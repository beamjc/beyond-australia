"""Reproduce docs/qa/grant-rate-check.md from the official BP0015 file.

Usage: download "BP0015 Student visa grant rates" XLSX from
https://data.gov.au/data/dataset/student-visas, then
    python3 scripts/qa/grant_rates_thailand.py path/to/file.xlsx
Needs pandas. Reads the pivot cache (all raw rows), keeps Thai citizens,
and prints grant rate = granted / (granted + refused) by sector, client
location and age group for primary applicants over the latest 12 months
in the file (the values used in src/lib/CalculationEngine.ts).
"""
import re, sys, zipfile, io
import pandas as pd

z = zipfile.ZipFile(sys.argv[1])
d = z.read('xl/pivotCache/pivotCacheDefinition1.xml').decode()
fields = re.findall(r'<cacheField name="([^"]+)"(.*?)</cacheField>', d, re.S)
names = [n for n, _ in fields]
items = [[v for _, v in re.findall(r'<(s|n|m)(?: v="([^"]*)")?/>', b)] for _, b in fields]
TH = items[9].index('Thailand')
rec, val = re.compile(r'<r>(.*?)</r>'), re.compile(r'<(x|n) v="([^"]*)"/>')
rows, buf = [], ''
with z.open('xl/pivotCache/pivotCacheRecords1.xml') as f:
    for chunk in iter(lambda: f.read(8 << 20).decode('utf-8', 'ignore'), ''):
        buf += chunk
        last = buf.rfind('</r>')
        if last < 0:
            continue
        part, buf = buf[:last + 4], buf[last + 4:]
        for m in rec.finditer(part):
            vs = val.findall(m.group(1))
            if len(vs) < 14 or int(vs[9][1]) != TH:
                continue
            rows.append([items[i][int(v)] if t == 'x' else v for i, (t, v) in enumerate(vs[:11])] + [float(v) for _, v in vs[11:13]])
df = pd.DataFrame(rows, columns=names[:11] + ['granted', 'refused'])
sector = {'Higher Education Sector': 'HE', 'Vocational Education and Training Sector': 'VET', 'Independent ELICOS Sector': 'ELICOS'}
df['sec'] = df['Sector'].map(sector)
df['loc'] = df['Client Location'].map({'In Australia': 'onshore', 'Outside Australia': 'offshore'})
# Month index: FY "2025-26" + "M03 Sep" -> 2025*12 + 2 (Jul = 0).
df['mi'] = df['Financial Year of Decision'].str[:4].astype(int) * 12 + df['Month'].str[1:3].astype(int) - 1
latest = df['mi'].max()
w = df[(df['mi'] > latest - 12) & df.sec.notna() & (df['Applicant Type'] == 'Primary')]
first = w['mi'].min()
ym = lambda mi: f"{mi // 12 + (1 if mi % 12 >= 6 else 0)}-{(mi % 12 + 6) % 12 + 1:02d}"
print(f'Period: {ym(first)} to {ym(latest)} (calendar year-month)\n')
for keys in (['sec', 'loc'], ['sec', 'loc', 'Age Group']):
    g = w.groupby(keys)[['granted', 'refused']].sum()
    g['decisions'] = g.granted + g.refused
    g['rate%'] = (100 * g.granted / g.decisions).round(1)
    print(g.to_string(), '\n')

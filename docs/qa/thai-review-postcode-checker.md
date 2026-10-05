# Thai review — Postcode Checker (WHM ปีที่ 2/3)

**Status: APPLIED 2026-10-05 — owner-approved (not editor-reviewed).** The owner chose to apply this Thai without waiting for the external Thai editor. Applied verbatim, with the intro **Alternative**. The editor may still review it; any edits go in a new batch. Screenshots: `screenshots/postcode-checker/th-new-*.png`.

- Owner requests, 2026-10-05: translate the checker to Thai; first redesign the result ("go ahead first and whatever we have after the redesign we can translate that"). The English below is the **redesigned English now in the code** (ISS-044).
- Source: every visible string is in the `text` object at the top of `src/components/whm/PostcodeChecker.tsx`. IDs below are its keys.
- Where: Home → Working Holiday section → tab "WHM ปีที่ 2/3" (`#whm-panel-postcode`). The visitor types a postcode and presses Check. The result lists each kind of work that counts there, with small tags saying where/when it counts, then a row for "other jobs".
- Screenshots (English, after redesign): `docs/qa/screenshots/postcode-checker/new-listed-390.png`, `new-listed-1440.png`, `new-regional-*.png`, `new-not-listed-*.png`. Before the redesign: `th-listed-*.png`, `th-not-listed-*.png`.
- Facts come from the Home Affairs page last updated 24/09/2026, checked 2026-10-05 (FC-17).
- **Owner edit** = Thai the owner wrote into the first draft of this file (2026-10-05). Kept as written; the owner's term "Postcode" is used in the other suggestions too.

## How to review

Mark each row **OK** / **EDIT** (write the wording). `{postcode}` is always 4 digits (e.g. 0872). Thai dates use the Buddhist year, as elsewhere on the site. "Specified Work" stays in English: it is the term on the visa form.

Look at these first ⚠️:
- `intro` (owner edit) says the visitor can check "ยื่นวีซ่า … ได้หรือไม่". The tool can only show which work counts at a postcode; visa eligibility also needs the required days of work, dates and other criteria. Suggest wording that keeps the owner's style but says what the tool checks (alternative given).
- `notListedBody` mentions critical COVID-19 healthcare work, which Home Affairs still counts anywhere in Australia. The owner may want it removed.
- `otherBody` describes Home Affairs' current flexibility for support roles (admin, cleaning) inside specified industries. It is temporary ("for now").
- Tags (`areas.*`) are small pills; keep them short. On a 390 px phone a tag wraps after about 40 Latin characters.

## Page text

| ID | Where / when | English | Thai suggested | Note |
|---|---|---|---|---|
| title | Tool heading | 2nd/3rd WHM Postcode Checker | เช็ก Postcode เมืองที่จะไปเก็บชั่วโมงสำหรับวีซ่า WHM ปีที่ 2/3 | **Owner edit** |
| intro ⚠️ | Under heading | Enter the postcode where you work to see which jobs there count as specified work for a 2nd or 3rd year Work and Holiday visa (subclass 462). | **Owner edit:** ใส่รหัสไปรษณีย์ของเมืองที่สนใจ เพื่อเช็กว่ายื่นวีซ่า Work and Holiday (subclass 462) ปีที่ 2 หรือ 3 ได้หรือไม่ — **Alternative:** ใส่ Postcode ของเมืองที่สนใจ เพื่อเช็กว่างานประเภทไหนสามารถยื่นวีซ่า Work and Holiday ปีที่ 2 หรือ 3 ได้| Alternative avoids implying visa eligibility. |
| placeholder | Input placeholder + screen-reader label | Enter postcode (e.g. 4810) | ใส่ Postcode (เช่น 4810) | **Owner edit** |
| check | Button | Check | ตรวจสอบ | |
| listedHeading | Result heading, postcode is on a list | Work that counts at postcode {postcode} | งานที่นับได้ใน Postcode {postcode} | Replaces the old "is eligible!" heading (owner edit was "Postcode {postcode} อยู่ในพื้นที่ Specified Work"). |
| listedBody | Under listedHeading | Your work here counts only if it is one of these types. | งานด้านล่างนี้นับเป็นชั่วโมงสำหรับยื่นวีซ่าปีที่ 2/3 ได้ | |
| otherTitle | Last row of the result | Other jobs | งานอื่น ๆ | |
| otherBody | Under otherTitle | Usually don't count. For now, Home Affairs may also accept support roles inside the industries above | โดยปกตินับไม่ได้ แต่ช่วงนี้ Home Affairs อาจเปิดให้ยื่นได้สำหรับบางอาชีพตามด้านบน | |
| notListedHeading | Result heading, postcode not on any list | Postcode {postcode} is not in a specified work area | Postcode {postcode} ไม่อยู่ในพื้นที่ Specified Work | Follows the owner's PC-05 style. |
| notListedBody ⚠️ | Under notListedHeading | Work at this postcode won't count towards a 2nd or 3rd year visa. The only exception is critical COVID-19 work in healthcare and medicine, which counts anywhere in Australia. | งานใน Postcode นี้เก็บชั่วโมงเพื่อยื่นวีซ่าปีที่ 2 หรือ 3 ไม่ได้ ยกเว้นงานด้านสุขภาพและการแพทย์ที่สำคัญต่อการรับมือ COVID-19 ซึ่งนับได้ทุกพื้นที่ในออสเตรเลีย | |
| disclaimer | Note at the bottom, before the link | This is a guide only, based on the Home Affairs postcode list updated 24 September 2026. Check the latest rules on the | ผลนี้เป็นข้อมูลเบื้องต้น อ้างอิงรายการ Postcode ของ Home Affairs ฉบับอัปเดต 24 ก.ย. 2569 โปรดตรวจสอบเงื่อนไขล่าสุดที่ | Date must change when the list is updated. |
| officialLink | Link (opens Home Affairs in a new tab) | Department of Home Affairs website | เว็บไซต์ Department of Home Affairs | |

## Kinds of work (one row each in the result)

| ID | English title | English examples | Thai title | Thai examples |
|---|---|---|---|---|
| work.tourism | Tourism and hospitality | Hotels, hostels, cafés, restaurants, bars, tour guides | การท่องเที่ยวและการบริการ | โรงแรม โฮสเทล คาเฟ่ ร้านอาหาร บาร์ ไกด์นำเที่ยว |
| work.cultivation | Farm work (plants and animals) | Picking and packing fruit and vegetables, caring for farm animals, shearing | งานฟาร์ม (พืชและสัตว์) | เก็บและแพ็กผักผลไม้ ดูแลสัตว์ในฟาร์ม ตัดขนแกะ |
| work.treeFarming | Tree farming and felling | Planting, tending or felling plantation trees | ปลูกและตัดไม้ | ปลูก ดูแล หรือตัดต้นไม้ในสวนป่า |
| work.fishing | Fishing and pearling | Work on fishing boats, pearl farms | ประมงและการเลี้ยงหอยมุก | ทำงานบนเรือประมง ฟาร์มหอยมุก |
| work.construction | Construction | Building sites, landscaping, painting new buildings, scaffolding | งานก่อสร้าง | ไซต์ก่อสร้าง จัดภูมิทัศน์ไซต์ก่อสร้าง ทาสีอาคารใหม่ นั่งร้าน |
| work.bushfireRecovery | Bushfire recovery | Rebuilding, clean-up, caring for wildlife — paid or volunteer | ฟื้นฟูหลังไฟป่า | ซ่อมสร้าง เก็บกวาด ดูแลสัตว์ป่า — มีค่าจ้างหรืออาสาสมัคร |
| work.disasterRecovery | Flood, cyclone and storm recovery | Clean-up, repairs, helping affected people — paid or volunteer | ฟื้นฟูหลังน้ำท่วม และพายุ | เก็บกวาด ซ่อมแซม ช่วยเหลือผู้ได้รับผลกระทบ — มีค่าจ้างหรืออาสาสมัคร |

## Where it counts (small tags under each kind of work)

| ID | English | Thai suggested |
|---|---|---|
| areas.remote | Remote and Very Remote Australia · work from 22 June 2021 | พื้นที่ห่างไกล (Remote and Very Remote) · งานตั้งแต่ 22 มิ.ย. 2564 |
| areas.northern | Northern Australia | (Northern Australia) |
| areas.regional | Regional Australia | (Regional Australia) |
| areas.bushfire | Bushfire declared area · work after 31 July 2019 | พื้นที่ประกาศภัยไฟป่า · งานหลัง 31 ก.ค. 2562 |
| areas.disaster | Natural disaster declared area · work after 31 Dec 2021 | พื้นที่ประกาศภัยพิบัติ · งานหลัง 31 ธ.ค. 2564 |

## After approval

1. Split `text` into `en` / `th` and pick by `useLanguage()` (same pattern as `OnshoreStudentVisaCheck.tsx`).
2. Check wrapping at 390 / 768 / 1440 px in both languages; update `coverage.md` (WHM-10, ISS-001).

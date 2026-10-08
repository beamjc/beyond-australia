# Humanizer review: public copy (EN + TH)

Status: **APPLIED 2026-10-08.** The owner approved the whole list; the external Thai editor did not review it. For the exceptions (HUM-07/13 fallbacks, HUM-41 not applied), see `changes.md`.
Date: 2026-10-07. Base: `main` @ 9d21f25.

Method: the installed `humanizer` skill, run over every public string (translations.ts, data files, component-inline copy). Pattern numbers refer to that skill:
§1 not-X-but-Y / staged contrast, §2 one-line closers and dramatic lines, §6 forced triads, §8 dashes as connectors, §12–13 inflated or AI-typical words, §16 sales language, §22 chatbot residue.

Constraints this list respects:
- No new facts, numbers or promises are added. Unsupported promises are softened or removed and marked **(claim)**.
- Owner decisions stay as they are: the budget taglines "งบไม่เกิน 100,000 / 150,000 บาท", the BSP-001/040/062/084/087 claims, and university rankings.
- Legal, scope and estimate notices are kept (e.g. "not a chance of visa approval", "for general planning only").
- Checklist and FAQ 2026 are written in the owner's own voice (ค่ะ, real examples). They get only minimal suggestions (section H).
- Thai suggestions are proposals for the external Thai editor. Per CLAUDE.md, they are applied only after approval.

How to reply: mark each ID **OK** (apply as suggested), **EDIT** (with your wording), or **SKIP**. You can approve EN and TH separately, e.g. "HUM-03 EN OK, TH SKIP".

---

## A. Home page and site shell (`src/i18n/translations.ts`)

| ID | Key / where it shows | Pattern | Current | Suggested |
|---|---|---|---|---|
| HUM-01 | `hero.badge` (EN), badge above hero title | §8, arrow symbol | Beyond Australia — Thailand → Australia WHM Program | Beyond Australia: Work and Holiday and study advice for Thai applicants |
| HUM-02 | `hero.subtitle` | §6 triad, §8, §13 "expert guidance every step of the way" | **EN** Navigate the Working Holiday visa process, transition to your next visa, and build your future in Australia — with expert guidance every step of the way.<br>**TH** วางแผนวีซ่า Work and Holiday ต่อยอดสู่วีซ่าถัดไป และสร้างอนาคตในออสเตรเลีย พร้อมคำแนะนำจากผู้เชี่ยวชาญในทุกขั้นตอน | **EN** Plan your Working Holiday visa and your next visa after it, with advice from our team when you need it.<br>**TH** วางแผนวีซ่า Work and Holiday และวีซ่าตัวถัดไป โดยมีทีมงานช่วยให้คำแนะนำเมื่อคุณต้องการ |
| HUM-03 | `whm.subtitle`, WHM section intro | §8, "Everything you need" | **EN** Everything you need for your Working Holiday journey — from DCY timeline to visa extension eligibility.<br>**TH** ครบทุกเรื่องที่คุณต้องรู้สำหรับวีซ่า Work and Holiday ตั้งแต่ไทม์ไลน์จาก ดย. ไปจนถึงเงื่อนไขการต่อวีซ่า | **EN** The DCY timeline, document checklist, specified-work postcodes and visa extension rules in one place.<br>**TH** ไทม์ไลน์จาก ดย. เช็กลิสต์เอกสาร เช็กรหัสไปรษณีย์ และเงื่อนไขการต่อวีซ่า รวมไว้ในที่เดียว |
| HUM-04 | `whm.timeline.subtitle` | §8 | **EN** Follow each step carefully. Timelines change yearly — stay updated with us.<br>**TH** (contains "—") | **EN** Dates change every year, so check back before each round.<br>**TH** ไทม์ไลน์เปลี่ยนทุกปี ควรเช็กวันที่ล่าสุดก่อนเปิดรับแต่ละรอบ |
| HUM-05 | `services.subtitle` | §8, §2 "we're here" | **EN** Whether you're preparing for WHM, transitioning to a student visa, or exploring migration — we're here.<br>**TH** …เราพร้อมดูแลในทุกขั้นตอน | **EN** We help with WHM applications, student visas and longer-term migration planning.<br>**TH** เราช่วยได้ทั้งการเตรียมยื่น WHM วีซ่านักเรียน และการวางแผนย้ายถิ่นฐานระยะยาว |
| HUM-06 | `services.items.ielts.description` (TH) | §16 "คว้าคะแนน…ได้ง่ายขึ้น" | รับส่วนลดพิเศษ พร้อมคลาสเรียนและคอร์สเรียนด้วยตัวเอง ที่จะช่วยให้คุณคว้าคะแนนตามเป้าหมายได้ง่ายขึ้น | มีส่วนลดค่าเรียน ทั้งคลาสสดและคอร์สเรียนด้วยตัวเอง สำหรับเตรียมสอบให้ได้คะแนนตามเป้า |
| HUM-07 | `services.items.insurance.description` | §16 sales ("comprehensive", "competitive rates", "อุ่นใจ", "ราคาพิเศษ") | **EN** Comprehensive coverage for your Australian journey at competitive rates.<br>**TH** อุ่นใจด้วยความคุ้มครองที่ครอบคลุมตลอดการเดินทางในออสเตรเลีย ในราคาพิเศษ | **EN** Travel and health insurance options for your time in Australia.<br>**TH** แนะนำประกันการเดินทางและประกันสุขภาพสำหรับช่วงที่อยู่ออสเตรเลีย<br>*Owner check: confirm the service covers health insurance. If not, drop "and health" / "และประกันสุขภาพ".* |
| HUM-08 | `services.items.shortCourses.description` | §8; **(claim)** "boost your employability on arrival" / "ได้งานทำทันทีเมื่อเดินทางถึง" | **EN** Aged care, childcare, English, barista — boost your employability on arrival.<br>**TH** …เพื่อเพิ่มโอกาสได้งานทำทันทีเมื่อเดินทางถึงออสเตรเลีย | **EN** Short courses such as aged care, childcare, English and barista skills, useful for common WHM jobs.<br>**TH** คอร์สสั้น เช่น ดูแลผู้สูงอายุ ดูแลเด็ก ภาษาอังกฤษ และบาริสต้า ซึ่งเป็นทักษะที่ใช้ในงานที่คน WHM ทำกันบ่อย |
| HUM-09 | `services.items.migration.description` | §16, §12 "professional" | **EN** Connected with registered migration agents for professional visa advice.<br>**TH** เชื่อมต่อคุณกับ Migration Agent ที่ได้มาตรฐานและขึ้นทะเบียนถูกต้อง พร้อมให้คำปรึกษาเรื่องวีซ่าอย่างมืออาชีพ | **EN** We refer you to registered migration agents for visa advice.<br>**TH** แนะนำ Migration Agent ที่ขึ้นทะเบียนถูกต้อง สำหรับปรึกษาเรื่องวีซ่า |
| HUM-10 | `services.items.community.description` (EN) | §13 "support your journey" | Online, offline & hybrid events in Thailand and Australia to support your journey. | Online, in-person and hybrid events in Thailand and Australia. |
| HUM-11 | `events.items.panel.title` | §8 | **EN** Life in Australia — WHM Returnees Panel<br>**TH** ชีวิตในออสเตรเลีย — เวทีแชร์ประสบการณ์ศิษย์เก่า WHM | **EN** Life in Australia: WHM returnees panel<br>**TH** ชีวิตในออสเตรเลีย: เวทีแชร์ประสบการณ์ศิษย์เก่า WHM |
| HUM-12 | `events.items.community.description` (TH) | §16 "สุดพิเศษ" | เรียนรู้รายละเอียดคอร์สเตรียมสอบ IELTS พร้อมรับโค้ดส่วนลดสุดพิเศษ | ฟังรายละเอียดคอร์สเตรียมสอบ IELTS และรับโค้ดส่วนลด |
| HUM-13 | `proof.highlights.founder` | §13 "support you at every step" | **EN** Personally guided by ThaiWAHClub's founder, ready to share firsthand experience and support you at every step.<br>**TH** ดูแลโดยผู้ก่อตั้งเพจ ThaiWAHClub ที่พร้อมแบ่งปันประสบการณ์และให้คำปรึกษาในทุกขั้นตอน | **EN** Run by the founder of ThaiWAHClub, who did the Working Holiday program and shares that experience.<br>**TH** ดูแลโดยผู้ก่อตั้งเพจ ThaiWAHClub ซึ่งเล่าจากประสบการณ์ตรง<br>*Owner check: the EN "who did the Working Holiday program" is only correct if the founder held a WHM visa. Otherwise use "who shares firsthand experience".* |
| HUM-14 | `proof.highlights.offices` | §13 "take care of you closely" | **EN** Offices in Bangkok, Melbourne, and Sydney, with a team ready to advise and take care of you closely.<br>**TH** …พร้อมทีมงานที่คอยให้คำปรึกษาและดูแลคุณอย่างใกล้ชิด | **EN** Offices in Bangkok, Melbourne and Sydney.<br>**TH** มีสำนักงานในกรุงเทพฯ เมลเบิร์น และซิดนีย์ |
| HUM-15 | `footer.tagline` (EN only; TH is just "© {year} Beyond Australia") | §13 "navigate their Australian dream"; EN/TH mismatch | © {year} Beyond Australia. Helping Thai WHM candidates navigate their Australian dream. | © {year} Beyond Australia (matches TH) |

## B. Shared consultation block (`src/components/shared/BSCConsultationCTA.tsx:29-33`)

| ID | Where | Pattern | Current | Suggested |
|---|---|---|---|---|
| HUM-16 | Heading of the consultation box under each tool | §12 "expert" | **EN** Want expert guidance?<br>**TH** ต้องการคำแนะนำจากผู้เชี่ยวชาญ? | **EN** Want to talk it through?<br>**TH** อยากคุยรายละเอียดกับทีมงาน? |
| HUM-17 | Sub-line | EN grammar (missing punctuation); "15 years+" | **EN** Free consultation with Beyond Study Center 15 years+ experience<br>**TH** ปรึกษา Beyond Study Center ฟรี ด้วยประสบการณ์มากกว่า 15 ปี | **EN** Free consultation with Beyond Study Center (15+ years of experience).<br>**TH** no change |

## C. Working Holiday Timeline (`src/components/whm/TimelineSection.tsx`)

| ID | Line | Pattern | Current | Suggested |
|---|---|---|---|---|
| HUM-18 | 37-38 `registrationAlert` | §8 | **EN** Very competitive — be ready at the exact opening time.<br>**TH** การแข่งขันสูงมาก — เตรียมตัวให้พร้อมและเข้าเว็บไซต์ทันทีที่ระบบเปิด | **EN** Places go fast. Be on the site when registration opens.<br>**TH** การแข่งขันสูงมาก ควรเข้าเว็บไซต์ทันทีที่ระบบเปิด |
| HUM-19 | 42-43 `prepareAlert` | §8, §2 dramatic "No second chances" | **EN** No second chances — have all documents prepared in advance.<br>**TH** ไม่มีรอบแก้ตัว — ควรเตรียมเอกสารทุกอย่างให้พร้อมล่วงหน้า | **EN** You can't fix missing documents later in the round, so prepare everything in advance.<br>**TH** ถ้าเอกสารไม่ครบจะแก้ไขทีหลังในรอบนี้ไม่ได้ ควรเตรียมทุกอย่างให้พร้อมล่วงหน้า<br>*Owner check: "can't fix later" is how we read "no second chances". Confirm it is correct.* |
| HUM-20 | 68-69 and 124-125 registration description (2026 and 2027 rounds) | §2 closer ("Think of it like a limited concert ticket!") | **EN** …= 4,000 total spots. Think of it like a limited concert ticket!<br>**TH** …รวมทั้งหมด 4,000 สิทธิ์ เรียกได้ว่าต้องแย่งกันเหมือนกดบัตรคอนเสิร์ตเลยทีเดียว! | **EN** …500 a day for 8 days, 4,000 places in total. Places usually run out quickly.<br>**TH** keep as is. The concert-ticket comparison sounds like a person talking in Thai, and Thai readers know it well. Optional: remove "เลยทีเดียว!" |
| HUM-21 | 79 and 135 documents description | §8, ALL CAPS "BEFORE"; TH uses `**` (shows as literal asterisks if not rendered) | **EN** IELTS 4.5+ overall (or PTE equivalent), bank certificate, qualifications — all must be ready BEFORE quota day.<br>**TH** …ต้องเตรียมให้พร้อม \*\*ก่อนวันกดโควตา\*\* | **EN** IELTS 4.5+ overall (or PTE equivalent), a bank certificate and your qualifications must all be ready before quota day.<br>**TH** wording unchanged. Check whether `**` displays; if it does, show it in real bold (code fix, no wording change) |
| HUM-22 | 91 and 147 quota result (TH) | §2/§13 closer | …และมีรายชื่อสำรองอีกราว 300–500 คน ถือเป็นโอกาสสำคัญเพียงครั้งเดียวของรอบนี้ | …และมีรายชื่อสำรองอีกราว 300–500 คน (cut the closing clause; it repeats HUM-19) |

## D. Study and planning tools (data files)

| ID | Source | Pattern | Current | Suggested |
|---|---|---|---|---|
| HUM-23 | `savingsCopy.ts:70` `studentHours` (EN) | §8 | …at minimum wage — more than the 48 hours a student visa allows during study periods. | …at minimum wage. That is more than the 48 hours a student visa allows during study periods. |
| HUM-24 | `visaExplorer.ts:157` question title | §8 | **EN** Student visa — where are you in your planning?<br>**TH** Student Visa — คุณกำลังวางแผนแบบไหน? | **EN** Student visa: where are you in your planning?<br>**TH** Student Visa: คุณวางแผนไว้ถึงขั้นไหนแล้ว? |
| HUM-25 | `visaExplorer.ts:77` option label (EN) | §8 | Not sure — show me all the options | Not sure yet. Show me all the options |
| HUM-26 | `visaExplorer.ts:59, 118, 369, 434` outcome titles | §12 same stock phrase repeated across outcomes | **EN** "…may be worth exploring" / tag "Worth exploring"<br>**TH** "…อาจเป็นตัวเลือกที่ควรศึกษาต่อ" / tag "ตัวเลือกที่ควรศึกษาต่อ" | **EN** "A Working Holiday visa could suit you" / "An employer-sponsored visa could suit you"; tag "Possible option"<br>**TH** "Working Holiday อาจเหมาะกับคุณ" / "วีซ่าแบบนายจ้างสปอนเซอร์อาจเหมาะกับคุณ"; tag "ทางเลือกที่เป็นไปได้"<br>*In Thai, "ควรศึกษาต่อ" can be misread as "you should continue studying", which is confusing in a study-visa tool.* |
| HUM-27 | `visaExplorer.ts:202` (TH) | §12 "น่าสนใจ" | ELICOS อาจเป็นจุดเริ่มต้นที่น่าสนใจ | ELICOS อาจเป็นจุดเริ่มต้นที่เหมาะ (EN "ELICOS may be a good place to start" is fine) |
| HUM-28 | `studyFinder.ts:86-106` result closings (×3) | §2 same closer each time | **EN** "…is one option worth considering…"<br>**TH** "…จึงเป็นหนึ่งในตัวเลือกที่น่าสนใจ…" | **EN** ELICOS: "so an ELICOS course can help you get ready for further study."; VET: "so a vocational (VET) course fits if you want practical, job-focused skills."; University: "so university study fits your goals."<br>**TH** ELICOS: "…จึงอาจเริ่มจากหลักสูตร ELICOS เพื่อเตรียมพร้อมก่อนเรียนต่อ"; VET: "…หลักสูตรสายวิชาชีพ (VET) จึงเหมาะถ้าอยากได้ทักษะที่นำไปใช้ทำงานได้จริง"; University: "…การเรียนระดับมหาวิทยาลัยจึงตรงกับเป้าหมายของคุณ" |
| HUM-29 | `studyFinder.ts:156, 158, 163` result headings | §12 "น่าสนใจ" repeated | **EN** Study pathways worth exploring / Another option worth a look<br>**TH** เส้นทางเรียนที่น่าสนใจสำหรับคุณ / …2 ทางเลือกที่น่าสนใจใกล้เคียงกัน / อีกทางเลือกที่น่าสนใจ | **EN** Study pathways that may suit you / Another option to consider<br>**TH** เส้นทางเรียนที่อาจเหมาะกับคุณ / …2 ทางเลือกที่เหมาะใกล้เคียงกัน / อีกทางเลือกหนึ่ง |
| HUM-30 | `visaReadiness.ts:336` (EN) | §12 "Professional guidance", missing full stop | Based on your answers, several points need more explanation or evidence. Professional guidance can help you prepare fully | Based on your answers, several points need more explanation or evidence. Talking to an adviser can help you prepare them. |

Kept on purpose (visaReadiness): "Age alone does not decide an application, but…", "A long study gap does not mean…, but…" and "It is not a chance of visa approval". These contrasts correct a belief readers really hold, or they are scope notices, so they pass §1.

## E. Onshore Student Visa check (`src/components/study/OnshoreStudentVisaCheck.tsx`)

| ID | Line | Pattern | Current (EN) | Suggested (EN) |
|---|---|---|---|---|
| HUM-31 | 182 `studentUnsure.cta` | Button names a vague action | Ask Beyond to review my situation | Ask Beyond Study Center about my case |
| HUM-32 | 189 disclaimer | Formal legal register ("does not constitute") | This tool is for general planning purposes only and does not constitute legal or migration advice. Always confirm… | This tool is for general planning only. It is not legal or migration advice. Always confirm… (rest unchanged) |

The Thai text in this component is already plain. No TH change suggested.

## F. Postcode checker (`src/components/whm/PostcodeChecker.tsx`)

| ID | Line | Pattern | Current | Suggested |
|---|---|---|---|---|
| HUM-33 | 65-66 examples (TH) | §8 | ซ่อมสร้าง เก็บกวาด ดูแลสัตว์ป่า — มีค่าจ้างหรืออาสาสมัคร | ซ่อมสร้าง เก็บกวาด ดูแลสัตว์ป่า (ทั้งงานมีค่าจ้างและงานอาสา) (same for disaster recovery) |
| HUM-34 | 22 `otherBody` (EN) | Reads like two fragments; "For now" is vague | Usually don't count. For now, Home Affairs may also accept support roles inside the industries above. | Usually these don't count. Home Affairs may currently accept support roles within the industries above. (Fact unchanged; see factual-checks.md) |

## G. Budget Study Planner (Thai only, `src/components/study/BudgetStudyPlanner.tsx`)

These overlap with `docs/qa/thai-review-budget-planner.md` (Batch 1). If both files cover the same line, use that file's ID.

| ID | Line | Pattern | Current | Suggested |
|---|---|---|---|---|
| HUM-35 | 349 | §6 triad | หารายได้ เรียนรู้ และสัมผัสประสบการณ์ที่ออสเตรเลีย ก่อนตัดสินใจเรียนต่อแบบเต็มรูปแบบ | ทำงานหารายได้และลองใช้ชีวิตที่ออสเตรเลียก่อน แล้วค่อยตัดสินใจเรียนต่อเต็มรูปแบบ |
| HUM-36 | 1167 tagline | §6 triad (keep the budget promise, owner decision) | เรียน ทำงาน และ หาประสบการณ์ใหม่ด้วยงบไม่เกิน 100,000 บาท | เรียนและทำงานที่ออสเตรเลียด้วยงบไม่เกิน 100,000 บาท |
| HUM-37 | 445 | Exclamation, casual "โอเค" | ระดับภาษาอังกฤษคุณโอเคแล้ว! ไม่จำเป็นต้องเรียนภาษา… | ระดับภาษาอังกฤษของคุณผ่านเกณฑ์แล้ว ไม่จำเป็นต้องเรียนภาษา… |
| HUM-38 | 1060 | Spoken spelling | จ่ายค่าเรียนครึ่งนึงก่อนได้… | จ่ายค่าเรียนครึ่งหนึ่งก่อนได้… |
| HUM-39 | 880 | Spoken abbreviation; missing "กับ" | …ค่าเรียนจะขึ้นอยู่คณะและมหาลัยที่นักเรียนเลือก… | …ค่าเรียนขึ้นอยู่กับคณะและมหาวิทยาลัยที่เลือก… |
| HUM-40 | 1305 | Fine, slight filler | อยากปรึกษาเพิ่มเติม? ติดต่อทีมงานของเราได้เลย | อยากปรึกษาเพิ่มเติม? ทักทีมงานได้เลย (optional) |

## H. Checklist and FAQ 2026 (owner voice, minimal)

`ChecklistSection.tsx` (10 dashes) and `FAQ2026.tsx` (38 dashes) read as human-written: they use ค่ะ, specific examples and a consistent personal voice. Under the skill's voice rule, the writer's own dash habit is kept.

- **HUM-41 (optional):** If the editor wants fewer dashes, replace "—" with a colon or line break only where it joins a heading and its answer. Wording stays the same. No other changes are suggested here.

## Not flagged

The following read as plain already and have no suggested change: calculator labels and units, validation messages, step navigation ("ถัดไป", "ดูผลลัพธ์"), Top Universities data (rankings kept per owner), and review/testimonial text (owner-supplied).

---

## Summary

- 41 items (HUM-01 to HUM-41). HUM-41 is optional and changes formatting only.
- Four items include an unsupported promise **(claim)** or a fact the owner should confirm: HUM-07, HUM-08, HUM-13, HUM-19.
- After approval, apply EN and TH together for each ID and log the batch in `docs/qa/changes.md`.

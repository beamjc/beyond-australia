# Thai review — Batch 2: Visa Readiness Check (was "Visa Strength Assessment")

**Status: owner-supplied Thai applied verbatim on branch `qa/study-tools-redesign`. 92 DRAFT strings are on the branch but AWAITING EXTERNAL THAI EDITOR REVIEW — do not merge to production until they are approved or replaced.**

- Owner request: 2026-09-25 (redesign brief pasted in the Claude session). The owner supplied the page title, disclaimer, status terms, factor labels, most positive/concern lines, explanations and example actions. Those rows are marked **Owner text**.
- Everything else (input slider ends, "medium" result lines, most checklist items, extra verdict bands, buttons, empty states) had to be written to make the design work. Those rows are **DRAFT**.
- Source: `src/data/visaReadiness.ts` (all visible copy for this tool, EN + TH). Components: `src/components/study/VisaStrengthAssessment.tsx`, `src/components/study/readiness/*`.
- Where: Home → Study section → tab "เช็กความพร้อมก่อนยื่นวีซ่า" / "Visa Readiness Check" (`#study-panel-strength`).
- English: the tool was English-only before (ISS-001). The English column is new and follows the Thai meaning; please check they match.
- Screenshots (390 px and 1440 px, Thai): questions, result, expanded row — `docs/qa/screenshots/visa-readiness/`.

## How to review

Mark each DRAFT row **OK** / **EDIT** (write wording) / **KEEP** (owner text rows only if you want to suggest a change). Variables: `{n}` is a number filled in by code.

Rows ⚠️ to look at first:
- `verdict.many.desc`, `verdict.serious.desc`, `factor.immigrationHistory.why` mention a **Registered Migration Agent**. The original English tool recommended "a registered migration agent" / "professional migration advice"; the meaning was kept.
- `copy.scoreNote` states the score is not a chance of approval (required by CLAUDE.md; not in the owner brief).
- `factor.age.input.*`: "ต่ำกว่า 25 ปี / มากกว่า 35 ปี" are the original tool's age anchors.

| ID | Key | English | Thai | Status |
|---|---|---|---|---|
| VRA-001 | copy.title | Visa readiness check | **Owner text** — เช็กความพร้อมก่อนยื่นวีซ่า | Applied verbatim |
| VRA-002 | copy.subtitle | See which points to prepare further, with basic guidance before you apply for a visa. | **Owner text** — ดูว่ามีจุดไหนที่ควรเตรียมเพิ่มเติม พร้อมคำแนะนำเบื้องต้นก่อนยื่นวีซ่า | Applied verbatim |
| VRA-003 | copy.bannerTitle | Want to talk about studying in Australia? | **Owner text** — อยากปรึกษาเรื่องเรียนต่อออสเตรเลีย? | Applied verbatim |
| VRA-004 | copy.bannerCta | Free consultation | **Owner text** — ปรึกษาฟรี | Applied verbatim |
| VRA-005 | copy.disclaimer | This is a general self-check to help you see what to prepare. It is not legal or migration advice and cannot predict a visa decision, because every case is assessed individually by the Department of Home Affairs. | **Owner text** — ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้น เพื่อช่วยให้คุณเห็นประเด็นที่ควรเตรียมเพิ่มเติม ไม่ใช่คำแนะนำด้านกฎหมายหรือการย้ายถิ่นฐาน และไม่สามารถใช้คาดการณ์ผลการพิจารณาวีซ่าได้ เนื่องจากแต่ละเคสจะได้รับการพิจารณาเป็นรายบุคคลโดย Department of Home Affairs | Applied verbatim |
| VRA-006 | copy.questionsTitle | Answer 8 quick questions | ตอบคำถามสั้นๆ 8 ข้อ | DRAFT — needs editor |
| VRA-007 | copy.questionsHint | Move each slider to the point closest to your situation. | เลื่อนแถบให้ใกล้กับสถานการณ์ของคุณมากที่สุด | DRAFT — needs editor |
| VRA-008 | copy.seeResult | See my readiness | ดูผลความพร้อม | DRAFT — needs editor |
| VRA-009 | copy.editAnswers | Edit answers | แก้ไขคำตอบ | DRAFT — needs editor |
| VRA-010 | copy.scoreLabel | Readiness score | คะแนนความพร้อม | DRAFT — needs editor |
| VRA-011 | copy.scoreNote | This score helps you prioritise what to prepare. It is not a chance of visa approval. | คะแนนนี้ช่วยจัดลำดับสิ่งที่ควรเตรียม ไม่ใช่โอกาสที่วีซ่าจะผ่าน | DRAFT — needs editor |
| VRA-012 | copy.especially | , especially  |  โดยเฉพาะ | DRAFT — needs editor |
| VRA-013 | copy.and |  and  | และ | DRAFT — needs editor |
| VRA-014 | copy.priorityTitle | What to prepare before applying | **Owner text** — สิ่งที่ควรเตรียมก่อนยื่นวีซ่า | Applied verbatim |
| VRA-015 | copy.priorityEmpty | No points stand out. Keep your supporting documents complete and explain your study goals clearly. | ยังไม่พบประเด็นที่ต้องเตรียมเป็นพิเศษ ควรเตรียมเอกสารประกอบให้ครบ และอธิบายเป้าหมายการเรียนให้ชัดเจน | DRAFT — needs editor |
| VRA-016 | copy.seeAll | See all guidance | **Owner text** — ดูคำแนะนำทั้งหมด | Applied verbatim |
| VRA-017 | copy.detailsTitle | Assessment details | **Owner text** — รายละเอียดการประเมิน | Applied verbatim |
| VRA-018 | copy.itemsCount | {n} items | {n} ประเด็น | DRAFT — needs editor |
| VRA-019 | copy.whyTitle | Why this matters | **Owner text** — ทำไมเรื่องนี้จึงควรอธิบาย? | Applied verbatim |
| VRA-020 | copy.prepareTitle | What to prepare | **Owner text** — สิ่งที่ควรเตรียม | Applied verbatim |
| VRA-021 | copy.planTitle | Your preparation plan | **Owner text** — สิ่งที่คุณควรเตรียมเพิ่มเติม | Applied verbatim |
| VRA-022 | copy.ctaTitle | Not sure what your case needs? | **Owner text** — ยังไม่แน่ใจว่าเคสของคุณควรเตรียมอะไรเพิ่มเติม? | Applied verbatim |
| VRA-023 | copy.ctaSub | Talk to the Beyond Study Center team for free. | **Owner text** — ปรึกษาทีม Beyond Study Center ได้ฟรี | Applied verbatim |
| VRA-024 | copy.ctaPrimary | Free consultation | **Owner text** — ปรึกษาฟรี | Applied verbatim |
| VRA-025 | level.high | Check carefully | **Owner text** — ควรตรวจสอบเป็นพิเศษ | Applied verbatim |
| VRA-026 | level.medium | Prepare more information | **Owner text** — ควรเตรียมข้อมูลเพิ่มเติม | Applied verbatim |
| VRA-027 | level.low | No clear concern | **Owner text** — ไม่มีข้อกังวลเด่นชัด | Applied verbatim |
| VRA-028 | metric.high | to check carefully | **Owner text** — ประเด็นที่ควรตรวจสอบเป็นพิเศษ | Applied verbatim |
| VRA-029 | metric.medium | to prepare more for | **Owner text** — ประเด็นที่ควรเตรียมเพิ่มเติม | Applied verbatim |
| VRA-030 | metric.low | with no clear concern | **Owner text** — ประเด็นไม่มีข้อกังวลเด่นชัด | Applied verbatim |
| VRA-031 | verdict.strong.title | You look well prepared overall | ภาพรวมค่อนข้างพร้อม | DRAFT — needs editor |
| VRA-032 | verdict.strong.desc | Based on your answers, there are no clear concerns. Keep your documents complete and explain your study goals clearly | จากข้อมูลที่คุณกรอก ยังไม่พบประเด็นที่ต้องกังวลเด่นชัด ควรเตรียมเอกสารให้ครบและอธิบายเป้าหมายการเรียนให้ชัดเจน | DRAFT — needs editor |
| VRA-033 | verdict.some.title | A few points need more preparation | **Owner text** — มีบางจุดที่ควรเตรียมเพิ่มเติม | Applied verbatim |
| VRA-034 | verdict.some.desc | Based on your answers, a few points may need more explanation or evidence | **Owner text** — จากข้อมูลที่คุณกรอก มีบางประเด็นที่อาจต้องอธิบายหรือเตรียมหลักฐานเพิ่มเติม | Applied verbatim |
| VRA-035 | verdict.several.title | Several points need more preparation | มีหลายจุดที่ควรเตรียมเพิ่มเติม | DRAFT — needs editor |
| VRA-036 | verdict.several.desc | Based on your answers, several points need more explanation or evidence. Professional guidance can help you prepare fully | จากข้อมูลที่คุณกรอก มีหลายประเด็นที่ควรอธิบายหรือเตรียมหลักฐานเพิ่มเติม การขอคำแนะนำจากผู้เชี่ยวชาญจะช่วยให้เตรียมตัวได้ครบขึ้น | DRAFT — needs editor |
| VRA-037 | verdict.many.title | Prepare more before you apply | ควรเตรียมตัวเพิ่มเติมก่อนยื่น | DRAFT — needs editor |
| VRA-038 | verdict.many.desc | Based on your answers, many points should be ready before you apply. We recommend talking to a registered migration agent | จากข้อมูลที่คุณกรอก มีหลายประเด็นที่ควรเตรียมให้พร้อมก่อนยื่น แนะนำให้ปรึกษา Registered Migration Agent | DRAFT — needs editor |
| VRA-039 | verdict.serious.title | Get professional advice before you apply | ควรปรึกษาผู้เชี่ยวชาญก่อนยื่น | DRAFT — needs editor |
| VRA-040 | verdict.serious.desc | Based on your answers, several important points need preparation. We recommend advice from a registered migration agent before applying | จากข้อมูลที่คุณกรอก มีประเด็นสำคัญหลายข้อที่ควรเตรียม แนะนำให้ขอคำแนะนำจาก Registered Migration Agent ก่อนยื่นวีซ่า | DRAFT — needs editor |
| VRA-041 | factor.age.label | Age | **Owner text** — อายุ | Applied verbatim |
| VRA-042 | factor.age.input.left | Younger | อายุน้อย | DRAFT — needs editor |
| VRA-043 | factor.age.input.leftHint | Under 25 | ต่ำกว่า 25 ปี | DRAFT — needs editor |
| VRA-044 | factor.age.input.right | Older | อายุมาก | DRAFT — needs editor |
| VRA-045 | factor.age.input.rightHint | Over 35 | มากกว่า 35 ปี | DRAFT — needs editor |
| VRA-046 | factor.age.result.low | Your age is typical for student applicants | **Owner text** — อายุอยู่ในช่วงทั่วไปของผู้สมัครเรียน | Applied verbatim |
| VRA-047 | factor.age.result.medium | Your age is a little above the typical student range | อายุสูงกว่าช่วงทั่วไปของผู้สมัครเรียนเล็กน้อย | DRAFT — needs editor |
| VRA-048 | factor.age.result.high | Your age is above the typical student range | อายุสูงกว่าช่วงทั่วไปของผู้สมัครเรียน | DRAFT — needs editor |
| VRA-049 | factor.age.why | Age alone does not decide an application, but you should be able to explain how studying now fits your education and career path. | **Owner text** — อายุเพียงอย่างเดียวไม่ได้เป็นตัวตัดสินผลการสมัคร แต่ควรสามารถอธิบายได้ว่าการเรียนในช่วงนี้สอดคล้องกับเส้นทางการศึกษาและอาชีพของคุณอย่างไร | Applied verbatim |
| VRA-050 | factor.age.prepare.1 | Why you are choosing to study now | เหตุผลที่เลือกเรียนในช่วงนี้ | DRAFT — needs editor |
| VRA-051 | factor.age.prepare.2 | How the course links to your past experience | ความเชื่อมโยงระหว่างหลักสูตรกับประสบการณ์ที่ผ่านมา | DRAFT — needs editor |
| VRA-052 | factor.age.prepare.3 | Your career goal after graduating | เป้าหมายอาชีพหลังเรียนจบ | DRAFT — needs editor |
| VRA-053 | factor.age.priority | Explain how studying now fits your education and career path. | อธิบายว่าการเรียนในช่วงนี้สอดคล้องกับเส้นทางการศึกษาและอาชีพของคุณอย่างไร | DRAFT — needs editor |
| VRA-054 | factor.age.action.title | Explain why you are studying now | อธิบายเหตุผลที่เรียนในช่วงนี้ | DRAFT — needs editor |
| VRA-055 | factor.age.action.desc | Link the course to your experience and career goals. | เชื่อมโยงการเรียนกับประสบการณ์และเป้าหมายอาชีพของคุณ | DRAFT — needs editor |
| VRA-056 | factor.studyGap.label | Study gap | **Owner text** — ระยะเวลาที่เว้นจากการเรียน | Applied verbatim |
| VRA-057 | factor.studyGap.input.left | Recent study | เพิ่งเรียนจบ | DRAFT — needs editor |
| VRA-058 | factor.studyGap.input.leftHint | No gap | ไม่ได้เว้นช่วงการเรียน | DRAFT — needs editor |
| VRA-059 | factor.studyGap.input.right | Long gap | เว้นมานาน | DRAFT — needs editor |
| VRA-060 | factor.studyGap.input.rightHint | 5+ years | 5 ปีขึ้นไป | DRAFT — needs editor |
| VRA-061 | factor.studyGap.result.low | Continuous study / recently graduated | **Owner text** — เรียนต่อเนื่อง / เพิ่งจบการศึกษา | Applied verbatim |
| VRA-062 | factor.studyGap.result.medium | Some time away from study | เว้นจากการเรียนมาระยะหนึ่ง | DRAFT — needs editor |
| VRA-063 | factor.studyGap.result.high | A long time away from study | **Owner text** — เว้นจากการเรียนมานาน | Applied verbatim |
| VRA-064 | factor.studyGap.why | A long study gap does not mean your application will have problems, but you should explain what you did in that time and why returning to study now fits your path. | **Owner text** — การเว้นช่วงการเรียนเป็นเวลานานไม่ได้หมายความว่าจะมีปัญหาในการสมัคร แต่ควรอธิบายให้เห็นว่าช่วงที่ผ่านมาได้ทำอะไร และทำไมการกลับมาเรียนในตอนนี้จึงสอดคล้องกับเส้นทางของคุณ | Applied verbatim |
| VRA-065 | factor.studyGap.prepare.1 | Your work history or activities during the gap | **Owner text** — ประวัติการทำงานหรือกิจกรรมในช่วงที่ผ่านมา | Applied verbatim |
| VRA-066 | factor.studyGap.prepare.2 | Why you decided to return to study now | **Owner text** — เหตุผลที่ตัดสินใจกลับมาเรียนในตอนนี้ | Applied verbatim |
| VRA-067 | factor.studyGap.prepare.3 | How the course links to your career goals | **Owner text** — ความเชื่อมโยงระหว่างหลักสูตรและเป้าหมายอาชีพ | Applied verbatim |
| VRA-068 | factor.studyGap.priority | Explain what work or activities you did in the gap, and why you want to return to study now. | **Owner text** — อธิบายว่าช่วงที่ผ่านมาได้ทำงานหรือทำกิจกรรมอะไร และเหตุใดจึงต้องการกลับมาเรียนในตอนนี้ | Applied verbatim |
| VRA-069 | factor.studyGap.action.title | Explain your study gap | **Owner text** — อธิบายช่วงที่เว้นจากการเรียน | Applied verbatim |
| VRA-070 | factor.studyGap.action.desc | Say whether you worked, studied or did other activities during that time. | **Owner text** — ระบุว่าช่วงดังกล่าวทำงาน เรียนเพิ่มเติม หรือทำกิจกรรมอะไร | Applied verbatim |
| VRA-071 | factor.downgrade.label | Level of the new course | **Owner text** — ระดับการศึกษาที่กำลังจะเรียน | Applied verbatim |
| VRA-072 | factor.downgrade.input.left | Same or higher level | ระดับเดิมหรือสูงขึ้น | DRAFT — needs editor (shortened from owner text) |
| VRA-073 | factor.downgrade.input.leftHint | e.g. Bachelor → Master | **Owner text** — เช่น ปริญญาตรี → ปริญญาโท | Applied verbatim |
| VRA-074 | factor.downgrade.input.right | Lower level | ระดับที่ต่ำลง | DRAFT — needs editor (shortened from owner text) |
| VRA-075 | factor.downgrade.input.rightHint | e.g. Master → Diploma | **Owner text** — เช่น ปริญญาโท → Diploma | Applied verbatim |
| VRA-076 | factor.downgrade.result.low | Studying at the same or a higher level | **Owner text** — เรียนต่อในระดับเดิมหรือสูงขึ้น | Applied verbatim |
| VRA-077 | factor.downgrade.result.medium | The new course level may need some explanation | ระดับการศึกษาใหม่อาจต้องอธิบายเหตุผลเพิ่มเติม | DRAFT — needs editor |
| VRA-078 | factor.downgrade.result.high | Studying at a lower level | **Owner text** — เรียนในระดับที่ต่ำลง | Applied verbatim |
| VRA-079 | factor.downgrade.why | If you choose a lower level than your current qualification, give a clear reason how the new course adds skills or connects to your career goals. | **Owner text** — หากเลือกระดับการศึกษาที่ต่ำกว่าวุฒิเดิม ควรมีเหตุผลที่ชัดเจนว่าหลักสูตรใหม่นี้จะช่วยเติมเต็มทักษะหรือเชื่อมโยงกับเป้าหมายด้านอาชีพอย่างไร | Applied verbatim |
| VRA-080 | factor.downgrade.prepare.1 | Why you chose a course at this level | เหตุผลที่เลือกหลักสูตรระดับนี้ | DRAFT — needs editor |
| VRA-081 | factor.downgrade.prepare.2 | The skills this course will add | ทักษะที่หลักสูตรนี้จะช่วยเติมเต็ม | DRAFT — needs editor |
| VRA-082 | factor.downgrade.prepare.3 | How it connects to your career goals | ความเชื่อมโยงกับเป้าหมายอาชีพ | DRAFT — needs editor |
| VRA-083 | factor.downgrade.priority | Explain how this course adds skills or connects to your career goals. | **Owner text** — อธิบายว่าหลักสูตรนี้จะช่วยเติมเต็มทักษะหรือเชื่อมโยงกับเป้าหมายอาชีพอย่างไร | Applied verbatim |
| VRA-084 | factor.downgrade.action.title | Explain why you chose this course | **Owner text** — อธิบายเหตุผลที่เลือกหลักสูตรนี้ | Applied verbatim |
| VRA-085 | factor.downgrade.action.desc | Show which knowledge or skills the course adds. | **Owner text** — แสดงให้เห็นว่าหลักสูตรช่วยเติมเต็มความรู้หรือทักษะใด | Applied verbatim |
| VRA-086 | factor.fieldChange.label | Relevance of your chosen field | **Owner text** — ความเกี่ยวข้องของสาขาที่เลือก | Applied verbatim |
| VRA-087 | factor.fieldChange.input.left | Same field or clear link | สายเดิม หรือมีเหตุผลเชื่อมโยง | DRAFT — needs editor |
| VRA-088 | factor.fieldChange.input.leftHint | Backed by experience or a career plan | มีประสบการณ์หรือแผนอาชีพรองรับ | DRAFT — needs editor |
| VRA-089 | factor.fieldChange.input.right | Unrelated field, no reason | คนละสาย ไม่มีเหตุผลรองรับ | DRAFT — needs editor |
| VRA-090 | factor.fieldChange.input.rightHint | No clear reason for the switch yet | ยังอธิบายไม่ได้ว่าทำไมเปลี่ยนสาย | DRAFT — needs editor |
| VRA-091 | factor.fieldChange.result.low | Same field, or a clearly explained link | **Owner text** — เรียนในสายเดิม หรือมีเหตุผลเชื่อมโยงชัดเจน | Applied verbatim |
| VRA-092 | factor.fieldChange.result.medium | The link between your new field and your background is not yet clear | สาขาที่เลือกยังเชื่อมโยงกับประวัติเดิมได้ไม่ชัดเจนนัก | DRAFT — needs editor |
| VRA-093 | factor.fieldChange.result.high | Switching to an unrelated field without a supporting reason | **Owner text** — เปลี่ยนไปเรียนคนละสายโดยไม่มีเหตุผลรองรับ | Applied verbatim |
| VRA-094 | factor.fieldChange.why | If you are changing fields, explain how it connects to your past experience, interests or future career plans. | **Owner text** — หากเปลี่ยนสายการเรียน ควรอธิบายความเชื่อมโยงกับประสบการณ์ที่ผ่านมา ความสนใจ หรือแผนอาชีพในอนาคต | Applied verbatim |
| VRA-095 | factor.fieldChange.prepare.1 | Experience or interests related to the new field | ประสบการณ์หรือความสนใจที่เกี่ยวข้องกับสาขาใหม่ | DRAFT — needs editor |
| VRA-096 | factor.fieldChange.prepare.2 | Why you decided to change fields | เหตุผลที่ตัดสินใจเปลี่ยนสาย | DRAFT — needs editor |
| VRA-097 | factor.fieldChange.prepare.3 | A career plan that uses this field | แผนอาชีพที่ใช้ความรู้จากสาขานี้ | DRAFT — needs editor |
| VRA-098 | factor.fieldChange.priority | Explain how the new field links to your experience and career plan. | อธิบายความเชื่อมโยงระหว่างสาขาใหม่กับประสบการณ์และแผนอาชีพ | DRAFT — needs editor |
| VRA-099 | factor.fieldChange.action.title | Explain why you chose this field | อธิบายเหตุผลที่เลือกสาขานี้ | DRAFT — needs editor |
| VRA-100 | factor.fieldChange.action.desc | Link the new field to your experience, interests or career plan. | เชื่อมโยงสาขาใหม่กับประสบการณ์ ความสนใจ หรือแผนอาชีพ | DRAFT — needs editor |
| VRA-101 | factor.immigrationHistory.label | Visa and travel history | **Owner text** — ประวัติด้านวีซ่าและการเดินทาง | Applied verbatim |
| VRA-102 | factor.immigrationHistory.input.left | No concerns | ไม่มีประวัติที่ต้องกังวล | DRAFT — needs editor |
| VRA-103 | factor.immigrationHistory.input.leftHint | No visa problems before | ไม่เคยมีปัญหาด้านวีซ่า | DRAFT — needs editor |
| VRA-104 | factor.immigrationHistory.input.right | Past visa problems | เคยมีปัญหาด้านวีซ่า | DRAFT — needs editor |
| VRA-105 | factor.immigrationHistory.input.rightHint | e.g. refusals, overstays or breaches | เช่น ถูกปฏิเสธวีซ่า อยู่เกินกำหนด หรือทำผิดเงื่อนไข | DRAFT — needs editor |
| VRA-106 | factor.immigrationHistory.result.low | No history of concern | **Owner text** — ไม่มีประวัติที่ต้องกังวล | Applied verbatim |
| VRA-107 | factor.immigrationHistory.result.medium | Some visa history that should be explained | มีประวัติด้านวีซ่าบางอย่างที่ควรอธิบาย | DRAFT — needs editor |
| VRA-108 | factor.immigrationHistory.result.high | Past visa problems | **Owner text** — เคยมีปัญหาด้านวีซ่า | Applied verbatim |
| VRA-109 | factor.immigrationHistory.why | If you have been refused a visa, had a visa cancelled, or not met visa conditions, give complete and honest information. If you are unsure, talk to a registered migration agent. | หากเคยมีประวัติ เช่น ถูกปฏิเสธวีซ่า ถูกยกเลิกวีซ่า หรือไม่ปฏิบัติตามเงื่อนไขวีซ่า ควรให้ข้อมูลอย่างครบถ้วนและตรงไปตรงมา หากไม่แน่ใจ ควรปรึกษา Registered Migration Agent | DRAFT — needs editor |
| VRA-110 | factor.immigrationHistory.prepare.1 | Details of past visa applications and outcomes | รายละเอียดวีซ่าที่เคยยื่นและผลการพิจารณา | DRAFT — needs editor |
| VRA-111 | factor.immigrationHistory.prepare.2 | Related documents, such as refusal letters | เอกสารที่เกี่ยวข้อง เช่น หนังสือแจ้งผลการปฏิเสธ | DRAFT — needs editor |
| VRA-112 | factor.immigrationHistory.prepare.3 | What has changed since then | คำอธิบายสิ่งที่เปลี่ยนไปจากครั้งก่อน | DRAFT — needs editor |
| VRA-113 | factor.immigrationHistory.priority | Give complete visa history and prepare the related documents. | ให้ข้อมูลประวัติวีซ่าอย่างครบถ้วน และเตรียมเอกสารที่เกี่ยวข้อง | DRAFT — needs editor |
| VRA-114 | factor.immigrationHistory.action.title | Prepare your visa history | เตรียมข้อมูลประวัติวีซ่า | DRAFT — needs editor |
| VRA-115 | factor.immigrationHistory.action.desc | Collect details and documents for past visas and explain them honestly. | รวบรวมรายละเอียดและเอกสารของวีซ่าที่เคยยื่น และอธิบายอย่างตรงไปตรงมา | DRAFT — needs editor |
| VRA-116 | factor.timeInAustralia.label | Time already spent in Australia | **Owner text** — ระยะเวลาที่เคยอยู่ในออสเตรเลีย | Applied verbatim |
| VRA-117 | factor.timeInAustralia.input.left | None or short | ไม่เคยอยู่ หรืออยู่ไม่นาน | DRAFT — needs editor |
| VRA-118 | factor.timeInAustralia.input.leftHint | First visit or a short stay | มาครั้งแรก หรือเคยมาระยะสั้น | DRAFT — needs editor |
| VRA-119 | factor.timeInAustralia.input.right | Several years | อยู่มาหลายปี | DRAFT — needs editor |
| VRA-120 | factor.timeInAustralia.input.rightHint | Already in Australia for years | อยู่ในออสเตรเลียมาแล้วหลายปี | DRAFT — needs editor |
| VRA-121 | factor.timeInAustralia.result.low | Never stayed, or only a short stay | **Owner text** — ไม่เคยอยู่ หรือเคยอยู่ไม่นาน | Applied verbatim |
| VRA-122 | factor.timeInAustralia.result.medium | Some time already spent in Australia | เคยอยู่ในออสเตรเลียมาระยะหนึ่ง | DRAFT — needs editor |
| VRA-123 | factor.timeInAustralia.result.high | A long time already spent in Australia | **Owner text** — เคยอยู่ในออสเตรเลียเป็นเวลานาน | Applied verbatim |
| VRA-124 | factor.timeInAustralia.why | If you have been in Australia for several years, you should be able to explain how this new course fits your path. | **Owner text** — หากเคยอยู่ในออสเตรเลียต่อเนื่องหลายปี ควรสามารถอธิบายได้ว่าการเรียนหลักสูตรใหม่นี้สอดคล้องกับเส้นทางของคุณอย่างไร | Applied verbatim |
| VRA-125 | factor.timeInAustralia.prepare.1 | A summary of your visas and what you did in Australia | สรุปวีซ่าและสิ่งที่ทำระหว่างอยู่ออสเตรเลีย | DRAFT — needs editor |
| VRA-126 | factor.timeInAustralia.prepare.2 | Why you need this new course | เหตุผลที่ต้องเรียนหลักสูตรใหม่นี้ | DRAFT — needs editor |
| VRA-127 | factor.timeInAustralia.prepare.3 | Progress from your past study or work | ความก้าวหน้าจากการเรียนหรือทำงานที่ผ่านมา | DRAFT — needs editor |
| VRA-128 | factor.timeInAustralia.priority | Explain how the new course builds on what you have done in Australia. | อธิบายว่าหลักสูตรใหม่ต่อยอดจากสิ่งที่ทำในออสเตรเลียอย่างไร | DRAFT — needs editor |
| VRA-129 | factor.timeInAustralia.action.title | Explain your time in Australia | อธิบายช่วงเวลาที่อยู่ในออสเตรเลีย | DRAFT — needs editor |
| VRA-130 | factor.timeInAustralia.action.desc | Summarise what you have done and why the new course suits your path. | สรุปสิ่งที่ทำที่ผ่านมา และเหตุผลที่หลักสูตรใหม่เหมาะกับเส้นทางของคุณ | DRAFT — needs editor |
| VRA-131 | factor.evidence.label | Supporting documents | **Owner text** — ความพร้อมของเอกสารประกอบ | Applied verbatim |
| VRA-132 | factor.evidence.input.left | No documents yet | ยังไม่มีเอกสารรองรับ | DRAFT — needs editor |
| VRA-133 | factor.evidence.input.leftHint | Mostly self-declared | ข้อมูลส่วนใหญ่ยังเป็นการบอกเล่า | DRAFT — needs editor |
| VRA-134 | factor.evidence.input.right | Clear documents | มีเอกสารยืนยันชัดเจน | DRAFT — needs editor |
| VRA-135 | factor.evidence.input.rightHint | e.g. transcripts, employer letters | เช่น Transcript หนังสือรับรองการทำงาน | DRAFT — needs editor |
| VRA-136 | factor.evidence.result.low | Clear supporting documents | **Owner text** — มีเอกสารยืนยันชัดเจน | Applied verbatim |
| VRA-137 | factor.evidence.result.medium | Some documents, but not all | มีเอกสารบางส่วน แต่ยังไม่ครบ | DRAFT — needs editor |
| VRA-138 | factor.evidence.result.high | Some information has no supporting documents | **Owner text** — ยังมีข้อมูลที่ไม่มีเอกสารรองรับ | Applied verbatim |
| VRA-139 | factor.evidence.why | Prepare related documents, such as transcripts, employer letters, financial evidence or letters from institutions, to support what you say. | **Owner text** — ควรเตรียมเอกสารที่เกี่ยวข้อง เช่น Transcript หนังสือรับรองการทำงาน หลักฐานทางการเงิน หรือเอกสารจากสถาบัน เพื่อสนับสนุนข้อมูลที่ให้ไว้ | Applied verbatim |
| VRA-140 | factor.evidence.prepare.1 | Transcripts and qualifications | Transcript และวุฒิการศึกษา | DRAFT — needs editor |
| VRA-141 | factor.evidence.prepare.2 | Employer reference letters | หนังสือรับรองการทำงาน | DRAFT — needs editor |
| VRA-142 | factor.evidence.prepare.3 | Financial evidence and institution letters | หลักฐานทางการเงิน และเอกสารจากสถาบัน | DRAFT — needs editor |
| VRA-143 | factor.evidence.priority | Get your transcripts, employer letters and financial evidence ready. | เตรียม Transcript หนังสือรับรองการทำงาน และหลักฐานทางการเงินให้พร้อม | DRAFT — needs editor |
| VRA-144 | factor.evidence.action.title | Prepare supporting documents | **Owner text** — เตรียมเอกสารสนับสนุน | Applied verbatim |
| VRA-145 | factor.evidence.action.desc | e.g. transcripts, employer letters and financial evidence. | **Owner text** — เช่น Transcript หนังสือรับรองการทำงาน และหลักฐานทางการเงิน | Applied verbatim |
| VRA-146 | factor.postStudyPlans.label | Post-study plans | **Owner text** — แผนหลังเรียนจบ | Applied verbatim |
| VRA-147 | factor.postStudyPlans.input.left | No clear plan | ยังไม่มีแผนชัดเจน | DRAFT — needs editor |
| VRA-148 | factor.postStudyPlans.input.leftHint | Not sure what to do after graduating | ยังไม่รู้ว่าจะทำอะไรหลังเรียนจบ | DRAFT — needs editor |
| VRA-149 | factor.postStudyPlans.input.right | Clear goal | มีเป้าหมายชัดเจน | DRAFT — needs editor |
| VRA-150 | factor.postStudyPlans.input.rightHint | A clear career or further-study path | มีเส้นทางอาชีพหรือการเรียนต่อที่ชัดเจน | DRAFT — needs editor |
| VRA-151 | factor.postStudyPlans.result.low | Clear goals after graduating | **Owner text** — มีเป้าหมายหลังเรียนจบชัดเจน | Applied verbatim |
| VRA-152 | factor.postStudyPlans.result.medium | A rough plan after graduating, not yet detailed | มีแผนหลังเรียนจบคร่าวๆ แต่ยังไม่ละเอียด | DRAFT — needs editor |
| VRA-153 | factor.postStudyPlans.result.high | Post-study plans are not yet clear | **Owner text** — แผนหลังเรียนจบยังไม่ชัดเจน | Applied verbatim |
| VRA-154 | factor.postStudyPlans.why | Explain how you plan to use the knowledge and skills from the course in your career after graduating. | **Owner text** — ควรอธิบายว่าหลังจบการศึกษา คุณต้องการนำความรู้และทักษะที่ได้รับไปใช้กับเส้นทางอาชีพอย่างไร | Applied verbatim |
| VRA-155 | factor.postStudyPlans.prepare.1 | The role or career you are aiming for | ตำแหน่งงานหรือสายอาชีพที่ตั้งเป้าไว้ | DRAFT — needs editor |
| VRA-156 | factor.postStudyPlans.prepare.2 | Skills from the course you will use | ทักษะจากหลักสูตรที่จะนำไปใช้ | DRAFT — needs editor |
| VRA-157 | factor.postStudyPlans.prepare.3 | Related job-market information or opportunities | ข้อมูลตลาดงานหรือโอกาสที่เกี่ยวข้อง | DRAFT — needs editor |
| VRA-158 | factor.postStudyPlans.priority | Show a clear link between the course and your career path after study. | **Owner text** — ทำให้เห็นความเชื่อมโยงระหว่างหลักสูตรและเส้นทางอาชีพหลังเรียนอย่างชัดเจน | Applied verbatim |
| VRA-159 | factor.postStudyPlans.action.title | Plan your career after graduating | **Owner text** — วางแผนอาชีพหลังเรียนจบ | Applied verbatim |
| VRA-160 | factor.postStudyPlans.action.desc | Explain how the course connects to your future goals. | **Owner text** — อธิบายว่าหลักสูตรเชื่อมโยงกับเป้าหมายในอนาคตอย่างไร | Applied verbatim |

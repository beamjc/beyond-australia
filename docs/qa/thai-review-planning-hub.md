# Thai review — Batch 4: Planning hub (Study Pathway Finder + Visa Options Explorer)

**Status: owner-supplied Thai applied verbatim on branch `qa/study-tools-redesign`. 95 rows are DRAFT (written to complete the flows) and AWAIT EXTERNAL THAI EDITOR REVIEW. "Owner text" marking is by key and may be approximate — please check any row you are unsure about.**

- Owner briefs: 2026-09-25 "Study Options Finder" and "planning hub".
- Sources: `src/data/studyFinder.ts`, `src/data/visaExplorer.ts` (all copy EN + TH; the tools render only data). Dated facts: `src/data/visaFacts.ts`.
- Where: Home → Study section → tab "วางแผนเส้นทาง" (`#study-panel-options`), deep links `/#plan` (hub) and `/#visa-pathway` (explorer).
- Screenshots: `docs/qa/screenshots/planning-hub/`.

Look first:
- `skilled-min-met.title` — owner text "คุณผ่านเกณฑ์คะแนนขั้นต่ำ…" says "ผ่าน" (passed). The English was softened to "You may meet…". Owner/editor: keep "ผ่าน", or use "คะแนนของคุณอาจถึงเกณฑ์ขั้นต่ำ…"?
- `whm-age.*`, `whm-age-over.summary` state the Thai 462 age range from `visaFacts` (18–30, UNVERIFIED).
- Study Finder reasons are written as clauses so they work both in the checklist and in the sentence "จากคำตอบของคุณ {reason} และ{reason} {closing}".
- `primaryCta` "ดูหลักสูตรที่เหมาะกับฉัน" opens the Budget Study Planner tab — there is no course database to filter yet (decision needed).

| ID | Key | English | Thai | Status |
|---|---|---|---|---|
| PLN-001 | title | Find your study pathway | **Owner text** — ค้นหาเส้นทางเรียนที่เหมาะกับคุณ | Applied verbatim |
| PLN-002 | subtitle | Answer a few short questions and we'll suggest study pathways in Australia that fit your goals. | **Owner text** — ตอบคำถามสั้น ๆ ไม่กี่ข้อ แล้วเราจะช่วยแนะนำเส้นทางเรียนในออสเตรเลียที่เหมาะกับเป้าหมายของคุณ | Applied verbatim |
| PLN-003 | step | Step {n} of {total} | **Owner text** — ขั้นตอน {n} จาก {total} | Applied verbatim |
| PLN-004 | next | Next | **Owner text** — ถัดไป | Applied verbatim |
| PLN-005 | back | Back | **Owner text** — ย้อนกลับ | Applied verbatim |
| PLN-006 | seeResults | See suggestions | **Owner text** — ดูคำแนะนำ | Applied verbatim |
| PLN-007 | startOver | Start over | **Owner text** — เริ่มใหม่ | Applied verbatim |
| PLN-008 | qAge | How old are you? | **Owner text** — ตอนนี้คุณอายุเท่าไหร่? | Applied verbatim |
| PLN-009 | agePlaceholder | e.g. 24 | **Owner text** — เช่น 24 | Applied verbatim |
| PLN-010 | ageError | Enter an age between 15 and 70. | กรอกอายุเป็นตัวเลขระหว่าง 15–70 ปี | DRAFT — needs editor |
| PLN-011 | qEnglish | What is your English level now? | **Owner text** — ระดับภาษาอังกฤษของคุณตอนนี้เป็นอย่างไร? | Applied verbatim |
| PLN-012 | englishHelper | If you have a different English test, pick the closest range for now. | **Owner text** — หากใช้ผลสอบภาษาอังกฤษประเภทอื่น สามารถเลือกช่วงคะแนนที่ใกล้เคียงได้ในตอนนี้ | Applied verbatim |
| PLN-013 | qGoals | What are your main goals? | **Owner text** — เป้าหมายหลักของคุณคืออะไร? | Applied verbatim |
| PLN-014 | goalsHelper | Choose all that apply. | เลือกได้มากกว่า 1 ข้อ | DRAFT — needs editor |
| PLN-015 | qCity | Where in Australia would you like to study? | **Owner text** — อยากเรียนที่เมืองไหนในออสเตรเลีย? | Applied verbatim |
| PLN-016 | qBudget | Roughly what is your yearly tuition budget? | **Owner text** — ตั้งงบค่าเรียนไว้ประมาณเท่าไหร่ต่อปี? | Applied verbatim |
| PLN-017 | qInterest | What kind of course interests you? | **Owner text** — สนใจเรียนหลักสูตรแบบไหน? | Applied verbatim |
| PLN-018 | qBackground | Your highest qualification and work experience | **Owner text** — วุฒิการศึกษาสูงสุดและประสบการณ์ทำงานของคุณ | Applied verbatim |
| PLN-019 | qualificationLabel | Highest qualification | **Owner text** — วุฒิการศึกษาสูงสุด | Applied verbatim |
| PLN-020 | experienceLabel | Years of work experience | **Owner text** — ประสบการณ์ทำงานกี่ปี? | Applied verbatim |
| PLN-021 | experienceError | Enter a number from 0 to 50. | กรอกจำนวนปีเป็นตัวเลข 0–50 | DRAFT — needs editor |
| PLN-022 | fieldLabel | What field do you work in? | **Owner text** — ทำงานด้านไหน? | Applied verbatim |
| PLN-023 | fieldPlaceholder | e.g. IT, Hospitality, Marketing | **Owner text** — เช่น IT, Hospitality, Marketing | Applied verbatim |
| PLN-024 | optional | (optional) | (ไม่บังคับ) | DRAFT — needs editor |
| PLN-025 | qTiming | When are you planning to come to Australia? | **Owner text** — ตอนนี้คุณวางแผนมาออสเตรเลียช่วงไหน? | Applied verbatim |
| PLN-026 | resultTitle | Study pathways worth exploring | **Owner text** — เส้นทางเรียนที่น่าสนใจสำหรับคุณ | Applied verbatim |
| PLN-027 | recommended | Suggested pathway | **Owner text** — เส้นทางที่แนะนำ | Applied verbatim |
| PLN-028 | tie | Based on your answers, two options look similarly relevant. | **Owner text** — จากข้อมูลของคุณ มี 2 ทางเลือกที่น่าสนใจใกล้เคียงกัน | Applied verbatim |
| PLN-029 | fromAnswers | Based on your answers, | จากคำตอบของคุณ | DRAFT — needs editor |
| PLN-030 | and |  and  |  และ | DRAFT — needs editor |
| PLN-031 | whyTitle | Why this suggestion? | **Owner text** — ทำไมเราถึงแนะนำทางเลือกนี้? | Applied verbatim |
| PLN-032 | sequenceTitle | An example pathway you could consider | **Owner text** — ตัวอย่างเส้นทางที่สามารถพิจารณาได้ | Applied verbatim |
| PLN-033 | alternativeTitle | Another option worth a look | **Owner text** — อีกทางเลือกที่น่าสนใจ | Applied verbatim |
| PLN-034 | budgetConstraint | This pathway fits your goals, but some courses may cost more than your budget. | **Owner text** — เส้นทางนี้ค่อนข้างตรงกับเป้าหมายของคุณ แต่ค่าเรียนของบางหลักสูตรอาจสูงกว่างบที่ตั้งไว้ | Applied verbatim |
| PLN-035 | budgetIdeas | You could | ลองพิจารณา | DRAFT — needs editor |
| PLN-036 | budgetCompare | Compare fees across institutions | เปรียบเทียบค่าเรียนของแต่ละสถาบัน | DRAFT — needs editor |
| PLN-037 | budgetVet | Look at vocational (VET) options | ดูทางเลือกสายวิชาชีพ (VET) | DRAFT — needs editor |
| PLN-038 | budgetTalk | Talk with the Beyond Study Center team | คุยกับทีม Beyond Study Center | DRAFT — needs editor |
| PLN-039 | downgradeNote | If you're considering a course below your current qualification level, check how it connects to your career goals. | **Owner text** — หากกำลังพิจารณาหลักสูตรที่อยู่ในระดับต่ำกว่าวุฒิเดิม ควรดูว่าหลักสูตรนั้นเชื่อมโยงกับเป้าหมายด้านอาชีพของคุณอย่างไร | Applied verbatim |
| PLN-040 | nextTitle | What to do next | **Owner text** — สิ่งที่ควรทำต่อ | Applied verbatim |
| PLN-041 | cityNote | Preferred city: {city} | เมืองที่สนใจ: {city} | DRAFT — needs editor |
| PLN-042 | primaryCta | See courses for me | **Owner text** — ดูหลักสูตรที่เหมาะกับฉัน | Applied verbatim |
| PLN-043 | visaBridgeTitle | Planning your visa too? | **Owner text** — กำลังวางแผนเรื่องวีซ่าด้วย? | Applied verbatim |
| PLN-044 | visaBridgeCta | Explore related visa options | **Owner text** — สำรวจตัวเลือกวีซ่าที่เกี่ยวข้อง | Applied verbatim |
| PLN-045 | consultTitle | Not sure where to start? | **Owner text** — ยังไม่แน่ใจว่าจะเริ่มจากตรงไหน? | Applied verbatim |
| PLN-046 | consultSub | The Beyond Study Center team can help you look at course options and plan a study pathway. | **Owner text** — ทีม Beyond Study Center ช่วยดูตัวเลือกหลักสูตรและวางแผนเส้นทางเรียนเบื้องต้นให้คุณได้ | Applied verbatim |
| PLN-047 | consultLine | Free chat on LINE | **Owner text** — ปรึกษาฟรีทาง LINE | Applied verbatim |
| PLN-048 | consultSite | BSC website | **Owner text** — เว็บไซต์ BSC | Applied verbatim |
| PLN-049 | disclaimer | These suggestions are general guidance based on your answers. Courses and entry requirements differ between institutions, so check the details before you decide. | **Owner text** — คำแนะนำนี้เป็นข้อมูลเบื้องต้นจากคำตอบที่คุณให้ไว้ หลักสูตรและเงื่อนไขการสมัครแตกต่างกันในแต่ละสถาบัน ควรตรวจสอบรายละเอียดอีกครั้งก่อนตัดสินใจ | Applied verbatim |
| PLN-050 | migrationNote | For visa or migration advice, check with a suitably qualified adviser. | **Owner text** — หากต้องการคำแนะนำด้านวีซ่าหรือการย้ายถิ่นฐาน ควรตรวจสอบกับผู้ให้คำแนะนำที่มีคุณสมบัติเหมาะสม | Applied verbatim |
| PLN-051 | english.none.label | No English score yet | **Owner text** — ยังไม่มีคะแนนภาษาอังกฤษ | Applied verbatim |
| PLN-052 | english.none.reason | You don't have an English score yet | ยังไม่มีผลคะแนนภาษาอังกฤษ | DRAFT — needs editor |
| PLN-053 | english.le45.label | IELTS 4.5 or lower | **Owner text** — IELTS 4.5 หรือต่ำกว่า | Applied verbatim |
| PLN-054 | english.le45.reason | Your IELTS is about 4.5 or lower | คะแนน IELTS ประมาณ 4.5 หรือต่ำกว่า | DRAFT — needs editor |
| PLN-055 | english.50to55.label | IELTS 5.0–5.5 | **Owner text** — IELTS 5.0–5.5 | Applied verbatim |
| PLN-056 | english.50to55.reason | Your IELTS is about 5.0–5.5 | คะแนน IELTS ประมาณ 5.0–5.5 | DRAFT — needs editor |
| PLN-057 | english.60to65.label | IELTS 6.0–6.5 | **Owner text** — IELTS 6.0–6.5 | Applied verbatim |
| PLN-058 | english.60to65.reason | Your IELTS is about 6.0–6.5 | คะแนน IELTS ประมาณ 6.0–6.5 | DRAFT — needs editor |
| PLN-059 | english.70plus.label | IELTS 7.0 or higher | **Owner text** — IELTS 7.0 ขึ้นไป | Applied verbatim |
| PLN-060 | english.70plus.reason | Your IELTS is 7.0 or higher | คะแนน IELTS 7.0 ขึ้นไป | DRAFT — needs editor |
| PLN-061 | goal.studyWork.label | Study and then work in Australia | **Owner text** — วางแผนเรียนและทำงานต่อในออสเตรเลีย | Applied verbatim |
| PLN-062 | goal.english.label | Improve my English | **Owner text** — พัฒนาภาษาอังกฤษ | Applied verbatim |
| PLN-063 | goal.english.reason | You want to improve your English | ต้องการพัฒนาภาษาอังกฤษ | DRAFT — needs editor |
| PLN-064 | goal.qualification.label | Gain a qualification or skills | **Owner text** — เรียนเพื่อเพิ่มวุฒิหรือทักษะ | Applied verbatim |
| PLN-065 | goal.qualification.reason | You want a qualification or new skills | ต้องการเพิ่มวุฒิหรือทักษะ | DRAFT — needs editor |
| PLN-066 | goal.career.label | Change career / improve career options | **Owner text** — เปลี่ยนสายงาน / เพิ่มโอกาสด้านอาชีพ | Applied verbatim |
| PLN-067 | goal.career.reason | You want to change career or improve your options | ต้องการเปลี่ยนสายงานหรือเพิ่มโอกาสด้านอาชีพ | DRAFT — needs editor |
| PLN-068 | goal.unsure.label | Not sure yet | **Owner text** — ยังไม่แน่ใจ | Applied verbatim |
| PLN-069 | budget.under10k.label | Under A$10,000 | **Owner text** — ต่ำกว่า A$10,000 | Applied verbatim |
| PLN-070 | budget.10to20k.label | A$10,000–20,000 | **Owner text** — A$10,000–20,000 | Applied verbatim |
| PLN-071 | budget.20to35k.label | A$20,001–35,000 | **Owner text** — A$20,001–35,000 | Applied verbatim |
| PLN-072 | budget.over35k.label | Over A$35,000 | **Owner text** — มากกว่า A$35,000 | Applied verbatim |
| PLN-073 | budget.unsure.label | Not sure yet | **Owner text** — ยังไม่แน่ใจ | Applied verbatim |
| PLN-074 | interest.elicos.label | English course (ELICOS) | **Owner text** — เรียนภาษาอังกฤษ (ELICOS) | Applied verbatim |
| PLN-075 | interest.elicos.desc | English language courses | **Owner text** — หลักสูตรภาษาอังกฤษ | Applied verbatim |
| PLN-076 | interest.elicos.reason | You're interested in an English course | สนใจเรียนภาษาอังกฤษ (ELICOS) | DRAFT — needs editor |
| PLN-077 | interest.vet.label | Vocational (VET) | **Owner text** — สายวิชาชีพ (VET) | Applied verbatim |
| PLN-078 | interest.vet.desc | Certificates, diplomas and vocational courses | **Owner text** — Certificate, Diploma และหลักสูตรสายวิชาชีพ | Applied verbatim |
| PLN-079 | interest.vet.reason | You're interested in vocational study | สนใจเรียนสายวิชาชีพ (VET) | DRAFT — needs editor |
| PLN-080 | interest.he.label | University / Higher Education | **Owner text** — มหาวิทยาลัย / Higher Education | Applied verbatim |
| PLN-081 | interest.he.desc | Bachelor, Graduate Certificate, Master and other university courses | **Owner text** — Bachelor, Graduate Certificate, Master และหลักสูตรระดับมหาวิทยาลัย | Applied verbatim |
| PLN-082 | interest.he.reason | You're interested in university study | สนใจเรียนระดับมหาวิทยาลัย | DRAFT — needs editor |
| PLN-083 | interest.unsure.label | Not sure yet | **Owner text** — ยังไม่แน่ใจ | Applied verbatim |
| PLN-084 | qualification.highSchool.label | High school or equivalent | **Owner text** — มัธยมศึกษาหรือเทียบเท่า | Applied verbatim |
| PLN-085 | qualification.highSchool.reason | You've finished high school | จบมัธยมศึกษาหรือเทียบเท่า | DRAFT — needs editor |
| PLN-086 | qualification.certDiploma.label | Certificate / Diploma | **Owner text** — Certificate / Diploma | Applied verbatim |
| PLN-087 | qualification.certDiploma.reason | You have a certificate or diploma | มีวุฒิ Certificate / Diploma | DRAFT — needs editor |
| PLN-088 | qualification.bachelor.label | Bachelor's degree | **Owner text** — ปริญญาตรี | Applied verbatim |
| PLN-089 | qualification.bachelor.reason | You have a bachelor's degree | มีวุฒิปริญญาตรี | DRAFT — needs editor |
| PLN-090 | qualification.master.label | Master's degree or higher | **Owner text** — ปริญญาโทขึ้นไป | Applied verbatim |
| PLN-091 | qualification.master.reason | You have a master's degree or higher | มีวุฒิปริญญาโทขึ้นไป | DRAFT — needs editor |
| PLN-092 | timing.inAustralia.label | Already in Australia | **Owner text** — อยู่ที่ออสเตรเลียแล้ว | Applied verbatim |
| PLN-093 | timing.within6.label | Within 6 months | **Owner text** — ภายใน 6 เดือน | Applied verbatim |
| PLN-094 | timing.6to12.label | In about 6–12 months | **Owner text** — ประมาณ 6–12 เดือน | Applied verbatim |
| PLN-095 | timing.over12.label | More than a year from now | **Owner text** — มากกว่า 1 ปี | Applied verbatim |
| PLN-096 | timing.unsure.label | Not sure yet | **Owner text** — ยังไม่แน่ใจ | Applied verbatim |
| PLN-097 | city.any | Not sure / open to any city | **Owner text** — ยังไม่แน่ใจ / เปิดรับทุกเมือง | Applied verbatim |
| PLN-098 | elicos.name | English course (ELICOS) | **Owner text** — เรียนภาษาอังกฤษ (ELICOS) | Applied verbatim |
| PLN-099 | elicos.desc | English courses to get ready for further study or life in Australia. | หลักสูตรภาษาอังกฤษ สำหรับเตรียมความพร้อมก่อนเรียนต่อหรือใช้ชีวิตในออสเตรเลีย | DRAFT — needs editor |
| PLN-100 | elicos.closing | so starting with an ELICOS course is one option worth considering to get ready for further study. | **Owner text** — การเริ่มจากหลักสูตร ELICOS จึงเป็นหนึ่งในตัวเลือกที่น่าสนใจสำหรับเตรียมความพร้อมก่อนเรียนต่อ | Applied verbatim |
| PLN-101 | vet.name | Vocational education (VET) | **Owner text** — สายวิชาชีพ (VET) | Applied verbatim |
| PLN-102 | vet.desc | Practical, job-focused skills through certificate or diploma courses. | **Owner text** — เรียนทักษะที่นำไปใช้กับงานได้โดยตรง ผ่านหลักสูตร Certificate หรือ Diploma | Applied verbatim |
| PLN-103 | vet.closing | so a vocational (VET) course is one option worth considering for practical, job-focused skills. | หลักสูตรสายวิชาชีพ (VET) จึงเป็นหนึ่งในตัวเลือกที่น่าสนใจ สำหรับเรียนทักษะที่นำไปใช้กับงานได้โดยตรง | DRAFT — needs editor |
| PLN-104 | he.name | University / Higher Education | **Owner text** — มหาวิทยาลัย / Higher Education | Applied verbatim |
| PLN-105 | he.desc | Bachelor, Graduate Certificate, Master and other university courses. | **Owner text** — Bachelor, Graduate Certificate, Master และหลักสูตรระดับมหาวิทยาลัย | Applied verbatim |
| PLN-106 | he.closing | so university study is one option worth considering for your goals. | การเรียนระดับมหาวิทยาลัยจึงเป็นหนึ่งในตัวเลือกที่น่าสนใจสำหรับเป้าหมายของคุณ | DRAFT — needs editor |
| PLN-107 | checkEnglish | Check your current English level | **Owner text** — เช็กระดับภาษาอังกฤษปัจจุบัน | Applied verbatim |
| PLN-108 | chooseField | Choose the field you're interested in | **Owner text** — เลือกสาขาที่สนใจ | Applied verbatim |
| PLN-109 | compareBudget | Compare tuition with your budget | **Owner text** — เปรียบเทียบค่าเรียนกับงบประมาณ | Applied verbatim |
| PLN-110 | planTiming | Plan your application around when you want to start | วางแผนเวลาสมัครให้ทันช่วงที่อยากเริ่มเรียน | DRAFT — needs editor |
| PLN-111 | institutionRequirements | Check each institution's entry requirements | **Owner text** — ดูเงื่อนไขการสมัครของแต่ละสถาบัน | Applied verbatim |
| PLN-112 | visaInfo | Look up the related visa information from official sources | ศึกษาข้อมูลวีซ่าที่เกี่ยวข้องจากแหล่งข้อมูลทางการ | DRAFT — needs editor |
| PLN-113 | hub.back | Plan your pathway to Australia | **Owner text** — วางแผนเส้นทางไปออสเตรเลีย | Applied verbatim |
| PLN-114 | hub.title | Plan your pathway to Australia | **Owner text** — วางแผนเส้นทางไปออสเตรเลีย | Applied verbatim |
| PLN-115 | hub.intro1 | Not sure where to start? | **Owner text** — ยังไม่แน่ใจว่าควรเริ่มจากตรงไหน? | Applied verbatim |
| PLN-116 | hub.intro2 | Explore study pathways and visa options that may suit your plans. | **Owner text** — ลองสำรวจเส้นทางการเรียนและตัวเลือกวีซ่าเบื้องต้นที่อาจเหมาะกับแผนของคุณ | Applied verbatim |
| PLN-117 | hub.studyTitle | Find your study pathway | **Owner text** — หาเส้นทางเรียนที่เหมาะกับคุณ | Applied verbatim |
| PLN-118 | hub.studyDesc | Answer a few short questions to see whether to start with English, vocational study or university. | **Owner text** — ตอบคำถามสั้น ๆ เพื่อดูว่าคุณควรเริ่มจากภาษาอังกฤษ สายวิชาชีพ หรือมหาวิทยาลัย | Applied verbatim |
| PLN-119 | hub.studyCta | Start planning your study | **Owner text** — เริ่มวางแผนการเรียน | Applied verbatim |
| PLN-120 | hub.visaTitle | Explore visa options | **Owner text** — สำรวจตัวเลือกวีซ่า | Applied verbatim |
| PLN-121 | hub.visaDesc | See how Working Holiday, Student, Skilled and Employer-Sponsored visas differ, and which to look into next. | **Owner text** — ดูภาพรวมว่า Working Holiday, Student, Skilled หรือ Employer-Sponsored แตกต่างกันอย่างไร และควรศึกษาตัวเลือกไหนต่อ | Applied verbatim |
| PLN-122 | hub.visaCta | Explore visa pathways | **Owner text** — สำรวจเส้นทางวีซ่า | Applied verbatim |
| PLN-123 | hub.disclaimer | This is general guidance to help you understand the options. Visa rules change and every case is different, so check the latest information from the Department of Home Affairs or a qualified adviser before you decide. | **Owner text** — ข้อมูลนี้เป็นเพียงคำแนะนำเบื้องต้นเพื่อช่วยให้คุณเข้าใจตัวเลือกต่าง ๆ เงื่อนไขวีซ่าสามารถเปลี่ยนแปลงได้ และแต่ละเคสมีรายละเอียดแตกต่างกัน ควรตรวจสอบข้อมูลล่าสุดจาก Department of Home Affairs หรือผู้ให้คำแนะนำที่มีคุณสมบัติเหมาะสมก่อนตัดสินใจ | Applied verbatim |
| PLN-124 | title | Explore visa options | **Owner text** — สำรวจตัวเลือกวีซ่า | Applied verbatim |
| PLN-125 | subtitle | Answer a few questions to see which visa types are worth looking into. | **Owner text** — ตอบคำถามไม่กี่ข้อ เพื่อดูว่ามีวีซ่าประเภทไหนที่คุณควรศึกษาต่อ | Applied verbatim |
| PLN-126 | question | Question {n} of {total} | **Owner text** — คำถาม {n} จาก {total} | Applied verbatim |
| PLN-127 | back | Back | **Owner text** — ย้อนกลับ | Applied verbatim |
| PLN-128 | startOver | Start over | **Owner text** — เริ่มใหม่ | Applied verbatim |
| PLN-129 | whyTitle | Why this appeared | **Owner text** — ทำไมตัวเลือกนี้จึงขึ้นมา? | Applied verbatim |
| PLN-130 | sequenceTitle | Example pathway | **Owner text** — ตัวอย่างเส้นทาง | Applied verbatim |
| PLN-131 | relatedTitle | Tools that may help next | **Owner text** — เครื่องมือที่อาจช่วยคุณต่อ | Applied verbatim |
| PLN-132 | sourcesTitle | Official sources | แหล่งข้อมูลทางการ | DRAFT — needs editor |
| PLN-133 | consultMigration | For advice about your visa, talk to a suitably qualified migration adviser. | **Owner text** — หากต้องการคำแนะนำเฉพาะด้านวีซ่า ควรปรึกษาผู้ให้คำแนะนำด้าน Migration ที่มีคุณสมบัติเหมาะสม | Applied verbatim |
| PLN-134 | consultMigrationLink | Find a registered migration agent | ค้นหา Registered Migration Agent | DRAFT — needs editor |
| PLN-135 | consultStudyTitle | Not sure where to start? | **Owner text** — ยังไม่แน่ใจว่าควรเริ่มจากตรงไหน? | Applied verbatim |
| PLN-136 | consultStudySub | The Beyond Study Center team can help you look at courses and plan your study, free. | **Owner text** — ทีม Beyond Study Center ช่วยดูตัวเลือกหลักสูตรและวางแผนการเรียนเบื้องต้นให้ได้ฟรี | Applied verbatim |
| PLN-137 | consultLine | Free chat on LINE | **Owner text** — ปรึกษาฟรีทาง LINE | Applied verbatim |
| PLN-138 | toolLabels.studyFinder | Find a study pathway | **Owner text** — หาเส้นทางเรียน | Applied verbatim |
| PLN-139 | toolLabels.planner | Study & budget planner | วางแผนเรียน & งบประมาณ | DRAFT — needs editor |
| PLN-140 | toolLabels.calculator | Estimate study costs | **Owner text** — คำนวณค่าเรียน | Applied verbatim |
| PLN-141 | toolLabels.savings | Plan your savings | **Owner text** — วางแผนเงินเก็บ | Applied verbatim |
| PLN-142 | toolLabels.strength | Visa readiness check | **Owner text** — เช็กความพร้อมก่อนยื่นวีซ่า | Applied verbatim |
| PLN-143 | toolLabels.universities | Find universities | ค้นหามหาวิทยาลัย | DRAFT — needs editor |
| PLN-144 | start.title | Which is closest to your situation right now? | **Owner text** — ตอนนี้สถานการณ์ของคุณใกล้เคียงกับข้อไหนที่สุด? | Applied verbatim |
| PLN-145 | start.opt.whm.label | I want to work and travel in Australia | **Owner text** — อยากไปทำงานและท่องเที่ยวในออสเตรเลีย | Applied verbatim |
| PLN-146 | start.opt.whm.reason | You want to work and travel in Australia | อยากไปทำงานและท่องเที่ยวในออสเตรเลีย | DRAFT — needs editor |
| PLN-147 | start.opt.study.label | I want to study | **Owner text** — อยากไปเรียนต่อ | Applied verbatim |
| PLN-148 | start.opt.study.reason | You want to study | ต้องการเรียนต่อ | DRAFT — needs editor |
| PLN-149 | start.opt.skilled.label | I have work experience and want to look at skilled visas | **Owner text** — มีประสบการณ์ทำงานและอยากดู Skilled Visa | Applied verbatim |
| PLN-150 | start.opt.skilled.reason | You have work experience and are interested in skilled visas | มีประสบการณ์ทำงานและสนใจ Skilled Visa | DRAFT — needs editor |
| PLN-151 | start.opt.employer.label | An Australian employer is interested in sponsoring me | **Owner text** — มีนายจ้างในออสเตรเลียที่สนใจสนับสนุนวีซ่า | Applied verbatim |
| PLN-152 | start.opt.employer.reason | An Australian employer is interested in sponsoring you | มีนายจ้างในออสเตรเลียที่สนใจสนับสนุนวีซ่า | DRAFT — needs editor |
| PLN-153 | start.opt.unsure.label | Not sure — show me all the options | **Owner text** — ยังไม่แน่ใจ อยากดูทุกตัวเลือก | Applied verbatim |
| PLN-154 | whm-age.title | Your age when you apply | อายุของคุณตอนที่จะยื่นวีซ่า | DRAFT — needs editor |
| PLN-155 | whm-age.helper | Working Holiday visas have age limits that depend on your passport. | Working Holiday มีเงื่อนไขเรื่องอายุ ซึ่งแตกต่างกันตามสัญชาติ | DRAFT — needs editor |
| PLN-156 | whm-age.opt.in.label | 18–30 | 18–30 ปี | DRAFT — needs editor |
| PLN-157 | whm-age.opt.in.reason | You're aged 18–30 | อายุอยู่ในช่วง 18–30 ปี | DRAFT — needs editor |
| PLN-158 | whm-age.opt.over.label | Over 30 | มากกว่า 30 ปี | DRAFT — needs editor |
| PLN-159 | whm-age.opt.unsure.label | Not sure | ยังไม่แน่ใจ | DRAFT — needs editor |
| PLN-160 | whm-passport.title | Do you hold a Thai passport? | คุณถือพาสปอร์ตไทยหรือไม่? | DRAFT — needs editor |
| PLN-161 | whm-passport.helper | Working Holiday conditions depend on your nationality. | เงื่อนไข Working Holiday แตกต่างกันตามสัญชาติ | DRAFT — needs editor |
| PLN-162 | whm-passport.opt.thai.label | Yes, a Thai passport | ใช่ ถือพาสปอร์ตไทย | DRAFT — needs editor |
| PLN-163 | whm-passport.opt.thai.reason | You hold a Thai passport (subclass 462) | ถือพาสปอร์ตไทย (วีซ่า 462) | DRAFT — needs editor |
| PLN-164 | whm-passport.opt.other.label | Another passport | ถือพาสปอร์ตประเทศอื่น | DRAFT — needs editor |
| PLN-165 | whm-goal.title | What is your main goal? | เป้าหมายหลักของคุณคืออะไร? | DRAFT — needs editor |
| PLN-166 | whm-goal.opt.travel.label | Travel and experience life there | ท่องเที่ยวและใช้ชีวิต | DRAFT — needs editor |
| PLN-167 | whm-goal.opt.travel.reason | You want to travel and experience life in Australia | อยากท่องเที่ยวและใช้ชีวิตในออสเตรเลีย | DRAFT — needs editor |
| PLN-168 | whm-goal.opt.work.label | Work for experience and income | ทำงานหาประสบการณ์และรายได้ | DRAFT — needs editor |
| PLN-169 | whm-goal.opt.work.reason | You want work experience and income | อยากทำงานหาประสบการณ์และรายได้ | DRAFT — needs editor |
| PLN-170 | whm-goal.opt.study.label | Also try some short study | อยากลองเรียนระยะสั้นด้วย | DRAFT — needs editor |
| PLN-171 | whm-goal.opt.study.reason | You're also interested in short study | สนใจเรียนระยะสั้นด้วย | DRAFT — needs editor |
| PLN-172 | whm-goal.opt.unsure.label | Not sure | ยังไม่แน่ใจ | DRAFT — needs editor |
| PLN-173 | whm-result.eyebrow | Worth exploring | **Owner text** — ตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-174 | whm-result.title | A Working Holiday visa may be worth exploring | **Owner text** — Working Holiday อาจเป็นตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-175 | whm-result.summary | Based on your answers, a Working Holiday visa (417/462) may relate to your plans. Check the latest conditions before you prepare. | จากคำตอบของคุณ วีซ่า Working Holiday (417/462) อาจเกี่ยวข้องกับแผนของคุณ ควรตรวจสอบเงื่อนไขล่าสุดก่อนเตรียมตัว | DRAFT — needs editor |
| PLN-176 | whm-result.checksTitle | What to check next | **Owner text** — สิ่งที่ควรเช็กต่อ | Applied verbatim |
| PLN-177 | whm-result.checks.1 | Age and nationality | **Owner text** — อายุและสัญชาติ | Applied verbatim |
| PLN-178 | whm-result.checks.2 | Conditions for the relevant subclass | **Owner text** — เงื่อนไขของ subclass ที่เกี่ยวข้อง | Applied verbatim |
| PLN-179 | whm-result.checks.3 | Financial evidence | **Owner text** — หลักฐานทางการเงิน | Applied verbatim |
| PLN-180 | whm-result.checks.4 | Work conditions | **Owner text** — เงื่อนไขด้านการทำงาน | Applied verbatim |
| PLN-181 | whm-result.checks.5 | Second and third year conditions, if relevant | **Owner text** — เงื่อนไขสำหรับปีที่ 2 / 3 หากเกี่ยวข้อง | Applied verbatim |
| PLN-182 | whm-result.action.1 | See Working Holiday details | **Owner text** — ดูรายละเอียด Working Holiday | Applied verbatim |
| PLN-183 | whm-result-study.eyebrow | Worth exploring | **Owner text** — ตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-184 | whm-result-study.title | A Working Holiday visa may be worth exploring | **Owner text** — Working Holiday อาจเป็นตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-185 | whm-result-study.summary | Based on your answers, a Working Holiday visa (417/462) may relate to your plans. Check the latest conditions before you prepare. | **Owner text** — จากคำตอบของคุณ วีซ่า Working Holiday (417/462) อาจเกี่ยวข้องกับแผนของคุณ ควรตรวจสอบเงื่อนไขล่าสุดก่อนเตรียมตัว | Applied verbatim |
| PLN-186 | whm-result-study.checksTitle | What to check next | **Owner text** — สิ่งที่ควรเช็กต่อ | Applied verbatim |
| PLN-187 | whm-result-study.checks.1 | Age and nationality | **Owner text** — อายุและสัญชาติ | Applied verbatim |
| PLN-188 | whm-result-study.checks.2 | Conditions for the relevant subclass | **Owner text** — เงื่อนไขของ subclass ที่เกี่ยวข้อง | Applied verbatim |
| PLN-189 | whm-result-study.checks.3 | Financial evidence | **Owner text** — หลักฐานทางการเงิน | Applied verbatim |
| PLN-190 | whm-result-study.checks.4 | Work conditions | **Owner text** — เงื่อนไขด้านการทำงาน | Applied verbatim |
| PLN-191 | whm-result-study.checks.5 | Second and third year conditions, if relevant | **Owner text** — เงื่อนไขสำหรับปีที่ 2 / 3 หากเกี่ยวข้อง | Applied verbatim |
| PLN-192 | whm-result-study.action.1 | See Working Holiday details | **Owner text** — ดูรายละเอียด Working Holiday | Applied verbatim |
| PLN-193 | whm-age-over.eyebrow | Worth checking | ควรตรวจสอบเพิ่มเติม | DRAFT — needs editor |
| PLN-194 | whm-age-over.title | Working Holiday may not match the age limit | Working Holiday อาจไม่ตรงกับช่วงอายุที่กำหนด | DRAFT — needs editor |
| PLN-195 | whm-age-over.summary | For Thai passport holders, the subclass 462 age range is 18–30. Check the latest conditions with Home Affairs, or look at other visa options that may relate to your plans. | สำหรับผู้ถือพาสปอร์ตไทย เงื่อนไขอายุของวีซ่า 462 คือ 18–30 ปี ลองตรวจสอบเงื่อนไขล่าสุดจาก Home Affairs หรือดูตัวเลือกวีซ่าอื่นที่อาจเกี่ยวข้องกับแผนของคุณ | DRAFT — needs editor |
| PLN-196 | whm-age-over.action.1 | See other visa options | ดูตัวเลือกวีซ่าอื่น | DRAFT — needs editor |
| PLN-197 | student-plan.title | Student visa — where are you in your planning? | **Owner text** — Student Visa — คุณกำลังวางแผนแบบไหน? | Applied verbatim |
| PLN-198 | student-plan.opt.ready.label | Ready to choose a course | **Owner text** — พร้อมเลือกหลักสูตรแล้ว | Applied verbatim |
| PLN-199 | student-plan.opt.ready.reason | You're ready to choose a course | พร้อมเลือกหลักสูตรแล้ว | DRAFT — needs editor |
| PLN-200 | student-plan.opt.unsure.label | I want to study but don't know what yet | **Owner text** — อยากเรียน แต่ยังไม่แน่ใจว่าจะเรียนอะไร | Applied verbatim |
| PLN-201 | student-plan.opt.unsure.reason | You're not sure what to study yet | ยังไม่แน่ใจว่าจะเรียนอะไร | DRAFT — needs editor |
| PLN-202 | student-plan.opt.english.label | I need to improve my English first | **Owner text** — ต้องพัฒนาภาษาอังกฤษก่อน | Applied verbatim |
| PLN-203 | student-plan.opt.english.reason | You want to improve your English first | ต้องการพัฒนาภาษาอังกฤษก่อน | DRAFT — needs editor |
| PLN-204 | student-plan.opt.budget.label | I'm worried about costs | **Owner text** — กังวลเรื่องงบประมาณ | Applied verbatim |
| PLN-205 | student-plan.opt.budget.reason | You're concerned about costs | กังวลเรื่องงบประมาณ | DRAFT — needs editor |
| PLN-206 | student-ready.eyebrow | Worth exploring | **Owner text** — ตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-207 | student-ready.title | Student Visa (Subclass 500) | **Owner text** — Student Visa (Subclass 500) | Applied verbatim |
| PLN-208 | student-ready.summary | Based on your answers, your main goal is to study in Australia. | **Owner text** — จากคำตอบของคุณ คุณมีเป้าหมายหลักด้านการเรียนต่อในออสเตรเลีย | Applied verbatim |
| PLN-209 | student-ready.checksTitle | What to do next | **Owner text** — สิ่งที่ควรทำต่อ | Applied verbatim |
| PLN-210 | student-ready.checks.1 | Choose a type of course | **Owner text** — เลือกประเภทหลักสูตร | Applied verbatim |
| PLN-211 | student-ready.checks.2 | Check tuition and your budget | **Owner text** — เช็กค่าเรียนและงบประมาณ | Applied verbatim |
| PLN-212 | student-ready.checks.3 | Check the Student visa requirements | **Owner text** — ตรวจสอบเงื่อนไข Student Visa | Applied verbatim |
| PLN-213 | student-ready.action.1 | Find your study pathway | **Owner text** — หาเส้นทางเรียนที่เหมาะกับคุณ | Applied verbatim |
| PLN-214 | student-ready.action.2 | See Home Affairs information | **Owner text** — ดูข้อมูลจาก Home Affairs | Applied verbatim |
| PLN-215 | student-unsure.eyebrow | Worth exploring | **Owner text** — ตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-216 | student-unsure.title | Start by finding your study pathway | เริ่มจากหาเส้นทางเรียนที่เหมาะกับคุณ | DRAFT — needs editor |
| PLN-217 | student-unsure.summary | Answer a few short questions to see whether to start with English, vocational study or university. | **Owner text** — ตอบคำถามสั้น ๆ เพื่อดูว่าคุณควรเริ่มจากภาษาอังกฤษ สายวิชาชีพ หรือมหาวิทยาลัย | Applied verbatim |
| PLN-218 | student-unsure.bridge | Not sure what to study? | **Owner text** — ยังไม่แน่ใจว่าจะเรียนอะไร? | Applied verbatim |
| PLN-219 | student-english.eyebrow | Worth exploring | **Owner text** — ตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-220 | student-english.title | ELICOS may be a good place to start | **Owner text** — ELICOS อาจเป็นจุดเริ่มต้นที่น่าสนใจ | Applied verbatim |
| PLN-221 | student-english.summary | If your English is not yet at the level your course requires, an English course first can help you prepare. | **Owner text** — หากระดับภาษาอังกฤษยังไม่ถึงเงื่อนไขของหลักสูตรที่สนใจ การเรียนภาษาอังกฤษก่อนสามารถช่วยเตรียมความพร้อมได้ | Applied verbatim |
| PLN-222 | student-english.action.1 | See ELICOS options | **Owner text** — ดูตัวเลือก ELICOS | Applied verbatim |
| PLN-223 | student-english.action.2 | Find your study pathway | **Owner text** — หาเส้นทางเรียนที่เหมาะกับคุณ | Applied verbatim |
| PLN-224 | student-budget.eyebrow | Worth exploring | **Owner text** — ตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-225 | student-budget.title | There are still options to explore for your budget | **Owner text** — ยังมีตัวเลือกที่เหมาะกับงบประมาณให้สำรวจ | Applied verbatim |
| PLN-226 | student-budget.summary | Tuition varies by course and institution. | **Owner text** — ค่าเรียนแตกต่างกันตามหลักสูตรและสถาบัน | Applied verbatim |
| PLN-227 | student-budget.checksTitle | Try next | **Owner text** — ลองทำต่อ | Applied verbatim |
| PLN-228 | student-budget.action.1 | Estimate study costs | **Owner text** — คำนวณค่าเรียน | Applied verbatim |
| PLN-229 | student-budget.action.2 | Plan your savings | **Owner text** — วางแผนเงินเก็บ | Applied verbatim |
| PLN-230 | student-budget.action.3 | Find your study pathway | **Owner text** — หาเส้นทางเรียนที่เหมาะกับคุณ | Applied verbatim |
| PLN-231 | skilled-list.title | Is your occupation on the Skilled Occupation List? | **Owner text** — อาชีพของคุณอยู่ใน Skilled Occupation List หรือไม่? | Applied verbatim |
| PLN-232 | skilled-list.opt.listed-calc.label | It's on the list and I've worked out my points | **Owner text** — อยู่ในรายการ และเคยคำนวณคะแนนแล้ว | Applied verbatim |
| PLN-233 | skilled-list.opt.listed-calc.reason | Your occupation is on the list | อาชีพอยู่ใน Skilled Occupation List | DRAFT — needs editor |
| PLN-234 | skilled-list.opt.listed-unsure.label | It's on the list but I'm not sure about points | **Owner text** — อยู่ในรายการ แต่ยังไม่แน่ใจเรื่องคะแนน | Applied verbatim |
| PLN-235 | skilled-list.opt.listed-unsure.reason | Your occupation is on the list | อาชีพอยู่ใน Skilled Occupation List | DRAFT — needs editor |
| PLN-236 | skilled-list.opt.not-listed.label | It's not on the list | **Owner text** — ไม่อยู่ในรายการ | Applied verbatim |
| PLN-237 | skilled-list.opt.unsure.label | Not sure | **Owner text** — ยังไม่แน่ใจ | Applied verbatim |
| PLN-238 | skilled-points.title | Roughly what is your points test score? | คะแนน Points Test ของคุณประมาณเท่าไหร่? | DRAFT — needs editor |
| PLN-239 | skilled-points.opt.high.label | 65 or more | 65 คะแนนขึ้นไป | DRAFT — needs editor |
| PLN-240 | skilled-points.opt.high.reason | Your score is about 65 or more | คะแนนประมาณ 65 ขึ้นไป | DRAFT — needs editor |
| PLN-241 | skilled-points.opt.low.label | Under 65 | ต่ำกว่า 65 คะแนน | DRAFT — needs editor |
| PLN-242 | skilled-points.opt.unsure.label | Not sure | ยังไม่แน่ใจ | DRAFT — needs editor |
| PLN-243 | skilled-min-met.eyebrow | Worth exploring | **Owner text** — ตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-244 | skilled-min-met.title | You may meet the basic minimum points score | **Owner text** — คุณผ่านเกณฑ์คะแนนขั้นต่ำที่ใช้ใน Points Test เบื้องต้น | Applied verbatim |
| PLN-245 | skilled-min-met.summary | But whether you're invited depends on the visa, your occupation, invitation rounds and other factors. | **Owner text** — แต่การได้รับ invitation ขึ้นอยู่กับประเภทวีซ่า อาชีพ รอบการเชิญ และปัจจัยอื่น ๆ ด้วย | Applied verbatim |
| PLN-246 | skilled-min-met.checksTitle | What to check next | **Owner text** — สิ่งที่ควรตรวจสอบต่อ | Applied verbatim |
| PLN-247 | skilled-min-met.checks.1 | Skills assessment | Skills Assessment | DRAFT — needs editor |
| PLN-248 | skilled-min-met.checks.2 | English level | ระดับภาษาอังกฤษ | DRAFT — needs editor |
| PLN-249 | skilled-min-met.checks.3 | Occupation eligibility | คุณสมบัติของอาชีพ | DRAFT — needs editor |
| PLN-250 | skilled-min-met.checks.4 | Points calculation | การคำนวณคะแนน | DRAFT — needs editor |
| PLN-251 | skilled-min-met.checks.5 | Invitation requirements | เงื่อนไขการได้รับ invitation | DRAFT — needs editor |
| PLN-252 | skilled-min-met.action.1 | Open the Home Affairs points calculator | **Owner text** — เปิด Points Calculator ของ Home Affairs | Applied verbatim |
| PLN-253 | skilled-low.eyebrow | Worth checking | **Owner text** — ควรตรวจสอบเพิ่มเติม | Applied verbatim |
| PLN-254 | skilled-low.title | Your current score may be limiting | **Owner text** — คะแนนปัจจุบันอาจยังมีข้อจำกัด | Applied verbatim |
| PLN-255 | skilled-low.summary | Check which factors could change your score, such as English, work experience, partner skills or other relevant conditions. | **Owner text** — ลองตรวจสอบว่ามีปัจจัยใดที่อาจเปลี่ยนคะแนนได้ เช่น ภาษาอังกฤษ ประสบการณ์ทำงาน คุณสมบัติคู่สมรส หรือเงื่อนไขอื่นที่เกี่ยวข้อง | Applied verbatim |
| PLN-256 | skilled-low.action.1 | Open the Home Affairs points calculator | **Owner text** — เปิด Points Calculator ของ Home Affairs | Applied verbatim |
| PLN-257 | skilled-low.action.2 | See other visa options | **Owner text** — ดูตัวเลือกวีซ่าอื่น | Applied verbatim |
| PLN-258 | skilled-check-points.eyebrow | Worth checking | ควรตรวจสอบเพิ่มเติม | DRAFT — needs editor |
| PLN-259 | skilled-check-points.title | Work out your points first | ลองคำนวณคะแนนเบื้องต้นก่อน | DRAFT — needs editor |
| PLN-260 | skilled-check-points.summary | The Home Affairs points calculator gives an estimate based on age, English, experience and qualifications. | Points Calculator ของ Home Affairs ช่วยให้เห็นคะแนนโดยประมาณจากอายุ ภาษาอังกฤษ ประสบการณ์ และวุฒิการศึกษา | DRAFT — needs editor |
| PLN-261 | skilled-check-points.action.1 | Open the Home Affairs points calculator | เปิด Points Calculator ของ Home Affairs | DRAFT — needs editor |
| PLN-262 | skilled-check-points.action.2 | Back to the question | กลับมาทำต่อ | DRAFT — needs editor |
| PLN-263 | skilled-not-listed.eyebrow | Worth checking | **Owner text** — ควรตรวจสอบเพิ่มเติม | Applied verbatim |
| PLN-264 | skilled-not-listed.title | Your occupation may not match this skilled pathway | **Owner text** — อาชีพปัจจุบันอาจไม่ตรงกับ Skilled pathway ที่กำลังดู | Applied verbatim |
| PLN-265 | skilled-not-listed.summary | You can still explore other options, such as other visa types, or look at which options relate to your experience. | **Owner text** — คุณยังสามารถสำรวจตัวเลือกอื่นได้ เช่น วีซ่าประเภทอื่น หรือศึกษาว่าอาชีพที่เกี่ยวข้องกับประสบการณ์ของคุณมีตัวเลือกอะไรบ้าง | Applied verbatim |
| PLN-266 | skilled-not-listed.action.1 | See other visa options | **Owner text** — ดูตัวเลือกวีซ่าอื่น | Applied verbatim |
| PLN-267 | skilled-not-listed.action.2 | Explore study pathways | **Owner text** — สำรวจเส้นทางการเรียน | Applied verbatim |
| PLN-268 | skilled-not-listed.action.3 | Check Home Affairs information | **Owner text** — ตรวจสอบข้อมูลจาก Home Affairs | Applied verbatim |
| PLN-269 | skilled-unsure.eyebrow | Worth checking | **Owner text** — ควรตรวจสอบเพิ่มเติม | Applied verbatim |
| PLN-270 | skilled-unsure.title | Not sure? Check the official list | **Owner text** — ยังไม่แน่ใจ? เช็กได้จากแหล่งข้อมูลทางการ | Applied verbatim |
| PLN-271 | skilled-unsure.summary | See whether your occupation is on the list, then come back and continue. | **Owner text** — ดูว่าอาชีพของคุณอยู่ในรายการหรือไม่ แล้วกลับมาตอบคำถามต่อได้ | Applied verbatim |
| PLN-272 | skilled-unsure.action.1 | Check the Skilled Occupation List | **Owner text** — เช็ก Skilled Occupation List | Applied verbatim |
| PLN-273 | skilled-unsure.action.2 | Back to the question | **Owner text** — กลับมาทำต่อ | Applied verbatim |
| PLN-274 | employer-status.title | Has an employer offered to sponsor you? | **Owner text** — นายจ้างเสนอสนับสนุนวีซ่าให้คุณแล้วหรือยัง? | Applied verbatim |
| PLN-275 | employer-status.opt.discussing.label | Yes, we're discussing details | **Owner text** — ใช่ กำลังคุยรายละเอียดกันอยู่ | Applied verbatim |
| PLN-276 | employer-status.opt.discussing.reason | You're discussing sponsorship with an employer | กำลังคุยรายละเอียดกับนายจ้างเรื่อง sponsorship | DRAFT — needs editor |
| PLN-277 | employer-status.opt.interested.label | An employer is interested but hasn't started | **Owner text** — นายจ้างสนใจ แต่ยังไม่ได้เริ่มขั้นตอน | Applied verbatim |
| PLN-278 | employer-status.opt.interested.reason | An employer is interested in sponsoring you | มีนายจ้างที่สนใจสนับสนุน | DRAFT — needs editor |
| PLN-279 | employer-status.opt.none.label | No employer yet | **Owner text** — ยังไม่มีนายจ้าง | Applied verbatim |
| PLN-280 | employer-match.title | Do your role and experience match what the employer needs? | **Owner text** — ตำแหน่งงานและประสบการณ์ของคุณตรงกับงานที่นายจ้างต้องการหรือไม่? | Applied verbatim |
| PLN-281 | employer-match.opt.yes.label | Yes, they match | ตรงกับงานที่นายจ้างต้องการ | DRAFT — needs editor |
| PLN-282 | employer-match.opt.yes.reason | Your experience matches the role | ประสบการณ์ตรงกับตำแหน่งงาน | DRAFT — needs editor |
| PLN-283 | employer-match.opt.partly.label | Partly | ตรงบางส่วน | DRAFT — needs editor |
| PLN-284 | employer-match.opt.unsure.label | Not sure | ยังไม่แน่ใจ | DRAFT — needs editor |
| PLN-285 | employer-result.eyebrow | Worth exploring | **Owner text** — ตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-286 | employer-result.title | An employer-sponsored visa may be worth exploring | **Owner text** — เส้นทาง Employer-Sponsored อาจเป็นตัวเลือกที่ควรศึกษาต่อ | Applied verbatim |
| PLN-287 | employer-result.summary | Based on your answers, an employer is interested in sponsoring you, so check the details of the visas that relate to your role. | **Owner text** — จากข้อมูลที่คุณให้มา คุณมีนายจ้างที่สนใจสนับสนุน จึงควรตรวจสอบรายละเอียดของวีซ่าที่เกี่ยวข้องกับตำแหน่งงานของคุณเพิ่มเติม | Applied verbatim |
| PLN-288 | employer-result.checksTitle | Check next | **Owner text** — ควรเช็กต่อ | Applied verbatim |
| PLN-289 | employer-result.checks.1 | Whether the role is on the relevant occupation list | **Owner text** — ตำแหน่งงานอยู่ในรายการอาชีพที่เกี่ยวข้องหรือไม่ | Applied verbatim |
| PLN-290 | employer-result.checks.2 | Whether your work experience meets the requirements | **Owner text** — ประสบการณ์ทำงานตรงตามเงื่อนไขหรือไม่ | Applied verbatim |
| PLN-291 | employer-result.checks.3 | English requirements | **Owner text** — คุณสมบัติด้านภาษาอังกฤษ | Applied verbatim |
| PLN-292 | employer-result.checks.4 | Salary and the market salary requirement | **Owner text** — เงินเดือนและ market salary requirement | Applied verbatim |
| PLN-293 | employer-result.checks.5 | Employer and nomination requirements | **Owner text** — เงื่อนไขของนายจ้างและ nomination | Applied verbatim |
| PLN-294 | employer-result.action.1 | Check Home Affairs information | **Owner text** — ตรวจสอบข้อมูลจาก Home Affairs | Applied verbatim |
| PLN-295 | employer-result.action.2 | Find a registered migration agent | **Owner text** — ปรึกษาผู้เชี่ยวชาญด้าน Migration | Applied verbatim |
| PLN-296 | employer-none.eyebrow | Worth checking | ควรตรวจสอบเพิ่มเติม | DRAFT — needs editor |
| PLN-297 | employer-none.title | Employer sponsorship needs an employer | Employer-Sponsored ต้องมีนายจ้างที่สนับสนุน | DRAFT — needs editor |
| PLN-298 | employer-none.summary | This pathway needs an Australian employer to nominate you. Look at other options that may relate to your plans. | เส้นทางนี้ต้องมีนายจ้างในออสเตรเลียที่เสนอชื่อ (nomination) ให้คุณ ลองดูตัวเลือกอื่นที่อาจเกี่ยวข้องกับแผนของคุณ | DRAFT — needs editor |
| PLN-299 | employer-none.action.1 | See other visa options | ดูตัวเลือกวีซ่าอื่น | DRAFT — needs editor |
| PLN-300 | compare.title | Compare the main options | **Owner text** — เปรียบเทียบตัวเลือกหลัก | Applied verbatim |
| PLN-301 | compare.card.Working Holiday.fit | People who want to travel and work short-term and meet the country and age conditions | **Owner text** — คนที่ต้องการเดินทางและทำงานระยะสั้น และมีคุณสมบัติตามเงื่อนไขของประเทศ/อายุ | Applied verbatim |
| PLN-302 | compare.card.Working Holiday.cta | See details | **Owner text** — ดูรายละเอียด | Applied verbatim |
| PLN-303 | compare.card.Student Visa.fit | People with a clear study goal | **Owner text** — คนที่มีเป้าหมายด้านการเรียนที่ชัดเจน | Applied verbatim |
| PLN-304 | compare.card.Student Visa.cta | Plan your study | **Owner text** — วางแผนการเรียน | Applied verbatim |
| PLN-305 | compare.card.Skilled.fit | People whose occupation and skills relate to skilled migration | **Owner text** — ผู้ที่มีอาชีพและคุณสมบัติที่เกี่ยวข้องกับ skilled migration | Applied verbatim |
| PLN-306 | compare.card.Skilled.cta | Quick check | **Owner text** — เช็กเบื้องต้น | Applied verbatim |
| PLN-307 | compare.card.Employer-Sponsored.fit | People who have, or are talking to, an Australian employer about sponsorship | **Owner text** — ผู้ที่มีหรือกำลังคุยกับนายจ้างออสเตรเลียเรื่อง sponsorship | Applied verbatim |
| PLN-308 | compare.card.Employer-Sponsored.cta | See the basics | **Owner text** — ดูเงื่อนไขเบื้องต้น | Applied verbatim |

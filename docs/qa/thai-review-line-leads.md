# Thai review — LINE lead form (LIFF)

**Status: all Thai below is DRAFT, written by Claude on branch `feat/line-liff-leads` (2026-11-18). AWAITING EXTERNAL THAI EDITOR REVIEW before go-live.**

- Owner request: 2026-11-17, "capture what the visitor filled in when they add our LINE account" (LIFF option).
- The feature is off until `NEXT_PUBLIC_LIFF_ID` is set, so none of this text is visible on the public site yet.
- The website itself gets **no new Thai text**. The LINE buttons are unchanged. The answer summaries are built from each tool's existing Thai question and option labels.
- Where it appears: the form opens **inside LINE** after the visitor taps the LINE button on the Budget Planner result (or opens the LIFF link directly). LINE messages go to the student's chat and the staff group.
- Tone: polite, uses ค่ะ only in greetings and the confirmation title. No promised reply time (removed "within 1 business day" because it isn't a confirmed service promise).
- Screenshots: not captured yet (the page needs a real LIFF ID to render outside tests). Mocked e2e runs show the layout: `npx playwright test tests/e2e/line-leads.spec.ts`.

## LIFF page — `src/components/line/LiffLeadForm.tsx` (`T.th` / `T.en`)

| ID | Key | Where / user action | English | Thai (draft) | Constraints |
|---|---|---|---|---|---|
| LIFF-001 | loading | Spinner while LINE login runs | Opening the form… | กำลังเปิดแบบฟอร์ม… | |
| LIFF-002 | errorTitle | LINE or server error | Couldn't open the form | เปิดแบบฟอร์มไม่สำเร็จ | |
| LIFF-003 | errorBody | Under the error title | Please try again, or message us on LINE. | กรุณาลองใหม่อีกครั้ง หรือทักแชท LINE ของเราได้เลย | |
| LIFF-004 | retry | Error retry button | Try again | ลองใหม่ | Button |
| LIFF-005 | hello | Page heading | Hi {name} | สวัสดีค่ะ คุณ{name} | {name} = LINE display name; no space after คุณ |
| LIFF-006 | intro | Under the heading | Share a few details and a counsellor will get back to you with a plan that fits. | กรอกข้อมูลสั้น ๆ ทีมที่ปรึกษาจะติดต่อกลับเพื่อแนะนำแผนที่เหมาะกับคุณ | |
| LIFF-007 | yourAnswers | Card showing Budget Planner answers | Your answers from the website | คำตอบของคุณจากเว็บไซต์ | Small caps label |
| LIFF-008 | notFriend | Shown if the visitor skipped adding the OA | Add Beyond Study Center on LINE to get a summary and let our team reply in chat. | เพิ่ม Beyond Study Center เป็นเพื่อนใน LINE เพื่อรับสรุปคำตอบและให้ทีมงานทักกลับทางแชทได้ | |
| LIFF-009 | addFriend | Green button | Add us on LINE | เพิ่มเพื่อนใน LINE | Button |
| LIFF-010 | fullName | Field label (required) | Full name | ชื่อ-นามสกุล | " *" appended |
| LIFF-011 | nickname | Field label | Nickname | ชื่อเล่น | |
| LIFF-034 | age | Field label (required) | Age (years) | อายุ (ปี) | " *" appended |
| LIFF-035 | visa | Select label (required) | Visa you're interested in | วีซ่าที่สนใจ | " *" appended |
| LIFF-036 | errors.age | Under age field | Please enter your age as a number, 15–70 | กรุณากรอกอายุเป็นตัวเลข 15–70 | Same range as Study Pathway Finder |
| LIFF-037 | errors.visa_interest | Under visa field | Please choose a visa | กรุณาเลือกวีซ่าที่สนใจ | |
| LIFF-012 | phone | Field label (required) | Phone number | เบอร์โทรศัพท์ | " *" appended |
| LIFF-013 | email | Field label | Email (optional) | อีเมล (ไม่บังคับ) | |
| LIFF-014 | level | Select label | Current education | ระดับการศึกษาปัจจุบัน | |
| LIFF-015 | program | Select label, shown only when visa = student | If studying, which course? | ถ้าเรียน สนใจหลักสูตรไหน | |
| LIFF-016 | intake | Select label | Preferred start | อยากเริ่มเรียนช่วงไหน | |
| LIFF-017 | message | Textarea label | Anything else? (optional) | คำถามเพิ่มเติม (ไม่บังคับ) | |
| LIFF-018 | select | Empty select option | Select | เลือก | |
| LIFF-019 | consent | Required checkbox | I agree that Beyond Study Center may keep and use this information to contact me about studying in Australia. | ยินยอมให้ Beyond Study Center เก็บและใช้ข้อมูลนี้เพื่อติดต่อให้คำปรึกษาเรื่องเรียนต่อ | **Legal meaning — owner to confirm with PDPA advice.** Keep purpose explicit. |
| LIFF-020 | privacy | Link after consent (only if NEXT_PUBLIC_PRIVACY_URL set) | Read the privacy policy | อ่านนโยบายความเป็นส่วนตัว | Link |
| LIFF-021 | marketing | Optional checkbox | Send me news and scholarships on LINE (optional) | รับข่าวสารและทุนการศึกษาทาง LINE (ไม่บังคับ) | Must stay clearly optional |
| LIFF-022 | submit | Submit button | Send to a counsellor | ส่งข้อมูลให้ทีมที่ปรึกษา | Button really sends data, so "ส่ง" is accurate |
| LIFF-023 | sending | Button while sending | Sending… | กำลังส่ง… | |
| LIFF-024 | errors.full_name | Under name field | Please enter your name | กรุณากรอกชื่อ | |
| LIFF-025 | errors.phone | Under phone field | Please enter a valid phone number | กรุณากรอกเบอร์โทรให้ถูกต้อง | |
| LIFF-026 | errors.email | Under email field | Please check your email | รูปแบบอีเมลไม่ถูกต้อง | |
| LIFF-027 | errors.consent | Under consent | Please tick to agree before sending | กรุณาติ๊กยินยอมก่อนส่งข้อมูล | |
| LIFF-028 | sendFailed | Network/server error on submit | Couldn't send. Please try again. | ส่งไม่สำเร็จ กรุณาลองใหม่ | |
| LIFF-029 | expired | Login expired on submit | Your LINE login expired. Please reopen the link. | หมดเวลาเข้าสู่ระบบ กรุณาเปิดลิงก์ใหม่อีกครั้ง | |
| LIFF-030 | doneTitle | Confirmation heading | Thanks, we've got it | ได้รับข้อมูลแล้วค่ะ | |
| LIFF-031 | doneFriend | Confirmation (is a friend) | We've sent a summary to your LINE chat. A counsellor will be in touch soon. | เราส่งสรุปไปที่แชท LINE แล้ว ทีมที่ปรึกษาจะติดต่อกลับโดยเร็ว | |
| LIFF-032 | doneNotFriend | Confirmation (not a friend) | A counsellor will be in touch soon. Add us on LINE to get a summary in chat. | ทีมที่ปรึกษาจะติดต่อกลับโดยเร็ว เพิ่มเพื่อนใน LINE เพื่อรับสรุปทางแชท | |
| LIFF-033 | close | Button inside LINE app | Close | ปิดหน้านี้ | Button |

## Select options — `src/lib/liffForm.ts`

| ID | Value (stored) | English | Thai (draft) | Notes |
|---|---|---|---|---|
| LIFF-052 | student | Student visa | วีซ่านักเรียน (Student visa) | Visa select |
| LIFF-053 | whm | Work and Holiday (subclass 462) | Work and Holiday (วีซ่า 462) | Visa select. Site elsewhere uses "Working Holiday" / "วีซ่า 417 / 462" |
| LIFF-054 | skilled | Skilled visa | วีซ่าแรงงานฝีมือ (Skilled visa) | Visa select. Explorer uses "Skilled Visa" |
| LIFF-055 | employer | Employer sponsored | นายจ้างสนับสนุนวีซ่า (Employer sponsored) | Visa select |
| LIFF-056 | unsure | Not sure yet | ยังไม่แน่ใจ | Visa select |
| LIFF-040 | High school | High school | มัธยมปลาย | |
| LIFF-041 | Bachelor (studying) | Studying a bachelor's degree | กำลังเรียนปริญญาตรี | |
| LIFF-042 | Bachelor graduate | Bachelor's graduate | จบปริญญาตรีแล้ว | |
| LIFF-043 | Master's or higher | Master's or higher | ปริญญาโทขึ้นไป | |
| LIFF-044 | Working | Working | ทำงานแล้ว | |
| LIFF-045 | English course | English course | เรียนภาษาอังกฤษ | Same as existing planner goal title |
| LIFF-046 | Short course | Short course / upskilling | คอร์สระยะสั้น / เพิ่มทักษะ | Same as existing planner goal title |
| LIFF-047 | Diploma / VET | Vocational (VET) | เรียนสายอาชีพ (VET) | Planner uses เรียนสายอาชีพ |
| LIFF-048 | Bachelor | Bachelor's degree | ปริญญาตรี | |
| LIFF-049 | Master | Master's degree | ปริญญาโท | |
| LIFF-050 | Not sure | Not sure yet | ยังไม่แน่ใจ | Also last intake option |
| LIFF-051 | Jan–Mar 2027 … | Jan–Mar 2027 | ม.ค.–มี.ค. 2570 | Generated quarters, Buddhist year. Quarters rather than fixed intake months because start dates vary by course. |

## LINE messages — `supabase/functions/_shared/messages.ts`

| ID | Where | English | Thai (draft) | Constraints |
|---|---|---|---|---|
| LIFF-060 | Student chat, line 1 | Hi {name}, thanks for your interest in studying in Australia with Beyond Study Center! | สวัสดีค่ะ คุณ{name} 👋 / ขอบคุณที่สนใจเรียนต่อออสเตรเลียกับ Beyond Study Center ค่ะ | {name} = nickname, else full name |
| LIFF-061 | Student chat, answers heading | Your {tool} answers are above. | คำตอบจาก{tool}: | Followed by the planner's existing answer lines |
| LIFF-062 | Student chat, closing | A counsellor will be in touch soon. Feel free to ask anything here. | ทีมที่ปรึกษาจะติดต่อกลับโดยเร็ว หากมีคำถามเพิ่มเติม พิมพ์ถามในแชทนี้ได้เลย | |
| LIFF-063 | Tool name `budget-planner` | Budget study planner | แผนงบเรียนต่อ | Used in LIFF-061 |
| LIFF-064 | Tool name fallback | Website | เว็บไซต์ | |
| LIFF-065 | Tool name `website-tools` (several tools used) | Website tools | เครื่องมือบนเว็บไซต์ | Used in LIFF-061 |
| LIFF-066 | Tool names `study-finder`, `visa-explorer`, `savings`, `postcode-checker` | Study pathway finder / Visa options explorer / Savings planner / Postcode checker | ค้นหาเส้นทางเรียน / ทางเลือกวีซ่า / วางแผนเงินเก็บ / เช็ก Postcode | Used in LIFF-061 when only that tool was used |

The answer summary itself (in the form, the student message and the staff alert) reuses each tool's **existing** Thai headings, questions and option labels, joined as "คำถาม? คำตอบ" or "หัวข้อ: คำตอบ", with "■ " before each tool name and "→ " before the Visa Explorer result. Please check that this reads naturally; it doesn't change any on-site text.

The staff-group alert is English only (internal).

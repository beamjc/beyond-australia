'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";

type FaqCategory = "overview" | "username" | "quota" | "documents" | "visa" | "finance" | "sponsor";

const categories: { id: FaqCategory; label: string; labelTh: string }[] = [
  { id: "overview", label: "Overview", labelTh: "ภาพรวมโครงการ" },
  { id: "username", label: "Username", labelTh: "รอบ Username" },
  { id: "quota", label: "Quota", labelTh: "รอบโควต้า" },
  { id: "documents", label: "Documents", labelTh: "รอบยื่นเอกสารกับดย." },
  { id: "visa", label: "Visa", labelTh: "รอบวีซ่า" },
  { id: "finance", label: "Finance", labelTh: "การเงิน" },
  { id: "sponsor", label: "Sponsor", labelTh: "Sponsor" },
];

interface FaqItem {
  question: string;
  answer: string;
}

interface AlertBox {
  type: "warn" | "info" | "good" | "danger";
  text: string;
}

interface CategoryContent {
  title: string;
  subtitle: string;
  alerts?: AlertBox[];
  faqs: FaqItem[];
  extra?: React.ReactNode;
}

const AlertIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "warn": return <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
    case "info": return <Info className="w-5 h-5 text-primary flex-shrink-0" />;
    case "good": return <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
    case "danger": return <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
    default: return null;
  }
};

const alertStyles: Record<string, string> = {
  warn: "bg-amber-500/10 border-amber-500/25",
  info: "bg-primary/10 border-primary/25",
  good: "bg-emerald-500/10 border-emerald-500/25",
  danger: "bg-red-500/10 border-red-500/25",
};

const categoryData: Record<FaqCategory, CategoryContent> = {
  overview: {
    title: "Timeline & ภาพรวม WAH 2026",
    subtitle: "ทุกรอบตั้งแต่ต้นจนจบ — สำหรับคนที่เพิ่งเริ่มศึกษา",
    alerts: [
      { type: "warn", text: "Deadline หลัก: เอกสารทุกอย่างต้องออกและพร้อมก่อนวันที่ 7 เมษายน 2026 (วันที่ 8 เมษายนคือวันกดโควต้า)" },
    ],
    faqs: [],
    extra: "timeline",
  },
  username: {
    title: "รอบ 1 — Username (ดย.)",
    subtitle: "23-28 มีนาคม 2026 · วันละ 500 คน · รวม 3,000 คน",
    alerts: [
      { type: "info", text: "รอบนี้ ยังไม่ต้องมีหลักฐานการเงิน ผลภาษา หรือใบจบ — แค่ข้อมูลส่วนตัวและรูปถ่ายเท่านั้น" },
    ],
    faqs: [
      {
        question: "รอบ Username คืออะไร และต้องเตรียมอะไรบ้าง?",
        answer: `รอบแรกคือการสมัครขอ Username/Password กับ ดย. เพื่อให้ได้สิทธิ์กดโควต้าในรอบถัดไป

สำหรับปี 2026 เริ่มวันที่: 23-28 มีนาคม 2026 (6 วัน วันละ 500 คน รวม 3,000 คน)
เวลา 9.00-16.00 น. (เวลาไทย) ปิดทันทีเมื่อเต็มในแต่ละวัน
ระบบ: dcywah.dcy.go.th/opp/app/register.php

ข้อมูลที่ต้องมีในรอบนี้:

1) รูปถ่าย
- ขนาด 200x265 pixels
- หน้าตรง สวมชุดสุภาพ
- ไม่ใส่หมวก ไม่ใส่แว่นดำ
- ถ่ายไม่เกิน 3 เดือน
- หากรูปไม่ชัด จากการ resize คือไม่เป็นไร — ปรับได้ผ่าน Canva (ตั้ง Canva 200x265px แล้วลากรูปลง)
- ไฟล์เป็น .jpg / .png
- สีพื้นหลังทาง ดย. ไม่ได้กำหนด

2) เลขบัตรประจำตัวประชาชน
3) ชื่อ-นามสกุล (ไทยและอังกฤษ) สะกดคำนำหน้า ชื่อ นามสกุล ตรงตาม Passport และบัตรปชช.
4) ที่อยู่ปัจจุบัน
5) อีเมล (ตรวจสอบการสะกดให้ถูกต้อง / ปีก่อนๆ ดย. แนะนำ Gmail ปีนี้ไม่ได้ระบุ)

หมายเหตุ:
▸ ยังไม่ต้องมีหลักฐานการเงิน ผลภาษา หรือใบจบในรอบนี้
▸ รอบถัดไปต้องมีหลักฐานตามที่ ดย. กำหนดก่อนวันที่ 8 เมษายน 2026
▸ ถ้าไม่ได้รับอีเมลตอบกลับ ติดต่อ wahthailand@dcy.go.th
▸ อัพโหลดเฉพาะรูปถ่าย นอกนั้นกรอกข้อมูลในระบบ`,
      },
      {
        question: "รอบ Username ปิดเมื่อไหร่? ถ้าพลาดทำยังไง?",
        answer: `สำหรับปี 2026:
▸ ระบบปิดทันทีเมื่อครบ 500 คนในแต่ละวัน
▸ วันสุดท้ายคือ 28 มีนาคม 2026

ถ้าพลาดรอบนี้ จะไม่สามารถกดโควต้า (8 เมษายน 2026) ได้ ต้องรอปีหน้า (2027)

แนะนำ: เตรียมข้อมูลและรูปถ่ายให้พร้อมล่วงหน้า เข้าระบบตั้งแต่เช้าวันแรก (23 มี.ค.) เพื่อเพิ่มโอกาสกดได้`,
      },
    ],
  },
  quota: {
    title: "รอบ 2 — โควต้า (ดย.)",
    subtitle: "8 เมษายน 2026 · 1 วัน · รับ 2,500 คน (ตัวจริง 2,000 + สำรอง)",
    alerts: [
      { type: "warn", text: "เอกสารทุกอย่างต้องออกก่อนหรือภายใน 7 เมษายน 2026" },
    ],
    faqs: [
      {
        question: "รอบโควต้าคืออะไร และต้องเตรียมอะไรบ้าง?",
        answer: `รอบที่สองคือการกดโควต้าเพื่อขอใบรับรอง (Letter of government support) ไปยื่นวีซ่าค่ะ
โดยจะต้องใช้ Username/Password ที่ได้มาจากรอบแรกในการกดโควต้า

สำหรับปี 2026 วันกดโควต้าคือ
วันที่ 8 เมษายน 2026 (1 วัน รับ 2,500 คน — ตัวจริง 2,000 + สำรอง)
กดผ่านระบบของทางดย.: dcywah.dcy.go.th/opp/app/register.php

ข้อมูลที่ต้องกรอก:
1) เลขบัตรประจำตัวประชาชน
2) ชื่อ-นามสกุล (ไทยและอังกฤษ) สะกดทั้งชื่อ-สกุล คำนำหน้า ตรงตาม Passport และบัตรประชาชน
3) วัน เดือน ปี เกิด
4) ที่อยู่ตามบัตรประชาชน
5) ที่อยู่ติดต่อได้สะดวก พร้อมเบอร์โทรและอีเมลที่ติดต่อได้
6) การศึกษาขั้นสูงสุด
7) ทักษะภาษาอังกฤษ
8) บุคคลที่ ดย. ติดต่อได้กรณีฉุกเฉิน

เอกสารหลักๆ ที่ต้องมีก่อนกดโควต้า — เอกสารออกช้าสุด 7 เมษายน 2026
▸ ผลสอบภาษาอังกฤษ
▸ ใบปริญญาหรือใบจบ
▸ Bank Certificate
▸ Passport

แนะนำมีหลักฐานหลักๆ ให้ครบก่อนวันกดโควต้าเพื่อไม่ให้มีปัญหาในรอบตรวจสอบคุณสมบัติและเอกสาร`,
      },
      {
        question: "ผลสอบภาษาอังกฤษ — ต้องได้คะแนนอะไรบ้าง?",
        answer: `ผลภาษาอะไรใช้สำหรับ WAH 2026 ได้บ้าง?

[อัพเดท 13 มีนาคม 2026 — ดย. ประกาศปรับเกณฑ์ตามรัฐบาลออสเตรเลีย]

─────────────────────────────────

กลุ่มที่ 1: ผลสอบออกระหว่าง 2 ก.ค. 2025 – 7 เม.ษ. 2026
▸ IELTS (General หรือ Academic) Overall 4.5
▸ PTE Academic Overall 30
▸ TOEFL iBT Overall 32
(อย่างใดอย่างหนึ่ง — ใช้คะแนน Overall ทั้งหมด)
▸ คะแนนสอบต้องผลออกก่อน 8 เมษายน 2026 (วันกดโควต้า)
▸ อายุผลสอบต้องไม่เกิน 1 ปี ณ วันรับใบรับรองวันแรก (1 ก.ค. 2026)

กลุ่มที่ 2: ผลสอบออกระหว่าง 7 ส.ค. 2025 – 7 เม.ษ. 2026
▸ IELTS (General หรือ Academic) Overall 4.5
▸ PTE Academic 24 / TOEFL iBT 26 / CELPIP 5 / MET 38 / OET 1020 / LANGUAGECERT Academic Test 38
(อย่างใดอย่างหนึ่ง — ใช้คะแนน Overall ทั้งหมด)

Cambridge CAE: คะแนนไม่ต่ำกว่า 147 (ผลสอบออกก่อน 6 ส.ค. 2025 เท่านั้น)

─────────────────────────────────

ใช้วุฒิการศึกษาแทนผลสอบได้ (English as the medium of instruction)
ต้องใช้ทั้งวุฒิการศึกษา "และ" ใบแสดงผลการเรียน ในวุฒิต่อไปนี้:
▸ จบ Diploma ขึ้นไปในออสเตรเลีย (หลักสูตรอย่างน้อย 1 ปี)
▸ อนุปริญญา / ปริญญาตรีขึ้นไป (หลักสูตรอย่างน้อย 2 ปี)
▸ ระดับมัธยมศึกษา (หลักสูตรอย่างน้อย 5 ปี)
▸ ระดับประถมและมัธยมศึกษาตอนต้น

─────────────────────────────────

เพิ่มเติมที่ควรรู้:
▸ จบอินเตอร์ = จบโปรแกรมที่สอนเป็นภาษาอังกฤษ = ใช้แทนผลภาษาได้
▸ ไม่มีกำหนดว่าต้องจบจากสถาบันใด ถ้าคุณสมบัติครบก็ใช้แทนได้
▸ จบมานานเท่าไหร่ก็ใช้แทนได้ ถ้าคุณสมบัติครบ
▸ สิ่งที่ใช้แทนผลภาษาไม่ได้: เรียนเอกอังกฤษ (ที่ไม่ใช่ English/International program), เรียนภาษากับครู, เคยทำงานในต่างประเทศ
▸ ถ้าผลภาษาครบตอนยื่น ดย. แต่จะหมดอายุตอนยื่นวีซ่า สามารถสอบใหม่ก่อนยื่นวีซ่าได้`,
      },
      {
        question: "ถ้าเอกสารไม่ครบก่อน 8 เมษา กดโควต้าได้ไหม?",
        answer: "กดได้ แต่จะไม่ผ่านการพิจารณาในรอบถัดไป",
      },
    ],
  },
  documents: {
    title: "รอบ 3-4 — เอกสาร & ประกาศ (ดย.)",
    subtitle: "หลังกดโควต้าสำเร็จ — ประกาศรายชื่อ ส่งเอกสาร และรับหนังสือรับรอง",
    faqs: [
      {
        question: "หลังกดโควต้าได้แล้ว ขั้นตอนต่อไปคืออะไร?",
        answer: `▸ ประกาศรายชื่อ: 20 เมษายน 2026 (2,500 คน) ผ่านระบบ ดย. และ IG
▸ ส่งเอกสาร Google Form: 27 เมษายน – 8 พฤษภาคม 2026 (ถึง 12.00 น.) ส่งได้คนละ 1 ครั้งเท่านั้น
▸ ประกาศผล: 8 มิถุนายน (500 คน) และ 31 กรกฎาคม (1,500 คน)
▸ รับหนังสือรับรอง: 1 กรกฎาคม (500 คน) และ 17 สิงหาคม (1,500 คน)

รับด้วยตัวเองหรือมอบฉันทะได้
หลังได้จดหมายจาก ดย. ค่อยยื่นวีซ่ากับ Home Affairs ออสเตรเลีย

รอบตัวสำรองอาจมีหรือไม่ก็ได้ ถ้ามีจะเป็นช่วงพฤศจิกายน 2026`,
      },
      {
        question: "เอกสารรอบส่ง ดย. (รอบ 4) ต้องเตรียมอะไรบ้าง?",
        answer: `สามารถดูรายละเอียดได้จากประกาศของ ดย. โดยตรงค่ะ
facebook.com/share/p/18LmhadJLF/

ทางเราจะทำ Checklist ฉบับปี 2026 ที่ปรึกษากับ ดย. แล้วให้อีกทีค่ะ
คอยติดตามได้ที่ Thaiwahclub และ Beyond Australia`,
      },
    ],
  },
  visa: {
    title: "รอบวีซ่า — Home Affairs",
    subtitle: "หลังได้หนังสือรับรองจาก ดย. แล้ว ค่อยยื่นวีซ่ากับ Department of Home Affairs ออสเตรเลีย",
    alerts: [
      { type: "danger", text: "สำคัญ: การได้จดหมายจาก ดย. ไม่ได้การันตีได้วีซ่า — รอบวีซ่าตรวจเอกสารการเงินเข้มกว่ารอบ ดย. พอควร" },
    ],
    faqs: [
      {
        question: "หลักฐานการเงินรอบวีซ่า Home Affairs ต้องเตรียมอะไรบ้าง?",
        answer: `หลังได้หนังสือรับรองจาก ดย. แล้ว ยื่นวีซ่ากับ Department of Home Affairs
ด้านหลักฐานการเงินจะดูละเอียดกว่าพอควร

กรณีสปอนเซอร์ตัวเอง:
▸ Statement ย้อนหลัง 6 เดือน ไม่น้อยกว่า 5,000 AUD
  (ปี 2025 มีหลายเคสที่ถูกขอเรียกให้แสดงถึง 6,000 AUD)
▸ Evidence of Source of Fund (ถ้ามีเงินก้อนเข้ามาในบัญชีที่ต้องอธิบาย)
▸ หลักฐาน Regular Source of Income (เช่น หลักฐานเสียภาษี, การจ้างงาน)
▸ Financial Support Letter (อธิบายการเงินของตัวเองว่าแนบอะไรมาบ้าง)

กรณีสปอนเซอร์โดยบุคคลอื่น:
▸ Financial Support Letter (ยืนยันจาก Sponsor ว่าจะ support ผู้สมัคร)
▸ บัตรปชช. + ทะเบียนบ้าน + หลักฐานความสัมพันธ์ของ Sponsor และผู้สมัคร
▸ หลักฐาน Regular Source of Income ของ Sponsor
▸ Statement ย้อนหลัง 6 เดือน ของ Sponsor
▸ Evidence of Source of Fund (ถ้ามีเงินก้อนที่ต้องอธิบาย)

แนะนำอธิบายเรื่องการเงินให้ละเอียดและมีหลักฐานที่ชัดเจนค่ะ`,
      },
      {
        question: "Timeline กดโควต้าจนได้วีซ่าใช้เวลาแค่ไหน?",
        answer: `▸ กดโควต้า: 8 เมษายน 2026
▸ ประกาศรายชื่อ: 20 เมษายน 2026
▸ ส่งเอกสาร ดย.: 27 เม.ษ. – 8 พ.ค. 2026
▸ ประกาศผล ดย.: มิถุนายน – กรกฎาคม 2026
▸ รับหนังสือรับรอง: กรกฎาคม – สิงหาคม 2026
▸ ยื่นวีซ่า + รอผล: 1-3 เดือนโดยประมาณ

เมื่อได้วีซ่าแล้ว ต้องเดินทางเข้าออสเตรเลียภายใน 1 ปี
อายุวีซ่าเริ่มนับอีก 1 ปีหลังเดินทางเข้าออสเตรเลีย ไม่ใช่วันที่ได้วีซ่า`,
      },
      {
        question: "ตรวจสุขภาพต้องทำที่ไหน?",
        answer: `ตรวจสุขภาพได้กับ Panel Physician 7 แห่งในไทย:
▸ Bangkok General Hospital
▸ Chiangmai Ram Hospital
▸ BNH Hospital
▸ IOM Bangkok
▸ Wellness Center, Bangkok Hospital Phuket
▸ Aek Udon International Hospital
▸ IOM Sangkhlaburi

ราคาต่างกันแต่ละที่ โทรสอบถามก่อนได้เลยค่ะ
สำหรับคนอยู่นอกไทย: ตรวจสอบได้ที่ immi.homeaffairs.gov.au`,
      },
      {
        question: "วีซ่าปีที่ 2-3 — เก็บชั่วโมงรวดเดียวได้ไหม?",
        answer: `ได้ค่ะ สามารถเก็บชั่วโมงปีที่ 2 และ 3 ใน 9 เดือนรวดได้ แต่มีเงื่อนไข:

ทำได้ใน 2 กรณีตามที่ Home Affairs กำหนด:
1) ได้รับ 2nd visa Grant แล้ว
2) ถือ Bridging Visa ที่ active ขณะรอผล 2nd visa

▸ ต้องยื่นทุกวีซ่าก่อนอายุ 31 ปี
▸ กรณีนอกเหนือจากนี้ แม้เคยมีคนผ่านมาแล้ว แต่แนะนำว่า at your own risk เพราะไม่ตรงตามที่รัฐบาลระบุไว้ และอาจถูกตรวจสอบย้อนหลังตอนยื่นวีซ่าอื่นๆ ในอนาคตด้วย`,
      },
    ],
  },
  finance: {
    title: "การเงิน — ทั้งสองรอบ",
    subtitle: "รอบ ดย. ต้องการ Bank Certificate · รอบวีซ่า Home Affairs ต้องการ Statement 6 เดือน + Verifiable Evidence",
    alerts: [
      { type: "info", text: 'หัวใจหลักของรอบวีซ่า: "Genuine Access to Funds" — พิสูจน์ว่าเข้าถึงเงินนั้นได้จริง และมีหลักฐานที่ตรวจสอบได้ (Verifiable Evidence)' },
    ],
    faqs: [
      {
        question: "รอบ ดย. — ต้องการหลักฐานการเงินอะไรบ้าง?",
        answer: `รอบโควต้ากับ ดย. ต้องการแค่ Bank Certificate:

▸ เป็นบัญชีออมทรัพย์ของธนาคารพาณิชย์
▸ ชื่อบัญชีต้องเป็นชื่อผู้สมัครเท่านั้น
▸ มีเงินอย่างน้อย 5,000 AUD (แปลงเป็น AUD แล้ว) หรือ 120,000 THB
▸ ออกโดยธนาคาร มีตราประทับหรือลายเซ็นเจ้าหน้าที่
▸ ออกก่อน 8 เมษายน 2026 มีอายุไม่เกิน 30 วัน

ธนาคารพาณิชย์ = ทุกธนาคารที่ไม่ใช่สหกรณ์หรือสถาบันการเงินประเภทอื่น
จะเป็นธนาคารในไทยหรือต่างประเทศก็ได้ ขอให้ออกเอกสารได้ตามที่ ดย. กำหนด`,
      },
      {
        question: "Bank Certificate ขออย่างไร?",
        answer: `▸ Walk-in ธนาคาร สาขาไหนก็ได้ หรือติดต่อตามช่องทางที่สะดวก
  (ในไทยทำได้ทุกสาขา / ในออสเตรเลียอาจมีเฉพาะบางสาขา)
▸ แจ้ง "ขอ Bank Certificate เพื่อยื่นวีซ่า"
▸ ถ้าเป็นเงินบาท ขอที่ 120,000 THB / ถ้าแปลงค่าเงิน ขอที่ 5,000 AUD
▸ ค่าธรรมเนียม ประมาณ 100 บาท รับได้ในวันเดียวกัน (แล้วแต่ธนาคาร)
▸ ต้องมีตราประทับจริง + ลายเซ็นเจ้าหน้าที่
▸ ออกช้าสุดวันที่ 7 เมษายน 2026 และมีอายุไม่เกิน 30 วัน`,
      },
      {
        question: "รอบวีซ่า Home Affairs ดูหลักฐานการเงินอย่างไร?",
        answer: `หัวใจหลักคือ "Genuine Access to Funds"
พิสูจน์ว่าเข้าถึงเงินนั้นได้จริง และมีหลักฐานที่ตรวจสอบได้ (Verifiable Evidences)

หลักการสำคัญ:
▸ ยื่น Statement ย้อนหลัง 6 เดือน
▸ แสดง Regular Source of Income — อธิบายที่มารายได้
▸ เงินก้อนที่เข้ามากระทบยอดที่ต้องการแสดง แนะนำแนบหลักฐานอธิบายที่มาเสมอ
▸ Verifiable Evidence (ตรวจสอบได้) = น้ำหนักมาก
▸ Non-verifiable (อ้างมาลอยๆ ไม่มีเอกสาร) = น้ำหนักน้อย

จำนวนเงิน:
▸ ขั้นต่ำตาม Home Affairs: 5,000 AUD + ค่าตั๋วกลับ
▸ ปี 2025 มีหลายเคสที่ยอด 5,000 AUD ถูกขอเพิ่มกันค่ะ`,
      },
      {
        question: "บัญชี 4 แบบ — แต่ละแบบต้องอธิบายอย่างไร?",
        answer: `เราแบ่งประเภทบัญชีตามการเข้าออกของเงินได้ 4 แบบ:

1) บัญชีเงินนอน (อธิบายง่ายที่สุด)
เงินครบมาอย่างน้อย 6 เดือน ไม่มีเคลื่อนไหวมาก
อธิบาย Source of Income หลักๆ และบอกว่าเป็นเงินเก็บ แนบที่มารายได้ไปด้วย

2) บัญชีเงินก้อน
มีเงินก้อนใหญ่เข้ามา โดยเฉพาะยอดที่กระทบกับยอดที่ต้องการแสดง
ต้องมีหลักฐานที่มาของเงินก้อนนั้น เช่น สัญญาขายบ้าน/รถ, Bonus จากบริษัท
✅ มีหลักฐาน = น่าเชื่อถือกว่า  /  ❌ ไม่มีหลักฐาน = ความเสี่ยงมากกว่า

3) บัญชีเงินเดือน
เงินเดือนเข้าทุกเดือนสม่ำเสมอ
ถ้ายอดเคยต่ำกว่าที่ต้องการแสดงในเดือนใด แนะนำอธิบายและแนบหลักฐาน

4) บัญชีเงินหมุน
เงินเข้าออกมากและบ่อย ยอดผันผวน
ต้องอธิบาย Source of Income ชัดเจน + อธิบายทุกยอดผิดปกติ
ถ้ายอด swing มากหรือเคยเป็น 0 ในช่วง 6 เดือน จะต้องอธิบายเยอะ

หลักการเดียวกันทุกแบบ: ถ้ามีหลักฐานชี้แจงได้ (Verifiable) ก็แนบและอธิบายไปได้เลยค่ะ`,
      },
      {
        question: "หลักฐาน Source of Regular Income ที่ดีควรมีอะไรบ้าง?",
        answer: `พนักงานบริษัท:
▸ จดหมายรับรองการทำงาน (ระบุตำแหน่ง เงินเดือน)
▸ Payslip ย้อนหลัง
▸ หลักฐานการเสียภาษี (ภ.ง.ด.91)

เจ้าของกิจการ:
▸ หนังสือรับรองการจดทะเบียนบริษัท
▸ รายละเอียดผู้ถือหุ้น
▸ หลักฐานการเสียภาษี

ข้าราชการ:
▸ หนังสือรับรองการทำงาน
▸ หลักฐานการเสียภาษี

หมายเหตุ: หลักฐานการเสียภาษีเป็นหนึ่งในเอกสาร Verifiable ที่สุด แนะนำแนบเสมอ`,
      },
      {
        question: "มีเงินก้อนเข้ามาในบัญชี ต้องทำอย่างไร?",
        answer: `ต้องแนบหลักฐานอธิบายที่มาเสมอค่ะ

ตัวอย่างหลักฐานที่ Verifiable:
▸ Bonus — Payslip + จดหมายรับรองงาน + หลักฐานเสียภาษี
▸ ขายรถ — สัญญาซื้อขาย + โอนกรรมสิทธิ์
▸ ขายบ้าน — สัญญา + การโอนกรรมสิทธิ์
▸ มรดก — เอกสารทางกฎหมาย

แนะนำแนบหลักฐาน 2 เรื่องเสมอ:
1. Regular Income (รายได้ปกติ)
2. Evidence of Source of Fund (หลักฐานเงินก้อนที่เข้ามา)

ถ้าที่มาไม่ชัดหรือหลักฐานไม่แข็งแรง ทาง Department จะให้น้ำหนักน้อยค่ะ`,
      },
    ],
  },
  sponsor: {
    title: "Sponsor",
    subtitle: "กรณีใช้คนอื่นเป็นผู้สนับสนุนทางการเงิน — สำหรับรอบวีซ่า (รอบดย. ต้องเป็นชื่อผู้สมัครเองเท่านั้น)",
    faqs: [
      {
        question: "ให้คนอื่น Sponsor ได้ไหม? ต้องพิสูจน์ความสัมพันธ์อย่างไร?",
        answer: `ได้ค่ะ แต่ต้องพิสูจน์ความสัมพันธ์ให้ชัดเจน ทาง Department ไม่ได้กำหนดว่าต้องเป็นใคร แต่ถ้าหลักฐานชัดเจนก็จะน่าเชื่อถือกว่าค่ะ

ตัวอย่าง: คุณน้า (น้องของคุณแม่) เป็น Sponsor

หลักฐานของแม่:
▸ บัตรประชาชน + ทะเบียนบ้าน

หลักฐานของ Sponsor (คุณน้า):
▸ บัตรประชาชน + ทะเบียนบ้าน
(ทั่วไปทะเบียนบ้านของแม่และน้าจะมีชื่อคุณตาคุณยายเหมือนกัน ก็จะพิสูจน์ได้ว่าเป็นพี่น้องกันจริงๆ)
▸ Financial Support Letter อธิบายว่าจะ support และหลานเข้าถึงเงินได้จริง/ให้เงินหลานใช้จริง
▸ หลักฐาน Source of Income ของ Sponsor
▸ Bank Statement ย้อนหลัง 6 เดือน ของ Sponsor
▸ ถ้ามีเงินก้อน ที่มาเงินก้อนก็อธิบายและแนบไปได้ด้วย
▸ ถ้าเคย support ทางการเงินต่อเนื่องมาก่อน จะยิ่งแข็งแกร่งมากขึ้น
▸ สามารถแนบ family tree ไปด้วยได้ค่ะ`,
      },
      {
        question: "Sponsor ต้องมีเงินเท่าไหร่?",
        answer: `รอบวีซ่า:
▸ แนะนำว่า Sponsor ควรมีมากกว่า 5,000 AUD ยิ่งเยอะยิ่งดี และต้องมีที่มาชัดเจนด้วยเสมอ ตรงนี้ไม่มี guideline จากทาง Department แต่แนะนำว่าอย่างน้อยๆ ก็ควรมีมากกว่าเงินที่ต้องใช้เท่าตัวค่ะ
▸ ถ้าโอนเงินเข้าบัญชีเราแล้วแนบบัญชีทั้งสองฝ่ายก็ดีค่ะ พิสูจน์เรื่อง Genuine Access to Funds ได้มากขึ้น`,
      },
    ],
  },
};

const timelineSteps = [
  { step: 1, date: "23-28 มีนาคม 2026", title: "รอบ Username / Password (ดย.)", desc: "สมัครขอ Username กับกรมกิจการเด็กและเยาวชน วันละ 500 คน รวม 3,000 คน\nยังไม่ต้องมีหลักฐานการเงินหรือผลภาษาในรอบนี้", badge: "dcywah.dcy.go.th" },
  { step: 2, date: "8 เมษายน 2026", title: "รอบกดโควต้า (ดย.)", desc: "กด 1 วัน รับ 2,500 คน (ตัวจริง 2,000 + สำรอง)\nต้องมีเอกสารครบก่อน — ผลภาษา + ใบจบ + Bank Certificate + Passport", badge: "เอกสารต้องออกก่อน 8 เม.ษ. 2026", badgeType: "warn" as const },
  { step: 3, date: "20 เมษายน 2026", title: "ประกาศรายชื่อ", desc: "ประกาศ 2,500 คน ผ่านระบบ ดย. และ IG" },
  { step: 4, date: "27 เม.ษ. – 8 พ.ค. 2026", title: "ส่งเอกสาร (ดย.) — Google Form", desc: "ส่งได้คนละ 1 ครั้งเท่านั้น ถึงเวลา 12.00 น. ของวันที่ 8 พ.ค." },
  { step: 5, date: "มิ.ย. – ก.ค. 2026", title: "ประกาศผล", desc: "8 มิถุนายน (500 คน) / 31 กรกฎาคม (1,500 คน)" },
  { step: 6, date: "ก.ค. – ส.ค. 2026", title: "รับหนังสือรับรอง (Letter of Government Support)", desc: "1 กรกฎาคม (500 คน) / 17 สิงหาคม (1,500 คน)\nรับด้วยตัวเองหรือมอบฉันทะได้ รับแล้วค่อยยื่นวีซ่ากับ Home Affairs" },
  { step: 7, date: "หลังได้จดหมาย ดย.", title: "ยื่นวีซ่า — Department of Home Affairs (ออสเตรเลีย)", desc: "ยื่นวีซ่า + ตรวจสุขภาพ + เก็บ Biometrics\nรอผลประมาณ 1-3 เดือน เมื่อได้วีซ่าต้องเดินทางภายใน 1 ปี", badge: "การได้จดหมายจาก ดย. ไม่ได้การันตีได้วีซ่า", badgeType: "warn" as const },
];

const FaqAccordionItem = ({ faq }: { faq: FaqItem }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        open
          ? "border-primary/30 shadow-warm bg-card"
          : "border-border bg-card hover:border-border/80"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <span
          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-transform duration-200 bg-primary/10 text-primary ${
            open ? "rotate-45" : ""
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
        </span>
        <span className="text-sm font-semibold text-foreground flex-1 leading-relaxed">
          {faq.question}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-[52px] border-t border-border">
              <p className="pt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OverviewTimeline = () => (
  <div className="space-y-0 mt-6">
    {timelineSteps.map((step, i) => (
      <div key={step.step} className="flex gap-4">
        <div className="flex flex-col items-center w-10 flex-shrink-0">
          <div className="w-9 h-9 rounded-full border-2 border-primary bg-primary/10 text-primary flex items-center justify-center text-sm font-bold z-10">
            {step.step}
          </div>
          {i < timelineSteps.length - 1 && (
            <div className="w-0.5 flex-1 min-h-[12px] bg-border" />
          )}
        </div>
        <div className="flex-1 pb-6 pt-0.5">
          <p className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">
            {step.date}
          </p>
          <h4 className="text-sm font-bold text-foreground mb-1">{step.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {step.desc}
          </p>
          {step.badge && (
            <span
              className={`inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-2 ${
                step.badgeType === "warn"
                  ? "bg-amber-500/10 text-amber-700"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {step.badge}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
);

const OverviewChecklist = () => (
  <div className="mt-8">
    <h3 className="text-lg font-bold text-foreground mb-2">
      Checklist ก่อนกดโควต้า (8 เม.ษ.)
    </h3>
    <p className="text-sm text-muted-foreground mb-4">
      เอกสารทุกอย่างต้องออกก่อนวันที่ 8 เมษายน 2026
    </p>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="text-amber-600">⚠️</span> เอกสารต้องออกก่อน 8 เม.ษ. 2026
        </h4>
        <div className="space-y-2">
          {[
            "Passport — ยังไม่หมดอายุ",
            "ผลสอบภาษาอังกฤษ — ผลต้องออกแล้ว ก่อน 8 เม.ษ.",
            "ใบปริญญา / ใบจบ — ต้องเรียนจบแล้ว/เอกสารออกแล้ว ก่อน 8 เม.ษ.",
            "Bank Certificate — 5,000 AUD มีตราประทับ/ลายเซ็น ออกช้าสุด 7 เม.ษ. 2026",
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 items-start text-sm border-b border-border last:border-0 py-1.5">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">✓</span>
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="text-primary">📋</span> เตรียมไว้ รอบวีซ่า
        </h4>
        <div className="space-y-2">
          {[
            "Statement ธนาคาร 6 เดือน — ไม่น้อยกว่า 5,000 AUD",
            "Source of Income — หลักฐานที่มารายได้ (Verifiable)",
            "เอกสาร Sponsor — ถ้าใช้คนอื่นเป็น Sponsor",
            "ตรวจสุขภาพ — Panel Physician ที่กำหนด",
            "Biometrics — หลังยื่นวีซ่าแล้ว",
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 items-start text-sm border-b border-border last:border-0 py-1.5">
              <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">→</span>
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FAQ2026 = () => {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("overview");
  const content = categoryData[activeCategory];

  return (
    <div>
      {/* Stats bar */}
      <div className="flex flex-wrap gap-6 mb-8 p-4 rounded-xl bg-secondary text-secondary-foreground">
        {[
          { num: "7", label: "หมวดหมู่" },
          { num: "19", label: "คำถาม" },
          { num: "8 เม.ษ.", label: "วันกดโควต้า" },
          { num: "2026", label: "รุ่นล่าสุด" },
        ].map((s) => (
          <div key={s.label}>
            <div className="font-display text-2xl font-bold">{s.num}</div>
            <div className="text-[10px] uppercase tracking-widest text-secondary-foreground/50 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category tabs */}
      <div className="overflow-x-auto -mx-2 px-2 mb-8">
        <div className="flex gap-1 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat.labelTh}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-6">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1">
              {content.title}
            </h3>
            <p className="text-sm text-muted-foreground">{content.subtitle}</p>
          </div>

          {content.alerts?.map((alert, i) => (
            <div
              key={i}
              className={`rounded-xl p-3.5 mb-5 flex gap-3 items-start text-sm border ${alertStyles[alert.type]}`}
            >
              <AlertIcon type={alert.type} />
              <span className="text-foreground leading-relaxed">{alert.text}</span>
            </div>
          ))}

          {activeCategory === "overview" && (
            <>
              <OverviewTimeline />
              <OverviewChecklist />
              <div className="mt-6 rounded-xl p-3.5 flex gap-3 items-start text-sm border bg-primary/10 border-primary/25">
                <Info className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground leading-relaxed">
                  รอบตัวสำรองอาจมีหรือไม่ก็ได้ ถ้ามีจะเป็นช่วง พฤศจิกายน 2026
                </span>
              </div>
            </>
          )}

          {content.faqs.length > 0 && (
            <div className="flex flex-col gap-3">
              {content.faqs.map((faq, i) => (
                <FaqAccordionItem key={i} faq={faq} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FAQ2026;

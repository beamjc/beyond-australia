'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  Info,
  Clock,
  Shield,
} from "lucide-react";
import SectionHeader from "../shared/SectionHeader";

type ChecklistItem = {
  name: string;
  nameEn?: string;
  notes: string[];
  critical?: boolean;
  example?: string;
};

type ChecklistStage = {
  id: string;
  step: number;
  title: string;
  titleEn: string;
  deadline?: string;
  description: string;
  critical?: boolean;
  items: ChecklistItem[];
  alert?: { type: "warning" | "info" | "danger"; text: string };
};

const stages: ChecklistStage[] = [
  {
    id: "pre-quota",
    step: 1,
    title: "เอกสารต้องมีก่อนกดโควต้า",
    titleEn: "Must have BEFORE Quota Day",
    deadline: "ก่อน 8 เมษายน 2026",
    description:
      "เอกสารทุกอย่างต้องออกและพร้อมก่อนวันที่ 8 เมษายน 2026 (วันกดโควต้า)",
    critical: true,
    alert: {
      type: "danger",
      text: "เอกสารทุกอย่างต้องออกก่อนหรือภายในวันที่ 7 เมษายน 2026 — ไม่มีข้อยกเว้น",
    },
    items: [
      {
        name: "Passport",
        notes: [
          "ยังไม่หมดอายุ ณ วันรับสมัคร (8 April 2026)",
          "ปริ้นต์คำเซ็นรับรองสำเนาถูกต้อง แล้ว Scan กลับไป (แนะนำเป็น Scan แบบสีเพื่อความคมชัด)",
        ],
      },
      {
        name: "ผลสอบภาษาอังกฤษ",
        nameEn: "English Test Score",
        notes: [
          "IELTS (General/Academic) Overall 4.5 / PTE Academic 30 / TOEFL iBT 32 (ผลออกระหว่าง 2 ก.ค. 2025 – 7 เม.ษ. 2026)",
          "IELTS 4.5 / PTE 24 / TOEFL 26 / CELPIP 5 / MET 38 / OET 1020 / LanguageCert 38 (ผลออกระหว่าง 7 ส.ค. 2025 – 7 เม.ษ. 2026)",
          "หรือใช้วุฒิการศึกษาที่เรียนเป็นภาษาอังกฤษ (English as medium of instruction) แทนได้",
          "ผลสอบต้องออกก่อน 8 เมษายน 2026 และมีอายุไม่เกิน 1 ปี ณ วันรับใบรับรอง (1 ก.ค. 2026)",
        ],
        critical: true,
      },
      {
        name: "ใบปริญญา / ใบจบ / Transcript",
        nameEn: "Education Certificate",
        notes: [
          "ต้องเรียนจบแล้ว / เอกสารออกแล้วก่อน 8 เม.ษ. 2026",
          "ปริ้นต์คำเซ็นรับรองสำเนาถูกต้อง แล้ว Scan กลับไป (แนะนำ Scan สี)",
        ],
      },
      {
        name: "Bank Certificate",
        nameEn: "หนังสือรับรองฐานะทางการเงินจากธนาคาร",
        notes: [
          "เป็นบัญชีออมทรัพย์ของธนาคารพาณิชย์ ชื่อบัญชีเป็นชื่อผู้สมัครเท่านั้น",
          "มีเงินอย่างน้อย 5,000 AUD หรือ 120,000 THB",
          "ออกโดยธนาคาร มีตราประทับหรือลายเซ็นเจ้าหน้าที่",
          "ออกช้าสุด 7 เมษายน 2026 มีอายุไม่เกิน 30 วัน",
        ],
        critical: true,
      },
    ],
  },
  {
    id: "dcy-submission",
    step: 2,
    title: "เอกสารรอบยื่น ดย. (Google Form)",
    titleEn: "DCY Document Submission",
    deadline: "27 เม.ษ. – 8 พ.ค. 2026",
    description:
      "หลังประกาศรายชื่อ (20 เม.ษ.) ส่งเอกสารผ่าน Google Form ได้คนละ 1 ครั้งเท่านั้น (ถึง 12.00 น. ของวันที่ 8 พ.ค.)",
    alert: {
      type: "warning",
      text: "ส่งได้คนละ 1 ครั้งเท่านั้น — ตรวจสอบเอกสารทุกอย่างให้ครบก่อนกดส่ง",
    },
    items: [
      {
        name: "ใบสมัคร",
        nameEn: "Application Form",
        notes: [
          "Download ได้จากระบบของ ดย. หลังกดโควต้าได้ — กรอกรายละเอียดให้ครบถ้วนตามที่ ดย. กำหนด",
          "ไม่แก้ไขข้อมูลที่มีอยู่แล้วจาก ดย.",
          "ปริ้นต์คำเซ็นแล้ว Scan กลับไป (แนะนำเป็น Scan แบบสีเพื่อความคมชัด)",
        ],
      },
      {
        name: "บัตรประจำตัวประชาชน และทะเบียนบ้าน",
        nameEn: "ID Card & House Registration",
        notes: [
          "บัตรประชาชนที่ยังไม่หมดอายุ",
          "ปริ้นต์คำเซ็นรับรองสำเนาถูกต้อง แล้ว Scan กลับไป (แนะนำ Scan สี)",
        ],
      },
      {
        name: "Passport",
        notes: [
          "ที่ยังไม่หมดอายุ ณ วันรับสมัคร (8 April 2026)",
          "ปริ้นต์คำเซ็นรับรองสำเนาถูกต้อง แล้ว Scan กลับไป (แนะนำ Scan สี)",
        ],
      },
      {
        name: "หนังสือรับรองฐานะทางการเงินจากธนาคาร",
        nameEn: "Bank Certificate",
        notes: [
          "เป็นบัญชีออมทรัพย์ไม่ชื่อผู้สมัครเอง",
          "มีเงินอย่างน้อย 5,000 AUD (Convert ค่าเงินได้) หรือ 120,000 บาท",
          "ออกโดยธนาคารพาณิชย์ มีตราประทับ/ลายเซ็น",
          "มีอายุไม่เกิน 30 วัน ณ วันกดโควต้า",
        ],
        critical: true,
      },
      {
        name: "ผลสอบภาษาอังกฤษ หรือ วุฒิที่เรียนเป็นภาษาอังกฤษ",
        nameEn: "English Test / English-medium Qualification",
        notes: [
          "ตามเกณฑ์ที่ ดย. ประกาศ (ดูรายละเอียดในหมวด FAQ 2026)",
          "ผลสอบต้องออกก่อน 8 เมษายน 2026",
          "อายุผลสอบไม่เกิน 1 ปี ณ วันรับใบรับรอง",
        ],
        critical: true,
      },
      {
        name: "วุฒิการศึกษา / ใบแสดงผลการเรียน",
        nameEn: "Degree Certificate / Transcript",
        notes: [
          "ปริญญาบัตร/ใบจบ + Transcript",
          "ปริ้นต์คำเซ็นรับรองสำเนาถูกต้อง แล้ว Scan (สี)",
        ],
      },
      {
        name: "รูปถ่าย",
        nameEn: "Photo",
        notes: [
          "ขนาด 200×265 pixels, หน้าตรง สวมชุดสุภาพ",
          "ไม่ใส่หมวก ไม่ใส่แว่นดำ ถ่ายไม่เกิน 3 เดือน",
          "ไฟล์ .jpg / .png — ปรับขนาดผ่าน Canva ได้",
        ],
      },
    ],
  },
  {
    id: "visa-docs",
    step: 3,
    title: "เอกสารรอบวีซ่า Home Affairs",
    titleEn: "Visa Application Documents",
    deadline: "หลังได้หนังสือรับรองจาก ดย.",
    description:
      "หลังได้หนังสือรับรอง (Letter of Government Support) จาก ดย. แล้ว ค่อยยื่นวีซ่ากับ Department of Home Affairs",
    alert: {
      type: "info",
      text: "การได้จดหมายจาก ดย. ไม่ได้การันตีได้วีซ่า — รอบวีซ่าตรวจเอกสารการเงินเข้มกว่ารอบ ดย.",
    },
    items: [
      {
        name: "Statement ย้อนหลัง 6 เดือน",
        nameEn: "6-month Bank Statement",
        notes: [
          "ไม่น้อยกว่า 5,000 AUD (ปี 2025 มีเคสถูกขอถึง 6,000 AUD)",
          "แนะนำแนบทั้ง Statement + Bank Certificate",
        ],
        critical: true,
      },
      {
        name: "หลักฐาน Source of Regular Income",
        nameEn: "Evidence of Regular Income",
        notes: [
          "จดหมายรับรองการทำงาน / Payslip / หลักฐานการเสียภาษี (ภ.ง.ด.91)",
          "เจ้าของกิจการ: หนังสือจดทะเบียนบริษัท + รายละเอียดผู้ถือหุ้น",
          "หลักฐาน Verifiable = น้ำหนักมากกว่า Non-verifiable",
        ],
      },
      {
        name: "Evidence of Source of Fund",
        notes: [
          "ถ้ามีเงินก้อนเข้ามาที่กระทบยอดต้องแสดง — ต้องแนบหลักฐานที่มา",
          "เช่น Bonus (Payslip), ขายรถ/บ้าน (สัญญา), มรดก (เอกสารกฎหมาย)",
        ],
      },
      {
        name: "Financial Support Letter",
        notes: [
          "อธิบายการเงินของตัวเองหรือ Sponsor ว่าแนบอะไรมาบ้าง",
          "กรณี Sponsor: ต้องมีหลักฐานความสัมพันธ์ + เอกสารการเงินของ Sponsor ด้วย",
        ],
      },
      {
        name: "ตรวจสุขภาพ (HAP ID)",
        nameEn: "Health Examination",
        notes: [
          "ตรวจกับ Panel Physician ที่กำหนด (7 แห่งในไทย)",
          "Bangkok General, BNH, Chiangmai Ram, IOM Bangkok, Bangkok Hospital Phuket, Aek Udon, IOM Sangkhlaburi",
        ],
      },
      {
        name: "Biometrics",
        notes: [
          "เก็บข้อมูลชีวมิติ (ลายนิ้วมือ/รูปถ่าย) หลังยื่นวีซ่าแล้ว",
        ],
      },
      {
        name: "ประกันการเดินทาง",
        nameEn: "Travel Insurance",
        notes: [
          "ครอบคลุมระยะเวลาที่อยู่ในออสเตรเลีย",
        ],
      },
    ],
  },
  {
    id: "sponsor",
    step: 4,
    title: "เอกสาร Sponsor (ถ้ามี)",
    titleEn: "Sponsor Documents (if applicable)",
    description:
      "กรณีใช้คนอื่นเป็นผู้สนับสนุนทางการเงิน — สำหรับรอบวีซ่าเท่านั้น (รอบ ดย. ต้องเป็นชื่อผู้สมัครเอง)",
    items: [
      {
        name: "Financial Support Letter จาก Sponsor",
        notes: [
          "ยืนยันว่า Sponsor จะ support ผู้สมัคร และผู้สมัครเข้าถึงเงินได้จริง",
        ],
      },
      {
        name: "บัตรปชช. + ทะเบียนบ้านของ Sponsor",
        notes: [
          "พิสูจน์ความสัมพันธ์กับผู้สมัคร",
          "สามารถแนบ Family Tree ไปด้วยได้",
        ],
      },
      {
        name: "หลักฐาน Source of Income ของ Sponsor",
        notes: [
          "จดหมายรับรองงาน / Payslip / หลักฐานเสียภาษี",
        ],
      },
      {
        name: "Bank Statement ย้อนหลัง 6 เดือน ของ Sponsor",
        notes: [
          "แนะนำมีมากกว่า 5,000 AUD — ยิ่งเยอะยิ่งดี พร้อมที่มาชัดเจน",
          "ถ้าโอนเงินเข้าบัญชีผู้สมัครแล้ว แนบบัญชีทั้งสองฝ่ายจะดีมาก",
        ],
      },
    ],
  },
];

const downloadFiles = [
  {
    name: "Checklist ฉบับเต็ม 2026 (เช็คกับ ดย. แล้ว)",
    description: "รายการเอกสารครบทุกรอบ + ตัวอย่างเอกสาร + ขั้นตอนกดโควต้า",
    url: "https://www.thaiwahclub.com/article-wah/Work-And-Holiday-Australia/449-Checklist%20Work%20and%20Holiday%202026.html",
    type: "article" as const,
  },
  {
    name: "ประกาศเกณฑ์ผลภาษาจาก ดย.",
    description: "PDF ประกาศเกณฑ์ภาษาอังกฤษฉบับใหม่ (อัพเดท 13 มี.ค. 2026)",
    url: "https://dcy.go.th/public/mainWeb/articles/news/1773060074857-311285978.pdf",
    type: "pdf" as const,
  },
  {
    name: "Functional English — Home Affairs",
    description: "เกณฑ์ภาษาอังกฤษของ Department of Home Affairs",
    url: "https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/english-language/functional-english",
    type: "link" as const,
  },
];

const alertStyles = {
  warning: "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200",
  info: "bg-primary/10 border-primary/30 text-foreground",
  danger: "bg-destructive/10 border-destructive/30 text-destructive",
};

const alertIcons = {
  warning: AlertTriangle,
  info: Info,
  danger: AlertTriangle,
};

const ChecklistSection = ({ embedded = false }: { embedded?: boolean }) => {
  const [expandedStage, setExpandedStage] = useState<string | null>("pre-quota");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalItems = stages.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = checkedItems.size;
  const progress = Math.round((checkedCount / totalItems) * 100);

  const content = (
    <>
      <SectionHeader
        eyebrow="เช็คกับ ดย. แล้ว ✓"
        title="Checklist WHM 2026"
        subtitle="รายการเอกสารครบทุกรอบ ตั้งแต่ก่อนกดโควต้าจนถึงยื่นวีซ่า — อัพเดทล่าสุด 2 เมษายน 2026"
      />

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            ความคืบหน้าของคุณ
          </span>
          <span className="text-sm font-bold text-primary">
            {checkedCount}/{totalItems} รายการ ({progress}%)
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Stages */}
      <div className="max-w-3xl mx-auto space-y-4">
        {stages.map((stage) => {
          const isExpanded = expandedStage === stage.id;
          const stageChecked = stage.items.filter((_, i) =>
            checkedItems.has(`${stage.id}-${i}`)
          ).length;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl border overflow-hidden transition-all ${
                stage.critical
                  ? "border-destructive/40 bg-destructive/5"
                  : "border-border gradient-card"
              } ${isExpanded ? "shadow-warm" : ""}`}
            >
              {/* Stage Header */}
              <button
                onClick={() =>
                  setExpandedStage(isExpanded ? null : stage.id)
                }
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    stage.critical
                      ? "bg-destructive/15 text-destructive border-2 border-destructive/30"
                      : "bg-primary/15 text-primary border-2 border-primary/30"
                  }`}
                >
                  {stage.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-foreground">
                      {stage.title}
                    </h3>
                    {stage.critical && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                        สำคัญมาก
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stage.titleEn}
                  </p>
                  {stage.deadline && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">
                        {stage.deadline}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {stageChecked}/{stage.items.length} เสร็จแล้ว
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 mt-2 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Stage Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-border/50">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground mt-4 mb-4">
                        {stage.description}
                      </p>

                      {/* Alert */}
                      {stage.alert && (
                        <div
                          className={`flex items-start gap-3 p-3.5 rounded-xl border mb-5 ${
                            alertStyles[stage.alert.type]
                          }`}
                        >
                          {(() => {
                            const IconComp = alertIcons[stage.alert.type];
                            return <IconComp className="w-4 h-4 flex-shrink-0 mt-0.5" />;
                          })()}
                          <p className="text-sm leading-relaxed">
                            {stage.alert.text}
                          </p>
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-2">
                        {stage.items.map((item, i) => {
                          const key = `${stage.id}-${i}`;
                          const isChecked = checkedItems.has(key);

                          return (
                            <div
                              key={key}
                              className={`rounded-xl border p-4 transition-all ${
                                isChecked
                                  ? "bg-primary/5 border-primary/30"
                                  : item.critical
                                  ? "bg-amber-500/5 border-amber-500/20"
                                  : "bg-background border-border"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => toggleCheck(key)}
                                  className="flex-shrink-0 mt-0.5"
                                >
                                  {isChecked ? (
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-border hover:text-primary/50 transition-colors" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`text-sm font-semibold ${
                                        isChecked
                                          ? "text-primary line-through"
                                          : "text-foreground"
                                      }`}
                                    >
                                      {i + 1}. {item.name}
                                    </span>
                                    {item.critical && !isChecked && (
                                      <span className="text-[9px] font-bold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                                        สำคัญ
                                      </span>
                                    )}
                                  </div>
                                  {item.nameEn && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {item.nameEn}
                                    </p>
                                  )}
                                  <ul className="mt-2 space-y-1.5">
                                    {item.notes.map((note, j) => (
                                      <li
                                        key={j}
                                        className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2"
                                      >
                                        <span className="text-primary/60 mt-0.5">▸</span>
                                        <span>{note}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Download Section */}
      <div className="max-w-3xl mx-auto mt-10">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">
            เอกสารและลิงก์ที่เกี่ยวข้อง
          </h3>
        </div>
        <div className="grid gap-3">
          {downloadFiles.map((file) => (
            <a
              key={file.name}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-background hover:bg-muted/30 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {file.type === "pdf" ? (
                  <FileText className="w-5 h-5 text-primary" />
                ) : file.type === "article" ? (
                  <Shield className="w-5 h-5 text-primary" />
                ) : (
                  <ExternalLink className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {file.description}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <p className="text-muted-foreground text-sm">
          ต้องการส่วนลดค่าสอบ IELTS หรือ PTE?{" "}
          <a
            href="#services"
            className="text-primary font-medium hover:underline"
          >
            ดูบริการของเรา →
          </a>
        </p>
      </div>
    </>
  );

  if (embedded) return content;
  return (
    <section id="checklist" className="py-20 bg-background">
      <div className="container">{content}</div>
    </section>
  );
};

export default ChecklistSection;

'use client'

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, CheckCircle2, XCircle, ExternalLink, AlertTriangle, MinusCircle } from "lucide-react";
import {
  checkPostcode, OFFICIAL_URL, type AreaId, type PostcodeResult, type WorkType,
} from "@/data/postcodeData";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Language } from "@/i18n/translations";

// All visible text. Thai approved by the owner on 2026-10-05
// (docs/qa/thai-review-postcode-checker.md).
const en = {
  title: "2nd/3rd WHM Postcode Checker",
  intro: "Enter the postcode where you work to see which jobs there count as specified work for a 2nd or 3rd year Work and Holiday visa (subclass 462).",
  placeholder: "Enter postcode (e.g. 4810)",
  check: "Check",
  listedHeading: (pc: string) => `Work that counts at postcode ${pc}`,
  listedBody: "Your work here counts only if it is one of these types.",
  otherTitle: "Other jobs",
  otherBody: "Usually these don't count. Home Affairs may currently accept support roles within the industries above.",
  notListedHeading: (pc: string) => `Postcode ${pc} is not in a specified work area`,
  notListedBody: "Work at this postcode won't count towards a 2nd or 3rd year visa. The only exception is critical COVID-19 work in healthcare and medicine, which counts anywhere in Australia.",
  disclaimer: "This is a guide only, based on the Home Affairs postcode list updated 24 September 2026. Check the latest rules on the",
  officialLink: "Department of Home Affairs website",
  work: {
    tourism: { title: "Tourism and hospitality", examples: "Hotels, hostels, cafés, restaurants, bars, tour guides" },
    cultivation: { title: "Farm work (plants and animals)", examples: "Picking and packing fruit and vegetables, caring for farm animals, shearing" },
    treeFarming: { title: "Tree farming and felling", examples: "Planting, tending or felling plantation trees" },
    fishing: { title: "Fishing and pearling", examples: "Work on fishing boats, pearl farms" },
    construction: { title: "Construction", examples: "Building sites, landscaping, painting new buildings, scaffolding" },
    bushfireRecovery: { title: "Bushfire recovery", examples: "Rebuilding, clean-up, caring for wildlife — paid or volunteer" },
    disasterRecovery: { title: "Flood, cyclone and storm recovery", examples: "Clean-up, repairs, helping affected people — paid or volunteer" },
  } satisfies Record<WorkType, { title: string; examples: string }>,
  // Where the work counts, plus any date condition from that area's list.
  areas: {
    remote: "Remote and Very Remote Australia · work from 22 June 2021",
    northern: "Northern Australia",
    regional: "Regional Australia",
    bushfire: "Bushfire declared area · work after 31 July 2019",
    disaster: "Natural disaster declared area · work after 31 Dec 2021",
  } satisfies Record<AreaId, string>,
};

const th: typeof en = {
  title: "เช็ก Postcode เมืองที่จะไปเก็บชั่วโมงสำหรับวีซ่า WHM ปีที่ 2/3",
  intro: "ใส่ Postcode ของเมืองที่สนใจ เพื่อเช็กว่างานประเภทไหนสามารถยื่นวีซ่า Work and Holiday ปีที่ 2 หรือ 3 ได้",
  placeholder: "ใส่ Postcode (เช่น 4810)",
  check: "ตรวจสอบ",
  listedHeading: (pc: string) => `งานที่นับได้ใน Postcode ${pc}`,
  listedBody: "งานด้านล่างนี้นับเป็นชั่วโมงสำหรับยื่นวีซ่าปีที่ 2/3 ได้",
  otherTitle: "งานอื่น ๆ",
  otherBody: "โดยปกตินับไม่ได้ แต่ช่วงนี้ Home Affairs อาจเปิดให้ยื่นได้สำหรับบางอาชีพตามด้านบน",
  notListedHeading: (pc: string) => `Postcode ${pc} ไม่อยู่ในพื้นที่ Specified Work`,
  notListedBody: "งานใน Postcode นี้เก็บชั่วโมงเพื่อยื่นวีซ่าปีที่ 2 หรือ 3 ไม่ได้ ยกเว้นงานด้านสุขภาพและการแพทย์ที่สำคัญต่อการรับมือ COVID-19 ซึ่งนับได้ทุกพื้นที่ในออสเตรเลีย",
  disclaimer: "ผลนี้เป็นข้อมูลเบื้องต้น อ้างอิงรายการ Postcode ของ Home Affairs ฉบับอัปเดต 24 ก.ย. 2569 โปรดตรวจสอบเงื่อนไขล่าสุดที่",
  officialLink: "เว็บไซต์ Department of Home Affairs",
  work: {
    tourism: { title: "การท่องเที่ยวและการบริการ", examples: "โรงแรม โฮสเทล คาเฟ่ ร้านอาหาร บาร์ ไกด์นำเที่ยว" },
    cultivation: { title: "งานฟาร์ม (พืชและสัตว์)", examples: "เก็บและแพ็กผักผลไม้ ดูแลสัตว์ในฟาร์ม ตัดขนแกะ" },
    treeFarming: { title: "ปลูกและตัดไม้", examples: "ปลูก ดูแล หรือตัดต้นไม้ในสวนป่า" },
    fishing: { title: "ประมงและการเลี้ยงหอยมุก", examples: "ทำงานบนเรือประมง ฟาร์มหอยมุก" },
    construction: { title: "งานก่อสร้าง", examples: "ไซต์ก่อสร้าง จัดภูมิทัศน์ไซต์ก่อสร้าง ทาสีอาคารใหม่ นั่งร้าน" },
    bushfireRecovery: { title: "ฟื้นฟูหลังไฟป่า", examples: "ซ่อมสร้าง เก็บกวาด ดูแลสัตว์ป่า (ทั้งงานมีค่าจ้างและงานอาสา)" },
    disasterRecovery: { title: "ฟื้นฟูหลังน้ำท่วม และพายุ", examples: "เก็บกวาด ซ่อมแซม ช่วยเหลือผู้ได้รับผลกระทบ (ทั้งงานมีค่าจ้างและงานอาสา)" },
  },
  areas: {
    remote: "พื้นที่ห่างไกล (Remote and Very Remote) · งานตั้งแต่ 22 มิ.ย. 2564",
    northern: "(Northern Australia)",
    regional: "(Regional Australia)",
    bushfire: "พื้นที่ประกาศภัยไฟป่า · งานหลัง 31 ก.ค. 2562",
    disaster: "พื้นที่ประกาศภัยพิบัติ · งานหลัง 31 ธ.ค. 2564",
  },
};

const copy: Record<Language, typeof en> = { en, th };

const PostcodeChecker = () => {
  const { language } = useLanguage();
  const text = copy[language];
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState<PostcodeResult | null>(null);
  const [searched, setSearched] = useState(false);
  const reduceMotion = useReducedMotion();
  // NT postcodes start with 0; show "872" as "0872" in the result.
  const shown = postcode.padStart(4, "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(postcode, 10);
    if (isNaN(num) || postcode.length < 3 || postcode.length > 4) return;
    setResult(checkPostcode(num));
    setSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {text.title}
        </h3>
        <p className="text-muted-foreground">
          {text.intro}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value.replace(/\D/g, ""));
              setSearched(false);
            }}
            placeholder={text.placeholder}
            aria-label={text.placeholder}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          />
        </div>
        <button
          type="submit"
          disabled={postcode.length < 3}
          className="px-8 py-4 rounded-xl gradient-gold text-primary-foreground font-semibold shadow-warm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          {text.check}
        </button>
      </form>

      <div aria-live="polite">
        {searched && result && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {result.eligible ? (
              <div className="rounded-xl border-2 border-accent bg-card overflow-hidden">
                <div className="flex items-start gap-3 p-5 bg-accent/10">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{text.listedHeading(shown)}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{text.listedBody}</p>
                  </div>
                </div>

                <ul className="divide-y divide-border">
                  {result.work.map(({ type, areas }) => (
                    <li key={type} className="flex items-start gap-3 px-5 py-4">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">{text.work[type].title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{text.work[type].examples}</p>
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {areas.map((id) => (
                            <li key={id} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground/80">
                              {text.areas[id]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                  <li className="flex items-start gap-3 px-5 py-4 bg-muted/30">
                    <MinusCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" aria-hidden />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{text.otherTitle}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{text.otherBody}</p>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-5 rounded-xl border-2 border-destructive bg-destructive/10">
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" aria-hidden />
                <div>
                  <h4 className="font-bold text-foreground text-lg">{text.notListedHeading(shown)}</h4>
                  <p className="text-muted-foreground text-sm mt-1">{text.notListedBody}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 border border-border">
              <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden />
              <p className="text-xs text-muted-foreground">
                {text.disclaimer}{" "}
                <a
                  href={OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  {text.officialLink} <ExternalLink className="w-3 h-3" aria-hidden />
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PostcodeChecker;

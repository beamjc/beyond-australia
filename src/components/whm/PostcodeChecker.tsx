'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, XCircle, ExternalLink, AlertTriangle } from "lucide-react";
import { checkPostcode, OFFICIAL_URL, type PostcodeResult } from "@/data/postcodeData";

const PostcodeChecker = () => {
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState<PostcodeResult | null>(null);
  const [searched, setSearched] = useState(false);

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
          2nd/3rd WHM Postcode Checker
        </h3>
        <p className="text-muted-foreground">
          Check if a postcode is eligible for specified work for 2nd or 3rd year Work and Holiday visa (subclass 462) extension.
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
            placeholder="Enter postcode (e.g. 4810)"
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          />
        </div>
        <button
          type="submit"
          disabled={postcode.length < 3}
          className="px-8 py-4 rounded-xl gradient-gold text-primary-foreground font-semibold shadow-warm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          Check
        </button>
      </form>

      {searched && result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {result.eligible ? (
            <>
              <div className="flex items-start gap-3 p-5 rounded-xl border-2 border-accent bg-accent/10">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground text-lg">
                    Postcode {postcode} is eligible!
                  </h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    This postcode falls within eligible areas for specified 462 work under the following categories:
                  </p>
                </div>
              </div>

              {result.areas.map((area) => (
                <div key={area.name} className="rounded-xl border border-border bg-card p-5">
                  <h5 className="font-bold text-foreground mb-2">{area.name}</h5>
                  <p className="text-sm text-muted-foreground mb-3">Eligible industries:</p>
                  <ul className="space-y-1.5">
                    {area.industries.map((ind) => (
                      <li key={ind} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        {ind}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-start gap-3 p-5 rounded-xl border-2 border-destructive bg-destructive/10">
              <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground text-lg">
                  Postcode {postcode} is not eligible
                </h4>
                <p className="text-muted-foreground text-sm mt-1">
                  This postcode does not appear in any eligible area for specified 462 work. Work in this area may not count towards your 2nd/3rd year WHM visa.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 border border-border">
            <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              This tool is for guidance only. Always verify eligibility via the{" "}
              <a
                href={OFFICIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                official Home Affairs website <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PostcodeChecker;

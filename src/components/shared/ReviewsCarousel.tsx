'use client'

import { Quote, Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import { useLanguage } from "@/i18n/LanguageProvider";

const sourceLabel: Record<(typeof reviews)[number]["source"], { en: string; th: string }> = {
  facebook: { en: "Facebook", th: "เฟซบุ๊ก" },
  google: { en: "Google", th: "กูเกิล" },
};

const ReviewsCarousel = () => {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background p-6 shadow-sm"
        >
          <Quote className="w-8 h-8 text-primary/25 fill-primary/10" strokeWidth={1.5} aria-hidden />

          <p className="flex-1 text-sm leading-relaxed text-foreground">{review.text}</p>

          <div className="flex items-center gap-3 border-t border-border/40 pt-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {review.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">{review.name}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </span>
                <span>· {sourceLabel[review.source][language]}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsCarousel;

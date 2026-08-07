'use client'

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { reviews } from "@/data/reviews";

const sourceLabel: Record<(typeof reviews)[number]["source"], string> = {
  facebook: "Facebook",
  google: "Google",
};

const ReviewsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.canScrollNext() ? api.scrollNext() : api.scrollTo(0);
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className="w-full max-w-xl mx-auto lg:mx-0">
      <CarouselContent>
        {reviews.map((review) => (
          <CarouselItem key={review.id}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-background p-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground">&ldquo;{review.text}&rdquo;</p>
              <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{review.name}</span>
                <span>{sourceLabel[review.source]}</span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ReviewsCarousel;

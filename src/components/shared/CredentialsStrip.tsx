'use client'

import ReviewsCarousel from "./ReviewsCarousel";

const CredentialsStrip = () => {
  return (
    <section className="py-12 sm:py-14 bg-card border-y border-border/60">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
          <div className="shrink-0 flex justify-center lg:justify-start">
            <img
              src="/beyond-study-logo.png"
              alt="Beyond Study Center"
              className="w-40 sm:w-48 lg:w-56 h-auto"
            />
          </div>
          <div className="flex-1">
            <ReviewsCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredentialsStrip;

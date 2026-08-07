type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

const SectionHeader = ({ eyebrow, title, subtitle, className = "mb-10" }: SectionHeaderProps) => (
  <div className={`text-center ${className}`}>
    <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-2 block">
      {eyebrow}
    </span>
    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;

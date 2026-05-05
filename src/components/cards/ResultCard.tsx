import { ReactNode } from "react";

interface Props {
  icon: string;
  title: string;
  children: ReactNode;
  delay?: number;
}

const ResultCard = ({ icon, title, children, delay = 0 }: Props) => (
  <div
    className="fade-in rounded-xl bg-card shadow-md border border-border p-6"
    style={{ animationDelay: `${delay}ms` }}
  >
    <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
      <span className="text-xl">{icon}</span>
      {title}
    </h3>
    <div className="text-foreground/80 text-sm leading-relaxed">{children}</div>
  </div>
);

export default ResultCard;

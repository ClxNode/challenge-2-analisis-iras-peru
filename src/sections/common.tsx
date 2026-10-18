import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-primary mt-10 mb-3 text-xl font-semibold tracking-tight first:mt-0">{children}</h3>;
}

export function P({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-foreground/85 max-w-[68ch] text-[1.02rem] leading-relaxed", className)}>{children}</p>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("science-card border-border/90 bg-card rounded-2xl border p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent/50", className)}>
      {children}
    </div>
  );
}

export function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <Card>
      <div className="text-primary text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="text-foreground mt-1 text-sm font-medium">{label}</div>
      {note ? <div className="text-muted-foreground mt-1 text-xs leading-snug">{note}</div> : null}
    </Card>
  );
}

export function Callout({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: "info" | "warn";
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-sm leading-relaxed",
        tone === "warn"
          ? "border-[#e8c872] bg-warn-bg text-warn"
          : "border-accent/30 bg-accent-soft text-primary",
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

export function SyntheticBanner() {
  return (
    <Callout tone="warn" title="Datos sintéticos: demostración, no pronóstico epidemiológico">
      La serie mensual la genera el notebook por código. No proviene del MINSA ni de pacientes reales, y las
      predicciones no son estimaciones oficiales.
    </Callout>
  );
}

export function ChartFrame({ title, caption, children }: { title: string; caption?: string; children: ReactNode }) {
  return (
    <Card>
      <div className="text-primary mb-3 text-sm font-semibold">{title}</div>
      {children}
      {caption ? <p className="text-muted-foreground mt-3 text-xs leading-snug">{caption}</p> : null}
    </Card>
  );
}

export function Pill({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-accent hover:text-accent",
      )}
    >
      {children}
    </button>
  );
}

export const fmt = (n: number) => n.toLocaleString("es-PE");

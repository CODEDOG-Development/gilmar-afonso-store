export function StepTitle({ step, title }: { step: number; title: string }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 text-base font-semibold">
      <span
        className="grid size-7 place-items-center rounded-full bg-foreground text-xs text-background"
        aria-hidden
      >
        {step}
      </span>
      {title}
    </h2>
  )
}

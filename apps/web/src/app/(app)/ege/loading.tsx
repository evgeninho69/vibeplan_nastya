export default function Loading() {
  return (
    <div className="px-5 md:px-8 pb-12 max-w-[var(--max-width)] mx-auto flex flex-col gap-5 vp-fade">
      <div className="h-32 rounded-3xl bg-[var(--surface-container-low)]" />
      <div className="h-24 rounded-3xl bg-[var(--surface-container-low)]" />
      <div className="h-96 rounded-3xl bg-[var(--surface-container-low)]" />
    </div>
  );
}
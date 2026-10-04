export default function Loading() {
  return (
    <div className="px-5 md:px-8 pb-12 max-w-[var(--max-width)] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 vp-fade">
      <div className="lg:col-span-7 h-96 rounded-3xl bg-[var(--surface-container-low)]" />
      <div className="lg:col-span-5 flex flex-col gap-5">
        <div className="h-48 rounded-3xl bg-[var(--surface-container-low)]" />
        <div className="h-44 rounded-3xl bg-[var(--surface-container-low)]" />
      </div>
    </div>
  );
}
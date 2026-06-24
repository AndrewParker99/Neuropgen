export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-clinical-200 bg-[#fafffc] p-8 text-center text-stone-500">
      {message}
    </div>
  );
}

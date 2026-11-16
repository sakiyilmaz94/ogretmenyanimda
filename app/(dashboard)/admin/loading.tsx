export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-md bg-surface-container" />
        <div className="h-4 w-72 rounded-md bg-surface-container" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-md bg-surface-container" />
        ))}
      </div>
      <div className="h-64 rounded-md bg-surface-container" />
    </div>
  );
}

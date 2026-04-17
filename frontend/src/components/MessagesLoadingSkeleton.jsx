function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}>
          <div className={`h-9 rounded-2xl ${i % 2 === 0 ? "bg-gray-200 w-40" : "bg-emerald-100 w-32"}`} />
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;
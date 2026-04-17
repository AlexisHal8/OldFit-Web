function UsersLoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((item) => (
        <div key={item} className="p-3 rounded-xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
            <div className="flex-1">
              <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-2.5 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default UsersLoadingSkeleton;
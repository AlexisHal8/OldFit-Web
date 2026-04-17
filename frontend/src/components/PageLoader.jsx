import { LoaderIcon } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <LoaderIcon className="w-8 h-8 animate-spin text-emerald-600" />
    </div>
  );
}
export default PageLoader;
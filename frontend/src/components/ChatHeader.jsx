import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.some(key => key.endsWith(`_${selectedUser.id}`));

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-white border-b border-gray-200 px-5 py-3 min-h-[64px]">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-100">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="w-full h-full object-cover" />
          </div>
          {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />}
        </div>
        <div>
          <h3 className="text-gray-800 font-semibold text-sm">{selectedUser.fullName}</h3>
          <p className={`text-xs font-medium ${isOnline ? "text-emerald-600" : "text-gray-400"}`}>
            {isOnline ? "En línea" : "Desconectado"}
          </p>
        </div>
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
export default ChatHeader;
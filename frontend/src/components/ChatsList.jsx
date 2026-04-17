import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => { getMyChatPartners(); }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => {
        const isOnline = onlineUsers.some(k => k.endsWith(`_${chat.id}`));
        return (
          <div
            key={chat.id}
            className="p-3 rounded-xl cursor-pointer hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all"
            onClick={() => setSelectedUser(chat)}
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} className="w-full h-full object-cover" />
                </div>
                {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />}
              </div>
              <div className="min-w-0">
                <h4 className="text-gray-800 font-semibold text-sm truncate">{chat.fullName}</h4>
                <p className="text-xs text-gray-400 truncate">{isOnline ? "En línea" : "Desconectado"}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
export default ChatsList;
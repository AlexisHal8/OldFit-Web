import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser.id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-5 overflow-y-auto py-5 bg-gray-50">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-2xl mx-auto space-y-3">
            {messages.map((msg) => {
              const isMe = msg.id_remitente === authUser?.id;
              return (
                <div key={msg.id_mensaje} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`w-fit max-w-[75%] flex flex-col px-4 py-2.5 rounded-2xl shadow-sm ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                  }`}>
                    {msg.image && (
                      <img src={msg.image} alt="Imagen" className="rounded-lg max-h-48 object-cover mb-2" />
                    )}
                    {msg.contenido_texto && (
                      <p className="text-sm leading-relaxed">{msg.contenido_texto}</p>
                    )}
                    <span className={`text-[10px] mt-1 text-right ${isMe ? "text-emerald-100" : "text-gray-400"}`}>
                      {new Date(msg.fecha_envio || msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput />
    </>
  );
}
export default ChatContainer;
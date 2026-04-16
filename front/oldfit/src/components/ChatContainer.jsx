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

    // clean up
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
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
       <div className="max-w-3xl mx-auto space-y-4 px-4">
            {messages.map((msg) => {
              // Comparamos si el mensaje es nuestro
              const isMe = msg.id_remitente === authUser?.id;

              return (
                <div
                  key={msg.id_mensaje}
                  // 1. EL SECRETO ESTÁ AQUÍ: justify-end lo manda a la derecha, justify-start a la izquierda
                  className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    // 2. Bordes redondeados con la esquina plana dependiendo de quién lo envía
                    className={`w-fit max-w-[80%] flex flex-col px-4 py-2 rounded-2xl ${
                      isMe
                        ? "bg-cyan-600 text-white rounded-tr-none" // Piquito arriba a la derecha
                        : "bg-slate-800 text-slate-200 rounded-tl-none" // Piquito arriba a la izquierda
                    }`}
                  >
                    {msg.image && (
                      <img src={msg.image} alt="Shared" className="rounded-lg max-h-48 object-cover mb-2" />
                    )}
                    
                    {/* TEXTO DEL MENSAJE */}
                    {msg.contenido_texto && (
                      <p className="text-sm">{msg.contenido_texto}</p>
                    )}
                    
                    {/* HORA DEL MENSAJE */}
                    <span className={`text-[10px] mt-1 text-right ${isMe ? "text-cyan-100" : "text-slate-400"}`}>
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
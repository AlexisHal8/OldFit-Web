import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-5xl h-[700px] rounded-2xl shadow-2xl overflow-hidden flex border border-slate-700 bg-slate-900 font-sans">
      
      {/* LADO IZQUIERDO (Lista de contactos) */}
      <div className="w-80 flex flex-col bg-slate-800 border-r border-slate-700 z-10">
        <ProfileHeader />
        <ActiveTabSwitch />

        {/* El min-h-0 aquí evita que los contactos empujen el contenedor hacia abajo */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* LADO DERECHO (Área de mensajes) */}
      <div className="flex-1 flex flex-col relative bg-slate-900">
        {/* Decorador de fondo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* El min-h-0 aquí ancla la barra de mensajes exactamente al fondo */}
        <div className="relative z-10 flex flex-col flex-1 min-h-0">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </div>

    </div>
  );
}
export default ChatPage;
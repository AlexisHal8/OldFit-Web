import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-5xl h-[700px] rounded-2xl shadow-xl overflow-hidden flex border border-gray-200 bg-white font-sans">

      {/* LADO IZQUIERDO */}
      <div className="w-72 flex flex-col bg-gray-50 border-r border-gray-200 z-10">
        <ProfileHeader />
        <ActiveTabSwitch />
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1.5">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="flex-1 flex flex-col relative bg-white">
        <div className="relative z-10 flex flex-col flex-1 min-h-0">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </div>
    </div>
  );
}
export default ChatPage;
import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex p-2 m-2 gap-1 bg-gray-100 rounded-lg">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${
          activeTab === "chats"
            ? "bg-white text-emerald-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Chats
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${
          activeTab === "contacts"
            ? "bg-white text-emerald-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Contactos
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
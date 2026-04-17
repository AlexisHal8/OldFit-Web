import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
      <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-7 h-7 text-emerald-500" />
      </div>
      <div>
        <h4 className="text-gray-700 font-semibold text-sm mb-1">Sin conversaciones</h4>
        <p className="text-gray-400 text-xs px-6">
          Inicia un chat seleccionando un contacto de la pestaña de contactos
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="px-4 py-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors font-semibold"
      >
        Ver contactos
      </button>
    </div>
  );
}
export default NoChatsFound;
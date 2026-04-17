import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50">
      <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="w-8 h-8 text-emerald-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Selecciona una conversación</h3>
      <p className="text-gray-400 text-sm max-w-xs">
        Elige un contacto del panel izquierdo para iniciar o continuar una conversación.
      </p>
    </div>
  );
};
export default NoConversationPlaceholder;
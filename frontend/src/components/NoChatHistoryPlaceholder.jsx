import { MessageCircleIcon } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50">
      <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mb-4">
        <MessageCircleIcon className="w-7 h-7 text-emerald-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        Inicia tu conversación con {name}
      </h3>
      <p className="text-gray-400 text-sm max-w-xs">
        Sé el primero en enviar un mensaje.
      </p>
    </div>
  );
};
export default NoChatHistoryPlaceholder;
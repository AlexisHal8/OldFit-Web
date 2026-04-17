import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import { SendIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    sendMessage({ contenido_texto: text.trim() });
    setText("");
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-800 placeholder:text-gray-400 text-sm focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
          placeholder="Escribe un mensaje..."
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 transition-all active:scale-95"
        >
          <SendIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
import {
  Paperclip,
  Smile,
  Send,
} from "lucide-react";

function MessageInput({
  newMessage,
  setNewMessage,
  sendMessage,
}) {
  return (
    <div className="p-4 border-t border-slate-800">

      <div className="flex items-center gap-3">

        <button className="text-slate-400 hover:text-white">
          <Paperclip size={20} />
        </button>

        <button className="text-slate-400 hover:text-white">
          <Smile size={20} />
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) =>
            setNewMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700"
        >
          <Send size={20} />
        </button>

      </div>

    </div>
  );
}

export default MessageInput;
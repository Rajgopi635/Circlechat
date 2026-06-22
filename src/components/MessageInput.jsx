import { useState } from "react";
import {
  Paperclip,
  Smile,
  Send,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function MessageInput({
  newMessage,
  setNewMessage,
  sendMessage,
}) {
  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const handleEmojiClick = (emojiData) => {
    setNewMessage(
      (prev) => prev + emojiData.emoji
    );
  };

  return (
    <div className="p-4 border-t border-slate-800 relative">

      {showEmojiPicker && (
        <div className="absolute bottom-20 left-12 z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
          />
        </div>
      )}

      <div className="flex items-center gap-3">

        <button className="text-slate-400 hover:text-white">
          <Paperclip size={20} />
        </button>

        <button
          onClick={() =>
            setShowEmojiPicker(
              !showEmojiPicker
            )
          }
          className="text-slate-400 hover:text-white"
        >
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
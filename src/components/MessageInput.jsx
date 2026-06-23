import { useState, useRef } from "react";
import {
  Paperclip,
  Smile,
  Send,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { supabase } from "../lib/supabase";

function MessageInput({
  newMessage,
  setNewMessage,
  sendMessage,
  currentUser,
  activeFriend,
}) {

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const typingTimeout = useRef(null);

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
          onChange={async (e) => {

            console.log("TYPING STARTED");

  setNewMessage(e.target.value);

  if (!currentUser || !activeFriend)
    return;

  const { data, error } = await supabase
  .from("typing_status")
  .upsert({
    user_id: currentUser.id,
    receiver_id: activeFriend.id,
    is_typing: true,
  });

console.log("TYPING RESPONSE");
console.log(data);
console.log(error);

clearTimeout(typingTimeout.current);

 typingTimeout.current = setTimeout(
    async () => {
      await supabase
        .from("typing_status")
        .upsert({
          user_id: currentUser.id,
          receiver_id: activeFriend.id,
          is_typing: false,
        });
    },
    2000
  );
}}
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
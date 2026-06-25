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
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleTyping = async (value) => {
    setNewMessage(value);

    if (!currentUser || !activeFriend) return;

    await supabase
      .from("typing_status")
      .upsert({
        user_id: currentUser.id,
        receiver_id: activeFriend.id,
        is_typing: true,
      });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(async () => {
      await supabase
        .from("typing_status")
        .upsert({
          user_id: currentUser.id,
          receiver_id: activeFriend.id,
          is_typing: false,
        });
    }, 2000);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await sendMessage();

    setNewMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (
      !file ||
      !currentUser ||
      !activeFriend
    )
      return;

    const extension =
      file.name.split(".").pop();

    const fileName = `${Date.now()}-${currentUser.id}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from("chat-files")
        .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("chat-files")
      .getPublicUrl(fileName);

    const messageType = file.type.startsWith("image/")
      ? "image"
      : "file";

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: activeFriend.id,
          message_text: "",
          message_type: messageType,
          file_url: publicUrl,
          file_name: file.name,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    event.target.value = "";
  };

  return (
    <div className="relative border-t border-slate-800 bg-slate-900 p-4">

      {showEmojiPicker && (
        <div className="absolute bottom-20 left-2 right-2 md:left-4 md:right-auto z-50 flex justify-center md:block">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="flex items-end gap-2 md:gap-3">

                <button
          onClick={() => fileInputRef.current?.click()}
          className="text-slate-400 hover:text-white"
          title="Attach File"
        >
          <Paperclip size={22} />
        </button>

        <button
          onClick={() =>
            setShowEmojiPicker(!showEmojiPicker)
          }
          className="text-slate-400 hover:text-white"
          title="Emoji"
        >
          <Smile size={22} />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={newMessage}
          onChange={(e) =>
            handleTyping(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 resize-none overflow-hidden rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none text-sm md:text-base min-h-[48px] max-h-36"
        />

        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className={`rounded-lg p-3 transition ${
            newMessage.trim()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-slate-700 cursor-not-allowed"
          }`}
        >
          <Send size={22} />
        </button>

      </div>

    </div>
  );
}

export default MessageInput;
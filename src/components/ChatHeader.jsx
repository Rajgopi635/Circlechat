function ChatHeader({ activeFriend }) {
  return (
    <div className="h-16 border-b border-slate-800 flex items-center px-6">
      <div>
        <h2 className="font-semibold">
          {activeFriend.name}
        </h2>

        <p className="text-xs text-green-400">
          {activeFriend.online
            ? "Online"
            : "Offline"}
        </p>
      </div>
    </div>
  );
}

export default ChatHeader;
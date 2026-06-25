function ChatLayout({
  sidebar,
  chat,
}) {
  return (
    <div className="h-screen bg-slate-950 text-white flex overflow-hidden">
      {sidebar}

      <div className="flex-1 flex flex-col overflow-hidden">
        {chat}
      </div>
    </div>
  );
}

export default ChatLayout;
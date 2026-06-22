function MessageList({
  activeFriend,
  chatMessages,
  messagesEndRef,
  currentUser,
}) {
  const messages =
    chatMessages[activeFriend?.id] || [];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-4">

        {messages.map((message) => {

          const isMe =
            message.sender_id === currentUser?.id;

          return (
            <div
              key={message.id}
              className={
                isMe
                  ? "flex justify-end"
                  : "flex"
              }
            >
              <div>

                <div
                  className={`text-xs text-slate-500 mb-1 ${
                    isMe
                      ? "text-right"
                      : ""
                  }`}
                >
                  {new Date(
                    message.created_at
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div
                  className={`px-4 py-3 rounded-xl ${
                    isMe
                      ? "bg-blue-600"
                      : "bg-slate-800"
                  }`}
                >
                  {message.message_text}
                </div>

              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>

      </div>
    </div>
  );
}

export default MessageList;
function MessageList({
  activeFriend,
  chatMessages,
  messagesEndRef,
}) {
  const messages =
    chatMessages[activeFriend?.id] || [];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-4">

        {messages.map((message) => (

          <div
            key={message.id}
            className={
              message.sender === "me"
                ? "flex justify-end"
                : "flex"
            }
          >
            <div>

              <div
                className={`text-xs text-slate-500 mb-1 ${
                  message.sender === "me"
                    ? "text-right"
                    : ""
                }`}
              >
                {message.time}
              </div>

              <div
                className={`px-4 py-3 rounded-xl ${
                  message.sender === "me"
                    ? "bg-blue-600"
                    : "bg-slate-800"
                }`}
              >
                {message.text}
              </div>

            </div>
          </div>

        ))}

        <div ref={messagesEndRef}></div>

      </div>
    </div>
  );
}

export default MessageList;
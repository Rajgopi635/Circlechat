function MessageList({
  activeFriend,
  chatMessages,
  messagesEndRef,
}) {
  const messages =
    chatMessages[activeFriend?.id] || [];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-6">
      <div className="space-y-4">

        {messages.map((message) => (

          <div
            key={message.id}
            className={
              message.sender === "me"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >

            <div
              className={`max-w-[85%] md:max-w-[70%] flex flex-col ${
                message.sender === "me"
                  ? "items-end"
                  : "items-start"
              }`}
            >

              {/* TEXT */}

              {(!message.message_type ||
                message.message_type === "text") && (

                <div
                  className={`px-4 py-3 rounded-2xl break-words ${
                    message.sender === "me"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-slate-800 text-white rounded-bl-md"
                  }`}
                >
                  {message.text}
                </div>

              )}

              {/* IMAGE */}

              {message.message_type ===
                "image" && (

                <img
                  src={message.file_url}
                  alt="Chat"
                  className="rounded-xl max-w-full md:max-w-xs cursor-pointer border border-slate-700"
                />

              )}

              {/* FILE */}

              {message.message_type ===
                "file" && (

                <a
                  href={message.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`rounded-xl px-4 py-3 break-all ${
                    message.sender === "me"
                      ? "bg-blue-600"
                      : "bg-slate-800"
                  }`}
                >

                  📄 {message.file_name}

                </a>

              )}

              {/* TIME */}

              <div
                className={`mt-1 flex items-center gap-1 text-[11px] text-slate-400 ${
                  message.sender === "me"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <span>
                  {message.time}
                </span>

                {message.sender === "me" && (

                  <span
                    className={
                      message.is_read
                        ? "text-sky-400"
                        : "text-slate-500"
                    }
                  >
                    {message.is_read
                      ? "✓✓"
                      : "✓"}
                  </span>

                )}

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
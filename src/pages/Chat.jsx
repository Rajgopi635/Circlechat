import { useState, useRef, useEffect } from "react";

// Remove this entire lucide-react import

import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageList from "../components/MessageList";
import Sidebar from "../components/Sidebar";

function Chat() {
  const friends = [
    {
      id: 1,
      name: "John Doe",
      online: true,
    },

    {
      id: 2,
      name: "Alex Smith",
      online: false,
    },

    {
      id: 3,
      name: "Sarah Wilson",
      online: true,
    },
  ];

  const initialMessages = {
    1: [
      {
        id: 1,
        text: "Hello 👋",
        sender: "friend",
        time: "10:25 AM",
      },

      {
        id: 2,
        text: "How are you?",
        sender: "friend",
        time: "10:26 AM",
      },
    ],

    2: [
      {
        id: 1,
        text: "Are you free today?",
        sender: "friend",
        time: "11:00 AM",
      },

      {
        id: 2,
        text: "Let's catch up.",
        sender: "friend",
        time: "11:02 AM",
      },
    ],

    3: [
      {
        id: 1,
        text: "Meeting at 5 PM?",
        sender: "friend",
        time: "09:15 AM",
      },

      {
        id: 2,
        text: "Don't forget 😄",
        sender: "friend",
        time: "09:16 AM",
      },
    ],
  };

  const [activeFriend, setActiveFriend] =
    useState(friends[0]);
    const [chatMessages, setChatMessages] =
  useState(initialMessages);

const [newMessage, setNewMessage] =
  useState("");

  const [searchTerm, setSearchTerm] =
  useState("");

  const messagesEndRef = useRef(null);

const filteredFriends = friends.filter(
  (friend) =>
    friend.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
);

const sendMessage = () => {
  if (!newMessage.trim()) return;

  const newMsg = {
    id: Date.now(),
    text: newMessage,
    sender: "me",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setChatMessages({
    ...chatMessages,
    [activeFriend.id]: [
      ...chatMessages[activeFriend.id],
      newMsg,
    ],
  });

  setNewMessage("");
};

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [chatMessages, activeFriend]);

  return (
    <div className="h-screen flex bg-slate-950 text-white">

      <Sidebar
  friends={friends}
  activeFriend={activeFriend}
  setActiveFriend={setActiveFriend}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>

      {/* Chat Area */}

      <div className="flex-1 flex flex-col">

        <ChatHeader activeFriend={activeFriend} />

        <MessageList
  activeFriend={activeFriend}
  chatMessages={chatMessages}
  messagesEndRef={messagesEndRef}
/>

        <MessageInput
  newMessage={newMessage}
  setNewMessage={setNewMessage}
  sendMessage={sendMessage}
/>

      </div>

    </div>
  );
}

export default Chat;
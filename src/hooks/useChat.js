import { useState, useRef } from "react";

export function useChat() {
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] =
    useState(null);
  const [currentUser, setCurrentUser] =
    useState(null);

  const [chatMessages, setChatMessages] =
    useState({});

  const [newMessage, setNewMessage] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [unreadCounts, setUnreadCounts] =
    useState({});

  const messagesEndRef = useRef(null);

  return {
    friends,
    setFriends,

    activeFriend,
    setActiveFriend,

    currentUser,
    setCurrentUser,

    chatMessages,
    setChatMessages,

    newMessage,
    setNewMessage,

    searchTerm,
    setSearchTerm,

    isTyping,
    setIsTyping,

    unreadCounts,
    setUnreadCounts,

    messagesEndRef,
  };
}
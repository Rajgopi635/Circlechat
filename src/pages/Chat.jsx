import { useState, useRef, useEffect } from "react";

import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageList from "../components/MessageList";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function Chat() {
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [chatMessages, setChatMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
  console.log("========== CURRENT USER ==========");
  console.log(currentUser);

  console.log("========== ACTIVE FRIEND ==========");
  console.log(activeFriend);
}, [currentUser, activeFriend]);

  useEffect(() => {
    const loadUsers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setCurrentUser(user);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      const formattedUsers = data.map((u) => ({
        id: u.id,
        name: u.username || u.email,
        online: true,
      }));

      setFriends(formattedUsers);

      if (formattedUsers.length > 0) {
        setActiveFriend(formattedUsers[0]);
      }
    };

    loadUsers();
  }, []);

  const loadMessages = async () => {
  if (!activeFriend || !currentUser) return;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const filtered = data.filter(
    (msg) =>
      (msg.sender_id === currentUser.id &&
        msg.receiver_id === activeFriend.id) ||
      (msg.sender_id === activeFriend.id &&
        msg.receiver_id === currentUser.id)
  );

  const formatted = filtered.map((msg) => ({
    id: msg.id,
    text: msg.message_text,
    sender:
      msg.sender_id === currentUser.id
        ? "me"
        : "friend",
    time: new Date(msg.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  setChatMessages({
    [activeFriend.id]: formatted,
  });
};

  useEffect(() => {
    loadMessages();
  }, [activeFriend, currentUser]);

  const sendMessage = async () => {
    if (
      !newMessage.trim() ||
      !activeFriend ||
      !currentUser
    )
      return;

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: activeFriend.id,
          message_text: newMessage,
        },
      ]);

    if (error) {
      console.error(error);
      return;
    }

    setNewMessage("");
    loadMessages();
  };

  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
  .channel("chat-room")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "messages",
    },
    (payload) => {
  console.log("🔥 REALTIME RECEIVED");
  console.log(payload);

  const msg = payload.new;

  if (
    (msg.sender_id === currentUser?.id &&
      msg.receiver_id === activeFriend?.id) ||
    (msg.sender_id === activeFriend?.id &&
      msg.receiver_id === currentUser?.id)
  ) {
    loadMessages();
  }
}
  )
  .subscribe((status) => {
    console.log("CHANNEL STATUS:", status);
  });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, activeFriend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  return (
    <div className="h-screen flex bg-slate-950 text-white">
      <Sidebar
        friends={friends}
        activeFriend={activeFriend}
        setActiveFriend={setActiveFriend}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="flex-1 flex flex-col">
        {activeFriend && (
          <ChatHeader activeFriend={activeFriend} />
        )}

        {activeFriend && (
          <MessageList
            activeFriend={activeFriend}
            chatMessages={chatMessages}
            messagesEndRef={messagesEndRef}
          />
        )}

        {activeFriend && (
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
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
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  
  useState(false);

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
  online: u.is_online,
  lastSeen: u.last_seen,
}));

      setFriends(formattedUsers);

      if (formattedUsers.length > 0) {
        setActiveFriend(formattedUsers[0]);
      }
    };

    loadUsers();
  }, []);
const loadFriends = async () => {
  if (!currentUser) return;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .neq("id", currentUser.id);

  if (error) {
    console.error(error);
    return;
  }

  const formattedUsers = data.map((u) => ({
    id: u.id,
    name: u.username || u.email,
    online: u.is_online,
    lastSeen: u.last_seen,
  }));

  setFriends(formattedUsers);
};

useEffect(() => {
  if (currentUser) {
    loadFriends();
  }
}, [currentUser]);

useEffect(() => {
  loadUnreadCounts();
}, [currentUser]);

const loadUnreadCounts = async () => {
  if (!currentUser) return;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("receiver_id", currentUser.id)
    .eq("is_read", false);

  if (error) {
    console.error(error);
    return;
  }

  const counts = {};

  data.forEach((msg) => {
    counts[msg.sender_id] =
      (counts[msg.sender_id] || 0) + 1;
  });

  setUnreadCounts(counts);
};

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
  const markMessagesAsRead = async () => {
    if (!activeFriend || !currentUser) return;

    await supabase
      .from("messages")
      .update({
        is_read: true,
      })
      .eq("sender_id", activeFriend.id)
      .eq("receiver_id", currentUser.id)
      .eq("is_read", false);

    loadUnreadCounts();
  };

  markMessagesAsRead();
}, [activeFriend, currentUser]);

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
loadUnreadCounts();
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
  if (!currentUser) return;

  const statusChannel = supabase
    .channel("user-status")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "users",
      },
      async () => {
        console.log("🟢 USER STATUS UPDATED");

        await loadFriends();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(statusChannel);
  };
}, [currentUser]);

useEffect(() => {
  if (!currentUser || !activeFriend) return;

  const typingChannel = supabase
    .channel("typing-indicator")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "typing_status",
      },
      (payload) => {
        const row = payload.new;

        if (
          row.user_id === activeFriend.id &&
          row.receiver_id === currentUser.id
        ) {
          setIsTyping(row.is_typing);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(typingChannel);
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
  unreadCounts={unreadCounts}
  activeFriend={activeFriend}
  setActiveFriend={setActiveFriend}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  currentUser={currentUser}
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

        {isTyping && (
  <div className="px-6 py-2 text-sm text-green-400 italic">
    {activeFriend.name} is typing...
  </div>
)}

        {activeFriend && (
          <MessageInput
  newMessage={newMessage}
  setNewMessage={setNewMessage}
  sendMessage={sendMessage}
  currentUser={currentUser}
  activeFriend={activeFriend}
/>
        )}
      </div>
    </div>
  );
}

export default Chat;
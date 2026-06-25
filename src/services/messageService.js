import { supabase } from "../lib/supabase";

/**
 * Get Chat Messages
 */
export async function getMessages(currentUserId, friendId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data
    .filter(
      (msg) =>
        (msg.sender_id === currentUserId &&
          msg.receiver_id === friendId) ||
        (msg.sender_id === friendId &&
          msg.receiver_id === currentUserId)
    )
    .map((msg) => ({
      id: msg.id,
      text: msg.message_text,
      sender:
        msg.sender_id === currentUserId
          ? "me"
          : "friend",
      time: new Date(
        msg.created_at
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
}

/**
 * Send Message
 */
export async function sendChatMessage(
  senderId,
  receiverId,
  text
) {
  return await supabase
    .from("messages")
    .insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        message_text: text,
      },
    ]);
}

/**
 * Mark Messages Read
 */
export async function markMessagesAsRead(
  senderId,
  receiverId
) {
  return await supabase
    .from("messages")
    .update({
      is_read: true,
    })
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .eq("is_read", false);
}

/**
 * Unread Counts
 */
export async function getUnreadCounts(
  currentUserId
) {
  const { data, error } = await supabase
    .from("messages")
    .select("sender_id")
    .eq("receiver_id", currentUserId)
    .eq("is_read", false);

  if (error) throw error;

  const counts = {};

  data.forEach((msg) => {
    counts[msg.sender_id] =
      (counts[msg.sender_id] || 0) + 1;
  });

  return counts;
}

/**
 * Realtime Messages
 */
export function subscribeMessages(
  callback
) {
  return supabase
    .channel("messages-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      callback
    )
    .subscribe();
}
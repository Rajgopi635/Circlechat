import { supabase } from "../lib/supabase";

/**
 * User started typing
 */
export async function startTyping(userId, receiverId) {
  return await supabase
    .from("typing_status")
    .upsert({
      user_id: userId,
      receiver_id: receiverId,
      is_typing: true,
    });
}

/**
 * User stopped typing
 */
export async function stopTyping(userId, receiverId) {
  return await supabase
    .from("typing_status")
    .upsert({
      user_id: userId,
      receiver_id: receiverId,
      is_typing: false,
    });
}

/**
 * Realtime Typing Listener
 */
export function subscribeTyping(callback) {
  return supabase
    .channel("typing-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "typing_status",
      },
      callback
    )
    .subscribe();
}
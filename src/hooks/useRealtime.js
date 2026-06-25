import { useEffect } from "react";
import { supabase } from "../lib/supabase";

function useRealtime({
  currentUser,
  activeFriend,
  onMessagesChange,
  onFriendsChange,
}) {
  useEffect(() => {
    if (!currentUser) return;

    const messageChannel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          onMessagesChange?.();
        }
      )
      .subscribe();

    const userChannel = supabase
      .channel("users-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
        },
        () => {
          onFriendsChange?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(userChannel);
    };
  }, [
    currentUser,
    activeFriend,
    onMessagesChange,
    onFriendsChange,
  ]);
}

export default useRealtime;
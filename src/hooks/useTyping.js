import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

import {
  startTyping,
  stopTyping,
  subscribeTyping,
} from "../services/typingService";

function useTyping(currentUser, activeFriend) {
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeout = useRef(null);

  const handleTyping = async () => {
    if (!currentUser || !activeFriend) return;

    await startTyping(
      currentUser.id,
      activeFriend.id
    );

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(
      async () => {
        await stopTyping(
          currentUser.id,
          activeFriend.id
        );
      },
      2000
    );
  };

  useEffect(() => {
    if (!currentUser || !activeFriend) return;

    const channel =
      subscribeTyping((payload) => {
        const row = payload.new;

        if (
          row.user_id === activeFriend.id &&
          row.receiver_id === currentUser.id
        ) {
          setIsTyping(row.is_typing);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, activeFriend]);

  return {
    isTyping,
    handleTyping,
  };
}

export default useTyping;
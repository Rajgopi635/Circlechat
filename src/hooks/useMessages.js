import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

import {
  getMessages,
  sendChatMessage,
  markMessagesAsRead,
  getUnreadCounts,
  subscribeMessages,
} from "../services/messageService";

function useMessages(currentUser, activeFriend) {
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * Load Messages
   */
  const refreshMessages = useCallback(async () => {
    if (!currentUser || !activeFriend) return;

    try {
      setLoading(true);

      const data = await getMessages(
        currentUser.id,
        activeFriend.id
      );

      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, activeFriend]);

  /**
   * Load Unread Counts
   */
  const refreshUnread = useCallback(async () => {
    if (!currentUser) return;

    try {
      const counts = await getUnreadCounts(
        currentUser.id
      );

      setUnreadCounts(counts);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser]);

  /**
   * Send Message
   */
  const sendMessage = async (text) => {
    if (
      !text.trim() ||
      !currentUser ||
      !activeFriend
    )
      return;

    await sendChatMessage(
      currentUser.id,
      activeFriend.id,
      text
    );

    await refreshMessages();
  };

  /**
   * Mark Read
   */
  const markRead = async () => {
    if (!currentUser || !activeFriend)
      return;

    await markMessagesAsRead(
      activeFriend.id,
      currentUser.id
    );

    setUnreadCounts((prev) => ({
      ...prev,
      [activeFriend.id]: 0,
    }));

    await refreshUnread();
  };

  /**
   * Initial Load
   */
  useEffect(() => {
    refreshMessages();
  }, [refreshMessages]);

  useEffect(() => {
    refreshUnread();
  }, [refreshUnread]);

  /**
   * Active Friend Changed
   */
  useEffect(() => {
    markRead();
  }, [activeFriend]);

  /**
   * Realtime
   */
  useEffect(() => {
    const channel =
      subscribeMessages(async () => {
        await refreshMessages();
        await refreshUnread();
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshMessages, refreshUnread]);

  return {
    messages,
    unreadCounts,
    sendMessage,
    refreshMessages,
    refreshUnread,
    loading,
  };
}

export default useMessages;
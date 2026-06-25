import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import {
  getCurrentUser,
  getFriends,
  subscribeFriends,
} from "../services/friendService";

function useFriends() {
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load Current User + Friends
   */
  const refreshFriends = useCallback(async () => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      const friendList = await getFriends(user.id);

      setFriends(friendList);
    } catch (err) {
      console.error("Friends Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial Load
   */
  useEffect(() => {
    refreshFriends();
  }, [refreshFriends]);

  /**
   * Realtime Friend Updates
   */
  useEffect(() => {
    if (!currentUser) return;

    const channel = subscribeFriends(async () => {
      const friendList = await getFriends(currentUser.id);

      setFriends(friendList);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  return {
    loading,
    friends,
    currentUser,
    refreshFriends,
  };
}

export default useFriends;
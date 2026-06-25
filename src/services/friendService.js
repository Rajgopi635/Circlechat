import { supabase } from "../lib/supabase";

/**
 * Logged in user
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile, error: profileError } =
    await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

  if (profileError) return null;

  return {
    ...user,
    username: profile.username,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    is_online: profile.is_online,
    last_seen: profile.last_seen,
  };
}

/**
 * Get all friends
 */
export async function getFriends(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .neq("id", userId)
    .order("username");

  if (error) throw error;

  return data.map((user) => ({
    id: user.id,
    name: user.username || user.email,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    online: user.is_online,
    lastSeen: user.last_seen,
  }));
}

/**
 * Search Friends
 */
export async function searchFriends(userId, keyword) {
  const friends = await getFriends(userId);

  return friends.filter((friend) =>
    friend.name
      .toLowerCase()
      .includes(keyword.toLowerCase())
  );
}

/**
 * Update Online / Offline
 */
export async function updateOnlineStatus(
  userId,
  status
) {
  const update = {
    is_online: status,
  };

  if (!status) {
    update.last_seen = new Date();
  }

  return await supabase
    .from("users")
    .update(update)
    .eq("id", userId);
}

/**
 * Update Profile
 */
export async function updateProfile(
  userId,
  values
) {
  return await supabase
    .from("users")
    .update(values)
    .eq("id", userId);
}

/**
 * Friends Realtime
 */
export function subscribeFriends(callback) {
  return supabase
    .channel("friends-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "users",
      },
      callback
    )
    .subscribe();
}
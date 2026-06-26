import { supabase } from "../lib/supabase";

// ==========================
// Register User
// ==========================
export const registerUser = async (
  email,
  password,
  username
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { data, error };
  }

  if (data?.user) {
    const { error: profileError } = await supabase
      .from("users")
      .insert([
        {
          id: data.user.id,
          email: email,
          username: username || email.split("@")[0],
          full_name: username || email.split("@")[0],
          avatar_url: "",
          bio: "",
          is_online: true,
          last_seen: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
    }
  }

  return { data, error };
};

// ==========================
// Login User
// ==========================
export const loginUser = async (
  email,
  password
) => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (!error && data?.user) {
    await supabase
      .from("users")
      .update({
        is_online: true,
        last_seen: new Date().toISOString(),
      })
      .eq("id", data.user.id);
  }

  return { data, error };
};

// ==========================
// Logout User
// ==========================
export const logoutUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("users")
      .update({
        is_online: false,
        last_seen: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

  return await supabase.auth.signOut();
};
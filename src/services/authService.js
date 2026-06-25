import { supabase } from "../lib/supabase";

export const registerUser = async (
  email,
  password,
  username
) => {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (error) {
    return { data, error };
  }

  if (data?.user) {
    await supabase.from("users").insert([
      {
        id: data.user.id,
        username:
          username ||
          email.split("@")[0],
        email: email,
      },
    ]);
  }

  return { data, error };
};

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
      })
      .eq("id", data.user.id);
  }

  return { data, error };
};

export const logoutUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("users")
      .update({
        is_online: false,
        last_seen: new Date(),
      })
      .eq("id", user.id);
  }

  return await supabase.auth.signOut();
};
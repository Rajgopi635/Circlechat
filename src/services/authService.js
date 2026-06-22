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
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const logoutUser = async () => {
  return await supabase.auth.signOut();
};
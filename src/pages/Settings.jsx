import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Settings() {
  const [user, setUser] = useState(null);

  const [username, setUsername] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

    const [avatarUrl, setAvatarUrl] =
  useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);

    const { data, error } =
      await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
      console.error(error);
      return;
    }

    setUsername(data.username || "");
    setFullName(data.full_name || "");
    setEmail(data.email || user.email);
    setAvatarUrl(data.avatar_url || "");

    setLoading(false);
  };

const handleAvatarUpload = async (
  event
) => {
  const file =
    event.target.files[0];

  if (!file || !user) return;

  const fileExt =
    file.name.split(".").pop();

  const fileName =
    `${user.id}.${fileExt}`;

  const { error } =
    await supabase.storage
      .from("avatars")
      .upload(
        fileName,
        file,
        {
          upsert: true,
        }
      );

  if (error) {
    console.error(error);
    alert("Upload failed");
    return;
  }

  const { data } =
    supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

  setAvatarUrl(
    data.publicUrl
  );
};

  const saveProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update({
        username: username,
        full_name: fullName,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile Updated Successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Settings
        </h1>

        <div className="mb-8 flex flex-col items-center">

  <img
    src={
      avatarUrl ||
      "https://placehold.co/120x120"
    }
    alt="Avatar"
    className="w-28 h-28 rounded-full object-cover border-4 border-slate-700"
  />

  <input
    type="file"
    accept="image/*"
    onChange={handleAvatarUpload}
    className="mt-4"
  />

</div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

          <div>
            <label className="block mb-2 text-slate-300">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-slate-300">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-slate-300">
              Registered Email
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 opacity-70"
            />
          </div>

          <button
            onClick={saveProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
          >
            Save Profile
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;
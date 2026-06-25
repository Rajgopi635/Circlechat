import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { supabase } from "../lib/supabase";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);
    setEmail(user.email);

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
  setUsername(data.username || "");
  setFullName(data.full_name || "");
  setAvatarUrl(data.avatar_url || "");
}
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

  setLoading(true);

  const { error } = await supabase
    .from("users")
    .update({
      username: username,
      full_name: fullName,
      avatar_url: avatarUrl,
    })
    .eq("id", user.id);

  setLoading(false);

  if (error) {
  alert(error.message);
  return;
}

// Save latest profile locally
localStorage.setItem(
  "circlechat_user",
  JSON.stringify({
    username,
    full_name: fullName,
    email,
    avatar_url: avatarUrl,
  })
);

alert("Profile Updated Successfully");

navigate("/chat");
};

const handleLogout = async () => {
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

  await logoutUser();

  navigate("/");
};

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8">

  <h1 className="text-3xl font-bold">
    My Profile
  </h1>

  <div className="flex gap-3">

    <button
      onClick={() => navigate("/chat")}
      className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
    >
      Back To Chat
    </button>

    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
    >
      Logout
    </button>

  </div>

</div>

        {/* Avatar Section */}

        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Profile Picture
          </h2>

          <img
  src={
    avatarUrl ||
    "https://placehold.co/120x120"
  }
  alt="Avatar"
  className="w-24 h-24 rounded-full object-cover border-4 border-slate-700"
/>

<input
  type="file"
  accept="image/*"
  onChange={handleAvatarUpload}
  className="mt-4"
/>
        </div>

        {/* Account Section */}

        <div className="bg-slate-900 rounded-xl p-6 mb-6">

          <h2 className="text-xl font-semibold mb-4">
            Account Information
          </h2>

          <div className="space-y-4">

            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Username"
              className="w-full p-3 rounded bg-slate-800"
            />

            <input
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Full Name"
              className="w-full p-3 rounded bg-slate-800"
            />

            <input
              value={email}
              disabled
              className="w-full p-3 rounded bg-slate-800 opacity-70"
            />

            <button
  onClick={saveProfile}
  disabled={loading}
  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
>
  {loading ? "Saving..." : "Save Changes"}
</button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;
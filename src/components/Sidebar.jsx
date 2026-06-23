import { Search } from "lucide-react";

function Sidebar({
  friends,
  unreadCounts,
  activeFriend,
  setActiveFriend,
  searchTerm,
  setSearchTerm,
  currentUser,
}) {
  const filteredFriends = friends.filter(
    (friend) =>
      friend.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">

      <div className="p-5 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          CircleChat
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">

        <div className="p-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search friends..."
              className="w-full bg-slate-800 rounded-lg py-2 pl-10 pr-3 outline-none"
            />

          </div>

        </div>

        <div className="p-4">

          <h2 className="text-slate-400 text-sm mb-3">
            Friends
          </h2>

          <div className="space-y-2">

            {filteredFriends.map((friend) => (

              <div
                key={friend.id}
                onClick={() =>
                  setActiveFriend(friend)
                }
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                  activeFriend?.id === friend.id
                    ? "bg-blue-600 shadow-lg shadow-blue-500/30"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >

                <div
                  className={`w-3 h-3 rounded-full ${
                    friend.online
                      ? "bg-green-500"
                      : "bg-slate-500"
                  }`}
                ></div>

                <div>
  <div className="flex items-center gap-2">
    <span>{friend.name}</span>

    {unreadCounts?.[friend.id] > 0 && (
      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {unreadCounts[friend.id]}
      </span>
    )}
  </div>

  <div className="text-xs text-slate-400">
    {friend.online
      ? "Online"
      : friend.lastSeen
      ? `Last seen ${new Date(
          friend.lastSeen
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "Offline"}
  </div>
</div>

              </div>

            ))}

          </div>

        </div>

      </div>

      <div className="p-4 border-t border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-blue-600"></div>

          <div>

            <p className="font-medium">
  {currentUser?.user_metadata?.username ||
    currentUser?.email?.split("@")[0]}
</p>

<p className="text-xs text-green-400">
  Online
</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;
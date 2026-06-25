function DesktopSidebar({
  children,
}) {
  return (
    <div
      className="
        hidden
        md:flex
        w-72
        bg-slate-900
        border-r
        border-slate-800
        flex-col
      "
    >
      {children}
    </div>
  );
}

export default DesktopSidebar;
function MobileSidebar({
  isOpen,
  onClose,
  children,
}) {
  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed
          top-0
          left-0
          h-full
          w-72
          bg-slate-900
          z-50
          transform
          transition-transform
          duration-300
          md:hidden
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {children}
      </div>
    </>
  );
}

export default MobileSidebar;
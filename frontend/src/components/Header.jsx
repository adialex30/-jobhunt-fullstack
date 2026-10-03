export default function Header({
  user,
  onLogout
}) {
  return (
    <header className="w-full bg-[#F9F8F6] border-b border-[#D9CFC7] max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex flex-col cursor-pointer items-center sm:items-start text-center sm:text-left">
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#1c1917] hover:text-[#C9B59C] transition-colors leading-none">
            forcemajeure.bzh
          </h1>
          <span className="text-[9px] sm:text-[10px] font-mono text-[#57534e] uppercase tracking-widest mt-1">
            CAREER NETWORK & AUTH PORTAL
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
          {user && (
            <>
              <div className="border border-[#1c1917] bg-[#C9B59C] text-[#1c1917] font-mono text-[11px] px-3 py-1 font-bold uppercase tracking-wider">
                ROLE: {user.role ? user.role.replace('_', ' ') : 'JOB SEEKER'}
              </div>

              <div className="flex items-center gap-2 pl-3 border-l border-[#D9CFC7]">
                <span className="text-[#1c1917] font-bold truncate max-w-[120px]">{user.name}</span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-2.5 py-1 border border-[#D9CFC7] text-[#57534e] hover:text-[#1c1917] hover:border-[#1c1917] bg-[#EFE9E3] font-bold text-xs"
                >
                  LOGOUT
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

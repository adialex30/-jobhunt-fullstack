import React, { useState } from 'react';

export default function AuraHeader({
  savedCount,
  onOpenSaved,
  searchQuery,
  onSearchChange,
  activeNav,
  setActiveNav
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
      <div className="h-20 max-w-[1360px] mx-auto px-gutter-lg flex items-center justify-between gap-space-lg">

        {/* Logo and Brand */}
        <div className="flex items-center gap-space-md shrink-0 cursor-pointer">
          <img
            alt="Aura Talent Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkkuBV4BwMdqsMLnq6TYdrxOT73AmmJAtaXYp62F_eJzPZ2wL7XUMVCP-jgn1hibX_Ez1oXSH3ZazNuZYdnKnyMBPeGL3QG9hJ5niti4Ctvzj9ju1TfBL3y1oxOGfudvuYSTOG5Iq5BG6UjuwdUzAtsIH6wPjPuCYFRB_mojv_O2J144T8wW8C3HYSMbeTXTzpmPyi9es6Bgm0RiIgGOxL_a-E2W0zZ1tqpBJJP2y_BqvlZV4FotZO"
          />
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight hidden sm:inline-block">
            Aura Talent
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-space-lg">
          {[
            { id: 'discover', label: 'Discover' },
            { id: 'curated-roles', label: 'Curated Roles' },
            { id: 'companies', label: 'Companies' },
            { id: 'salary-insights', label: 'Salary Insights' },
            { id: 'career-compass', label: 'Career Compass' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`transition-colors pb-1 ${
                activeNav === item.id
                  ? 'text-primary font-title-md border-b-2 border-primary'
                  : 'font-body-md text-body-md text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Search and Actions */}
        <div className="flex items-center gap-space-md flex-1 max-w-xs justify-end">
          <div className="hidden md:flex items-center bg-surface-container-lowest border border-outline-variant rounded-full px-space-md py-space-xs w-full shadow-[0px_2px_8px_-2px_rgba(34,32,30,0.04)] focus-within:ring-1 focus-within:ring-primary">
            <span className="material-symbols-outlined text-outline text-[18px] mr-space-xs select-none">
              search
            </span>
            <input
              className="bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface placeholder:text-outline w-full"
              placeholder="Search roles, disciplines..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-space-sm shrink-0">
            {/* Bookmarks */}
            <button
              aria-label="Saved bookmarks"
              onClick={onOpenSaved}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative"
            >
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
              {savedCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary"></span>
            </button>

            {/* Profile Avatar */}
            <div className="pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-outline-variant ring-1 ring-surface-container-high cursor-pointer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNKAti8C5geDQ8G07eu5sJkBXwFCANxx6UsqXNvOwIVtX1CYOh38dI0vghKlJyWsTEpy1jQj1MrwWs5kndmlSG-PdMghwtVhILItpMnpcWqFhRYKuovgIxpQ1th2xX7K03dhRIlNGDNSa50TBQ1cgeKxGa6LGYxox7X2sYhUTFOHT0igbgux7nGqUR2y-Wa_3tEQvcxM4ConQDQegm6r34E5LFA9kyN5H70IAQG9H-DN3tDuDe0ZLp"
              />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

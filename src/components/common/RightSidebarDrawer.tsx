import { useEffect, useCallback, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/store/authSlice";
import {
  X,
  MapPin,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Navigation2,
  ChevronRight,
} from "@/utils/icons";
import { NAV_ITEMS, NAV_GROUPS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";

interface RightSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RightSidebarDrawer({
  isOpen,
  onClose,
}: RightSidebarDrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState("Jakarta Central Hub");
  const [isHubDropdownOpen, setIsHubDropdownOpen] = useState(false);
  const prevPathRef = useRef(location.pathname);

  // Close drawer ONLY when the route actually changes
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      onClose();
    }
  }, [location.pathname, onClose]);

  // Prevent background scrolling and body interaction when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLogout = useCallback(() => {
    onClose();
    dispatch(clearAuth());
    navigate("/login");
  }, [dispatch, navigate, onClose]);

  const handleNavClick = useCallback(
    (to: string) => {
      onClose();
      navigate(to);
    },
    [navigate, onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden justify-end animate-fadeIn">
      {/* ── Unclickable Backdrop Overlay ── */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
        aria-label="Close drawer"
      />

      {/* ── Right-Side Sliding Panel ── */}
      <aside
        className="relative w-[300px] md:w-[400px] max-w-[500px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 animate-slideLeft sm:rounded-l-[28px] border-l border-neutral-100"
        style={{
          paddingTop: "max(env(safe-area-inset-top, 0px), 16px)",
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
        }}
      >
        {/* ── Top Header: Brand Logo + Close Button ── */}
        <div className="px-5 pt-2 pb-3 flex flex-col gap-3 border-b border-neutral-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black italic tracking-tighter text-neutral-900 font-sans">
                Indo<span className="text-[#0D5C4D]">.Cab</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-50 text-[#0D5C4D] border border-emerald-200/60 rounded-lg">
                Admin
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Close Menu"
              aria-label="Close Menu"
            >
              <X size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* ── Middle: Scrollable Navigation Items & Featured Callout ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
          {/* Navigation Groups */}
          <nav className="space-y-4">
            {NAV_GROUPS.map(({ key, label }) => {
              const items = NAV_ITEMS.filter((n) => n.group === key);
              if (!items.length) return null;

              return (
                <div key={key} className="space-y-1">
                  {label && (
                    <div className="px-3 pt-1 pb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                      {label}
                    </div>
                  )}

                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.to === "/"
                          ? location.pathname === "/"
                          : location.pathname.startsWith(item.to);

                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.to === "/"}
                          onClick={() => handleNavClick(item.to)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 group ${
                            isActive
                              ? "bg-[#edf7f5] text-[#0D5C4D] font-bold shadow-2xs"
                              : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100/70"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? "bg-[#0D5C4D] text-white shadow-2xs"
                                : "bg-neutral-100 text-neutral-500 group-hover:bg-white group-hover:text-neutral-800"
                            }`}
                          >
                            <Icon
                              size={15}
                              strokeWidth={isActive ? 2.3 : 1.8}
                            />
                          </div>
                          <span className="flex-1 truncate">{item.label}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-lg bg-[#0D5C4D] shrink-0" />
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* ── Bottom Section: Profile & Account Controls ── */}
        <div className="px-4 pt-3 border-t border-neutral-100 space-y-2 shrink-0 bg-white">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-neutral-400 font-medium">
              Need assistance?
            </span>
            <button
              type="button"
              onClick={() => handleNavClick("/support")}
              className="text-[11px] font-bold text-[#0D5C4D] hover:underline cursor-pointer"
            >
              Help & Support
            </button>
          </div>

          {/* Account Menu Accordion Container (Reference style) */}
          {isAccountMenuOpen && (
            <div className="bg-white border border-neutral-200 rounded-lg p-3 space-y-2 animate-fadeIn shadow-xl">
              {/* User details header inside menu */}
              <div className="pb-2.5 mb-1.5 border-b border-neutral-100 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#0D5C4D] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  SA
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="font-bold text-xs text-neutral-900 truncate">
                    Super Admin
                  </span>
                  <span className="text-[11px] text-neutral-400 truncate">
                    admin@indo.cab
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => handleNavClick("/profile")}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <User
                    size={15}
                    className="text-neutral-500 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>Profile Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick("/settings")}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <Settings
                    size={15}
                    className="text-neutral-500 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>Organization Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick("/support")}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <HelpCircle
                    size={15}
                    className="text-neutral-500 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>Support & Help</span>
                </button>
              </div>

              <div className="border-t border-neutral-100 my-2" />

              {/* LOG OUT Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 px-3 rounded-lg bg-rose-50/80 hover:bg-rose-100 border border-rose-200/90 text-rose-600 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <LogOut size={14} strokeWidth={2.2} />
                <span>LOG OUT</span>
              </button>
            </div>
          )}

          {/* Main User Profile Card Button Trigger */}
          <button
            type="button"
            onClick={() => setIsAccountMenuOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
              isAccountMenuOpen
                ? "bg-neutral-100 border-neutral-300 ring-2 ring-neutral-200/60"
                : "bg-neutral-50/90 hover:bg-neutral-100 border-neutral-200/80"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#0D5C4D] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                SA
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="font-bold text-xs text-neutral-900 truncate">
                  Admin Profile
                </span>
                <span className="text-[11px] font-medium text-neutral-400 truncate">
                  Manage org
                </span>
              </div>
            </div>
            <ChevronDown
              size={13}
              className={`text-neutral-400 shrink-0 transition-transform duration-200 ${
                isAccountMenuOpen ? "rotate-180 text-neutral-700" : ""
              }`}
            />
          </button>
        </div>
      </aside>
    </div>
  );
}

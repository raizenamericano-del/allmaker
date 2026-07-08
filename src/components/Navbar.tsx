import { Link, useLocation } from "react-router";
import { useTranslation } from "@/stores/i18nStore";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/tools", label: t("nav.tools") },
    { path: "/about", label: t("nav.about") },
    { path: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] backdrop-blur-2xl bg-[#0a0a0a]/70 border-b border-[#ff0040]/15">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-orbitron font-black text-lg sm:text-xl tracking-[0.12em] text-[#f0f0f0] group-hover:text-[#ff0040] transition-colors duration-300">
            DARKFORGE
          </span>
          <span className="font-orbitron font-bold text-lg sm:text-xl tracking-[0.08em] text-[#ff0040] group-hover:text-[#f0f0f0] transition-colors duration-300">
            FILES
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 text-xs tracking-[0.1em] uppercase transition-all duration-300 rounded-lg ${
                isActive(link.path)
                  ? "text-[#ff0040] bg-[#ff0040]/10"
                  : "text-[#f0f0f0]/60 hover:text-[#ff0040] hover:bg-[#ff0040]/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-[#ff0040]/20 mx-2" />
          <LanguageSwitcher />
          <div className="w-px h-5 bg-[#ff0040]/20 mx-2" />
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-wider text-[#f0f0f0]/70 hover:text-[#ff0040] transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[80px] truncate">{user.name || "User"}</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-[#f0f0f0]/50 hover:text-[#ff0040] hover:bg-[#ff0040]/10"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 text-xs tracking-[0.1em] uppercase bg-[#ff0040] text-white rounded-full hover:bg-[#c40030] hover:scale-105 transition-all duration-300 font-medium"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#f0f0f0]/70 hover:text-[#ff0040] transition-colors"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-[#ff0040]/15 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm tracking-wider uppercase rounded-lg ${
                    isActive(link.path)
                      ? "text-[#ff0040] bg-[#ff0040]/10"
                      : "text-[#f0f0f0]/60 hover:text-[#ff0040] hover:bg-[#ff0040]/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#ff0040]/10 flex items-center justify-between">
                <LanguageSwitcher />
                {user ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-[#f0f0f0]/50 hover:text-[#ff0040]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("nav.logout")}
                  </Button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-5 py-2 text-xs tracking-wider uppercase bg-[#ff0040] text-white rounded-full"
                  >
                    {t("nav.login")}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

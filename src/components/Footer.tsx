import { Link } from "react-router";
import { useTranslation } from "@/stores/i18nStore";
import { Github, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  const toolLinks = [
    { path: "/tools/size-mutator", label: t("tools.sizeMutator") },
    { path: "/tools/archive-forge", label: t("tools.archiveForge") },
    { path: "/tools/pdf-lab", label: t("tools.pdfLab") },
    { path: "/tools/image-forge", label: t("tools.imageForge") },
    { path: "/tools/audio-forge", label: t("tools.audioForge") },
    { path: "/tools/video-forge", label: t("tools.videoForge") },
  ];

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/tools", label: t("nav.tools") },
    { path: "/about", label: t("nav.about") },
    { path: "/contact", label: t("nav.contact") },
  ];

  const legalLinks = [
    { path: "/privacy", label: t("footer.privacy") },
    { path: "/terms", label: t("footer.terms") },
    { path: "/faq", label: "FAQ" },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-gradient-to-r from-transparent via-[#ff0040]/30 to-transparent">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#ff0040]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="block">
              <span className="font-orbitron font-black text-2xl tracking-[0.1em] text-[#f0f0f0]">
                DARKFORGE
              </span>
              <span className="font-orbitron font-bold text-2xl tracking-[0.08em] text-[#ff0040] ml-2">
                FILES
              </span>
            </Link>
            <p className="text-sm text-[#f0f0f0]/40 leading-relaxed">
              {t("footer.disclaimer")}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="mailto:raizenamericano@gmail.com"
                className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[#f0f0f0]/50 hover:text-[#ff0040] hover:border-[#ff0040]/40 transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/306942463620"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[#f0f0f0]/50 hover:text-[#ff0040] hover:border-[#ff0040]/40 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[#f0f0f0]/50 hover:text-[#ff0040] hover:border-[#ff0040]/40 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-orbitron font-semibold text-sm tracking-wider text-[#f0f0f0]/80 mb-4">
              {t("footer.navigation")}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#f0f0f0]/40 hover:text-[#ff0040] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-orbitron font-semibold text-sm tracking-wider text-[#f0f0f0]/80 mb-4">
              {t("footer.tools")}
            </h4>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#f0f0f0]/40 hover:text-[#ff0040] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-orbitron font-semibold text-sm tracking-wider text-[#f0f0f0]/80 mb-4">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#f0f0f0]/40 hover:text-[#ff0040] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#ff0040]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#f0f0f0]/30">
            {t("footer.copyright")} · {t("footer.createdBy")} · {t("footer.rights")}
          </p>
          <p className="text-xs text-[#f0f0f0]/20 font-jetbrains">
            v1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}

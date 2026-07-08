import { useTranslation } from "@/stores/i18nStore";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ToolLayoutProps {
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  image: string;
  children: React.ReactNode;
}

export function ToolLayout({ titleKey, subtitleKey, descriptionKey, image, children }: ToolLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      {/* Header */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/90 to-[#0a0a0a]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-xs tracking-wider text-[#f0f0f0]/40 hover:text-[#ff0040] transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("nav.tools")}
            </Link>
            <h1 className="font-orbitron font-black text-2xl sm:text-3xl md:text-4xl tracking-[0.08em] text-[#f0f0f0] text-glow-red-sm mb-2">
              {t(titleKey)}
            </h1>
            <p className="text-sm text-[#ff0040]/70 tracking-wider mb-2">
              {t(subtitleKey)}
            </p>
            <p className="text-xs text-[#f0f0f0]/40 max-w-lg">
              {t(descriptionKey)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {children}
        </div>
      </section>
    </div>
  );
}

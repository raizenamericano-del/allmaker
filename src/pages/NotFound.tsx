import { useTranslation } from "@/stores/i18nStore";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <AlertTriangle className="w-12 h-12 text-[#ff0040]/40 mx-auto mb-6" />
        <h1 className="font-orbitron font-black text-6xl sm:text-8xl text-[#ff0040] mb-4">
          {t("notFound.title")}
        </h1>
        <p className="font-orbitron text-lg tracking-wider text-[#f0f0f0]/60 mb-2">
          {t("notFound.subtitle")}
        </p>
        <p className="text-sm text-[#f0f0f0]/30 mb-8">
          {t("notFound.description")}
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff0040] hover:bg-[#c40030] text-white rounded-full text-xs tracking-wider uppercase font-semibold transition-all">
          <Home className="w-4 h-4" />{t("notFound.back")}
        </Link>
      </motion.div>
    </div>
  );
}

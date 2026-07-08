import { useTranslation } from "@/stores/i18nStore";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Cpu, Database, BarChart3 } from "lucide-react";

export default function Privacy() {
  const { t } = useTranslation();

  const sections = [
    { icon: Cpu, title: t("privacy.local"), desc: t("privacy.local.desc") },
    { icon: Database, title: t("privacy.noStorage"), desc: t("privacy.noStorage.desc") },
    { icon: BarChart3, title: t("privacy.analytics"), desc: t("privacy.analytics.desc") },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff0040]/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-orbitron font-black text-3xl sm:text-4xl tracking-[0.08em] text-[#f0f0f0] mb-4">
              {t("privacy.title")}
            </h1>
            <p className="text-sm text-[#f0f0f0]/50 leading-relaxed mb-10">
              {t("privacy.description")}
            </p>
          </motion.div>

          <div className="space-y-6">
            {sections.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="glass-panel rounded-xl p-6 neon-border-left">
                  <Icon className="w-5 h-5 text-[#ff0040] mb-3" />
                  <h3 className="font-orbitron font-semibold text-sm tracking-wider text-[#f0f0f0] mb-2">{s.title}</h3>
                  <p className="text-xs text-[#f0f0f0]/50 leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

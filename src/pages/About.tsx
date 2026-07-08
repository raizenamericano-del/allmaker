import { useTranslation } from "@/stores/i18nStore";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Cpu, Shield, Zap, Gift, Mail, MessageCircle, User } from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const features = [
    { icon: Cpu, title: t("about.localProcessing"), desc: t("about.localProcessing.desc") },
    { icon: Shield, title: t("about.privacy"), desc: t("about.privacy.desc") },
    { icon: Zap, title: t("about.fast"), desc: t("about.fast.desc") },
    { icon: Gift, title: t("about.free"), desc: t("about.free.desc") },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff0040]/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl tracking-[0.08em] text-[#f0f0f0] mb-4">
              {t("about.title")}
            </h1>
            <p className="text-sm text-[#ff0040]/60 tracking-wider mb-6">{t("about.subtitle")}</p>
            <p className="text-sm sm:text-base text-[#f0f0f0]/60 max-w-2xl leading-relaxed">
              {t("about.description")}
            </p>
          </motion.div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="glass-panel rounded-xl p-6 neon-border-left hover:border-[#ff0040]/40 transition-all duration-300"
                >
                  <Icon className="w-6 h-6 text-[#ff0040] mb-3" />
                  <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-2">{f.title}</h3>
                  <p className="text-xs text-[#f0f0f0]/50 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Developer Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-panel rounded-xl p-8 mt-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#ff0040]/10 border border-[#ff0040]/20 flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7 text-[#ff0040]" />
            </div>
            <h3 className="font-orbitron font-bold text-lg tracking-wider text-[#f0f0f0] mb-1">
              {t("about.developer.name")}
            </h3>
            <p className="text-xs text-[#ff0040]/60 tracking-wider mb-2">{t("about.developer.role")}</p>
            <p className="text-sm text-[#f0f0f0]/50 mb-6">{t("about.developer.bio")}</p>
            <div className="flex items-center justify-center gap-3">
              <a href="mailto:raizenamericano@gmail.com"
                className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-lg text-xs text-[#f0f0f0]/60 hover:text-[#ff0040] hover:border-[#ff0040]/30 transition-all">
                <Mail className="w-3.5 h-3.5" />Email
              </a>
              <a href="https://wa.me/306942463620" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-lg text-xs text-[#f0f0f0]/60 hover:text-[#ff0040] hover:border-[#ff0040]/30 transition-all">
                <MessageCircle className="w-3.5 h-3.5" />WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

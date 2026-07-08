import { Link } from "react-router";
import { useTranslation } from "@/stores/i18nStore";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Zap,
  FileArchive,
  FileImage,
  FileAudio,
  FileVideo,
  FileSearch,
  Hash,
  Fingerprint,
  Layers,
  ShieldCheck,
  Maximize2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const tools = [
  {
    id: "size-mutator",
    titleKey: "tools.sizeMutator",
    descKey: "tools.sizeMutator.desc",
    image: "/images/tool-size-mutator.jpg",
    icon: Maximize2,
    href: "/tools/size-mutator",
  },
  {
    id: "archive-forge",
    titleKey: "tools.archiveForge",
    descKey: "tools.archiveForge.desc",
    image: "/images/tool-archive-forge.jpg",
    icon: FileArchive,
    href: "/tools/archive-forge",
  },
  {
    id: "pdf-lab",
    titleKey: "tools.pdfLab",
    descKey: "tools.pdfLab.desc",
    image: "/images/tool-pdf-lab.jpg",
    icon: FileSearch,
    href: "/tools/pdf-lab",
  },
  {
    id: "image-forge",
    titleKey: "tools.imageForge",
    descKey: "tools.imageForge.desc",
    image: "/images/tool-image-forge.jpg",
    icon: FileImage,
    href: "/tools/image-forge",
  },
  {
    id: "audio-forge",
    titleKey: "tools.audioForge",
    descKey: "tools.audioForge.desc",
    image: "/images/tool-audio-forge.jpg",
    icon: FileAudio,
    href: "/tools/audio-forge",
  },
  {
    id: "video-forge",
    titleKey: "tools.videoForge",
    descKey: "tools.videoForge.desc",
    image: "/images/tool-video-forge.jpg",
    icon: FileVideo,
    href: "/tools/video-forge",
  },
  {
    id: "deep-scan",
    titleKey: "tools.deepScan",
    descKey: "tools.deepScan.desc",
    image: "/images/tool-deep-scan.jpg",
    icon: ShieldCheck,
    href: "/tools/deep-scan",
  },
  {
    id: "hash-gen",
    titleKey: "tools.hashGen",
    descKey: "tools.hashGen.desc",
    image: "/images/tool-hash-gen.jpg",
    icon: Hash,
    href: "/tools/hash-generator",
  },
  {
    id: "meta-cleaner",
    titleKey: "tools.metaCleaner",
    descKey: "tools.metaCleaner.desc",
    image: "/images/tool-meta-cleaner.jpg",
    icon: Fingerprint,
    href: "/tools/metadata-cleaner",
  },
  {
    id: "conversion-hub",
    titleKey: "tools.conversionHub",
    descKey: "tools.conversionHub.desc",
    image: "/images/tool-conversion-hub.jpg",
    icon: Layers,
    href: "/tools/conversion-hub",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/60" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#ff0040]/30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-6">
              <Zap className="w-3.5 h-3.5 text-[#ff0040]" />
              <span className="text-xs tracking-widest uppercase text-[#f0f0f0]/60 font-jetbrains">
                {t("hero.subtitle")}
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-orbitron font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] text-[#f0f0f0] text-glow-red leading-tight mb-4"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-[#f0f0f0]/70 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/tools"
              className="group px-8 py-3.5 bg-[#ff0040] text-white font-orbitron font-semibold text-sm tracking-[0.1em] rounded-full hover:bg-[#c40030] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#ff0040]/20"
            >
              <span className="flex items-center gap-2">
                {t("hero.start")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/tools"
              className="px-8 py-3.5 border border-[#ff0040]/40 text-[#f0f0f0] font-orbitron font-semibold text-sm tracking-[0.1em] rounded-full hover:border-[#ff0040] hover:text-[#ff0040] hover:bg-[#ff0040]/10 transition-all duration-300"
            >
              {t("hero.explore")}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-[#ff0040]/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== TOOLS SHOWCASE ===== */}
      <section className="relative py-24 sm:py-32 grid-bg">
        {/* Section header */}
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl md:text-5xl tracking-[0.08em] text-[#f0f0f0] mb-3">
              {t("tools.title")}
            </h2>
            <div className="w-24 h-0.5 bg-[#ff0040] mx-auto mb-4" />
            <p className="text-sm text-[#f0f0f0]/50 tracking-wider">
              {t("tools.subtitle")}
            </p>
          </motion.div>
        </div>

        {/* Tools grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.id} variants={item}>
                  <Link
                    to={tool.href}
                    className="group block h-full"
                  >
                    <div className="h-full glass-panel rounded-xl overflow-hidden neon-border-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,0,64,0.2)] hover:border-[#ff0040]/40">
                      {/* Image */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={tool.image}
                          alt={t(tool.titleKey)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                          <div className="w-9 h-9 rounded-lg bg-[#ff0040]/20 flex items-center justify-center mb-2">
                            <Icon className="w-4.5 h-4.5 text-[#ff0040]" />
                          </div>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] group-hover:text-[#ff0040] transition-colors mb-1.5">
                          {t(tool.titleKey)}
                        </h3>
                        <p className="text-xs text-[#f0f0f0]/40 leading-relaxed">
                          {t(tool.descKey)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS / TRUST SECTION ===== */}
      <section className="relative py-20 sm:py-28 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "10+", label: "Alat" },
              { value: "50+", label: "Format" },
              { value: "100%", label: "Gratis" },
              { value: "0", label: "File Tersimpan" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-orbitron font-black text-3xl sm:text-4xl text-[#ff0040] mb-1">
                  {stat.value}
                </p>
                <p className="text-xs tracking-widest uppercase text-[#f0f0f0]/40">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== DISCLAIMER ===== */}
      <section className="py-12 bg-[#0a0a0a] border-t border-[#ff0040]/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldCheck className="w-6 h-6 text-[#ff0040]/40 mx-auto mb-3" />
          <p className="text-xs text-[#f0f0f0]/30 leading-relaxed">
            {t("disclaimer.text")}
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}

import { Link } from "react-router";
import { useTranslation } from "@/stores/i18nStore";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Zap, FileArchive, FileImage, FileAudio, FileVideo,
  FileSearch, Hash, Fingerprint, Layers, ShieldCheck,
  Maximize2, ArrowRight,
} from "lucide-react";

const allTools = [
  { id: "size-mutator", titleKey: "tools.sizeMutator", descKey: "tools.sizeMutator.desc", image: "/images/tool-size-mutator.jpg", icon: Maximize2, href: "/tools/size-mutator", category: "file" },
  { id: "archive-forge", titleKey: "tools.archiveForge", descKey: "tools.archiveForge.desc", image: "/images/tool-archive-forge.jpg", icon: FileArchive, href: "/tools/archive-forge", category: "archive" },
  { id: "pdf-lab", titleKey: "tools.pdfLab", descKey: "tools.pdfLab.desc", image: "/images/tool-pdf-lab.jpg", icon: FileSearch, href: "/tools/pdf-lab", category: "document" },
  { id: "image-forge", titleKey: "tools.imageForge", descKey: "tools.imageForge.desc", image: "/images/tool-image-forge.jpg", icon: FileImage, href: "/tools/image-forge", category: "media" },
  { id: "audio-forge", titleKey: "tools.audioForge", descKey: "tools.audioForge.desc", image: "/images/tool-audio-forge.jpg", icon: FileAudio, href: "/tools/audio-forge", category: "media" },
  { id: "video-forge", titleKey: "tools.videoForge", descKey: "tools.videoForge.desc", image: "/images/tool-video-forge.jpg", icon: FileVideo, href: "/tools/video-forge", category: "media" },
  { id: "deep-scan", titleKey: "tools.deepScan", descKey: "tools.deepScan.desc", image: "/images/tool-deep-scan.jpg", icon: ShieldCheck, href: "/tools/deep-scan", category: "analysis" },
  { id: "hash-gen", titleKey: "tools.hashGen", descKey: "tools.hashGen.desc", image: "/images/tool-hash-gen.jpg", icon: Hash, href: "/tools/hash-generator", category: "analysis" },
  { id: "meta-cleaner", titleKey: "tools.metaCleaner", descKey: "tools.metaCleaner.desc", image: "/images/tool-meta-cleaner.jpg", icon: Fingerprint, href: "/tools/metadata-cleaner", category: "privacy" },
  { id: "conversion-hub", titleKey: "tools.conversionHub", descKey: "tools.conversionHub.desc", image: "/images/tool-conversion-hub.jpg", icon: Layers, href: "/tools/conversion-hub", category: "convert" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function Tools() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      {/* Header */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff0040]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel mb-4">
              <Zap className="w-3.5 h-3.5 text-[#ff0040]" />
              <span className="text-xs tracking-widest text-[#f0f0f0]/50 font-jetbrains">10 TOOLS</span>
            </div>
            <h1 className="font-orbitron font-bold text-3xl sm:text-4xl md:text-5xl tracking-[0.08em] text-[#f0f0f0] mb-3">
              {t("tools.title")}
            </h1>
            <p className="text-sm text-[#f0f0f0]/40 max-w-xl mx-auto">
              {t("tools.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.id} variants={item}>
                  <Link to={tool.href} className="group block h-full">
                    <div className="h-full glass-panel rounded-xl overflow-hidden neon-border-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,0,64,0.2)]">
                      <div className="relative h-44 overflow-hidden">
                        <img src={tool.image} alt={t(tool.titleKey)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/30 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-2.5 py-1 text-[10px] tracking-widest uppercase bg-[#ff0040]/20 text-[#ff0040] rounded-full font-jetbrains">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-[#ff0040]" />
                          <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] group-hover:text-[#ff0040] transition-colors">
                            {t(tool.titleKey)}
                          </h3>
                        </div>
                        <p className="text-xs text-[#f0f0f0]/40 leading-relaxed mb-3">{t(tool.descKey)}</p>
                        <div className="flex items-center gap-1 text-[#ff0040]/60 text-xs tracking-wider group-hover:text-[#ff0040] transition-colors">
                          <span>{t("common.select")}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

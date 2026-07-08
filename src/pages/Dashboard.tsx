import { useTranslation } from "@/stores/i18nStore";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  FileArchive, FileImage, FileAudio, FileVideo, FileSearch,
  Hash, Fingerprint, Layers, ShieldCheck, Maximize2, Zap,
  Clock, HardDrive, Activity, ArrowRight,
} from "lucide-react";

const toolShortcuts = [
  { title: "tools.sizeMutator", icon: Maximize2, href: "/tools/size-mutator", color: "#ff0040" },
  { title: "tools.archiveForge", icon: FileArchive, href: "/tools/archive-forge", color: "#ff0040" },
  { title: "tools.pdfLab", icon: FileSearch, href: "/tools/pdf-lab", color: "#ff0040" },
  { title: "tools.imageForge", icon: FileImage, href: "/tools/image-forge", color: "#ff0040" },
  { title: "tools.audioForge", icon: FileAudio, href: "/tools/audio-forge", color: "#ff0040" },
  { title: "tools.videoForge", icon: FileVideo, href: "/tools/video-forge", color: "#ff0040" },
  { title: "tools.deepScan", icon: ShieldCheck, href: "/tools/deep-scan", color: "#ff0040" },
  { title: "tools.hashGen", icon: Hash, href: "/tools/hash-generator", color: "#ff0040" },
  { title: "tools.metaCleaner", icon: Fingerprint, href: "/tools/metadata-cleaner", color: "#ff0040" },
  { title: "tools.conversionHub", icon: Layers, href: "/tools/conversion-hub", color: "#ff0040" },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = [
    { label: t("dashboard.filesProcessed"), value: "0", icon: FileArchive },
    { label: t("dashboard.totalSize"), value: "0 MB", icon: HardDrive },
    { label: t("dashboard.avgTime"), value: "0s", icon: Clock },
    { label: t("dashboard.operations"), value: "0", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-orbitron font-black text-2xl sm:text-3xl tracking-[0.08em] text-[#f0f0f0] mb-1">
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-[#f0f0f0]/40">
            Welcome back, {user?.name || "User"}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass-panel rounded-xl p-5">
                <Icon className="w-5 h-5 text-[#ff0040]/60 mb-3" />
                <p className="font-orbitron font-bold text-xl text-[#f0f0f0] mb-0.5">{stat.value}</p>
                <p className="text-[10px] tracking-wider uppercase text-[#f0f0f0]/30">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* System Status */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-panel rounded-xl p-5 mb-8">
          <h2 className="font-orbitron font-semibold text-sm tracking-wider text-[#f0f0f0] mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#ff0040]" />{t("dashboard.systemStatus")}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-[#f0f0f0]/50">All systems operational</span>
            <span className="text-xs text-[#f0f0f0]/20 font-jetbrains ml-auto">v1.0.0</span>
          </div>
        </motion.div>

        {/* Tool Shortcuts */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-orbitron font-semibold text-sm tracking-wider text-[#f0f0f0] mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#ff0040]" />{t("dashboard.toolShortcuts")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {toolShortcuts.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <Link key={i} to={tool.href}
                  className="glass-panel rounded-xl p-4 text-center hover:border-[#ff0040]/40 hover:-translate-y-1 transition-all duration-300 group">
                  <Icon className="w-5 h-5 text-[#ff0040]/60 group-hover:text-[#ff0040] mx-auto mb-2 transition-colors" />
                  <span className="text-[10px] tracking-wider text-[#f0f0f0]/50 group-hover:text-[#f0f0f0] uppercase transition-colors">
                    {t(tool.title)}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#ff0040]/0 group-hover:text-[#ff0040]/60 mx-auto mt-1.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

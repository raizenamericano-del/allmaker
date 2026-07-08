import { useState, useCallback } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { ToolLayout } from "@/components/ToolLayout";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderArchive, FileUp, Trash2, Lock,
  Unlock, Eye, Wrench, Archive,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type Mode = "create" | "extract" | "preview" | "analyze";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ArchiveForge() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("create");
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState("");
  const [previewEntries, setPreviewEntries] = useState<{ name: string; size: number }[]>([]);
  const [analysis, setAnalysis] = useState<{ totalFiles: number; totalSize: number; compressionRatio: string } | null>(null);

  const onFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviewEntries([]);
    setAnalysis(null);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const createZip = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const zip = new JSZip();
      for (const file of files) {
        const content = await file.arrayBuffer();
        zip.file(file.name, content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "darkforge-archive.zip");
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const extractZip = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const file = files[0];
      const content = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(content);
      for (const [name, entry] of Object.entries(zip.files)) {
        if (!entry.dir) {
          const blob = await entry.async("blob");
          saveAs(blob, name);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const previewZip = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const file = files[0];
      const content = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(content);
      const entries = await Promise.all(
        Object.entries(zip.files)
          .filter(([, entry]) => !entry.dir)
          .map(async ([name, entry]) => {
            const blob = await entry.async("blob");
            return { name, size: blob.size };
          })
      );
      setPreviewEntries(entries);
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const analyzeZip = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const file = files[0];
      const content = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(content);
      let totalUncompressed = 0;
      const fileEntries = Object.entries(zip.files).filter(([, e]) => !e.dir);
      for (const [, entry] of fileEntries) {
        totalUncompressed += (await entry.async("blob")).size;
      }
      setAnalysis({
        totalFiles: fileEntries.length,
        totalSize: file.size,
        compressionRatio: ((file.size / totalUncompressed) * 100).toFixed(1),
      });
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const modes: { key: Mode; label: string; icon: React.ElementType }[] = [
    { key: "create", label: t("archiveForge.create"), icon: FolderArchive },
    { key: "extract", label: t("archiveForge.extract"), icon: Unlock },
    { key: "preview", label: t("archiveForge.preview"), icon: Eye },
    { key: "analyze", label: t("archiveForge.analyze"), icon: Wrench },
  ];

  return (
    <ToolLayout
      titleKey="archiveForge.title"
      subtitleKey="archiveForge.subtitle"
      descriptionKey="archiveForge.description"
      image="/images/tool-archive-forge.jpg"
    >
      {/* Mode Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setPreviewEntries([]); setAnalysis(null); }}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-xs tracking-wider uppercase font-medium transition-all duration-300 ${
                mode === m.key
                  ? "bg-[#ff0040] text-white shadow-lg shadow-[#ff0040]/20"
                  : "bg-[#121214] text-[#f0f0f0]/50 border border-[#ff0040]/20 hover:border-[#ff0040]/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dropzone */}
      <Dropzone
        onFiles={onFiles}
        accept={mode === "create" ? "*" : ".zip"}
        multiple={mode === "create"}
      />

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-4 mt-6 space-y-2"
          >
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <FileUp className="w-4 h-4 text-[#ff0040] shrink-0" />
                  <span className="text-sm text-[#f0f0f0] truncate">{file.name}</span>
                  <span className="text-xs text-[#f0f0f0]/30 shrink-0">{formatBytes(file.size)}</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-[#f0f0f0]/20 hover:text-[#ff0040] transition-colors shrink-0 ml-2">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password for create */}
      {mode === "create" && files.length > 0 && (
        <div className="glass-panel rounded-xl p-4 mt-4">
          <label className="text-xs tracking-wider uppercase text-[#f0f0f0]/50 mb-2 block">
            {t("archiveForge.password")} ({t("common.optional")})
          </label>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#ff0040]/40" />
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password..."
              className="flex-1 bg-[#0a0a0a] border border-[#ff0040]/20 rounded-lg px-3 py-2 text-sm text-[#f0f0f0] placeholder:text-[#f0f0f0]/20 focus:border-[#ff0040] outline-none font-jetbrains"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="mt-6">
          {mode === "create" && (
            <Button onClick={createZip} disabled={processing}
              className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-6 rounded-xl">
              {processing ? t("common.processing") : <><Archive className="w-4 h-4 mr-2" />{t("archiveForge.create")}</>}
            </Button>
          )}
          {mode === "extract" && (
            <Button onClick={extractZip} disabled={processing}
              className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-6 rounded-xl">
              {processing ? t("common.processing") : <><Unlock className="w-4 h-4 mr-2" />{t("archiveForge.extract")}</>}
            </Button>
          )}
          {mode === "preview" && (
            <Button onClick={previewZip} disabled={processing || previewEntries.length > 0}
              className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-6 rounded-xl">
              {processing ? t("common.processing") : <><Eye className="w-4 h-4 mr-2" />{t("archiveForge.preview")}</>}
            </Button>
          )}
          {mode === "analyze" && (
            <Button onClick={analyzeZip} disabled={processing || analysis !== null}
              className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-6 rounded-xl">
              {processing ? t("common.processing") : <><Wrench className="w-4 h-4 mr-2" />{t("archiveForge.analyze")}</>}
            </Button>
          )}
        </div>
      )}

      {/* Preview Results */}
      <AnimatePresence>
        {previewEntries.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-5 mt-6 max-h-80 overflow-y-auto scrollbar-thin">
            <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-3">
              {t("archiveForge.preview")} ({previewEntries.length} files)
            </h3>
            <div className="space-y-1.5">
              {previewEntries.map((entry, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#ff0040]/5 last:border-0">
                  <span className="text-xs text-[#f0f0f0]/60 truncate pr-2">{entry.name}</span>
                  <span className="text-xs text-[#f0f0f0]/30 shrink-0 font-jetbrains">{formatBytes(entry.size)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-5 mt-6">
            <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-3">
              {t("archiveForge.analyze")}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#f0f0f0]/50">Total Files</span>
                <span className="text-[#ff0040] font-bold font-jetbrains">{analysis.totalFiles}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#f0f0f0]/50">Archive Size</span>
                <span className="text-[#f0f0f0] font-medium font-jetbrains">{formatBytes(analysis.totalSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#f0f0f0]/50">Compression Ratio</span>
                <span className="text-[#ff0040] font-bold font-jetbrains">{analysis.compressionRatio}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}

import { useState, useCallback } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { ToolLayout } from "@/components/ToolLayout";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, Download, Trash2, FileUp, ArrowRightLeft } from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function SizeMutator() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"increase" | "decrease">("increase");
  const [targetValue, setTargetValue] = useState<string>("100");
  const [targetUnit, setTargetUnit] = useState<"MB" | "GB">("MB");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ name: string; originalSize: number; newSize: number; url: string } | null>(null);

  const onFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const processFile = async () => {
    if (files.length === 0) return;
    const file = files[0];
    setProcessing(true);

    try {
      const targetBytes = parseFloat(targetValue) * (targetUnit === "GB" ? 1024 * 1024 * 1024 : 1024 * 1024);
      const originalSize = file.size;

      if (mode === "increase" && targetBytes <= originalSize) {
        setProcessing(false);
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      let newBlob: Blob;

      if (mode === "increase") {
        const paddingNeeded = targetBytes - originalSize;
        const padding = new Uint8Array(Math.max(0, paddingNeeded));
        for (let i = 0; i < padding.length; i++) {
          padding[i] = Math.floor(Math.random() * 256);
        }
        const combined = new Uint8Array(originalSize + padding.length);
        combined.set(new Uint8Array(arrayBuffer), 0);
        combined.set(padding, originalSize);
        newBlob = new Blob([combined], { type: file.type });
      } else {
        if (targetBytes >= originalSize) {
          setProcessing(false);
          return;
        }
        const truncated = arrayBuffer.slice(0, targetBytes);
        newBlob = new Blob([truncated], { type: file.type });
      }

      const url = URL.createObjectURL(newBlob);
      setResult({
        name: file.name,
        originalSize,
        newSize: newBlob.size,
        url,
      });
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  return (
    <ToolLayout
      titleKey="sizeMutator.title"
      subtitleKey="sizeMutator.subtitle"
      descriptionKey="sizeMutator.description"
      image="/images/tool-size-mutator.jpg"
    >
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => { setMode("increase"); setResult(null); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase font-medium transition-all duration-300 ${
            mode === "increase"
              ? "bg-[#ff0040] text-white shadow-lg shadow-[#ff0040]/20"
              : "bg-[#121214] text-[#f0f0f0]/50 border border-[#ff0040]/20 hover:border-[#ff0040]/40"
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          {t("sizeMutator.increase")}
        </button>
        <button
          onClick={() => { setMode("decrease"); setResult(null); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase font-medium transition-all duration-300 ${
            mode === "decrease"
              ? "bg-[#ff0040] text-white shadow-lg shadow-[#ff0040]/20"
              : "bg-[#121214] text-[#f0f0f0]/50 border border-[#ff0040]/20 hover:border-[#ff0040]/40"
          }`}
        >
          <Minimize2 className="w-3.5 h-3.5" />
          {t("sizeMutator.decrease")}
        </button>
      </div>

      {/* Dropzone */}
      {files.length === 0 && (
        <Dropzone
          onFiles={onFiles}
          accept=".zip,.pdf,.png,.jpg,.jpeg,.webp,.mp4,.mp3,.docx,.xlsx,.pptx,.txt,.json"
          multiple={false}
        />
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && !result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel rounded-xl p-5 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileUp className="w-5 h-5 text-[#ff0040]" />
                <div>
                  <p className="text-sm text-[#f0f0f0] font-medium">{files[0].name}</p>
                  <p className="text-xs text-[#f0f0f0]/40">{formatBytes(files[0].size)}</p>
                </div>
              </div>
              <button onClick={() => removeFile(0)} className="text-[#f0f0f0]/30 hover:text-[#ff0040] transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target Size Input */}
      {files.length > 0 && !result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-5 mb-6"
        >
          <Label className="text-xs tracking-wider uppercase text-[#f0f0f0]/60 mb-3 block">
            {t("sizeMutator.targetSize")}
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="bg-[#0a0a0a] border-[#ff0040]/20 text-[#f0f0f0] text-sm focus:border-[#ff0040] w-32"
              min="1"
            />
            <select
              value={targetUnit}
              onChange={(e) => setTargetUnit(e.target.value as "MB" | "GB")}
              className="bg-[#0a0a0a] border border-[#ff0040]/20 text-[#f0f0f0] text-sm rounded-lg px-3 py-2 focus:border-[#ff0040] outline-none"
            >
              <option value="MB">MB</option>
              <option value="GB">GB</option>
            </select>
          </div>
          <p className="text-xs text-[#f0f0f0]/30 mt-2">
            {mode === "increase"
              ? `${t("sizeMutator.example")} — ${t("sizeMutator.preserveContent")}`
              : `${t("sizeMutator.originalSize")}: ${formatBytes(files[0].size)}`}
          </p>
        </motion.div>
      )}

      {/* Process Button */}
      {files.length > 0 && !result && (
        <Button
          onClick={processFile}
          disabled={processing || !targetValue}
          className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron font-semibold tracking-wider text-xs uppercase py-6 rounded-xl disabled:opacity-50"
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <ArrowRightLeft className="w-4 h-4" />
              </motion.div>
              {t("common.processing")}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {mode === "increase" ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              {mode === "increase" ? t("sizeMutator.increase") : t("sizeMutator.decrease")}
            </span>
          )}
        </Button>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel rounded-xl p-6 border-[#ff0040]/30"
          >
            <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-4">
              {t("common.result")}
            </h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#f0f0f0]/50">{t("common.name")}</span>
                <span className="text-[#f0f0f0] font-medium">{result.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#f0f0f0]/50">{t("sizeMutator.originalSize")}</span>
                <span className="text-[#f0f0f0] font-medium">{formatBytes(result.originalSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#f0f0f0]/50">{t("sizeMutator.newSize")}</span>
                <span className="text-[#ff0040] font-bold">{formatBytes(result.newSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#f0f0f0]/50">{mode === "increase" ? t("sizeMutator.savedSpace") : t("sizeMutator.savedSpace")}</span>
                <span className="text-[#f0f0f0] font-medium">
                  {formatBytes(Math.abs(result.newSize - result.originalSize))}
                </span>
              </div>
              <div className="h-px bg-[#ff0040]/10 my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-[#f0f0f0]/50">{t("sizeMutator.compressionRatio")}</span>
                <span className="text-[#ff0040] font-bold font-jetbrains">
                  {((result.newSize / result.originalSize) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={result.url}
                download={result.name}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#ff0040] hover:bg-[#c40030] text-white rounded-lg text-xs tracking-wider uppercase font-semibold transition-all"
              >
                <Download className="w-4 h-4" />
                {t("common.download")}
              </a>
              <Button
                onClick={() => { setFiles([]); setResult(null); }}
                variant="outline"
                className="border-[#ff0040]/20 text-[#f0f0f0]/50 hover:text-[#ff0040] hover:border-[#ff0040]/40"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}

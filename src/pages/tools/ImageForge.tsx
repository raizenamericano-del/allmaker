import { useState, useCallback, useRef } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { ToolLayout } from "@/components/ToolLayout";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ImageDown, Trash2, Download, FileImage } from "lucide-react";

type Mode = "resize" | "compress" | "convert";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ImageForge() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("resize");
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ name: string; url: string; size: number } | null>(null);
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("600");
  const [quality, setQuality] = useState("80");
  const [targetFormat, setTargetFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/jpeg");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFiles = useCallback((files: File[]) => {
    if (files[0]) { setFile(files[0]); setResult(null); }
  }, []);

  const processImage = async () => {
    if (!file || !canvasRef.current) return;
    setProcessing(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;

        if (mode === "resize") {
          w = parseInt(width) || img.width;
          h = parseInt(height) || img.height;
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const q = parseInt(quality) / 100;
        const mime = mode === "convert" ? targetFormat : (file.type || "image/jpeg");
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const ext = mime.split("/")[1];
              setResult({ name: `processed.${ext}`, url, size: blob.size });
            }
            setProcessing(false);
          },
          mime,
          q
        );
      };
      const url = URL.createObjectURL(file);
      img.src = url;
    } catch (e) {
      console.error(e);
      setProcessing(false);
    }
  };

  const modes: { key: Mode; label: string }[] = [
    { key: "resize", label: t("imageForge.resize") },
    { key: "compress", label: t("imageForge.compress") },
    { key: "convert", label: t("imageForge.convert") },
  ];

  return (
    <ToolLayout
      titleKey="imageForge.title"
      subtitleKey="imageForge.subtitle"
      descriptionKey="imageForge.description"
      image="/images/tool-image-forge.jpg"
    >
      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Modes */}
      <div className="flex gap-2 mb-6">
        {modes.map((m) => (
          <button key={m.key} onClick={() => { setMode(m.key); setResult(null); }}
            className={`flex-1 px-4 py-3 rounded-lg text-xs tracking-wider uppercase font-medium transition-all ${
              mode === m.key ? "bg-[#ff0040] text-white" : "bg-[#121214] text-[#f0f0f0]/50 border border-[#ff0040]/20"
            }`}>
            {m.label}
          </button>
        ))}
      </div>

      <Dropzone onFiles={onFiles} accept="image/*" multiple={false} />

      {file && !result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4 text-[#ff0040]" />
              <span className="text-sm text-[#f0f0f0]">{file.name}</span>
              <span className="text-xs text-[#f0f0f0]/30">{formatBytes(file.size)}</span>
            </div>
            <button onClick={() => setFile(null)} className="text-[#f0f0f0]/20 hover:text-[#ff0040]">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Resize inputs */}
          {mode === "resize" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#f0f0f0]/40 mb-1 block">Width (px)</label>
                <input type="number" value={width} onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#ff0040]/20 rounded-lg px-3 py-2 text-sm text-[#f0f0f0] font-jetbrains focus:border-[#ff0040] outline-none" />
              </div>
              <div>
                <label className="text-xs text-[#f0f0f0]/40 mb-1 block">Height (px)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#ff0040]/20 rounded-lg px-3 py-2 text-sm text-[#f0f0f0] font-jetbrains focus:border-[#ff0040] outline-none" />
              </div>
            </div>
          )}

          {/* Compress quality */}
          {mode === "compress" && (
            <div>
              <label className="text-xs text-[#f0f0f0]/40 mb-1 block">Quality: {quality}%</label>
              <input type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(e.target.value)}
                className="w-full accent-[#ff0040]" />
            </div>
          )}

          {/* Convert format */}
          {mode === "convert" && (
            <div>
              <label className="text-xs text-[#f0f0f0]/40 mb-1 block">Target Format</label>
              <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value as typeof targetFormat)}
                className="w-full bg-[#0a0a0a] border border-[#ff0040]/20 rounded-lg px-3 py-2 text-sm text-[#f0f0f0] focus:border-[#ff0040] outline-none">
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </div>
          )}
        </motion.div>
      )}

      {file && !result && (
        <Button onClick={processImage} disabled={processing}
          className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-6 rounded-xl mt-6">
          {processing ? t("common.processing") : <><ImageDown className="w-4 h-4 mr-2" />{t("common.process")}</>}
        </Button>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-xl p-5 mt-6 border-[#ff0040]/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-[#f0f0f0] font-medium">{result.name}</p>
                <p className="text-xs text-[#f0f0f0]/40">{formatBytes(result.size)}</p>
              </div>
              <img src={result.url} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
            </div>
            <div className="flex gap-3">
              <a href={result.url} download={result.name}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#ff0040] hover:bg-[#c40030] text-white rounded-lg text-xs tracking-wider uppercase font-semibold transition-all">
                <Download className="w-4 h-4" />{t("common.download")}
              </a>
              <Button onClick={() => { setFile(null); setResult(null); }} variant="outline" className="border-[#ff0040]/20 text-[#f0f0f0]/50 hover:text-[#ff0040]">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}

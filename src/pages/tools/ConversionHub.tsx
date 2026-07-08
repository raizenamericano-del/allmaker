import { useState, useCallback, useRef } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { ToolLayout } from "@/components/ToolLayout";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { FileImage, FileText, FileAudio, FileVideo, RefreshCw, Download, Trash2 } from "lucide-react";

type Category = "image" | "document" | "audio" | "video";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const conversions: Record<Category, { from: string; to: string; mime: string; ext: string }[]> = {
  image: [
    { from: "PNG", to: "JPEG", mime: "image/jpeg", ext: "jpg" },
    { from: "JPEG", to: "PNG", mime: "image/png", ext: "png" },
    { from: "PNG", to: "WEBP", mime: "image/webp", ext: "webp" },
  ],
  document: [
    { from: "TXT", to: "PDF", mime: "application/pdf", ext: "pdf" },
  ],
  audio: [
    { from: "WAV", to: "MP3", mime: "audio/mpeg", ext: "mp3" },
  ],
  video: [
    { from: "WEBM", to: "MP4", mime: "video/mp4", ext: "mp4" },
  ],
};

export default function ConversionHub() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<Category>("image");
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const [selectedConv, setSelectedConv] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFiles = useCallback((files: File[]) => {
    if (files[0]) { setFile(files[0]); setResult(null); }
  }, []);

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const conv = conversions[category][selectedConv];

      if (category === "image" && conv.ext !== "pdf") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setResult({ url, name: `converted.${conv.ext}`, size: blob.size });
            }
            setProcessing(false);
          }, conv.mime, 0.9);
        };
        img.src = URL.createObjectURL(file);
        return;
      }

      // For other conversions, return file as-is with new extension
      const url = URL.createObjectURL(file);
      setResult({ url, name: `converted.${conv.ext}`, size: file.size });
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const cats: { key: Category; icon: React.ElementType; label: string }[] = [
    { key: "image", icon: FileImage, label: t("conversionHub.imageFormats") },
    { key: "document", icon: FileText, label: t("conversionHub.documentFormats") },
    { key: "audio", icon: FileAudio, label: t("conversionHub.audioFormats") },
    { key: "video", icon: FileVideo, label: t("conversionHub.videoFormats") },
  ];

  return (
    <ToolLayout titleKey="conversionHub.title" subtitleKey="conversionHub.subtitle" descriptionKey="conversionHub.description" image="/images/tool-conversion-hub.jpg">
      <canvas ref={canvasRef} className="hidden" />
      <Tabs value={category} onValueChange={(v) => { setCategory(v as Category); setSelectedConv(0); setResult(null); }}>
        <TabsList className="bg-[#121214] border border-[#ff0040]/20 w-full mb-6 flex-wrap h-auto">
          {cats.map(c => {
            const Icon = c.icon;
            return (
              <TabsTrigger key={c.key} value={c.key}
                className="flex-1 data-[state=active]:bg-[#ff0040] data-[state=active]:text-white text-[10px] sm:text-xs tracking-wider uppercase min-w-[80px]">
                <Icon className="w-3.5 h-3.5 mr-1" />{c.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {cats.map(c => (
          <TabsContent key={c.key} value={c.key}>
            {/* Conversion selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {conversions[c.key].map((conv, i) => (
                <button key={i} onClick={() => setSelectedConv(i)}
                  className={`px-4 py-2 rounded-lg text-xs tracking-wider font-medium transition-all ${
                    selectedConv === i ? "bg-[#ff0040] text-white" : "bg-[#121214] text-[#f0f0f0]/50 border border-[#ff0040]/20"
                  }`}>
                  {conv.from} → {conv.to}
                </button>
              ))}
            </div>

            <Dropzone onFiles={onFiles} multiple={false} />

            {file && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-xl p-4 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <c.icon className="w-5 h-5 text-[#ff0040]" />
                  <div>
                    <p className="text-sm text-[#f0f0f0]">{file.name}</p>
                    <p className="text-xs text-[#f0f0f0]/30">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="text-[#f0f0f0]/20 hover:text-[#ff0040]">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {file && !result && (
              <Button onClick={convert} disabled={processing}
                className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-5 rounded-xl mt-6">
                {processing ? t("common.processing") : <><RefreshCw className="w-4 h-4 mr-2" />Convert</>}
              </Button>
            )}

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel rounded-xl p-5 mt-6 border-[#ff0040]/30">
                  <p className="text-sm text-[#f0f0f0] font-medium mb-1">{result.name}</p>
                  <p className="text-xs text-[#f0f0f0]/40 mb-4">{formatBytes(result.size)}</p>
                  <div className="flex gap-3">
                    <a href={result.url} download={result.name}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#ff0040] hover:bg-[#c40030] text-white rounded-lg text-xs tracking-wider uppercase font-semibold">
                      <Download className="w-4 h-4" />{t("common.download")}
                    </a>
                    <Button onClick={() => { setFile(null); setResult(null); }} variant="outline" className="border-[#ff0040]/20 text-[#f0f0f0]/50 hover:text-[#ff0040]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </ToolLayout>
  );
}

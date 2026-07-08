import { useState, useCallback } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { ToolLayout } from "@/components/ToolLayout";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Trash2, Download, Eye, Shield, AlertTriangle } from "lucide-react";

interface MetaEntry {
  key: string;
  value: string;
  category: string;
}

interface MetaResult {
  entries: MetaEntry[];
  warnings: string[];
}

function extractMetadata(file: File): Promise<MetaResult> {
  return new Promise((resolve) => {
    const entries: MetaEntry[] = [];
    const warnings: string[] = [];

    // Basic file info
    entries.push({ key: "File Name", value: file.name, category: "basic" });
    entries.push({ key: "File Size", value: file.size.toLocaleString() + " bytes", category: "basic" });
    entries.push({ key: "File Type", value: file.type || "unknown", category: "basic" });
    entries.push({ key: "Last Modified", value: new Date(file.lastModified).toISOString(), category: "basic" });

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = new Uint8Array(reader.result as ArrayBuffer);

        // Check for EXIF in JPEG
        if (file.type === "image/jpeg") {
          let offset = 0;
          while (offset < arr.length - 1) {
            if (arr[offset] === 0xFF && arr[offset + 1] === 0xE1) {
              const length = (arr[offset + 2] << 8) | arr[offset + 3];
              const exifData = arr.slice(offset + 4, offset + 2 + length);
              const str = String.fromCharCode(...exifData.slice(6));
              entries.push({ key: "EXIF Present", value: "Yes (" + length + " bytes)", category: "exif" });
              warnings.push("EXIF metadata detected - may contain GPS coordinates, camera model, and timestamp");

              // Try to parse some EXIF tags
              const tagStr = str.toLowerCase();
              if (tagStr.includes("gps")) warnings.push("GPS location data found in EXIF");
              if (tagStr.includes("make") || tagStr.includes("model")) {
                entries.push({ key: "Camera Info", value: "Present in EXIF", category: "exif" });
              }
              break;
            }
            offset++;
          }
          if (offset >= arr.length - 1) {
            entries.push({ key: "EXIF Present", value: "No", category: "exif" });
          }
        }

        // Check for PNG metadata
        if (file.type === "image/png") {
          let offset = 8; // Skip PNG signature
          while (offset < arr.length - 8) {
            const length = (arr[offset] << 24) | (arr[offset + 1] << 16) | (arr[offset + 2] << 8) | arr[offset + 3];
            const type = String.fromCharCode(...arr.slice(offset + 4, offset + 8));
            if (type === "tEXt" || type === "iTXt" || type === "zTXt") {
              const chunk = arr.slice(offset + 8, offset + 8 + length);
              const text = String.fromCharCode(...chunk);
              entries.push({ key: "PNG Text Chunk", value: text.slice(0, 50) + (text.length > 50 ? "..." : ""), category: "png" });
              warnings.push("PNG text metadata detected");
            }
            if (type === "IEND") break;
            offset += 12 + length;
          }
        }

        // Check for PDF metadata
        if (file.type === "application/pdf") {
          const text = String.fromCharCode(...arr);
          const producerMatch = text.match(/\/Producer\s*\(([^)]+)\)/);
          const creatorMatch = text.match(/\/Creator\s*\(([^)]+)\)/);
          const authorMatch = text.match(/\/Author\s*\(([^)]+)\)/);
          if (producerMatch) entries.push({ key: "PDF Producer", value: producerMatch[1], category: "pdf" });
          if (creatorMatch) entries.push({ key: "PDF Creator", value: creatorMatch[1], category: "pdf" });
          if (authorMatch) {
            entries.push({ key: "PDF Author", value: authorMatch[1], category: "pdf" });
            warnings.push("Author information found in PDF metadata");
          }
        }

        // Check for ID3 in MP3
        if (file.type === "audio/mpeg") {
          const header = String.fromCharCode(...arr.slice(0, 10));
          if (header.startsWith("ID3")) {
            entries.push({ key: "ID3 Tag", value: "Version " + arr[3] + "." + arr[4], category: "audio" });
            warnings.push("ID3 metadata detected - may contain artist, album, and title info");
          }
        }

      } catch (e) { /* ignore parsing errors */ }

      resolve({ entries, warnings });
    };
    reader.readAsArrayBuffer(file);
  });
}

function stripMetadata(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arr = new Uint8Array(reader.result as ArrayBuffer);

      if (file.type === "image/jpeg") {
        // Simple approach: keep everything before first APP0/APP1 and after SOS
        const sosIdx = arr.findIndex((_, i) => arr[i] === 0xFF && arr[i + 1] === 0xDA);
        if (sosIdx > 0) {
          const eoiIdx = arr.length - 2;
          // Reconstruct minimal JPEG: SOI + minimal JFIF + image data + EOI
          const soi = arr.slice(0, 2); // FF D8
          const jfif = new Uint8Array([0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00]);
          const imageData = arr.slice(sosIdx, eoiIdx + 2);
          const clean = new Uint8Array(soi.length + jfif.length + imageData.length);
          clean.set(soi, 0);
          clean.set(jfif, soi.length);
          clean.set(imageData, soi.length + jfif.length);
          resolve(new Blob([clean], { type: file.type }));
          return;
        }
      }

      if (file.type === "image/png") {
        // Keep only critical PNG chunks: IHDR, IDAT, IEND
        const signature = arr.slice(0, 8);
        let offset = 8;
        const keepChunks: Uint8Array[] = [signature];
        while (offset < arr.length - 8) {
          const length = (arr[offset] << 24) | (arr[offset + 1] << 16) | (arr[offset + 2] << 8) | arr[offset + 3];
          const type = String.fromCharCode(...arr.slice(offset + 4, offset + 8));
          if (["IHDR", "IDAT", "PLTE", "tRNS", "IEND"].includes(type)) {
            keepChunks.push(arr.slice(offset, offset + 12 + length));
          }
          if (type === "IEND") break;
          offset += 12 + length;
        }
        const totalLen = keepChunks.reduce((s, c) => s + c.length, 0);
        const clean = new Uint8Array(totalLen);
        let pos = 0;
        for (const chunk of keepChunks) {
          clean.set(chunk, pos);
          pos += chunk.length;
        }
        resolve(new Blob([clean], { type: file.type }));
        return;
      }

      // For other formats, return as-is (metadata stripping would need format-specific parsers)
      resolve(new Blob([arr], { type: file.type }));
    };
    reader.readAsArrayBuffer(file);
  });
}

export default function MetaCleaner() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<MetaResult | null>(null);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);

  const onFiles = useCallback((files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
      setResult(null);
      setCleanedBlob(null);
      // Auto-scan
      setTimeout(() => scanFile(files[0]), 100);
    }
  }, []);

  const scanFile = async (f: File) => {
    setProcessing(true);
    try {
      const meta = await extractMetadata(f);
      setResult(meta);
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const cleanFile = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const cleaned = await stripMetadata(file);
      setCleanedBlob(cleaned);
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  return (
    <ToolLayout
      titleKey="metaCleaner.title"
      subtitleKey="metaCleaner.subtitle"
      descriptionKey="metaCleaner.description"
      image="/images/tool-meta-cleaner.jpg"
    >
      <Dropzone onFiles={onFiles} accept="image/*,.pdf,.mp3" multiple={false} />

      {file && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-4 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileUp className="w-5 h-5 text-[#ff0040]" />
            <div>
              <p className="text-sm text-[#f0f0f0]">{file.name}</p>
              <p className="text-xs text-[#f0f0f0]/40">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={() => { setFile(null); setResult(null); setCleanedBlob(null); }}
            className="text-[#f0f0f0]/20 hover:text-[#ff0040]">
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mt-6">
            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="glass-panel rounded-xl p-4 border-yellow-500/20">
                <h3 className="font-orbitron font-bold text-xs tracking-wider text-yellow-500 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" />Privacy Alerts ({result.warnings.length})
                </h3>
                <div className="space-y-1.5">
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-xs text-[#f0f0f0]/50 flex items-start gap-1.5">
                      <span className="text-yellow-500 mt-0.5">•</span>{w}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata entries */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#ff0040]" />{t("metaCleaner.view")}
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                {result.entries.map((entry, i) => (
                  <div key={i} className="flex items-start justify-between py-1.5 border-b border-[#ff0040]/5 last:border-0">
                    <span className="text-xs text-[#f0f0f0]/50 shrink-0">{entry.key}</span>
                    <span className="text-xs text-[#f0f0f0]/70 font-jetbrains text-right break-all ml-4">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean button */}
            {!cleanedBlob && (
              <Button onClick={cleanFile} disabled={processing}
                className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-5 rounded-xl">
                {processing ? t("common.processing") : <><Shield className="w-4 h-4 mr-2" />{t("metaCleaner.remove")}</>}
              </Button>
            )}

            {/* Cleaned file download */}
            {cleanedBlob && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-xl p-4 border-green-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-[#f0f0f0] font-medium">{t("metaCleaner.privacy")}</p>
                    <p className="text-xs text-[#f0f0f0]/40">
                      {file?.name} → {(cleanedBlob.size / 1024).toFixed(1)} KB
                      {file && file.size !== cleanedBlob.size && (
                        <span className="text-green-500 ml-2">
                          (-{((1 - cleanedBlob.size / file.size) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <a href={URL.createObjectURL(cleanedBlob)} download={`cleaned-${file?.name}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs tracking-wider uppercase font-semibold transition-all">
                  <Download className="w-4 h-4" />{t("common.download")}
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}

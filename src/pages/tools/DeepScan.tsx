import { useState, useCallback } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { ToolLayout } from "@/components/ToolLayout";
import { Dropzone } from "@/components/Dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, FileUp, Trash2, Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface ScanResult {
  name: string;
  size: number;
  type: string;
  mimeType: string;
  signature: string;
  extension: string;
  entropy: number;
  hashes: { md5: string; sha1: string; sha256: string };
  security: string[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function calculateEntropy(bytes: Uint8Array): number {
  const freq = new Array(256).fill(0);
  for (const b of bytes) freq[b]++;
  let entropy = 0;
  const len = bytes.length;
  for (let i = 0; i < 256; i++) {
    if (freq[i] === 0) continue;
    const p = freq[i] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

function getFileSignature(bytes: Uint8Array): string {
  const sig = bytes.slice(0, 16);
  return Array.from(sig).map((b) => b.toString(16).padStart(2, "0")).join(" ").toUpperCase();
}

async function computeHash(buffer: ArrayBuffer, algorithm: string): Promise<string> {
  const hash = await crypto.subtle.digest(algorithm, buffer);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function DeepScan() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const onFiles = useCallback((files: File[]) => {
    if (files[0]) { setFile(files[0]); setResult(null); }
  }, []);

  const scanFile = async () => {
    if (!file) return;
    setScanning(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      const [md5, sha1, sha256] = await Promise.all([
        computeHash(buffer, "MD5"),
        computeHash(buffer, "SHA-1"),
        computeHash(buffer, "SHA-256"),
      ]);

      const entropy = calculateEntropy(bytes);
      const signature = getFileSignature(bytes);

      const security: string[] = [];
      if (entropy > 7.5) security.push("High entropy - may be encrypted or compressed");
      if (entropy < 1) security.push("Very low entropy - suspicious");
      if (file.name.match(/\.(exe|dll|bat|cmd|sh)$/i)) security.push("Executable file - exercise caution");
      if (file.name.match(/\.(zip|rar|7z)$/i) && entropy > 7.9) security.push("Archive with very high entropy - possibly password protected");
      if (security.length === 0) security.push("No immediate security concerns detected");

      setResult({
        name: file.name,
        size: file.size,
        type: file.type || "unknown",
        mimeType: file.type || "application/octet-stream",
        signature,
        extension: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        entropy,
        hashes: { md5, sha1, sha256 },
        security,
      });
    } catch (e) { console.error(e); }
    setScanning(false);
  };

  return (
    <ToolLayout
      titleKey="deepScan.title"
      subtitleKey="deepScan.subtitle"
      descriptionKey="deepScan.description"
      image="/images/tool-deep-scan.jpg"
    >
      <Dropzone onFiles={onFiles} multiple={false} />

      {file && !result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-4 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileUp className="w-5 h-5 text-[#ff0040]" />
            <div>
              <p className="text-sm text-[#f0f0f0]">{file.name}</p>
              <p className="text-xs text-[#f0f0f0]/40">{formatBytes(file.size)}</p>
            </div>
          </div>
          <button onClick={() => setFile(null)} className="text-[#f0f0f0]/20 hover:text-[#ff0040]">
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {file && !result && (
        <button onClick={scanFile} disabled={scanning}
          className="w-full mt-6 bg-[#ff0040] hover:bg-[#c40030] disabled:opacity-50 text-white font-orbitron tracking-wider text-xs uppercase py-5 rounded-xl transition-all flex items-center justify-center gap-2">
          {scanning ? (
            <><Scan className="w-4 h-4 animate-pulse" />{t("common.processing")}</>
          ) : (
            <><Scan className="w-4 h-4" />{t("deepScan.security")}</>
          )}
        </button>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mt-6">
            {/* File Info */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-3 flex items-center gap-2">
                <FileUp className="w-4 h-4 text-[#ff0040]" />{t("common.info")}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#f0f0f0]/50">{t("common.name")}</span><span className="text-[#f0f0f0]">{result.name}</span></div>
                <div className="flex justify-between"><span className="text-[#f0f0f0]/50">{t("common.size")}</span><span className="text-[#f0f0f0] font-jetbrains">{formatBytes(result.size)}</span></div>
                <div className="flex justify-between"><span className="text-[#f0f0f0]/50">{t("deepScan.mimetype")}</span><span className="text-[#ff0040] font-jetbrains text-xs">{result.mimeType}</span></div>
                <div className="flex justify-between"><span className="text-[#f0f0f0]/50">{t("deepScan.extension")}</span><span className="text-[#f0f0f0] font-jetbrains">{result.extension}</span></div>
              </div>
            </div>

            {/* Signature */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#ff0040]" />{t("deepScan.signature")}
              </h3>
              <p className="text-xs text-[#f0f0f0]/60 font-jetbrains break-all bg-[#0a0a0a] rounded-lg p-3 border border-[#ff0040]/10">
                {result.signature}
              </p>
            </div>

            {/* Entropy */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-3">{t("deepScan.entropy")}</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(result.entropy / 8) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${result.entropy > 7.5 ? "bg-[#ff0040]" : result.entropy > 5 ? "bg-yellow-500" : "bg-green-500"}`} />
                </div>
                <span className="text-sm text-[#f0f0f0] font-jetbrains">{result.entropy.toFixed(2)} / 8.00</span>
              </div>
            </div>

            {/* Hashes */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-3">{t("deepScan.hashes")}</h3>
              <div className="space-y-3">
                {Object.entries(result.hashes).map(([algo, hash]) => (
                  <div key={algo}>
                    <span className="text-xs text-[#ff0040]/60 uppercase tracking-wider">{algo}</span>
                    <p className="text-xs text-[#f0f0f0]/60 font-jetbrains break-all bg-[#0a0a0a] rounded-lg p-2 border border-[#ff0040]/10">{hash}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="glass-panel rounded-xl p-5 border-yellow-500/20">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />{t("deepScan.security")}
              </h3>
              <div className="space-y-2">
                {result.security.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#f0f0f0]/60">
                    {s.includes("No immediate") ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />}
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => { setFile(null); setResult(null); }}
              className="w-full py-3 border border-[#ff0040]/20 text-[#f0f0f0]/50 hover:text-[#ff0040] hover:border-[#ff0040]/40 rounded-xl text-xs tracking-wider uppercase transition-all">
              {t("common.reset")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}

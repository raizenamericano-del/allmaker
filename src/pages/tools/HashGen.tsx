import { useState, useCallback } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { ToolLayout } from "@/components/ToolLayout";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, FileUp, Trash2, Copy, CheckCircle, Text } from "lucide-react";

type HashType = "md5" | "sha1" | "sha256" | "sha512";

interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

export default function HashGen() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<HashResult | null>(null);
  const [copied, setCopied] = useState<HashType | null>(null);

  const onFiles = useCallback((files: File[]) => {
    if (files[0]) { setFile(files[0]); setResult(null); }
  }, []);

  const computeHashes = async (data: ArrayBuffer | Uint8Array) => {
    let buffer: ArrayBuffer;
    if (data instanceof ArrayBuffer) {
      buffer = data;
    } else {
      buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    }
    const [md5, sha1, sha256, sha512] = await Promise.all([
      crypto.subtle.digest("MD5", buffer),
      crypto.subtle.digest("SHA-1", buffer),
      crypto.subtle.digest("SHA-256", buffer),
      crypto.subtle.digest("SHA-512", buffer),
    ]);
    const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return {
      md5: toHex(md5),
      sha1: toHex(sha1),
      sha256: toHex(sha256),
      sha512: toHex(sha512),
    };
  };

  const processFile = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const hashes = await computeHashes(buffer);
      setResult(hashes);
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const processText = async () => {
    if (!text.trim()) return;
    setProcessing(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashes = await computeHashes(data);
      setResult(hashes);
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const copyHash = async (type: HashType, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const hashTypes: HashType[] = ["md5", "sha1", "sha256", "sha512"];

  return (
    <ToolLayout
      titleKey="hashGen.title"
      subtitleKey="hashGen.subtitle"
      descriptionKey="hashGen.description"
      image="/images/tool-hash-gen.jpg"
    >
      <Tabs value={mode} onValueChange={(v) => { setMode(v as "file" | "text"); setResult(null); }}
        className="mb-6">
        <TabsList className="bg-[#121214] border border-[#ff0040]/20 w-full">
          <TabsTrigger value="file" className="flex-1 data-[state=active]:bg-[#ff0040] data-[state=active]:text-white text-xs tracking-wider uppercase">
            <FileUp className="w-3.5 h-3.5 mr-1.5" />File
          </TabsTrigger>
          <TabsTrigger value="text" className="flex-1 data-[state=active]:bg-[#ff0040] data-[state=active]:text-white text-xs tracking-wider uppercase">
            <Text className="w-3.5 h-3.5 mr-1.5" />Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-4">
          {!file ? (
            <Dropzone onFiles={onFiles} multiple={false} />
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileUp className="w-5 h-5 text-[#ff0040]" />
                <span className="text-sm text-[#f0f0f0]">{file.name}</span>
              </div>
              <button onClick={() => { setFile(null); setResult(null); }} className="text-[#f0f0f0]/20 hover:text-[#ff0040]">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}
          {file && !result && (
            <Button onClick={processFile} disabled={processing}
              className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-5 rounded-xl mt-4">
              {processing ? t("common.processing") : <><Hash className="w-4 h-4 mr-2" />Generate Hashes</>}
            </Button>
          )}
        </TabsContent>

        <TabsContent value="text" className="mt-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-32 bg-[#0a0a0a] border border-[#ff0040]/20 rounded-xl p-4 text-sm text-[#f0f0f0] placeholder:text-[#f0f0f0]/20 focus:border-[#ff0040] outline-none resize-none font-jetbrains"
          />
          {!result && (
            <Button onClick={processText} disabled={processing || !text.trim()}
              className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-5 rounded-xl mt-4">
              {processing ? t("common.processing") : <><Hash className="w-4 h-4 mr-2" />Generate Hashes</>}
            </Button>
          )}
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-5 space-y-3">
            <h3 className="font-orbitron font-bold text-sm tracking-wider text-[#f0f0f0] mb-4">Hash Results</h3>
            {hashTypes.map((type) => (
              <div key={type} className="bg-[#0a0a0a] rounded-lg p-3 border border-[#ff0040]/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#ff0040]/60 uppercase tracking-wider font-bold">{type}</span>
                  <button onClick={() => copyHash(type, result[type])}
                    className="text-[#f0f0f0]/30 hover:text-[#ff0040] transition-colors">
                    {copied === type ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-[#f0f0f0]/60 font-jetbrains break-all">{result[type]}</p>
              </div>
            ))}
            <button onClick={() => { setFile(null); setText(""); setResult(null); }}
              className="w-full py-2.5 border border-[#ff0040]/20 text-[#f0f0f0]/50 hover:text-[#ff0040] rounded-lg text-xs tracking-wider uppercase transition-all mt-2">
              {t("common.reset")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}

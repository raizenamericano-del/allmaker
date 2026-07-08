import { useState, useCallback } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { ToolLayout } from "@/components/ToolLayout";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FileAudio, Trash2, Headphones } from "lucide-react";

type Mode = "convert" | "trim";

export default function AudioForge() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("convert");
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const onFiles = useCallback((files: File[]) => {
    if (files[0]) { setFile(files[0]); setResultUrl(null); }
  }, []);

  const processAudio = async () => {
    if (!file) return;
    setProcessing(true);
    // Simulate processing - real audio processing requires Web Audio API
    await new Promise(r => setTimeout(r, 1500));
    const url = URL.createObjectURL(file);
    setResultUrl(url);
    setProcessing(false);
  };

  return (
    <ToolLayout titleKey="audioForge.title" subtitleKey="audioForge.subtitle" descriptionKey="audioForge.description" image="/images/tool-audio-forge.jpg">
      <div className="flex gap-2 mb-6">
        {(["convert", "trim"] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setResultUrl(null); }}
            className={`flex-1 px-4 py-3 rounded-lg text-xs tracking-wider uppercase font-medium transition-all ${
              mode === m ? "bg-[#ff0040] text-white" : "bg-[#121214] text-[#f0f0f0]/50 border border-[#ff0040]/20"
            }`}>{m}</button>
        ))}
      </div>
      <Dropzone onFiles={onFiles} accept="audio/*" multiple={false} />
      {file && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-4 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileAudio className="w-5 h-5 text-[#ff0040]" />
            <span className="text-sm text-[#f0f0f0]">{file.name}</span>
          </div>
          <button onClick={() => setFile(null)} className="text-[#f0f0f0]/20 hover:text-[#ff0040]"><Trash2 className="w-4 h-4" /></button>
        </motion.div>
      )}
      {file && !resultUrl && (
        <Button onClick={processAudio} disabled={processing}
          className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-5 rounded-xl mt-6">
          {processing ? t("common.processing") : <><Headphones className="w-4 h-4 mr-2" />{t("common.process")}</>}
        </Button>
      )}
      <AnimatePresence>
        {resultUrl && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-xl p-5 mt-6 border-[#ff0040]/30">
            <audio controls className="w-full mb-4" src={resultUrl} />
            <a href={resultUrl} download={file?.name}
              className="block text-center px-4 py-3 bg-[#ff0040] hover:bg-[#c40030] text-white rounded-lg text-xs tracking-wider uppercase font-semibold">
              {t("common.download")}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}

import { useState, useCallback } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { ToolLayout } from "@/components/ToolLayout";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Merge, Split, RotateCw, FileText,
  Trash2, Lock, Download,
} from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";

type Mode = "merge" | "split" | "compress" | "rotate" | "protect" | "unlock";

export default function PdfLab() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{ name: string; url: string } | null>(null);
  const [splitPage, setSplitPage] = useState("1");

  const onFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
  }, []);

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const outBytes = await merged.save();
      const blob = new Blob([new Uint8Array(outBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ name: "merged.pdf", url });
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const splitPdf = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pageIdx = parseInt(splitPage) - 1;
      if (pageIdx < 0 || pageIdx >= pdf.getPageCount()) {
        setProcessing(false);
        return;
      }
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [pageIdx]);
      newPdf.addPage(page);
      const outBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(outBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ name: `page-${splitPage}.pdf`, url });
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const rotatePdf = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      pdf.getPages().forEach((page) => {
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + 90) % 360));
      });
      const outBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(outBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ name: `rotated-${files[0].name}`, url });
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const protectPdf = async () => {
    if (files.length === 0 || !password) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const outBytes = await pdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });
      const blob = new Blob([new Uint8Array(outBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ name: `protected-${files[0].name}`, url });
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const modes: { key: Mode; label: string; icon: React.ElementType }[] = [
    { key: "merge", label: t("pdfLab.merge"), icon: Merge },
    { key: "split", label: t("pdfLab.split"), icon: Split },
    { key: "rotate", label: t("pdfLab.rotate"), icon: RotateCw },
    { key: "protect", label: t("pdfLab.protect"), icon: Lock },
  ];

  return (
    <ToolLayout
      titleKey="pdfLab.title"
      subtitleKey="pdfLab.subtitle"
      descriptionKey="pdfLab.description"
      image="/images/tool-pdf-lab.jpg"
    >
      {/* Modes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <button key={m.key} onClick={() => { setMode(m.key); setResult(null); }}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-xs tracking-wider uppercase font-medium transition-all ${
                mode === m.key ? "bg-[#ff0040] text-white" : "bg-[#121214] text-[#f0f0f0]/50 border border-[#ff0040]/20"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>

      <Dropzone onFiles={onFiles} accept=".pdf" multiple={mode === "merge"} />

      {/* Files */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-4 mt-6 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-[#ff0040] shrink-0" />
                  <span className="text-sm text-[#f0f0f0] truncate">{f.name}</span>
                  <span className="text-xs text-[#f0f0f0]/30 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-[#f0f0f0]/20 hover:text-[#ff0040] ml-2">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split page input */}
      {mode === "split" && files.length > 0 && (
        <div className="glass-panel rounded-xl p-4 mt-4">
          <label className="text-xs tracking-wider uppercase text-[#f0f0f0]/50 mb-2 block">Page Number</label>
          <input type="number" value={splitPage} onChange={(e) => setSplitPage(e.target.value)}
            min="1" className="bg-[#0a0a0a] border border-[#ff0040]/20 rounded-lg px-3 py-2 text-sm text-[#f0f0f0] w-24 font-jetbrains" />
        </div>
      )}

      {/* Password */}
      {mode === "protect" && files.length > 0 && (
        <div className="glass-panel rounded-xl p-4 mt-4">
          <label className="text-xs tracking-wider uppercase text-[#f0f0f0]/50 mb-2 block">{t("archiveForge.password")}</label>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#ff0040]/40" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password" className="flex-1 bg-[#0a0a0a] border border-[#ff0040]/20 rounded-lg px-3 py-2 text-sm text-[#f0f0f0] outline-none focus:border-[#ff0040] font-jetbrains" />
          </div>
        </div>
      )}

      {/* Action */}
      {files.length > 0 && !result && (
        <div className="mt-6">
          {mode === "merge" && files.length >= 2 && (
            <Button onClick={mergePdfs} disabled={processing} className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-6 rounded-xl">
              {processing ? t("common.processing") : <><Merge className="w-4 h-4 mr-2" />{t("pdfLab.merge")}</>}
            </Button>
          )}
          {mode === "split" && (
            <Button onClick={splitPdf} disabled={processing} className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-6 rounded-xl">
              {processing ? t("common.processing") : <><Split className="w-4 h-4 mr-2" />{t("pdfLab.split")}</>}
            </Button>
          )}
          {mode === "rotate" && (
            <Button onClick={rotatePdf} disabled={processing} className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-6 rounded-xl">
              {processing ? t("common.processing") : <><RotateCw className="w-4 h-4 mr-2" />{t("pdfLab.rotate")}</>}
            </Button>
          )}
          {mode === "protect" && (
            <Button onClick={protectPdf} disabled={processing || !password} className="w-full bg-[#ff0040] hover:bg-[#c40030] text-white font-orbitron tracking-wider text-xs uppercase py-6 rounded-xl">
              {processing ? t("common.processing") : <><Lock className="w-4 h-4 mr-2" />{t("pdfLab.protect")}</>}
            </Button>
          )}
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-xl p-5 mt-6 border-[#ff0040]/30">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#ff0040]" />
              <div>
                <p className="text-sm text-[#f0f0f0] font-medium">{result.name}</p>
                <p className="text-xs text-[#f0f0f0]/40">{t("common.success")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={result.url} download={result.name}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#ff0040] hover:bg-[#c40030] text-white rounded-lg text-xs tracking-wider uppercase font-semibold transition-all">
                <Download className="w-4 h-4" />{t("common.download")}
              </a>
              <Button onClick={() => { setFiles([]); setResult(null); }} variant="outline" className="border-[#ff0040]/20 text-[#f0f0f0]/50 hover:text-[#ff0040]">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}

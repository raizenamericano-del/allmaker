import { Routes, Route } from "react-router";
import { Navbar } from "@/components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Tools from "./pages/Tools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/Dashboard";
import SizeMutator from "./pages/tools/SizeMutator";
import ArchiveForge from "./pages/tools/ArchiveForge";
import PdfLab from "./pages/tools/PdfLab";
import ImageForge from "./pages/tools/ImageForge";
import AudioForge from "./pages/tools/AudioForge";
import VideoForge from "./pages/tools/VideoForge";
import DeepScan from "./pages/tools/DeepScan";
import HashGen from "./pages/tools/HashGen";
import MetaCleaner from "./pages/tools/MetaCleaner";
import ConversionHub from "./pages/tools/ConversionHub";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/size-mutator" element={<SizeMutator />} />
        <Route path="/tools/archive-forge" element={<ArchiveForge />} />
        <Route path="/tools/pdf-lab" element={<PdfLab />} />
        <Route path="/tools/image-forge" element={<ImageForge />} />
        <Route path="/tools/audio-forge" element={<AudioForge />} />
        <Route path="/tools/video-forge" element={<VideoForge />} />
        <Route path="/tools/deep-scan" element={<DeepScan />} />
        <Route path="/tools/hash-generator" element={<HashGen />} />
        <Route path="/tools/metadata-cleaner" element={<MetaCleaner />} />
        <Route path="/tools/conversion-hub" element={<ConversionHub />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

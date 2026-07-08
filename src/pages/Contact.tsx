import { useTranslation } from "@/stores/i18nStore";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, MessageCircle, User, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setForm({ name: "", email: "", message: "" }); setSent(false); }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff0040]/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center mb-12">
            <h1 className="font-orbitron font-black text-3xl sm:text-4xl tracking-[0.08em] text-[#f0f0f0] mb-3">
              {t("contact.title")}
            </h1>
            <p className="text-sm text-[#f0f0f0]/40">{t("contact.subtitle")}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="space-y-6">
                <div className="glass-panel rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#ff0040]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#ff0040]" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-sm tracking-wider text-[#f0f0f0] mb-1">{t("contact.email")}</h3>
                    <a href="mailto:raizenamericano@gmail.com" className="text-xs text-[#f0f0f0]/50 hover:text-[#ff0040] transition-colors">
                      raizenamericano@gmail.com
                    </a>
                  </div>
                </div>
                <div className="glass-panel rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#ff0040]/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#ff0040]" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-sm tracking-wider text-[#f0f0f0] mb-1">{t("contact.whatsapp")}</h3>
                    <a href="https://wa.me/306942463620" target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#f0f0f0]/50 hover:text-[#ff0040] transition-colors">
                      +30 694 246 3620
                    </a>
                  </div>
                </div>
                <div className="glass-panel rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#ff0040]/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#ff0040]" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-sm tracking-wider text-[#f0f0f0] mb-1">{t("contact.developer")}</h3>
                    <p className="text-xs text-[#f0f0f0]/50">Skyy — {t("about.developer.role")}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-xs tracking-wider uppercase text-[#f0f0f0]/50 mb-1.5 block">{t("contact.name")}</label>
                  <input type="text" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required
                    className="w-full bg-[#0a0a0a] border border-[#ff0040]/20 rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] focus:border-[#ff0040] outline-none" />
                </div>
                <div>
                  <label className="text-xs tracking-wider uppercase text-[#f0f0f0]/50 mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required
                    className="w-full bg-[#0a0a0a] border border-[#ff0040]/20 rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] focus:border-[#ff0040] outline-none" />
                </div>
                <div>
                  <label className="text-xs tracking-wider uppercase text-[#f0f0f0]/50 mb-1.5 block">{t("contact.message")}</label>
                  <textarea value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))} required rows={4}
                    className="w-full bg-[#0a0a0a] border border-[#ff0040]/20 rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] focus:border-[#ff0040] outline-none resize-none" />
                </div>
                <button type="submit" disabled={sent}
                  className={`w-full py-3 rounded-lg text-xs tracking-wider uppercase font-semibold transition-all flex items-center justify-center gap-2 ${
                    sent ? "bg-green-600 text-white" : "bg-[#ff0040] hover:bg-[#c40030] text-white"
                  }`}>
                  {sent ? "Sent!" : <><Send className="w-3.5 h-3.5" />{t("contact.send")}</>}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

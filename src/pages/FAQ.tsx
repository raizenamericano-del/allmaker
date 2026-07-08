import { useTranslation } from "@/stores/i18nStore";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff0040]/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center mb-12">
            <h1 className="font-orbitron font-black text-3xl sm:text-4xl tracking-[0.08em] text-[#f0f0f0] mb-3">
              {t("faq.title")}
            </h1>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`w-full glass-panel rounded-xl p-5 text-left transition-all duration-300 ${
                    openIndex === i ? "border-[#ff0040]/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-[#ff0040] shrink-0" />
                      <span className="text-sm text-[#f0f0f0] font-medium">{faq.q}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#f0f0f0]/30 transition-transform duration-300 shrink-0 ml-2 ${openIndex === i ? "rotate-180" : ""}`} />
                  </div>
                  {openIndex === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pl-7">
                      <p className="text-xs text-[#f0f0f0]/50 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

import { Globe } from "lucide-react";
import { useTranslation } from "@/stores/i18nStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs tracking-widest uppercase text-[#f0f0f0]/70 hover:text-[#ff0040] hover:bg-transparent gap-1.5"
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === "id" ? "ID" : "EN"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#121214]/95 backdrop-blur-xl border-[#ff0040]/20"
      >
        <DropdownMenuItem
          onClick={() => setLang("id")}
          className={`text-sm cursor-pointer ${
            lang === "id"
              ? "text-[#ff0040] font-medium"
              : "text-[#f0f0f0]/70 hover:text-[#ff0040]"
          }`}
        >
          Indonesia
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLang("en")}
          className={`text-sm cursor-pointer ${
            lang === "en"
              ? "text-[#ff0040] font-medium"
              : "text-[#f0f0f0]/70 hover:text-[#ff0040]"
          }`}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

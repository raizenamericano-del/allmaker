import { useCallback, useState } from "react";
import { useTranslation } from "@/stores/i18nStore";
import { Upload, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  className?: string;
}

export function Dropzone({
  onFiles,
  accept = "*",
  multiple = true,
  maxSize = 1024 * 1024 * 1024, // 1GB
  className,
}: DropzoneProps) {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((f) => f.size <= maxSize);
      onFiles(validFiles);
    },
    [onFiles, maxSize]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      const validFiles = files.filter((f) => f.size <= maxSize);
      onFiles(validFiles);
    },
    [onFiles, maxSize]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer group",
        isDragOver
          ? "border-[#ff0040] bg-[#ff0040]/10 scale-[1.02]"
          : "border-[#ff0040]/20 bg-[#121214]/50 hover:border-[#ff0040]/50 hover:bg-[#ff0040]/5",
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="relative z-0 flex flex-col items-center gap-3">
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
            isDragOver
              ? "bg-[#ff0040]/20 text-[#ff0040]"
              : "bg-[#ff0040]/10 text-[#ff0040]/60 group-hover:text-[#ff0040] group-hover:bg-[#ff0040]/20"
          )}
        >
          {isDragOver ? (
            <File className="w-6 h-6" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>
        <p className="text-sm text-[#f0f0f0]/60">
          {isDragOver ? t("dropzone.dropText") : t("dropzone.dragText")}
        </p>
        <p className="text-xs text-[#f0f0f0]/30">
          {t("common.or")}{" "}
          <span className="text-[#ff0040]/60 group-hover:text-[#ff0040] transition-colors">
            {t("common.browse")}
          </span>
        </p>
        <p className="text-xs text-[#f0f0f0]/20 mt-1">
          {t("dropzone.maxSize")}: {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
      </div>
    </div>
  );
}

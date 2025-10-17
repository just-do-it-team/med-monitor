import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, XIcon, PaperclipIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils.ts";
import { Button } from "@/shared/ui/button.tsx";

interface FileUploadZoneProps {
  title: string;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
  clearFiles?: boolean;
}

interface FilePreview {
  file: File;
  preview: string;
}

export function FileUploadZone({
  accept,
  maxFiles = 1,
  onFilesChange,
  clearFiles = false,
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  useEffect(() => {
    if (clearFiles) {
      setFiles([]);
      setPendingFiles([]);
    }
  }, [clearFiles]);

  useEffect(() => {
    if (pendingFiles.length > 0) {
      const newFiles = pendingFiles.map((file) => ({
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "",
      }));

      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFiles].slice(0, maxFiles);
        onFilesChange(updatedFiles.map((f) => f.file));
        return updatedFiles;
      });

      setPendingFiles([]);
    }
  }, [pendingFiles, maxFiles, onFilesChange]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPendingFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      onFilesChange(newFiles.map((f) => f.file));
      return newFiles;
    });
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-lg cursor-pointer">
      {!files.length && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-3 transition-colors",
            "flex flex-col items-center justify-center gap-4",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary/50",
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-6 w-6 text-gray-400" />
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Нажмите на поле или перетащите в него файл
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {`Допустимый формат: ${accept && Object.values(accept).join(" ")}`}
            </p>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-3">
          <div className="grid grid-cols-1 gap-4">
            {files.map((file, index) => (
              <div
                key={file.file.name + index}
                className="relative group bg-indigo-50 rounded-lg p-2 flex items-center gap-3"
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                ) : (
                  <div className="h-6 w-6 rounded flex items-center justify-center">
                    <PaperclipIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className=" text-[13px] font-medium truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  aria-label="Remove file"
                >
                  <XIcon className="size-4 mr-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

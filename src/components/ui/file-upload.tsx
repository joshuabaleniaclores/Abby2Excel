import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileImage } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploadProps {
    onChange: (file: File | null) => void;
    value?: File | null;
    className?: string;
    disabled?: boolean;
}

export function FileUpload({ onChange, value, className, disabled }: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    // Cleanup preview URL on unmount or when preview changes
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onChange(file);
        }
    }, [onChange]);

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setPreview(null);
    };

    // Sync internal preview with prop value if needed (optional, but good for controlled mostly)
    useEffect(() => {
        if (!value) {
            setPreview(null);
        }
    }, [value]);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        disabled
    });

    return (
        <div className={cn("w-full transition-opacity", disabled && "opacity-50 cursor-not-allowed", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center gap-4 group min-h-[200px] overflow-hidden",
                    isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                    preview ? "border-solid border-primary/20 bg-background" : ""
                )}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full h-full flex flex-col items-center"
                        >
                            <img src={preview} alt="Upload preview" className="max-h-[300px] rounded-lg shadow-md object-contain z-10 block" />
                            <button
                                onClick={removeFile}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 shadow-sm hover:scale-110 transition-transform z-20"
                                type="button"
                                aria-label="Remove file"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <FileImage className="w-4 h-4" />
                                <span>Ready to process</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center text-center text-muted-foreground"
                        >
                            <div className="p-4 rounded-full bg-muted mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm border border-border">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-lg font-semibold text-foreground">
                                Drag & drop image here
                            </p>
                            <p className="text-sm mt-1 text-muted-foreground">
                                Supports JPG, PNG, WEBP
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

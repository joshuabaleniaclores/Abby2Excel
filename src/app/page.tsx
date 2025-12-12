"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadDeliveryExcel, DeliveryItem } from "@/lib/excel";
import { Loader2, Table as TableIcon, Download, AlertCircle, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Footer } from "@/components/footer";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<DeliveryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExtracted, setHasExtracted] = useState<boolean>(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      setError(null);
      setHasExtracted(false);
      setItems([]);
    }
  };

  const handleExtract = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to extract data");
      }

      setItems(json.data || []);
      setHasExtracted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemChange = (index: number, field: keyof DeliveryItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleDownload = () => {
    downloadDeliveryExcel(items);
  };

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 font-sans selection:bg-primary/20 relative">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <ModeToggle />
      </div>
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <header className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 pb-2">
              Abby2Excel
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Upload a delivery receipt, and we'll extract the data into a formatted Excel file automatically using AI.
          </motion.p>
        </header>

        {/* Configuration & Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-8 p-6 md:p-8 rounded-2xl border bg-card shadow-sm"
        >

          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Upload Image</label>
            <FileUpload onChange={handleFileChange} value={file} disabled={isLoading} />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleExtract}
              disabled={!file || isLoading}
              size="lg"
              className="w-full md:w-auto relative overflow-hidden transition-all duration-300 transform active:scale-95 text-base px-8 h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Extract Operations
                </>
              )}
            </Button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

        </motion.div>


        {/* Results Section */}
        <AnimatePresence>
          {hasExtracted && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TableIcon className="w-6 h-6 text-primary" />
                  Extracted Data
                </h2>
                <Button onClick={handleDownload} variant="default" className="w-full sm:w-auto shadow-lg shadow-primary/25">
                  <Download className="mr-2 h-4 w-4" />
                  Download Excel
                </Button>
              </div>

              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left min-w-[800px]">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold whitespace-nowrap">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Qty</th>
                        <th className="px-4 py-3">Unit</th>
                        <th className="px-4 py-3">Item Description</th>
                        <th className="px-4 py-3">Control No.</th>
                        <th className="px-4 py-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="p-2">
                            <input
                              value={item.date}
                              onChange={(e) => handleItemChange(idx, 'date', e.target.value)}
                              className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                              className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.unit}
                              onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                              className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.item}
                              onChange={(e) => handleItemChange(idx, 'item', e.target.value)}
                              className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.drNumber}
                              onChange={(e) => handleItemChange(idx, 'drNumber', e.target.value)}
                              className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.remarks || ""}
                              onChange={(e) => handleItemChange(idx, 'remarks', e.target.value)}
                              className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 placeholder:text-muted-foreground/50"
                              placeholder="-"
                            />
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-muted-foreground">
                            No items found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <Footer />
    </main>
  );
}

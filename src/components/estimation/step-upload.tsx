"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { EstimationFormValues } from "@/types/estimation-form";

interface UploadedFile {
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  category: string;
}

interface StepUploadProps {
  form: UseFormReturn<EstimationFormValues>;
  onNext: () => void;
}

export function StepUpload({ form, onNext }: StepUploadProps) {
  const files = form.watch("attachments.files") || [];
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    if (files.length + selectedFiles.length > 20) {
      alert("Maximum 20 files allowed");
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        return {
          fileName: file.name,
          fileUrl: data.url,
          fileType: file.type,
          fileSize: file.size,
          category: "reference" as const,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      form.setValue("attachments.files", [...files, ...uploadedFiles]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload some files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_f: UploadedFile, i: number) => i !== index);
    form.setValue("attachments.files", updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Upload Files
        </h2>
        <p className="text-muted-foreground text-lg">
          Upload floor plans, CAD files, room images, or reference materials (max 20 files).
        </p>
      </div>

      <Card>
        <CardContent className="pt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-12 h-12 mb-4 text-muted-foreground"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, CAD, Images, Videos (MAX. 20 files)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.mp4,.mov"
                  onChange={handleFileChange}
                  disabled={isUploading || files.length >= 20}
                />
              </label>
            </div>

            {isUploading && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Uploading files...</p>
              </div>
            )}

            {files.length > 0 && (
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Uploaded Files ({files.length}/20)
                </Label>
                <div className="space-y-2">
                  {files.map((file: UploadedFile, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border-2 border-border bg-background"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <svg
                          className="w-5 h-5 text-muted-foreground flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.fileSize)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 text-destructive hover:text-destructive/80 flex-shrink-0"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parsePGN } from "@/lib/chess-utils";

interface PGNUploadProps {
  onPGNLoaded: (pgn: string) => void;
}

export default function PGNUpload({ onPGNLoaded }: PGNUploadProps) {
  const [pgnText, setPgnText] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handlePGNSubmit = () => {
    if (!pgnText.trim()) {
      setError("Please enter PGN text");
      return;
    }

    const result = parsePGN(pgnText);
    if (!result.isValid) {
      setError(result.error || "Invalid PGN format");
      return;
    }

    setError("");
    onPGNLoaded(pgnText);
  };

  const handleFileUpload = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".pgn")) {
        setError("Please upload a .pgn file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setPgnText(content);

        const result = parsePGN(content);
        if (result.isValid) {
          onPGNLoaded(content);
          setError("");
        } else {
          setError(result.error || "Invalid PGN format");
        }
      };
      reader.readAsText(file);
    },
    [onPGNLoaded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-8 flex flex-col items-center text-center">
      {/* File Upload */}
      <Card className="border border-white/5 bg-minimal w-1/2 rounded">
        <CardHeader>
          <CardTitle className="font-bold text-cream">Upload PGN File</CardTitle>
          <CardDescription className="text-gray-400">
            Drag and drop or click to select a .pgn file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <Upload className="w-12 h-12 text-cream mx-auto mb-4" />
            <p className="text-sm text-gray-400 mb-4">
              Drop your PGN file here or click to browse
            </p>
            <input
              type="file"
              accept=".pgn"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
              id="pgn-file-input"
            />
            <label htmlFor="pgn-file-input">
              <Button variant="outline" asChild className="bg-chess border-white/5 hover:bg-cream text-ink">
                <span>
                  <FileText className="w-4 h-4" />
                  <span className="font-bold">Choose File</span>
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Text Input */}
      <Card className="w-1/2 rounded border border-white/5 bg-minimal">
        <CardHeader >
          <CardTitle className="text-cream">Or Paste PGN Text</CardTitle>
          <CardDescription className="text-gray-400">
            Copy and paste PGN notation directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="paste your full pgn text here..."
            value={pgnText}
            onChange={(e) => setPgnText(e.target.value)}
            rows={10}
            className="font-mono text-sm bg-transparent border-white/5 text-cream w-full h-38"
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handlePGNSubmit} className="w-full bg-chess border-white/5 hover:bg-cream text-ink">
            <span className="font-bold">Load Game</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

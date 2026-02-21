"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export default function CenterModal({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
}: CenterModalProps) {
  const prefersReducedMotion = useReducedMotion();

  // Close on ESC key when modal is open
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (!isOpen) return;

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight =
        scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]",
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/55"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.14, ease: "easeOut" }
            }
          />

          {/* Modal */}
          <motion.div
            className={cn(
              "relative bg-kala border border-white/5 rounded w-full max-h-[90vh] overflow-hidden transform-gpu shadow-xl",
              sizeClasses[size],
            )}
            onClick={(e) => e.stopPropagation()}
            initial={
              prefersReducedMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.97, y: 8 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.98, y: 6 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 32, mass: 0.8 }
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-white/10">
              <h2 className="text-xl font-bold text-cream ml-5">{title}</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-chess hover:text-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

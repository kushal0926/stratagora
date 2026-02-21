"use client";

import { useCallback, useRef, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import DockSidebar from "@/components/layout/docker-sidebar";
import CenterModal from "@/components/layout/center-page";
import QuickAnalyzeSection from "@/components/quick-analyze-section";
import { toast } from "sonner";
import Title from "@/components/title";

const LoginModal = dynamic(() => import("@/components/auth/login"));
const SignupModal = dynamic(() => import("@/components/auth/signup"));
const DashboardModalContent = dynamic(
  () => import("@/components/modals/dashboard-content"),
);
const GamesModalContent = dynamic(() => import("@/components/modals/games-content"));
const ChatModalContent = dynamic(() => import("@/components/modals/chat-content"));
const SettingsModalContent = dynamic(
  () => import("@/components/modals/settings-content"),
);
const GameViewModalContent = dynamic(
  () => import("@/components/modals/games-view-content"),
  {
    loading: () => (
      <div className="flex items-center justify-center p-10 text-sm text-gray-400">
        Loading game view...
      </div>
    ),
  },
);

const preloaders = {
  login: () => import("@/components/auth/login"),
  signup: () => import("@/components/auth/signup"),
  dashboard: () => import("@/components/modals/dashboard-content"),
  games: () => import("@/components/modals/games-content"),
  chat: () => import("@/components/modals/chat-content"),
  settings: () => import("@/components/modals/settings-content"),
  "game-view": () => import("@/components/modals/games-view-content"),
};

type ModalType =
  | "login"
  | "signup"
  | "dashboard"
  | "games"
  | "analyze"
  | "chat"
  | "settings"
  | "game-view"
  | null;

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const quickAnalyzeRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const handleItemClick = useCallback((itemId: string) => {
    if (itemId === "analyze") {
      setActiveModal(null);
      quickAnalyzeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setActiveModal(itemId as ModalType);
  }, []);

  const handleItemHover = useCallback((itemId: string) => {
    if (itemId in preloaders) {
      preloaders[itemId as keyof typeof preloaders]();
    }
  }, []);

  const handleLoginRequired = useCallback(() => {
    setActiveModal("login");
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      setActiveModal(null);
      router.refresh();
    } catch {
      toast.error("Failed to logout");
    }
  }, [router]);

  const handleLoginSuccess = useCallback(() => {
    setActiveModal(null);
    router.refresh();
  }, [router]);

  const handleGameClick = useCallback((gameId: string) => {
    setSelectedGameId(gameId);
    setActiveModal("game-view");
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelectedGameId(null);
  }, []);

  const getModalTitle = useCallback((): string => {
    switch (activeModal) {
      case "login":
        return "Sign In";
      case "signup":
        return "Create Account";
      case "dashboard":
        return "Dashboard";
      case "games":
        return "My Games";
      case "chat":
        return "AI Chess Coach";
      case "settings":
        return "Settings";
      case "game-view":
        return "Game Details";
      default:
        return "";
    }
  }, [activeModal]);

  const getModalSize = useCallback(() => {
    if (activeModal === "game-view") return "full";
    if (activeModal === "games") return "xl";
    if (activeModal === "dashboard") return "xl";
    if (activeModal === "settings") return "lg";
    return "md";
  }, [activeModal]);

  const isModalOpen =
    activeModal !== null &&
    activeModal !== "analyze" &&
    (activeModal !== "game-view" || selectedGameId !== null);

  return (
    <div className="min-h-screen bg-kala">
      <nav className="flex justify-center pt-10">
        <Title />
      </nav>
      {/* Dock Sidebar */}
      <DockSidebar
        onItemClick={handleItemClick}
        onItemHover={handleItemHover}
        onLoginRequired={handleLoginRequired}
        onLogout={handleLogout}
        activeItem={activeModal}
      />

      {/* Main Content - Quick Analyze */}
      <div className="ml-24 min-h-screen flex items-center justify-center p-8">
        <div ref={quickAnalyzeRef} className="w-full max-w-7xl">
          {/* Quick Analyze */}
          <QuickAnalyzeSection isLoggedIn={!!session} />
        </div>
      </div>

      {/* Modals */}
      <CenterModal isOpen={isModalOpen} onClose={closeModal} title={getModalTitle()} size={getModalSize()}>
        {activeModal === "login" && (
          <LoginModal
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setActiveModal("signup")}
          />
        )}
        {activeModal === "signup" && (
          <SignupModal
            onSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setActiveModal("login")}
          />
        )}
        {activeModal === "dashboard" && session && (
          <DashboardModalContent userName={session.user.name || "User"} />
        )}
        {activeModal === "games" && <GamesModalContent onGameClick={handleGameClick} />}
        {activeModal === "chat" && <ChatModalContent />}
        {activeModal === "settings" && session && (
          <SettingsModalContent user={session.user} />
        )}
        {activeModal === "game-view" && selectedGameId && (
          <GameViewModalContent gameId={selectedGameId} onClose={closeModal} />
        )}
      </CenterModal>
    </div>
  );
}

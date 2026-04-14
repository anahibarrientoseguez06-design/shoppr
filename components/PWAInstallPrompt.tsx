"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "shoppr-pwa-prompt-dismissed";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // No mostrar si el usuario ya lo cerró antes
    if (localStorage.getItem(STORAGE_KEY)) return;

    // No mostrar si ya está instalada como PWA (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Mostrar el banner después de 3 segundos
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      dismiss();
    }
  };

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
    setDeferredPrompt(null);
  };

  if (!visible || !deferredPrompt) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar Shoppr"
      className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-96 animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3">
        {/* Ícono */}
        <div className="shrink-0 w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
          <span className="text-white font-black text-xl">S</span>
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">
            Instalá Shoppr en tu celular
          </p>
          <p className="text-gray-500 text-xs mt-0.5 leading-snug">
            Accedé más rápido y usala como una app nativa.
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={dismiss}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="shrink-0 text-gray-400 hover:text-gray-600 p-0.5 -mt-0.5 -mr-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

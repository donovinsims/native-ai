"use client";

import { createContext, useContext, ReactNode } from "react";
import { useModals } from "@/hooks/useModal";
import { SubscribeModal, SubmitAppModal } from "@/components/modals";

interface ModalContextType {
  openSubscribeModal: () => void;
  openSubmitAppModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const { subscribeModal, submitAppModal } = useModals();

  return (
    <ModalContext.Provider
      value={{
        openSubscribeModal: subscribeModal.open,
        openSubmitAppModal: submitAppModal.open,
      }}
    >
      {children}
      <SubscribeModal
        isOpen={subscribeModal.isOpen}
        onClose={subscribeModal.close}
      />
      <SubmitAppModal
        isOpen={submitAppModal.isOpen}
        onClose={submitAppModal.close}
      />
    </ModalContext.Provider>
  );
}

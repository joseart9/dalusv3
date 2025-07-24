"use client";

import {
  Dialog as ModalRoot,
  DialogTrigger as ModalTrigger,
  DialogContent as ModalContent,
  DialogHeader as ModalHeader,
  DialogFooter as ModalFooter,
  DialogTitle as ModalTitle,
  DialogDescription as ModalDescription,
  DialogClose as ModalClose,
  DialogOverlay as ModalOverlay,
  DialogPortal as ModalPortal,
} from "@/components/ui/dialog";

// Optionally, you can wrap or extend these components for custom logic or styling
// For now, we simply re-export them under Modal* names for a custom API

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Footer: ModalFooter,
  Title: ModalTitle,
  Description: ModalDescription,
  Close: ModalClose,
  Overlay: ModalOverlay,
  Portal: ModalPortal,
});

export {
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
  ModalOverlay,
  ModalPortal,
};

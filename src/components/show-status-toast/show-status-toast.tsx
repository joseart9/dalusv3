"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface ShowStatusToastProps {
  status?: string;
  message: string;
  key: string;
}

export function ShowStatusToast({
  status,
  message,
  key,
}: ShowStatusToastProps) {
  useEffect(() => {
    if (status === "success") {
      toast.success(message);
    } else if (status === "error") {
      toast.error(message);
    }
  }, [status, message, key]);

  return null;
}

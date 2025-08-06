"use client";

import Link from "next/link";
import { SETTINGS_NAVBAR_OPTIONS } from "./options";
import { Button } from "@/components/button";
import { usePathname } from "next/navigation";

export function SettingsNavbar() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {SETTINGS_NAVBAR_OPTIONS.map((option) => (
        <Link key={option.href} href={option.href} className="w-full">
          <Button
            variant={pathname === option.href ? "default" : "outline"}
            className="w-full"
          >
            {option.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}

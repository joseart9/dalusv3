import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";
import {
  SidebarProvider,
  SidebarTrigger,
  AppSidebar,
  SidebarInset,
} from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { AuthGuard } from "@/components/auth-guard/auth-guard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dalus - Sistema de base de datos",
  description: "Sistema de base de datos para la empresa Dalus",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <QueryProvider>
          <AuthProvider>
            <AuthGuard>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                      <SidebarTrigger className="-ml-1 cursor-pointer" />
                      <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                      />
                      <h1 className="text-lg font-medium">Dalus Database</h1>
                    </div>
                  </header>
                  <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
                    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4">
                      <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                      >
                        {children}
                      </ThemeProvider>
                    </div>
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </AuthGuard>
          </AuthProvider>
          <Toaster
            className="font-sans"
            position="top-right"
            toastOptions={{
              className:
                "bg-popover text-popover-foreground border border-border shadow-md rounded-lg p-4 font-sans",
              descriptionClassName: "text-muted-foreground",
              classNames: {
                actionButton:
                  "bg-primary text-primary-foreground rounded-md px-3 py-1 text-sm font-medium hover:bg-primary/90 transition",
                cancelButton:
                  "bg-destructive text-destructive-foreground rounded-md px-3 py-1 text-sm font-medium hover:bg-destructive/90 transition",
                closeButton: "hover:bg-muted/50 rounded-full p-1 transition",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}

import { SettingsNavbar } from "./settings-navbar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="col-span-2">
        <SettingsNavbar />
      </div>
      <div className="col-span-10 p-2">{children}</div>
    </div>
  );
}

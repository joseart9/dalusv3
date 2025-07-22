import { getWelder } from "@/server/services/welders";
import { notFound } from "next/navigation";
import { WelderViewComponent } from "../welder-view-component";

export async function MainView({ id }: { id: string }) {
  const { data: welder } = await getWelder(id);

  if (!welder) {
    notFound();
  }

  return <WelderViewComponent welder={welder} />;
}

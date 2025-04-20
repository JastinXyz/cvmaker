import { AppPage } from "~/pages/app";
import type { Route } from "./+types/app";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Curriculum Vitae Builder - App" },
    { name: "description", content: "Free and open source Curriculum Vitae Builder" },
  ];
}

export default function App() {
  return <AppPage />;
}

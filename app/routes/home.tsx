import { Welcome } from "~/pages/welcome";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Curriculum Vitae Builder" },
    { name: "description", content: "Free and open source Curriculum Vitae Builder" },
  ];
}

export default function Home() {
  return <Welcome />;
}

import { Welcome } from "~/pages/welcome";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Maker" },
    { name: "description", content: "Free Resume Maker" },
  ];
}

export default function Home() {
  return <Welcome />;
}

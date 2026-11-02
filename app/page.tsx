import { HomePage } from "@/components/home";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "Gabriel Wan",
  description: "I'm a computer science student at NUS. I build small apps and tools, mostly for problems around me, and write about how they went.",
  path: "/",
  siteName: null,
});

export default function Page() {
  return <HomePage />;
}

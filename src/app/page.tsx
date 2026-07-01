import { redirect } from "next/navigation";

/** The app entry just forwards to the dashboard; the shell guards auth. */
export default function Home() {
  redirect("/dashboard");
}

import { redirect } from "next/navigation";

export default function Home() {
	redirect("/login"); // go to home page to start role based demo flow
}

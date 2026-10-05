import Link from "next/link";
import { PageIntro } from "@/components/ui";
export default function NotFound() { return <><PageIntro title="Let’s get you back in play."><p>We couldn’t find that page.</p></PageIntro><div className="container section"><Link className="button" href="/">Back to Home</Link></div></>; }

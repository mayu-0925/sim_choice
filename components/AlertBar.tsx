import Link from "next/link";
import type { SiteAlert } from "@/lib/types";

type Props = {
  alert: SiteAlert;
};

export default function AlertBar({ alert }: Props) {
  return (
    <div className="bg-red-500 text-white text-center py-2 px-4 text-sm font-bold">
      {alert.message}{" "}
      <Link
        href={alert.linkHref}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="underline hover:opacity-80"
      >
        {alert.linkText}
      </Link>
    </div>
  );
}

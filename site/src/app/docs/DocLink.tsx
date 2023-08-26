"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TextLink from "@/components/Link";
import { exhausted } from "@/util/exhausted";

export default function DocLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const pathname = usePathname();
  return (
    <TextLink selected={pathname.startsWith(href)}>
      {({ style, ...restProps }) =>
        exhausted(restProps) && (
          <Link href={href} style={style}>
            {children}
          </Link>
        )
      }
    </TextLink>
  );
}

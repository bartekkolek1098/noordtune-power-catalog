import Image from "next/image";

import {assetPath} from "@/lib/site-path";
import {cn} from "@/lib/utils";

export function NoordTuneLogo({
  compact = false,
  className,
  tagline = "Chiptuning & Auto Diagnostiek"
}: {
  compact?: boolean;
  className?: string;
  tagline?: string;
}) {
  return (
    <span
      aria-label={`NoordTune.nl - ${tagline}`}
      className={cn(
        "relative block shrink-0 overflow-hidden",
        compact ? "h-12 w-[166px]" : "h-[58px] w-[202px] md:h-[72px] md:w-[250px]",
        className
      )}
    >
      <Image
        alt={`NoordTune.nl - ${tagline}`}
        className="object-contain object-left"
        fill
        priority={!compact}
        sizes={compact ? "166px" : "(min-width: 768px) 250px, 202px"}
        src={assetPath("/brand/v8/header-logo-dark.png")}
      />
    </span>
  );
}

import Image from "next/image";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { outer: "w-7 h-7", text: "text-xs" },
  md: { outer: "w-9 h-9", text: "text-sm" },
  lg: { outer: "w-12 h-12", text: "text-base" },
};

export function Avatar({ name, avatarUrl, size = "md" }: AvatarProps) {
  const { outer, text } = sizeMap[size];

  if (avatarUrl) {
    return (
      <div className={`${outer} relative rounded-full overflow-hidden flex-shrink-0`}>
        <Image src={avatarUrl} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${outer} rounded-full bg-sage-100 dark:bg-stone-700 text-coffee dark:text-stone-200 flex items-center justify-center font-semibold flex-shrink-0 ${text}`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}

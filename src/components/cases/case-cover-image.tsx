import Image from "next/image";

interface CaseCoverImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  containerClassName?: string;
  unoptimized?: boolean;
}

export default function CaseCoverImage({
  src,
  alt,
  className = "object-cover",
  containerClassName,
  unoptimized = false,
}: CaseCoverImageProps) {
  if (!src) {
    return (
      <div
        className={
          containerClassName ??
          "relative w-full h-full min-h-[200px] bg-[#E8E8ED] flex items-center justify-center"
        }
      >
        <span className="font-manrope font-semibold text-sm text-[#353556]/50 px-4 text-center">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClassName ?? "relative w-full h-full"}>
      <Image
        src={src}
        fill
        alt={alt}
        className={className}
        unoptimized={unoptimized}
      />
    </div>
  );
}

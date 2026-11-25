import { cn } from "@/shared/lib";

interface SkeletonBlockProps {
  /** 크기와 모서리는 쓰는 쪽에서 실제 요소와 같게 정해요. */
  className?: string;
  /** 어두운 배경(나발 심기) 위에서는 밝은 블록을 써요. */
  tone?: "light" | "dark";
}

/**
 * 서버 값이 들어갈 자리를 채우는 회색 블록이에요. 화면 틀은 실제 마크업을 그대로 쓰고 값 자리만 이걸로 바꿔요.
 * TDS Skeleton은 정해진 막대만 쌓아서 직접 만든 배치(보살 무대, 2열 카드)를 따라가지 못해 따로 둬요.
 */
const SkeletonBlock = ({ className, tone = "light" }: SkeletonBlockProps) => (
  <div
    aria-hidden
    className={cn(
      "motion-safe:animate-pulse",
      tone === "light" ? "bg-(--adaptiveGreyOpacity100)" : "bg-on-fill-opacity-10",
      className,
    )}
  />
);

export default SkeletonBlock;

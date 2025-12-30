export default function ArrowIcon({
  direction = "right",
  className = "",
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transform: direction === "left" ? "rotate(-180deg)" : "rotate(0deg)",
      }}
    >
      <path
        d="M0.999244 7.78831H15.1414M15.1414 7.78831L8.35316 14.5765M15.1414 7.78831L8.35316 1.00008"
        stroke="#0B0B0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

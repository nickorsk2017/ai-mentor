type ChevronUpIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function ChevronUpIcon({
  className,
  width = 14,
  height = 14,
}: ChevronUpIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 15L12 9L18 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

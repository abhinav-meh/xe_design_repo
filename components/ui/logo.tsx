/* Crow logomark — angular bird in the brand accent. Uses currentColor so it
   tracks the --primary token (set color via className, e.g. text-primary). */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 73 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M49.303 23.842L40.499 47.529L67.121 55.914L49.303 23.842Z" fill="currentColor" />
      <path d="M39.238 49.674L11.879 89.8L40.251 67.913L39.238 49.674Z" fill="currentColor" />
      <path d="M41.4 67.331L66.623 56.993L40.366 48.724L41.4 67.331Z" fill="currentColor" />
      <path d="M59.519 39.889L68.112 55.278L72.509 35.292L59.519 39.889Z" fill="currentColor" />
      <path d="M39.529 46.754L48.455 22.739L0 0L39.529 46.754Z" fill="currentColor" />
    </svg>
  );
}

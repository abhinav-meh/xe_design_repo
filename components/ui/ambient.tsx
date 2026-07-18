/*
  Ambient background — faint chartreuse glow, top and bottom, so large screens
  read as intentional atmosphere instead of empty black. Purely decorative and
  static (no motion), sits behind all content, and never intercepts pointers.
*/
export function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[20%] left-1/2 h-[55vh] w-[85vw] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[130px]" />
      <div className="absolute -bottom-[22%] left-1/2 h-[45vh] w-[70vw] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[130px]" />
    </div>
  );
}

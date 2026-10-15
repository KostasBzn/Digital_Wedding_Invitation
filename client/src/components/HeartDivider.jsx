import heart from "../assets/heart_1.png";

// Heart with a line on each side. Size it per use:
// <HeartDivider lineWidth="w-10 sm:w-20" heartSize="w-4 sm:w-5" className="mt-6" />
export default function HeartDivider({
  lineWidth = "w-14 sm:w-24",
  heartSize = "w-5 sm:w-6",
  className = "",
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 sm:gap-4 ${className}`}
    >
      <span className={`${lineWidth} border-t border-ink/40`} />
      <img src={heart} alt="" className={`${heartSize} h-auto`} />
      <span className={`${lineWidth} border-t border-ink/40`} />
    </div>
  );
}

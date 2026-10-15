import cornerTL from "../assets/eucalyptus_corner_top_left.png";
import cornerTR from "../assets/eucalyptus_corner_top_right.png";
import cornerBL from "../assets/eucalyptus_corner_bottom_left.png";
import cornerBR from "../assets/eucalyptus_corner_bottom_right.png";

const CORNERS = {
  tl: { src: cornerTL, position: "top-0 left-0 reveal-tl" },
  tr: { src: cornerTR, position: "top-0 right-0 reveal-tr" },
  bl: { src: cornerBL, position: "bottom-0 left-0 reveal-bl" },
  br: { src: cornerBR, position: "bottom-0 right-0 reveal-br" },
};

// Eucalyptus corner decoration. `at` is one of: tl, tr, bl, br
function Decor({ at, className = "", delay = 0 }) {
  const { src, position } = CORNERS[at];

  return (
    <div
      aria-hidden="true"
      style={{ "--reveal-delay": `${delay}ms` }}
      className={`reveal pointer-events-none absolute z-0 ${position} ${className}`}
    >
      <img
        src={src}
        alt=""
        draggable="false"
        className="h-auto w-full select-none"
      />
    </div>
  );
}

export default Decor;

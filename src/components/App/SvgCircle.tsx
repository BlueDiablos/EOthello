function SvgCircle(fill: string) {
  return (
    <svg width="100" height="100">
      <circle
        cx="45"
        cy="45"
        r="40"
        fill={fill}
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  );
}

export default SvgCircle;

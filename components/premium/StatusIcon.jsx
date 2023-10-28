export default function StatusIcon({ color, height, width }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="6" fill={color} />
      <circle
        cx="11"
        cy="11"
        r="5"
        stroke="white"
        stroke-opacity="0.21"
        stroke-width="2"
      />
    </svg>
  );
}

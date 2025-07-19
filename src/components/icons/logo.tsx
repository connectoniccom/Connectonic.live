import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 14l4-4 4 4" />
    <path d="m12 14 4-4 4 4" />
    <path d="M4 18h8" />
    <path d="M12 18h8" />
    <path d="M8 6V4h8v2" />
    <path d="M12 10v-1" />
  </svg>
);

export default Logo;

import React from 'react';

export function TextColorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 8.8H9.5L10.4 11H12.5L7.75 0H6.25L1.5 11H3.6L4.5 8.8ZM7 1.98L8.87 7H5.13L7 1.98Z"
        fill="currentColor"
      />
      <path d="M0 13V15H14V13H0ZM4.5 1.98Z" fill="currentColor" />
    </svg>
  );
}

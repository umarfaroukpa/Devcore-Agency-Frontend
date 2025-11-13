import { ImageResponse } from 'next/og';

// Export runtime to use the Edge environment for image generation
export const runtime = 'edge';

// Define the exact size for the icon (e.g., a favicon)
export const size = {
  width: 32,
  height: 32,
};

// Define the output format
export const contentType = 'image/png';

export default function Icon() {
  // New Gradient: A more balanced blend of vibrant purples, blues, and greens.
  const gradientStart = '#6A11CB'; // Deep Violet
  const gradientMid = '#2575FC';   // Bright Blue
  const gradientEnd = '#4DFF7D';   // Vibrant Green

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18, // Text size (though no text is used, good practice)
          background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientMid} 50%, ${gradientEnd} 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white', // Color for the SVG lines
          borderRadius: '6px', // Rounded corners for the icon
        }}
      >
        {/*
            SVG Icon: A modern, interconnected network structure symbolizing connectivity and data flow.
        */}
        <svg
          width="24" // Slightly larger SVG within the 32x32 container for better visibility
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor" // Uses the 'color: white' from the parent div
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main interconnected network structure */}
          <path d="M8 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" /> {/* Outer box/frame */}
          
          <line x1="12" y1="6" x2="12" y2="18" /> {/* Central vertical divider */}
          <line x1="6" y1="12" x2="18" y2="12" /> {/* Central horizontal divider */}

          {/* Diagonal connections, creating the 'X' or mesh effect */}
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />

          {/* Small circles at key intersection points to represent nodes/data points */}
          <circle cx="12" cy="6" r="1.5" />    {/* Top center */}
          <circle cx="12" cy="18" r="1.5" />   {/* Bottom center */}
          <circle cx="6" cy="12" r="1.5" />    {/* Left center */}
          <circle cx="18" cy="12" r="1.5" />   {/* Right center */}
          <circle cx="12" cy="12" r="1.5" />   {/* Middle center */}
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
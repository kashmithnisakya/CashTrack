import React from 'react';

interface CashTrackLogoProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'icon' | 'text';
}

export const CashTrackLogo: React.FC<CashTrackLogoProps> = ({ 
  size = 40, 
  className = '',
  variant = 'full'
}) => {
  const logoIcon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="[stop-color:hsl(var(--primary))]" />
          <stop offset="50%" className="[stop-color:hsl(var(--primary-glow))]" />
          <stop offset="100%" className="[stop-color:hsl(var(--secondary))]" />
        </linearGradient>
        
        <linearGradient id="wealthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="[stop-color:hsl(var(--secondary))]" />
          <stop offset="100%" className="[stop-color:hsl(var(--warning))]" />
        </linearGradient>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background Circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#primaryGradient)"
        filter="url(#glow)"
        opacity="0.9"
      />
      
      {/* Inner Circle for depth */}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke="white"
        strokeWidth="1"
        opacity="0.3"
      />
      
      {/* Dollar Sign - Main Symbol */}
      <g transform="translate(50,50)">
        {/* Dollar Sign Vertical Line */}
        <line
          x1="0"
          y1="-25"
          x2="0"
          y2="25"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#glow)"
        />
        
        {/* Dollar Sign S Curve */}
        <path
          d="M-12,-15 C-12,-20 -8,-22 -4,-22 L8,-22 C12,-22 16,-18 16,-14 C16,-10 12,-8 8,-8 L-8,-8 C-12,-8 -16,-4 -16,0 C-16,4 -12,8 -8,8 L4,8 C8,8 12,10 12,15"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
      </g>
      
      {/* Decorative Elements - Growth Arrows */}
      <g opacity="0.7">
        <path
          d="M25,25 L32,18 L25,18 Z"
          fill="url(#wealthGradient)"
        />
        <path
          d="M75,75 L68,82 L75,82 Z"
          fill="url(#wealthGradient)"
          transform="rotate(180 71.5 79)"
        />
      </g>
      
      {/* Sparkle Effects */}
      <g opacity="0.8">
        <circle cx="20" cy="30" r="2" fill="white">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="80" cy="70" r="1.5" fill="white">
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>
        <circle cx="30" cy="80" r="1" fill="white">
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="2.5s"
            repeatCount="indefinite"
            begin="1s"
          />
        </circle>
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return logoIcon;
  }

  if (variant === 'text') {
    return (
      <span className={`font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent ${className}`}>
        CashTrack
      </span>
    );
  }

  // Full logo with icon and text
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoIcon}
      <span className="font-bold text-2xl bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent drop-shadow-sm">
        CashTrack
      </span>
    </div>
  );
};
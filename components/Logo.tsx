import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => (
  <img 
    src="/public/images/logosib.png" 
    alt="StayinUBUD" 
    className={className}
  />
);
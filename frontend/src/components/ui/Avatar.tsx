import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'h-6 w-6 text-xs', md: 'h-8 w-8 text-sm', lg: 'h-10 w-10 text-base' };

const colors = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500',
  'bg-orange-500', 'bg-pink-500', 'bg-teal-500',
];

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`${sizeMap[size]} ${colors[colorIndex]} ${className} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      title={name}
    >
      {initials}
    </div>
  );
};

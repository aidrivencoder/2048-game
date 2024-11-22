import React from 'react';

interface TileProps {
  value: number;
  position: [number, number];
  isNew?: boolean;
  isMerging?: boolean;
}

const colors: Record<number, string> = {
  2: 'bg-[#eee4da] text-[#776e65]',
  4: 'bg-[#ede0c8] text-[#776e65]',
  8: 'bg-[#f2b179] text-white',
  16: 'bg-[#f59563] text-white',
  32: 'bg-[#f67c5f] text-white',
  64: 'bg-[#f65e3b] text-white',
  128: 'bg-[#edcf72] text-white',
  256: 'bg-[#edcc61] text-white',
  512: 'bg-[#edc850] text-white',
  1024: 'bg-[#edc53f] text-white',
  2048: 'bg-[#edc22e] text-white'
};

const getFontSize = (value: number): string => {
  if (value < 100) return 'text-3xl';
  if (value < 1000) return 'text-2xl';
  return 'text-xl';
};

export default function Tile({ value, position, isNew, isMerging }: TileProps) {
  const [y, x] = position;
  const color = colors[value] || 'bg-[#edc22e] text-white';
  
  return (
    <div
      className={`absolute flex items-center justify-center w-[72px] h-[72px] rounded-md font-bold transition-all duration-100
        ${color} ${getFontSize(value)}
        ${isNew ? 'animate-pop-in' : ''}
        ${isMerging ? 'animate-merge' : ''}`}
      style={{
        transform: `translate(${x * 88 + 16}px, ${y * 88 + 16}px)`
      }}
    >
      {value}
    </div>
  );
}
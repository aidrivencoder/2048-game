import React from 'react';

export default function Grid() {
  return (
    <div className="relative grid grid-cols-4 gap-4 bg-[#bbada0] rounded-md p-4 w-[360px] h-[360px]">
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="w-[72px] h-[72px] bg-[#cdc1b4] rounded-md"
        />
      ))}
    </div>
  );
}
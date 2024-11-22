import React from 'react';

export default function Grid() {
  return (
    <div className="grid grid-cols-4 gap-4 bg-[#bbada0] rounded-md p-4">
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="w-16 h-16 bg-[#cdc1b4] rounded-md"
        />
      ))}
    </div>
  );
}
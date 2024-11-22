import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import Grid from './Grid';
import Tile from './Tile';
import useGame from '../hooks/useGame';

export default function GameBoard() {
  const {
    tiles,
    score,
    bestScore,
    isGameOver,
    resetGame,
    moveTiles
  } = useGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          moveTiles('up');
          break;
        case 'ArrowDown':
          moveTiles('down');
          break;
        case 'ArrowLeft':
          moveTiles('left');
          break;
        case 'ArrowRight':
          moveTiles('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, moveTiles]);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex items-center justify-between w-full max-w-[360px]">
        <div>
          <h1 className="text-4xl font-bold text-[#776e65]">2048</h1>
          <p className="text-[#776e65]">Join the tiles, get to 2048!</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#bbada0] rounded-md p-2 text-white">
            <div className="text-sm">SCORE</div>
            <div className="font-bold">{score}</div>
          </div>
          <div className="bg-[#bbada0] rounded-md p-2 text-white">
            <div className="text-sm">BEST</div>
            <div className="font-bold">{bestScore}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-[360px]">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-[#8f7a66] text-white rounded-md hover:bg-[#7f6a56] transition-colors"
        >
          <RotateCcw size={20} />
          New Game
        </button>
      </div>

      <div className="relative">
        <Grid />
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            value={tile.value}
            position={tile.position}
            isNew={tile.isNew}
            isMerging={tile.isMerging}
          />
        ))}
        
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#ffffff80] rounded-md">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#776e65]">Game Over!</h2>
              <button
                onClick={resetGame}
                className="mt-4 px-4 py-2 bg-[#8f7a66] text-white rounded-md hover:bg-[#7f6a56] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-[#776e65] max-w-[360px]">
        <strong>HOW TO PLAY:</strong> Use your arrow keys to move the tiles. 
        When two tiles with the same number touch, they merge into one!
      </div>
    </div>
  );
}
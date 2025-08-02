'use client';

import React, { useRef } from 'react';
import GameIframe, { GameIframeRef } from './GameIframe';
import VirtualGameControls from './VirtualGameControls';

interface GameWithControlsProps {
  src: string;
  title: string;
  className?: string;
  showControls?: boolean;
}

const GameWithControls: React.FC<GameWithControlsProps> = ({
  src,
  title,
  className = '',
  showControls = true
}) => {
  const gameIframeRef = useRef<GameIframeRef>(null);
  const internalIframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <>
      <style>
        {`
          .game-with-controls {
            width: 100%;
            max-width: 100vw;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .game-with-controls .game-iframe-container {
            width: 100%;
            max-width: min(90vw, 800px);
          }
          
          @media (max-width: 768px) {
            .game-with-controls .game-iframe-container {
              max-width: 95vw;
            }
          }
        `}
      </style>

      <div className={`game-with-controls ${className}`}>
        {/* Game Iframe */}
        <GameIframe
          ref={gameIframeRef}
          src={src}
          title={title}
        />

        {/* Virtual Controls (only show if enabled) */}
        {showControls && (
          <VirtualGameControls
            iframeRef={gameIframeRef.current?.getIframeRef() || internalIframeRef}
          />
        )}
      </div>
    </>
  );
};

export default GameWithControls;
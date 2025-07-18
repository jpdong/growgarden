'use client';

import React, { useState } from 'react';

interface GameIframeProps {
  src: string;
  title: string;
  className?: string;
}

const GameIframe: React.FC<GameIframeProps> = ({
  src,
  title,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload by updating the key
    const iframe = document.querySelector(`iframe[title="${title}"]`) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    aspectRatio: '4/3',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  };

  const iframeStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
    display: hasError ? 'none' : 'block'
  };

  const loadingStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: isLoading && !hasError ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    color: '#666'
  };

  const errorStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: hasError ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'center',
    padding: '20px',
    color: '#666'
  };

  const spinnerStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4CAF50',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const retryButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .game-iframe-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            aspect-ratio: 4/3;
          }
          
          @media (max-width: 768px) {
            .game-iframe-container {
              max-width: 100%;
              aspect-ratio: 3/4;
            }
          }
          
          .retry-button:hover {
            background-color: #45a049 !important;
          }
        `}
      </style>
      <div
        className={`game-iframe-container ${className}`}
        style={containerStyle}
      >
        <iframe
          src={src}
          title={title}
          style={iframeStyle}
          onLoad={handleLoad}
          onError={handleError}
          allowFullScreen
          width="600" height="800"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        />

        {/* Loading indicator */}
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p>Loading {title}...</p>
        </div>

        {/* Error state */}
        <div style={errorStyle}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎮</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>Game Loading Error</h3>
          <p style={{ margin: '0 0 16px 0', maxWidth: '300px' }}>
            Sorry, we couldn't load the game. Please check your internet connection and try again.
          </p>
          <button
            onClick={handleRetry}
            style={retryButtonStyle}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    </>
  );
};

export default GameIframe;
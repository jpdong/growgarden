'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface GameIframeProps {
  src: string;
  title: string;
  className?: string;
}

interface GameMessage {
  type: string;
  data: any;
  source: string;
  timestamp: number;
}

interface GameStats {
  score: number;
  plantsInGarden: number;
  plantsHarvested: number;
  gameTime: number;
}

const GameIframe: React.FC<GameIframeProps> = ({
  src,
  title,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [gameStatus, setGameStatus] = useState<'loading' | 'ready' | 'error' | 'failed'>('loading');
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const maxRetries = 3;

  // 发送消息到游戏iframe
  const sendMessageToGame = useCallback((type: string, data: any = {}) => {
    if (iframeRef.current?.contentWindow) {
      const message = {
        type,
        data,
        source: 'parentPage',
        timestamp: Date.now()
      };
      
      try {
        iframeRef.current.contentWindow.postMessage(message, '*');
        console.log(`发送消息到游戏: ${type}`, data);
      } catch (error) {
        console.error('发送消息到游戏失败:', error);
      }
    }
  }, []);

  // 处理来自游戏iframe的消息
  const handleGameMessage = useCallback((event: MessageEvent<GameMessage>) => {
    // 验证消息来源
    if (event.data?.source !== 'growGardenGame') {
      return;
    }

    const { type, data } = event.data;
    console.log(`收到游戏消息: ${type}`, data);

    switch (type) {
      case 'gameReady':
        setGameReady(true);
        setGameStatus('ready');
        setIsLoading(false);
        setHasError(false);
        console.log('游戏准备就绪');
        break;

      case 'gameLoadingStart':
        setGameStatus('loading');
        setIsLoading(true);
        setHasError(false);
        console.log('游戏开始加载');
        break;

      case 'gameLoadingComplete':
        setGameStatus('ready');
        setIsLoading(false);
        setHasError(false);
        setRetryCount(0);
        console.log('游戏加载完成');
        break;

      case 'gameError':
        console.error('游戏错误:', data);
        setErrorMessage(data.error || '游戏发生未知错误');
        
        if (data.canRetry && retryCount < maxRetries) {
          setGameStatus('error');
          setHasError(true);
        } else {
          setGameStatus('failed');
          setHasError(true);
        }
        break;

      case 'gameFailure':
        console.error('游戏最终失败:', data);
        setGameStatus('failed');
        setHasError(true);
        setErrorMessage(data.error || '游戏多次失败');
        break;

      case 'gameStateResponse':
        if (data.stats) {
          setGameStats(data.stats);
        }
        break;

      case 'gameRetryStart':
        setRetryCount(prev => prev + 1);
        setIsLoading(true);
        setHasError(false);
        setGameStatus('loading');
        break;

      case 'gameRecovered':
        console.log('游戏已恢复:', data);
        setHasError(false);
        setGameStatus('ready');
        break;

      case 'gameReset':
        console.log('游戏已重置');
        setGameStats(null);
        break;

      case 'messageHandlerError':
        console.error('游戏消息处理错误:', data);
        break;

      default:
        console.log(`未处理的游戏消息类型: ${type}`);
    }
  }, [retryCount, maxRetries]);

  // 设置消息监听器
  useEffect(() => {
    window.addEventListener('message', handleGameMessage);
    
    return () => {
      window.removeEventListener('message', handleGameMessage);
    };
  }, [handleGameMessage]);

  // 定期请求游戏状态
  useEffect(() => {
    if (!gameReady) return;

    const interval = setInterval(() => {
      sendMessageToGame('getGameState');
    }, 5000); // 每5秒请求一次游戏状态

    return () => clearInterval(interval);
  }, [gameReady, sendMessageToGame]);

  const handleLoad = () => {
    console.log('iframe加载完成');
    // 不立即设置为非加载状态，等待游戏的准备消息
  };

  const handleError = () => {
    console.error('iframe加载错误');
    setIsLoading(false);
    setHasError(true);
    setGameStatus('error');
    setErrorMessage('游戏页面加载失败');
  };

  const handleRetry = () => {
    console.log(`重试游戏 (第${retryCount + 1}次)`);
    
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
    setGameStatus('loading');
    setErrorMessage('');
    setGameReady(false);
    
    // 重新加载iframe
    if (iframeRef.current) {
      iframeRef.current.src = src;
    }
  };

  const handleResetGame = () => {
    sendMessageToGame('resetGame');
  };

  const handlePauseGame = () => {
    sendMessageToGame('pauseGame');
  };

  const handleResumeGame = () => {
    sendMessageToGame('resumeGame');
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

  // 游戏状态显示样式
  const gameStatusStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    display: gameReady && gameStats ? 'block' : 'none',
    zIndex: 10
  };

  const controlButtonsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: gameReady ? 'flex' : 'none',
    gap: '8px',
    zIndex: 10
  };

  const controlButtonStyle: React.CSSProperties = {
    padding: '6px 12px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
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
          
          .control-button:hover {
            background-color: rgba(0, 0, 0, 0.9) !important;
          }
        `}
      </style>
      <div
        className={`game-iframe-container ${className}`}
        style={containerStyle}
      >
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          style={iframeStyle}
          onLoad={handleLoad}
          onError={handleError}
          allowFullScreen
          width="600" height="800"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        />

        {/* Game control buttons */}
        <div style={controlButtonsStyle}>
          <button
            onClick={handleResetGame}
            style={controlButtonStyle}
            className="control-button"
            title="重置游戏"
          >
            🔄
          </button>
          <button
            onClick={handlePauseGame}
            style={controlButtonStyle}
            className="control-button"
            title="暂停游戏"
          >
            ⏸️
          </button>
          <button
            onClick={handleResumeGame}
            style={controlButtonStyle}
            className="control-button"
            title="继续游戏"
          >
            ▶️
          </button>
        </div>

        {/* Game status display */}
        <div style={gameStatusStyle}>
          {gameStats && (
            <>
              <div>积分: {gameStats.score}</div>
              <div>植物: {gameStats.plantsInGarden}</div>
              <div>收获: {gameStats.plantsHarvested}</div>
              <div>时间: {Math.floor(gameStats.gameTime / 60000)}:{String(Math.floor((gameStats.gameTime % 60000) / 1000)).padStart(2, '0')}</div>
            </>
          )}
        </div>

        {/* Loading indicator */}
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p>
            {gameStatus === 'loading' ? `加载中... (${retryCount > 0 ? `重试 ${retryCount}/${maxRetries}` : '初次加载'})` : `Loading ${title}...`}
          </p>
          {gameStatus === 'loading' && retryCount > 0 && (
            <p style={{ fontSize: '14px', color: '#999' }}>
              正在重新加载游戏...
            </p>
          )}
        </div>

        {/* Error state */}
        <div style={errorStyle}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>
            {gameStatus === 'failed' ? '❌' : '🎮'}
          </div>
          <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
            {gameStatus === 'failed' ? '游戏无法加载' : '游戏加载错误'}
          </h3>
          <p style={{ margin: '0 0 16px 0', maxWidth: '300px' }}>
            {errorMessage || (gameStatus === 'failed' 
              ? '游戏多次加载失败，请刷新页面重试' 
              : '抱歉，无法加载游戏。请检查网络连接后重试。')}
          </p>
          {retryCount > 0 && (
            <p style={{ fontSize: '14px', color: '#999', margin: '0 0 16px 0' }}>
              已重试 {retryCount}/{maxRetries} 次
            </p>
          )}
          {gameStatus !== 'failed' && retryCount < maxRetries && (
            <button
              onClick={handleRetry}
              style={retryButtonStyle}
              className="retry-button"
            >
              重试 ({maxRetries - retryCount} 次机会)
            </button>
          )}
          {gameStatus === 'failed' && (
            <button
              onClick={() => window.location.reload()}
              style={retryButtonStyle}
              className="retry-button"
            >
              刷新页面
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GameIframe;
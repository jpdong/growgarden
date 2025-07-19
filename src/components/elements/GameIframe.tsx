'use client';

import React, { useState, useRef, useEffect } from 'react';

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
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
        window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      setShowControls(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 模拟键盘事件发送到iframe
  const sendKeyEvent = (key: string, type: 'keydown' | 'keyup') => {
    console.log("sendKeyEvent")
    console.log(iframeRef.current?.contentWindow)
    if (!iframeRef.current?.contentWindow) return;

    try {
      // 创建键盘事件
      const keyEvent = new KeyboardEvent(type, {
        key: key,
        code: getKeyCode(key),
        keyCode: getKeyCodeNumber(key),
        which: getKeyCodeNumber(key),
        bubbles: true,
        cancelable: true
      });

      // 发送到iframe
      iframeRef.current.contentWindow.postMessage({
        type: 'keyboardEvent',
        eventType: type,
        key: key,
        keyCode: getKeyCodeNumber(key),
        code: getKeyCode(key)
      }, '*');

      // 也尝试直接在iframe的document上触发事件
      // if (iframeRef.current.contentDocument) {
      //   iframeRef.current.contentDocument.dispatchEvent(keyEvent);
      // }
    } catch (error) {
      console.log('Key event simulation failed:', error);
    }
  };

  // 获取键码
  const getKeyCode = (key: string): string => {
    const keyMap: { [key: string]: string } = {
      'ArrowUp': 'ArrowUp',
      'ArrowDown': 'ArrowDown',
      'ArrowLeft': 'ArrowLeft',
      'ArrowRight': 'ArrowRight',
      ' ': 'Space',
      'Enter': 'Enter'
    };
    return keyMap[key] || key;
  };

  const getKeyCodeNumber = (key: string): number => {
    const keyMap: { [key: string]: number } = {
      'ArrowUp': 38,
      'ArrowDown': 40,
      'ArrowLeft': 37,
      'ArrowRight': 39,
      ' ': 32,
      'Enter': 13
    };
    return keyMap[key] || 0;
  };

  // 处理虚拟按键按下
  const handleVirtualKeyDown = (key: string) => {
    sendKeyEvent(key, 'keydown');
  };

  // 处理虚拟按键释放
  const handleVirtualKeyUp = (key: string) => {
    sendKeyEvent(key, 'keyup');
  };

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
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const iframeContainerStyle: React.CSSProperties = {
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
          
          .virtual-controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            z-index: 10;
          }
          
          .control-row {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          
          .control-button {
            width: 60px;
            height: 60px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            color: white;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            transition: all 0.1s ease;
            touch-action: manipulation;
          }
          
          .control-button:active {
            background: rgba(0, 0, 0, 0.9);
            border-color: rgba(255, 255, 255, 0.6);
            transform: scale(0.95);
          }
          
          .control-button:hover {
            background: rgba(0, 0, 0, 0.8);
            border-color: rgba(255, 255, 255, 0.5);
          }
          
          .action-buttons {
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 10;
          }
          
          .action-button {
            width: 50px;
            height: 50px;
            background: rgba(76, 175, 80, 0.8);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            color: white;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            transition: all 0.1s ease;
            touch-action: manipulation;
          }
          
          .action-button:active {
            background: rgba(76, 175, 80, 1);
            transform: scale(0.95);
          }
          
          @media (max-width: 480px) {
            .control-button {
              width: 50px;
              height: 50px;
              font-size: 20px;
            }
            
            .action-button {
              width: 45px;
              height: 45px;
              font-size: 14px;
            }
            
            .virtual-controls {
              bottom: 15px;
            }
            
            .action-buttons {
              bottom: 15px;
              right: 15px;
            }
          }
        `}
      </style>
      <div
        className={`game-iframe-container ${className}`}
        style={containerStyle}
      >
        {/* Game iframe container */}
        <div style={iframeContainerStyle}>
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

          {/* Loading indicator */}
          <div style={loadingStyle}>
            <div style={spinnerStyle}></div>
            <p>Loading {title}...</p>
          </div>

          {/* Error state */}
          <div style={errorStyle}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎮</div>
            <p style={{ margin: '0 0 8px 0', color: '#333' }}>Game Loading Error</p>
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

        {/* Virtual Controls for Mobile - Below the game */}
        {showControls && !isLoading && !hasError && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            marginTop: '10px'
          }}>
            {/* Direction Pad */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              {/* Top Row - Up Arrow */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div
                  className="control-button"
                  onTouchStart={() => handleVirtualKeyDown('ArrowUp')}
                  onTouchEnd={() => handleVirtualKeyUp('ArrowUp')}
                  onMouseDown={() => handleVirtualKeyDown('ArrowUp')}
                  onMouseUp={() => handleVirtualKeyUp('ArrowUp')}
                  onMouseLeave={() => handleVirtualKeyUp('ArrowUp')}
                  style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.1s ease',
                    touchAction: 'manipulation'
                  }}
                >
                  ↑
                </div>
              </div>

              {/* Middle Row - Left and Right Arrows */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div
                  className="control-button"
                  onTouchStart={() => handleVirtualKeyDown('ArrowLeft')}
                  onTouchEnd={() => handleVirtualKeyUp('ArrowLeft')}
                  onMouseDown={() => handleVirtualKeyDown('ArrowLeft')}
                  onMouseUp={() => handleVirtualKeyUp('ArrowLeft')}
                  onMouseLeave={() => handleVirtualKeyUp('ArrowLeft')}
                  style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.1s ease',
                    touchAction: 'manipulation'
                  }}
                >
                  ←
                </div>
                <div style={{ width: '50px' }}></div> {/* Spacer */}
                <div
                  className="control-button"
                  onTouchStart={() => handleVirtualKeyDown('ArrowRight')}
                  onTouchEnd={() => handleVirtualKeyUp('ArrowRight')}
                  onMouseDown={() => handleVirtualKeyDown('ArrowRight')}
                  onMouseUp={() => handleVirtualKeyUp('ArrowRight')}
                  onMouseLeave={() => handleVirtualKeyUp('ArrowRight')}
                  style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.1s ease',
                    touchAction: 'manipulation'
                  }}
                >
                  →
                </div>
              </div>

              {/* Bottom Row - Down Arrow */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div
                  className="control-button"
                  onTouchStart={() => handleVirtualKeyDown('ArrowDown')}
                  onTouchEnd={() => handleVirtualKeyUp('ArrowDown')}
                  onMouseDown={() => handleVirtualKeyDown('ArrowDown')}
                  onMouseUp={() => handleVirtualKeyUp('ArrowDown')}
                  onMouseLeave={() => handleVirtualKeyUp('ArrowDown')}
                  style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.1s ease',
                    touchAction: 'manipulation'
                  }}
                >
                  ↓
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div
                className="action-button"
                onTouchStart={() => handleVirtualKeyDown('Enter')}
                onTouchEnd={() => handleVirtualKeyUp('Enter')}
                onMouseDown={() => handleVirtualKeyDown('Enter')}
                onMouseUp={() => handleVirtualKeyUp('Enter')}
                onMouseLeave={() => handleVirtualKeyUp('Enter')}
                title="确认/选择"
                style={{
                  width: '45px',
                  height: '45px',
                  background: 'rgba(76, 175, 80, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.1s ease',
                  touchAction: 'manipulation'
                }}
              >
                ✓
              </div>
              <div
                className="action-button"
                onTouchStart={() => handleVirtualKeyDown(' ')}
                onTouchEnd={() => handleVirtualKeyUp(' ')}
                onMouseDown={() => handleVirtualKeyDown(' ')}
                onMouseUp={() => handleVirtualKeyUp(' ')}
                onMouseLeave={() => handleVirtualKeyUp(' ')}
                title="空格/动作"
                style={{
                  width: '45px',
                  height: '45px',
                  background: 'rgba(76, 175, 80, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.1s ease',
                  touchAction: 'manipulation'
                }}
              >
                ⚡
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GameIframe;
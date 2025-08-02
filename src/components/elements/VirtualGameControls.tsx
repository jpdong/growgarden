'use client';

import React, { useEffect, useState } from 'react';

interface VirtualGameControlsProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  className?: string;
}

const VirtualGameControls: React.FC<VirtualGameControlsProps> = ({
  iframeRef,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
                            window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 模拟键盘事件发送到iframe
  const sendKeyEvent = (key: string, type: 'keydown' | 'keyup') => {
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
      if (iframeRef.current.contentDocument) {
        iframeRef.current.contentDocument.dispatchEvent(keyEvent);
      }
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

  // 如果不是移动设备，不显示控制器
  // if (!isMobile) {
  //   return null;
  // }

  return (
    <>
      <style>
        {`
          .virtual-game-controls {
            width: 100%;
            max-width: min(90vw, 800px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            margin: 10px auto 0 auto;
            box-sizing: border-box;
          }
          
          .direction-pad {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          
          .control-row {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          
          .control-button {
            width: 50px;
            height: 50px;
            background: rgba(0, 0, 0, 0.8);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            transition: all 0.1s ease;
            touch-action: manipulation;
          }
          
          .control-button:active {
            background: rgba(0, 0, 0, 1);
            transform: scale(0.95);
          }
          
          .control-button:hover {
            background: rgba(0, 0, 0, 0.9);
          }
          
          .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .action-button {
            width: 45px;
            height: 45px;
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
            .virtual-game-controls {
              padding: 15px;
            }
            
            .control-button {
              width: 45px;
              height: 45px;
              font-size: 18px;
            }
            
            .action-button {
              width: 40px;
              height: 40px;
              font-size: 14px;
            }
          }
        `}
      </style>
      
      <div className={`virtual-game-controls ${className}`}>
        {/* Direction Pad */}
        <div className="direction-pad">
          {/* Top Row - Up Arrow */}
          <div className="control-row">
            <div
              className="control-button"
              onTouchStart={() => handleVirtualKeyDown('ArrowUp')}
              onTouchEnd={() => handleVirtualKeyUp('ArrowUp')}
              onMouseDown={() => handleVirtualKeyDown('ArrowUp')}
              onMouseUp={() => handleVirtualKeyUp('ArrowUp')}
              onMouseLeave={() => handleVirtualKeyUp('ArrowUp')}
            >
              ↑
            </div>
          </div>
          
          {/* Middle Row - Left and Right Arrows */}
          <div className="control-row">
            <div
              className="control-button"
              onTouchStart={() => handleVirtualKeyDown('ArrowLeft')}
              onTouchEnd={() => handleVirtualKeyUp('ArrowLeft')}
              onMouseDown={() => handleVirtualKeyDown('ArrowLeft')}
              onMouseUp={() => handleVirtualKeyUp('ArrowLeft')}
              onMouseLeave={() => handleVirtualKeyUp('ArrowLeft')}
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
            >
              →
            </div>
          </div>
          
          {/* Bottom Row - Down Arrow */}
          <div className="control-row">
            <div
              className="control-button"
              onTouchStart={() => handleVirtualKeyDown('ArrowDown')}
              onTouchEnd={() => handleVirtualKeyUp('ArrowDown')}
              onMouseDown={() => handleVirtualKeyDown('ArrowDown')}
              onMouseUp={() => handleVirtualKeyUp('ArrowDown')}
              onMouseLeave={() => handleVirtualKeyUp('ArrowDown')}
            >
              ↓
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <div
            className="action-button"
            onTouchStart={() => handleVirtualKeyDown('Enter')}
            onTouchEnd={() => handleVirtualKeyUp('Enter')}
            onMouseDown={() => handleVirtualKeyDown('Enter')}
            onMouseUp={() => handleVirtualKeyUp('Enter')}
            onMouseLeave={() => handleVirtualKeyUp('Enter')}
            title="确认/选择"
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
          >
            ⚡
          </div>
        </div>
      </div>
    </>
  );
};

export default VirtualGameControls;
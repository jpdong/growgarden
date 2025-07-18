import React from 'react';
import { Game } from '../../types/Game';

interface GameCardProps {
  game: Game;
  variant?: 'featured' | 'grid';
}

// Server-side component for static display
const GameCard: React.FC<GameCardProps> = ({
  game,
  variant = 'grid'
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'default',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e0e0e0'
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingTop: variant === 'featured' ? '56.25%' : '60%', // 16:9 for featured, 5:3 for grid
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  };

  const contentStyle: React.CSSProperties = {
    padding: variant === 'featured' ? '24px' : '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: variant === 'featured' ? '1.5rem' : '1.25rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 12px 0',
    lineHeight: '1.3'
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.5',
    margin: '0 0 16px 0',
    flex: 1
  };

  const tagsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '16px'
  };

  const tagStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
    padding: '4px 8px',
    borderRadius: '12px',
    fontWeight: '500'
  };

  const categoryBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'capitalize'
  };



  return (
    <>
      <style>
        {`
          .game-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
          }
          
          .game-card:hover .game-image {
            transform: scale(1.05);
          }
          
          @media (max-width: 768px) {
            .game-card-content {
              padding: 16px !important;
            }
            
            .game-card-title {
              font-size: 1.1rem !important;
            }
          }
        `}
      </style>
      <div
        className="game-card"
        style={cardStyle}
        role="article"
        aria-label={`${game.title} - ${game.description}`}
      >
        <div style={imageContainerStyle}>
          <img
            src={game.thumbnailUrl}
            alt={`${game.title} - ${game.description}`}
            style={imageStyle}
            className="game-image"
            loading="lazy"
          />
          <div style={categoryBadgeStyle}>
            {game.category}
          </div>
        </div>
        
        <div style={contentStyle} className="game-card-content">
          <h3 style={titleStyle} className="game-card-title">
            {game.title}
          </h3>
          
          <p style={descriptionStyle}>
            {game.description}
          </p>
          
          <div style={tagsContainerStyle}>
            {game.tags.slice(0, 3).map((tag, index) => (
              <span key={index} style={tagStyle}>
                {tag}
              </span>
            ))}
            {game.tags.length > 3 && (
              <span style={{ ...tagStyle, backgroundColor: '#f0f0f0', color: '#666' }}>
                +{game.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameCard;
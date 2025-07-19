import React from 'react';
import NavBar from '../components/elements/NavBar';
import Footer from '../components/elements/Footer';
import SectionTitle from '../components/elements/SectionTitle';
import GameIframe from '../components/elements/GameIframe';
import GameCard from '../components/elements/GameCard';
import Container from '../components/layout/Container';
import { featuredGame, moreGardenGames } from '../data/games';

const GrowGardenHomePage: React.FC = () => {

  return (
    <>
      <NavBar />
      <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
        {/* Hero Section with Featured Game */}
        <div className="featured-game-section">
          <Container>
           
            
            {/* Centered Game Iframe */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              marginBottom: '40px'
            }}>
              <GameIframe
                src="https://growgarden.cc/game/growgarden.html"
                title={featuredGame.title}
                className="featured-game-iframe"
              />
            </div>
          </Container>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 className="featured-game-title">
                {featuredGame.title}
              </h1>
              <h2 className="featured-game-description">
                {featuredGame.longDescription || featuredGame.description}
              </h2>
            </div>
        {/* More Garden Games Section
        <div className="games-section" style={{ 
          background: '#fff', 
          padding: '80px 0',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Container>
            <SectionTitle>More Garden Games</SectionTitle>
            <div className="row">
              {moreGardenGames.map((game) => (
                <div key={game.id}>
                  <GameCard 
                    game={game}
                    variant="grid"
                  />
                </div>
              ))}
            </div>
          </Container>
        </div> */}

        {/* Additional SEO Content Section */}
        <div className="seo-content-section">
          <Container>
            <div style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <h2 style={{ 
                fontSize: '2rem', 
                color: '#2c3e50', 
                marginBottom: '24px'
              }}>
                Welcome to Your Garden Paradise
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#666', 
                lineHeight: '1.7',
                marginBottom: '32px'
              }}>
                Discover the joy of virtual gardening with our collection of relaxing garden games. 
                Plant seeds, watch them grow, design beautiful landscapes, and create your own digital paradise. 
                Whether you're a seasoned gardener or just starting out, our games offer a peaceful escape 
                into the world of plants and nature.
              </p>
              <div className="seo-features-grid">
                <div className="seo-feature-card">
                  <div className="seo-feature-icon">🌱</div>
                  <h3 className="seo-feature-title">Plant & Grow</h3>
                  <p className="seo-feature-description">
                    Start with seeds and watch your garden flourish
                  </p>
                </div>
                <div className="seo-feature-card">
                  <div className="seo-feature-icon">🌸</div>
                  <h3 className="seo-feature-title">Beautiful Flowers</h3>
                  <p className="seo-feature-description">
                    Cultivate colorful blooms and stunning arrangements
                  </p>
                </div>
                <div className="seo-feature-card">
                  <div className="seo-feature-icon">🎨</div>
                  <h3 className="seo-feature-title">Design & Decorate</h3>
                  <p className="seo-feature-description">
                    Create unique garden layouts and landscapes
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GrowGardenHomePage;
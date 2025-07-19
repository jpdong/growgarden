import React from 'react';
import NavBar from '../components/elements/NavBar';
import Footer from '../components/elements/Footer';
import SectionTitle from '../components/elements/SectionTitle';
import GameIframe from '../components/elements/GameIframe';
import Container from '../components/layout/Container';
import { featuredGame } from '../data/games';

const GrowGardenHomePage: React.FC = () => {

  const faqData = [
    {
      question: "How do I get rich in Grow A Garden?",
      answer: "Plant seeds and sell them for a higher price! That's the only way to get rich. Buy seeds at low prices from the seed shop, plant them in your garden, wait for them to grow, and then sell the mature plants for profit."
    },
    {
      question: "How do I upgrade my garden?",
      answer: "Go to the gear section to upgrade your seed arena! This allows you to continue planting more seeds and expand your gardening business. Upgrades help you plant more efficiently and handle larger crops."
    },
    {
      question: "How does the seed shop work?",
      answer: "Buy seeds here at a low price and plant them! Browse different types of seeds in the seed shop, purchase the ones you want, and then plant them in your garden. Each seed type has different growth times and selling prices."
    },
    {
      question: "How do I sell my plants?",
      answer: "Take the plant you want to sell and sell it! Once your plants are fully grown, you can sell them to earn checkles (the game currency). Mature plants sell for much more than the seeds cost, giving you profit!"
    },
    {
      question: "What are the different weather conditions?",
      answer: "The game features dynamic weather including rain, sun, frozen conditions, and moonlight. Each weather type affects plant growth differently. There are also secret events - the longer you play, the better events you'll unlock!"
    },
    {
      question: "What are secret events?",
      answer: "Secret events are special occurrences that unlock as you play longer. These events can boost your garden's productivity, provide bonus rewards, or introduce unique growing conditions. Keep playing to discover them all!"
    }
  ];

  const userReviews = [
    {
      name: "Emily Chen",
      avatar: "/avatars/emily.jpg",
      rating: 5,
      review: "This game is so addictive! I love the business aspect of buying seeds cheap and selling plants for profit. The weather system adds a nice touch of realism. Already earned thousands of checkles!",
      date: "2 days ago"
    },
    {
      name: "Alex Rodriguez",
      avatar: "/avatars/alex.jpg",
      rating: 5,
      review: "Perfect relaxing game! The upgrade system keeps me engaged, and I'm always excited to unlock new secret events. The moonlight weather effect is absolutely beautiful!",
      date: "1 week ago"
    },
    {
      name: "Linda Thompson",
      avatar: "/avatars/linda.jpg",
      rating: 4,
      review: "Really enjoying the gardening mechanics. The different weather conditions make each play session unique. Can't wait to see what secret events I unlock next! The frozen weather is challenging but fun.",
      date: "2 weeks ago"
    },
    {
      name: "Sam Wilson",
      avatar: "/avatars/sam.jpg",
      rating: 5,
      review: "Best gardening business game I've played! The economic system is brilliant - buying low, selling high feels so rewarding. Love how the longer I play, the better events I get!",
      date: "3 weeks ago"
    }
  ];

  return (
    <>
      <NavBar />
      <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
        {/* Hero Section with Featured Game */}
        <div className="featured-game-section" style={{ padding: '40px 0' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '3rem',
                color: '#2c3e50',
                marginBottom: '16px',
                fontWeight: 'bold'
              }}>
                🌱 Grow A Garden - Plant & Profit! 🌱
              </h1>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#27ae60',
                marginBottom: '24px',
                fontWeight: '600'
              }}>
                Plant Seeds, Sell Plants, Get Rich! The Ultimate Gardening Business Game
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: '#666',
                lineHeight: '1.6',
                maxWidth: '800px',
                margin: '0 auto 32px'
              }}>
                Start your gardening empire! Buy seeds at low prices, plant them in your seed arena,
                and sell the grown plants for higher profits. Experience dynamic weather conditions
                including rain, sun, frost, and moonlight that affect your garden's growth!
              </p>
            </div>

            {/* Centered Game Iframe */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '40px'
            }}>
              <GameIframe
                src="https://growgarden.cc/game/growgarden20250720.html"
              
                title={featuredGame.title}
                className="featured-game-iframe"
              />
            </div>
          </Container>
        </div>
        {/* Game Instructions Section */}
        <div className="game-instructions-section" style={{
          background: '#fff',
          padding: '60px 0',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                color: '#2c3e50',
                marginBottom: '16px',
                fontWeight: 'bold'
              }}>
                How to Play Grow A Garden
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Master the art of gardening business with these simple steps
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
                <h3 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '1.3rem' }}>
                  Buy Seeds Cheap
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Visit the seed shop to buy seeds at low prices. Choose from different varieties and plan your garden strategy.
                </p>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌱</div>
                <h3 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '1.3rem' }}>
                  Plant & Grow
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Plant your seeds in the garden arena and watch them grow through different weather conditions.
                </p>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
                <h3 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '1.3rem' }}>
                  Sell for Profit
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Harvest mature plants and sell them for checkles. Earn more than you spent to get rich!
                </p>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚙️</div>
                <h3 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '1.3rem' }}>
                  Upgrade Arena
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Use the gear section to upgrade your seed arena and expand your gardening capacity.
                </p>
              </div>
            </div>
          </Container>
        </div>

        {/* FAQ Section */}
        <div className="faq-section" style={{
          background: '#f7f9fb',
          padding: '80px 0'
        }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                color: '#2c3e50',
                marginBottom: '16px',
                fontWeight: 'bold'
              }}>
                Frequently Asked Questions
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Everything you need to know about playing Grow A Garden
              </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {faqData.map((faq, index) => (
                <div key={index} style={{
                  marginBottom: '24px',
                  background: '#fff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    padding: '20px 24px 16px 24px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <h3 style={{
                      margin: '0',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#2c3e50',
                      lineHeight: '1.4'
                    }}>
                      {faq.question}
                    </h3>
                  </div>
                  <div style={{
                    padding: '16px 24px 20px 24px',
                    color: '#666',
                    lineHeight: '1.6'
                  }}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* User Reviews Section */}
        <div className="reviews-section" style={{
          background: '#fff',
          padding: '80px 0'
        }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                color: '#2c3e50',
                marginBottom: '16px',
                fontWeight: 'bold'
              }}>
                What Players Are Saying
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Join thousands of happy gardeners who love playing Grow A Garden
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {userReviews.map((review, index) => (
                <div key={index} style={{
                  background: '#f8f9fa',
                  padding: '30px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <img
                      src={review.avatar}
                      alt={review.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        marginRight: '12px',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <h4 style={{
                        margin: '0 0 4px 0',
                        color: '#2c3e50',
                        fontSize: '1.1rem',
                        fontWeight: '600'
                      }}>
                        {review.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ color: '#ffc107' }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#999'
                        }}>
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6',
                    margin: '0',
                    fontStyle: 'italic'
                  }}>
                    "{review.review}"
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>

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
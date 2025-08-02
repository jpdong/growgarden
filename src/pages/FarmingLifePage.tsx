import React from 'react';
import NavBar from '../components/elements/NavBar';
import Footer from '../components/elements/Footer';
import GameWithControls from '../components/elements/GameWithControls';
import Container from '../components/layout/Container';

const FarmingLifePage: React.FC = () => {
  const faqData = [
    {
      question: "How do I start my farming life?",
      answer: "Begin by planting your first crops! Choose seeds that grow quickly to get started, then expand your farm as you earn more money. Focus on building a sustainable farming operation."
    },
    {
      question: "What crops should I plant first?",
      answer: "Start with fast-growing crops like carrots or lettuce to generate quick income. As you progress, invest in more valuable crops like tomatoes and corn that take longer but provide better profits."
    },
    {
      question: "How do I take care of my animals?",
      answer: "Feed your animals regularly and keep their living areas clean. Happy animals produce more resources like milk, eggs, and wool. Build proper shelters and provide fresh water daily."
    },
    {
      question: "How can I expand my farm?",
      answer: "Use the money you earn from selling crops and animal products to buy more land, build new structures, and purchase better equipment. Plan your farm layout efficiently to maximize productivity."
    },
    {
      question: "What's the best farming strategy?",
      answer: "Balance between quick-profit crops and long-term investments. Diversify your farm with both crops and animals. Upgrade your tools and buildings to increase efficiency and unlock new opportunities."
    },
    {
      question: "How do I unlock new features?",
      answer: "Progress through the game by completing tasks and reaching certain milestones. New crops, animals, and buildings become available as you level up and expand your farming empire."
    }
  ];

  const userReviews = [
    {
      name: "Emily Chen",
      avatar: "/avatars/emily.jpg",
      rating: 5,
      review: "Amazing farming simulation! I love how realistic the crop growing mechanics are. The animal care system is so detailed and rewarding. Been playing for hours!",
      date: "1 day ago"
    },
    {
      name: "Alex Rodriguez",
      avatar: "/avatars/alex.jpg",
      rating: 5,
      review: "Perfect farming game for relaxation! The graphics are beautiful and the gameplay is addictive. Love building my dream farm from scratch. Highly recommended!",
      date: "3 days ago"
    },
    {
      name: "Linda Thompson",
      avatar: "/avatars/linda.jpg",
      rating: 4,
      review: "Great farming experience! The variety of crops and animals keeps the game interesting. The seasonal changes add a nice touch of realism to the farming life.",
      date: "1 week ago"
    },
    {
      name: "Sam Wilson",
      avatar: "/avatars/sam.jpg",
      rating: 5,
      review: "Best farming game I've played! The progression system is well-balanced and the farm customization options are endless. Perfect for anyone who loves agriculture!",
      date: "2 weeks ago"
    }
  ];

  return (
    <>
      <NavBar />
      <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
        {/* Hero Section */}
        <div className="featured-game-section" style={{ padding: '40px 0' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ 
                fontSize: '3rem', 
                color: '#2c3e50', 
                marginBottom: '16px',
                fontWeight: 'bold'
              }}>
                🚜 Farming Life - Build Your Dream Farm! 🌾
              </h1>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: '#27ae60', 
                marginBottom: '24px',
                fontWeight: '600'
              }}>
                Plant Crops, Raise Animals, Create Your Agricultural Empire
              </h2>
              <p style={{ 
                fontSize: '1.2rem', 
                color: '#666', 
                lineHeight: '1.6',
                maxWidth: '800px',
                margin: '0 auto 32px'
              }}>
                Experience the joy of farming life! Plant and harvest crops, raise livestock, 
                build farm structures, and manage your agricultural business. Create the farm 
                of your dreams in this immersive farming simulation game.
              </p>
            </div>
            
            {/* Game Iframe */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              marginBottom: '40px'
            }}>
              <GameWithControls
                src="https://html5.gamemonetize.co/q8w2r79771yeqx2v37xqdqwn9oh0bkmo/"
                title="Farming Life"
                className="featured-game-iframe"
                showControls={false}
              />
            </div>
          </Container>
        </div>

        {/* Game Features Section */}
        <div className="game-features-section" style={{ 
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
                Farm Life Features
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#666', 
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Discover all the amazing features that make farming life so rewarding
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
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌱</div>
                <h3 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '1.3rem' }}>
                  Crop Farming
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Plant, water, and harvest a variety of crops. From quick-growing vegetables to valuable fruits and grains.
                </p>
              </div>
              
              <div style={{ 
                background: '#f8f9fa', 
                padding: '30px', 
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🐄</div>
                <h3 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '1.3rem' }}>
                  Animal Care
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Raise cows, chickens, pigs, and sheep. Feed them, keep them healthy, and collect valuable resources.
                </p>
              </div>
              
              <div style={{ 
                background: '#f8f9fa', 
                padding: '30px', 
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏗️</div>
                <h3 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '1.3rem' }}>
                  Farm Building
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Construct barns, silos, greenhouses, and other farm buildings to expand your agricultural operations.
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
                  Farm Business
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Sell your products at the market, manage your finances, and grow your farming business empire.
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
                Farming Life FAQ
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Everything you need to know about starting your farming life
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
                What Farmers Are Saying
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Join thousands of happy farmers building their dream farms
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

        {/* SEO Content Section */}
        <div className="seo-content-section" style={{
          background: '#f7f9fb',
          padding: '80px 0'
        }}>
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
                Start Your Farming Adventure Today
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#666',
                lineHeight: '1.7',
                marginBottom: '32px'
              }}>
                Farming Life offers the most realistic and engaging farming simulation experience. 
                Whether you're a seasoned farmer or just starting out, you'll find endless opportunities 
                to grow crops, raise animals, and build the farm of your dreams. Experience the satisfaction 
                of agricultural life in this comprehensive farming game.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px',
                marginTop: '40px'
              }}>
                <div style={{
                  background: '#fff',
                  padding: '30px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🌾</div>
                  <h3 style={{ color: '#2c3e50', marginBottom: '12px' }}>Realistic Farming</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    Experience authentic farming with seasonal changes, weather effects, and realistic crop growth cycles.
                  </p>
                </div>
                <div style={{
                  background: '#fff',
                  padding: '30px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🏆</div>
                  <h3 style={{ color: '#2c3e50', marginBottom: '12px' }}>Achievement System</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    Unlock achievements and milestones as you progress through your farming journey.
                  </p>
                </div>
                <div style={{
                  background: '#fff',
                  padding: '30px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎮</div>
                  <h3 style={{ color: '#2c3e50', marginBottom: '12px' }}>Easy to Play</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    Simple controls and intuitive gameplay make it easy for anyone to start farming.
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

export default FarmingLifePage;
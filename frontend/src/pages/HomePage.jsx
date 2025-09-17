import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/routes';
import Button from '../components/common/Button';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();

  // Redirect authenticated users to chat page
  if (user) {
    return <Navigate to={ROUTES.CHAT} replace />;
  }

  const features = [
    {
      icon: '💬',
      title: 'Real-time Messaging',
      description: 'Send and receive messages instantly with our fast, reliable messaging system.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your conversations are protected with end-to-end encryption and secure authentication.'
    },
    {
      icon: '📱',
      title: 'Cross-Platform',
      description: 'Access your chats from any device with our responsive, mobile-friendly design.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span>ChatApp</span>
          </h1>
          <p className="hero-subtitle">
            Connect with friends and family
          </p>
          <p className="hero-description">
            Experience seamless communication with our modern, secure chat platform. 
            Start conversations, share moments, and stay connected with the people who matter most.
          </p>
          <div className="cta-buttons">
            <Link to={ROUTES.LOGIN} className="cta-button">
              <Button variant="primary" size="large">
                Get Started
              </Button>
            </Link>
            <Link to={ROUTES.SIGNUP} className="cta-button">
              <Button variant="secondary" size="large">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Choose ChatApp?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
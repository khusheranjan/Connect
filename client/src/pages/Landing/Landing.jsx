import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '16px 48px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#1877f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '22px'
          }}>
            C
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '700',
            color: '#1877f2'
          }}>
            Connect
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              color: '#1877f2',
              border: '2px solid #1877f2',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e7f3ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '10px 24px',
              backgroundColor: '#1877f2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#166fe5';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1877f2';
            }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '56px',
          fontWeight: '700',
          color: '#050505',
          marginBottom: '24px',
          lineHeight: '1.2'
        }}>
          Stay Connected, Anywhere
        </h2>
        <p style={{
          fontSize: '24px',
          color: '#65676b',
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 40px'
        }}>
          Real-time messaging, group channels, and seamless communication all in one place
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '16px 48px',
              backgroundColor: '#1877f2',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(24,119,242,0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#166fe5';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(24,119,242,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1877f2';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(24,119,242,0.3)';
            }}
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '60px 48px',
        backgroundColor: '#ffffff',
        maxWidth: '1200px',
        margin: '0 auto',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#050505',
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          Why Choose Connect?
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px'
        }}>
          {[
            {
              icon: '💬',
              title: 'Real-Time Messaging',
              description: 'Instant message delivery with Socket.io technology. Chat with friends in real-time.'
            },
            {
              icon: '👥',
              title: 'Group Channels',
              description: 'Create or join group channels to chat with multiple people at once.'
            },
            {
              icon: '🔒',
              title: 'Secure & Private',
              description: 'Your conversations are protected with JWT authentication and encrypted connections.'
            },
            {
              icon: '🔔',
              title: 'Friend System',
              description: 'Send friend requests, manage your connections, and see who\'s online.'
            },
            {
              icon: '🎨',
              title: 'Modern Interface',
              description: 'Clean, intuitive design inspired by the best messaging apps.'
            },
            {
              icon: '⚡',
              title: 'Fast & Reliable',
              description: 'Built with modern technologies for a smooth, responsive experience.'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              padding: '32px',
              backgroundColor: '#f7f8fa',
              borderRadius: '12px',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {feature.icon}
              </div>
              <h4 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#050505',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h4>
              <p style={{
                fontSize: '15px',
                color: '#65676b',
                lineHeight: '1.5'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 48px',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '42px',
          fontWeight: '700',
          color: '#050505',
          marginBottom: '24px'
        }}>
          Ready to Connect?
        </h3>
        <p style={{
          fontSize: '20px',
          color: '#65676b',
          marginBottom: '32px'
        }}>
          Join thousands of users already chatting on Connect
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '16px 48px',
            backgroundColor: '#42b72a',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(66,183,42,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#36a420';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(66,183,42,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#42b72a';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(66,183,42,0.3)';
          }}
        >
          Create Account
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 48px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e4e6eb',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#65676b',
          margin: 0
        }}>
          © 2024 Connect. Built with React, Node.js, Express, MongoDB & Socket.io
        </p>
      </footer>
    </div>
  );
};

export default Landing;

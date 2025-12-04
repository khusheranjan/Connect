import React from 'react'
import { useNavigate } from 'react-router-dom';
import useUser  from '../../Context.jsx'
import Sidebar from '../../components/Sidebar.jsx';
import ChatArea from '../../components/ChatArea.jsx';

const Dashboard = () => {
    const {userData} = useUser();
    const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e4e6eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#1877f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            C
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#050505'
          }}>
            Connect
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: '#f0f2f5',
            borderRadius: '20px'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#1877f2',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#050505'
            }}>
              {userData?.name}
            </span>
          </div>
          <button
            onClick={() => navigate('/profile')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f0f2f5',
              color: '#050505',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e4e6eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f2f5'}
          >
            Profile
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        gap: '0'
      }}>
        <Sidebar/>
        <ChatArea/>
      </div>
    </div>
  )
}

export default Dashboard

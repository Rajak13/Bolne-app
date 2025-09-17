import { useState } from 'react';
import { Button, Input } from './';
import httpClient from '../../services/httpClient';

const DevHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: 'password123'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTestUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await httpClient.post('/auth/create-test-user', formData);
      setMessage(`✅ Test user created successfully! You can now login with: ${formData.email}`);
      setFormData({
        fullName: '',
        email: '',
        password: 'password123'
      });
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 9999,
        background: '#f59e0b',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }} onClick={() => setIsOpen(true)}>
        🛠️ Dev Helper
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '300px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>🛠️ Create Test User</h4>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>
      
      <form onSubmit={handleCreateTestUser} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          size="small"
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          size="small"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          size="small"
        />
        <Button
          type="submit"
          variant="primary"
          size="small"
          loading={isLoading}
          disabled={isLoading}
        >
          Create Test User
        </Button>
      </form>
      
      {message && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px', 
          borderRadius: '4px', 
          fontSize: '12px',
          backgroundColor: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
          color: message.includes('✅') ? '#166534' : '#dc2626',
          border: `1px solid ${message.includes('✅') ? '#bbf7d0' : '#fecaca'}`
        }}>
          {message}
        </div>
      )}
      
      <div style={{ 
        marginTop: '8px', 
        fontSize: '11px', 
        color: '#6b7280',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '8px'
      }}>
        💡 This bypasses email verification for testing
      </div>
    </div>
  );
};

export default DevHelper;
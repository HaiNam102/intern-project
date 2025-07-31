import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { callGetCameraById, callUpdateCamera } from '../services/api';

const EditCamera = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nameCamera: '',
    location: '',
    streamUrl: '',
    status: 'ONLINE'
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchCamera = async () => {
      try {
        setInitialLoading(true);
        const response = await callGetCameraById(id);
        if (response.code === 200 && response.data) {
          setFormData({
            nameCamera: response.data.nameCamera || '',
            location: response.data.location || '',
            streamUrl: response.data.streamUrl || '',
            status: response.data.status || 'ONLINE'
          });
        } else {
          setError('Không thể tải thông tin camera');
        }
      } catch (error) {
        console.error('Error fetching camera:', error);
        setError('Không thể tải thông tin camera');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchCamera();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await callUpdateCamera(id, formData);
      if (response.code === 200) {
        navigate('/cameras'); // Redirect to camera list
      } else {
        setError(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      setError('Không thể cập nhật camera');
      console.error('Update camera error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (initialLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #4299e1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ marginLeft: '12px', fontSize: '16px' }}>
          Đang tải thông tin camera...
        </span>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px',
      margin: '20px auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        color: '#2c3e50',
        fontSize: '2rem',
        fontWeight: '600'
      }}>Chỉnh sửa Camera</h2>
      
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px' 
      }}>
        {['nameCamera', 'location', 'streamUrl'].map((field) => (
          <div key={field} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label 
              htmlFor={field} 
              style={{ 
                fontSize: '1rem',
                fontWeight: '500',
                color: '#4a5568'
              }}
            >
              {field === 'nameCamera' ? 'Tên Camera' : 
               field === 'location' ? 'Vị trí' : 
               'Stream URL'}:
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease',
                outline: 'none',
                ':focus': {
                  borderColor: '#4299e1',
                  boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.5)'
                }
              }}
              placeholder={
                field === 'nameCamera' ? 'Nhập tên camera...' :
                field === 'location' ? 'Nhập vị trí...' :
                'Nhập URL stream...'
              }
            />
          </div>
        ))}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <label 
            htmlFor="status" 
            style={{ 
              fontSize: '1rem',
              fontWeight: '500',
              color: '#4a5568'
            }}
          >
            Trạng thái:
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              backgroundColor: '#fff',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="ONLINE">ONLINE</option>
            <option value="OFFLINE">OFFLINE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>

        {error && (
          <div style={{ 
            color: '#e53e3e',
            backgroundColor: '#fff5f5',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '0.95rem',
            border: '1px solid #feb2b2'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/cameras')}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#e2e8f0',
              color: '#4a5568',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: loading ? '#cbd5e0' : '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: loading ? '#cbd5e0' : '#3182ce'
              },
              ':active': {
                transform: loading ? 'none' : 'translateY(1px)'
              }
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>Đang xử lý...</span>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '3px solid #ffffff',
                  borderTop: '3px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : 'Cập nhật Camera'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCamera; 
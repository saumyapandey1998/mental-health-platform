import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Input, Rate, Checkbox, Alert, Space, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Review = () => {
  const [completedSessions, setCompletedSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [token] = useState(localStorage.getItem('authToken'));
  const [role] = useState(localStorage.getItem('role'));
  const [userId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    if (!token || !userId) {
      window.location.href = '/login';
      return;
    }
    fetchCompletedSessions();
    fetchFeedbacks();
  }, [token, userId]);

  const fetchCompletedSessions = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/appointments/completed', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sessionsWithFeedbackStatus = await Promise.all(
        res.data.map(async (session) => {
          try {
            const feedbackRes = await axios.get('http://localhost:5001/api/feedback/feedbacks', {
              headers: { Authorization: `Bearer ${token}` },
              params: { appointmentId: session._id }
            });
            return {
              ...session,
              hasFeedback: feedbackRes.data.length > 0
            };
          } catch (error) {
            console.error(`Error checking feedback for appointment ${session._id}:`, error);
            return { ...session, hasFeedback: false };
          }
        })
      );

      const filteredSessions = sessionsWithFeedbackStatus.filter(session => {
        if (!session.patient || !session.therapist) return false;
        return (
          (role === 'patient' && session.patient._id === userId && !session.hasFeedback) ||
          (role === 'therapist' && session.therapist._id === userId)
        );
      });

      setCompletedSessions(filteredSessions);
      if (filteredSessions.length === 0 && role === 'patient') {
        setNotification({ message: 'No completed sessions available to review', type: 'info' });
      }
    } catch (error) {
      console.error('Error fetching completed sessions:', error);
      setNotification({ 
        message: error.response?.data?.message || 'Failed to fetch completed sessions', 
        type: 'error' 
      });
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/feedback/feedbacks', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Raw feedbacks:', res.data); // Debug log
  
      const filteredFeedbacks = role === 'therapist'
        ? res.data.filter(f => {
            const therapistId = typeof f.therapist === 'string'
              ? f.therapist
              : f.therapist?._id; // fallback if populated
  
            return therapistId === userId;
          })
        : res.data;
  
      console.log('Filtered feedbacks:', filteredFeedbacks);
      setFeedbacks(filteredFeedbacks);
  
      if (filteredFeedbacks.length === 0 && role === 'therapist') {
        setNotification({ message: 'No feedback available', type: 'info' });
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setNotification({ message: 'Failed to fetch feedbacks', type: 'error' });
    }
  };
  
  

  const handleSubmitFeedback = async () => {
    if (!selectedSession || rating === 0 || !reviewText.trim()) {
      setNotification({
        message: 'Please select a session, rating, and write a review',
        type: 'warning'
      });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/feedback/feedbacks',
        {
          appointmentId: selectedSession._id,
          rating,
          review: reviewText,
          anonymous: isAnonymous,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotification({
        message: response.data.message || 'Feedback submitted successfully!',
        type: 'success'
      });

      setSelectedSession(null);
      setRating(0);
      setReviewText('');
      setIsAnonymous(false);
      fetchCompletedSessions();
      fetchFeedbacks();
    } catch (error) {
      console.error('Feedback submission error:', error);
      setNotification({
        message: error.response?.data?.message || 'Failed to submit feedback',
        type: 'error'
      });
    }
  };

  const handleModerate = async (feedbackId, action, reply = '') => {
    try {
      await axios.put(`http://localhost:5001/api/feedback/feedbacks/${feedbackId}`, {
        action,
        reply,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification({ message: `Feedback ${action}ed successfully`, type: 'success' });
      fetchFeedbacks();
    } catch (error) {
      console.error(`Error ${action}ing feedback:`, error);
      setNotification({ message: `Failed to ${action} feedback`, type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('MM/DD/YYYY HH:mm');
  };

  const patientView = () => (
    <>
      <Title level={3}>Submit Feedback</Title>
      {completedSessions.length === 0 ? (
        <Text>No completed sessions available to review.</Text>
      ) : (
        <>
          <Select
            placeholder="Select a completed session"
            style={{ width: '100%', marginBottom: 16 }}
            onChange={(value) => setSelectedSession(completedSessions.find(s => s._id === value))}
            value={selectedSession?._id}
          >
            {completedSessions.map(session => (
              <Select.Option key={session._id} value={session._id}>
                {formatDate(session.date)} with {session.therapist.username}
              </Select.Option>
            ))}
          </Select>
          <Rate value={rating} onChange={setRating} style={{ marginBottom: 16 }} />
          <TextArea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review"
            style={{ marginBottom: 16 }}
            rows={4}
          />
          <Checkbox 
            checked={isAnonymous} 
            onChange={(e) => setIsAnonymous(e.target.checked)}
            style={{ marginBottom: 16 }}
          >
            Post anonymously
          </Checkbox>
          <Button 
            type="primary" 
            onClick={handleSubmitFeedback}
            disabled={!selectedSession || rating === 0 || !reviewText.trim()}
          >
            Submit Feedback
          </Button>
        </>
      )}
    </>
  );

  const therapistView = () => (
    <>
      <Title level={3}>Your Feedback</Title>
      <Table
        rowKey="_id"
        columns={[
          {
            title: 'Patient',
            dataIndex: 'anonymous',
            key: 'patient',
            render: (anonymous, record) => anonymous ? 'Anonymous' : record.patient?.username || 'N/A'
          },
          { title: 'Rating', dataIndex: 'rating', key: 'rating' },
          { title: 'Review', dataIndex: 'review', key: 'review' },
          {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: date => formatDate(date)
          },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          {
            title: 'Admin Reply',
            dataIndex: 'adminReply',
            key: 'adminReply',
            render: reply => reply || 'No reply'
          },
        ]}
        dataSource={feedbacks}
        pagination={{ pageSize: 5 }}
      />
    </>
  );

  const adminReviewView = () => (
    <>
      <Title level={3}>All Reviews</Title>
      <Table
        rowKey="_id"
        columns={[
          {
            title: 'Therapist',
            dataIndex: ['appointment', 'therapist', 'username'],
            key: 'therapist'
          },
          {
            title: 'Patient',
            dataIndex: 'anonymous',
            key: 'patient',
            render: (anonymous, record) => anonymous ? 'Anonymous' : record.patient?.username || 'N/A'
          },
          { title: 'Rating', dataIndex: 'rating', key: 'rating' },
          { title: 'Review', dataIndex: 'review', key: 'review' },
          {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: date => formatDate(date)
          },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          {
            title: 'Admin Reply',
            dataIndex: 'adminReply',
            key: 'adminReply',
            render: reply => reply || 'No reply'
          },
        ]}
        dataSource={feedbacks}
        pagination={{ pageSize: 5 }}
      />
    </>
  );

  const adminModerateView = () => {
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [reply, setReply] = useState('');

    return (
      <>
        <Title level={3}>Moderate Reviews</Title>
        <Table
          rowKey="_id"
          columns={[
            {
              title: 'Therapist',
              dataIndex: ['appointment', 'therapist', 'username'],
              key: 'therapist'
            },
            {
              title: 'Patient',
              dataIndex: 'anonymous',
              key: 'patient',
              render: (anonymous, record) => anonymous ? 'Anonymous' : record.patient?.username || 'N/A'
            },
            { title: 'Rating', dataIndex: 'rating', key: 'rating' },
            { title: 'Review', dataIndex: 'review', key: 'review' },
            {
              title: 'Date',
              dataIndex: 'createdAt',
              key: 'date',
              render: date => formatDate(date)
            },
            { title: 'Status', dataIndex: 'status', key: 'status' },
            {
              title: 'Action',
              key: 'action',
              render: (_, record) => (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => handleModerate(record._id, 'approve')}
                    disabled={record.status === 'approved'}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    onClick={() => handleModerate(record._id, 'delete')}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedFeedback(record);
                      setReply(record.adminReply || '');
                    }}
                  >
                    Reply
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={feedbacks.filter(f => f.status === 'pending')}
          pagination={{ pageSize: 5 }}
        />
        <Modal
          title="Reply to Feedback"
          open={!!selectedFeedback}
          onOk={() => {
            handleModerate(selectedFeedback._id, 'reply', reply);
            setSelectedFeedback(null);
            setReply('');
          }}
          onCancel={() => {
            setSelectedFeedback(null);
            setReply('');
          }}
          okButtonProps={{ disabled: !reply.trim() }}
        >
          <TextArea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Enter your reply"
            rows={4}
          />
        </Modal>
      </>
    );
  };

  return (
    <div style={{ padding: 24, paddingTop: 80 }}>
      {notification.message && (
        <Alert
          message={notification.message}
          type={notification.type}
          showIcon
          style={{ marginBottom: 16 }}
          closable
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      {role === 'patient' && patientView()}
      {role === 'therapist' && therapistView()}
      {role === 'admin' && (
        <>
          {adminReviewView()}
          {adminModerateView()}
        </>
      )}
    </div>
  );
};

export default Review;
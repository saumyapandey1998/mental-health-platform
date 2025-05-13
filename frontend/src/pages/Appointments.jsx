import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Typography, Select, DatePicker, Space, Alert } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const SLOT_TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

const Appointments = () => {
  const [therapists, setTherapists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [therapistAppointments, setTherapistAppointments] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [bookingTherapist, setBookingTherapist] = useState(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] = useState(false);
  const [isAvailabilityModalVisible, setIsAvailabilityModalVisible] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState(null);
  const [selectedUnavailableSlots, setSelectedUnavailableSlots] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [token] = useState(localStorage.getItem('authToken'));
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchTherapists();
    fetchAppointments();
  }, [token, refreshCounter]);

  const refreshData = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  const fetchTherapists = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/appointments/therapists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTherapists(res.data);
    } catch (error) {
      setNotification({ message: 'Failed to fetch therapists', type: 'error' });
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedAppointments = await Promise.all(
        res.data.map(async (app) => {
          const now = new Date();
          const appDate = new Date(app.date);
          if (
            appDate < now &&
            app.status !== APPOINTMENT_STATUS.COMPLETED &&
            app.status !== APPOINTMENT_STATUS.CANCELLED
          ) {
            await axios.put(
              'http://localhost:5001/api/appointments/complete',
              { appointmentId: app._id },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            app.status = APPOINTMENT_STATUS.COMPLETED;
          }
          return app;
        })
      );
      setAppointments(updatedAppointments);

      if (role === 'therapist') {
        const therapistApps = updatedAppointments.filter(
          (app) =>
            app.therapist &&
            (app.therapist._id === userId || app.therapist.username === username)
        );
        setTherapistAppointments(therapistApps);
      }
    } catch (error) {
      setNotification({ message: 'Failed to fetch appointments', type: 'error' });
    }
  };

  const fetchSlots = async (therapistId, date) => {
    try {
      if (!therapistId || !date) {
        setNotification({ message: 'Therapist ID and date required', type: 'error' });
        return;
      }
      const formattedDate = date.format('MM/DD/YYYY');
      const res = await axios.get('http://localhost:5001/api/appointments/slots', {
        params: { therapistId, date: formattedDate },
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookedSlots(res.data);
      setNotification({ message: '', type: '' });
    } catch (error) {
      console.error('Error fetching slots:', error);
      setNotification({ message: 'Failed to fetch booked slots', type: 'error' });
    }
  };

  const handleBook = async () => {
    if (!bookingDate || !bookingTime || !bookingTherapist) {
      setNotification({ message: 'Please select a date and time', type: 'warning' });
      return;
    }
    const formattedDate = bookingDate.format('MM/DD/YYYY');
    try {
      const res = await axios.post(
        'http://localhost:5001/api/appointments/book',
        {
          therapistId: bookingTherapist._id,
          date: formattedDate,
          time: bookingTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification({ message: res.data.message || 'Appointment booked', type: 'success' });
      setIsBookingModalVisible(false);
      setBookingDate(null);
      setBookingTime(null);
      refreshData();
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Booking failed',
        type: 'error',
      });
    }
  };

  const handleReschedule = async () => {
    if (!bookingDate || !bookingTime || !reschedulingAppointment) {
      setNotification({ message: 'Please select a date and time', type: 'warning' });
      return;
    }
    const formattedDate = bookingDate.format('MM/DD/YYYY');
    try {
      const res = await axios.put(
        'http://localhost:5001/api/appointments/modify',
        {
          appointmentId: reschedulingAppointment._id,
          action: 'reschedule',
          newDate: formattedDate,
          newTime: bookingTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification({
        message: res.data.message || 'Appointment rescheduled',
        type: 'success',
      });
      setIsRescheduleModalVisible(false);
      setBookingDate(null);
      setBookingTime(null);
      refreshData();
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Reschedule failed',
        type: 'error',
      });
    }
  };

  const handleSetAvailability = async () => {
    if (!availabilityDate) {
      setNotification({ message: 'Please select a date', type: 'warning' });
      return;
    }
    if (selectedUnavailableSlots.length === 0) {
      setNotification({
        message: 'Please select at least one unavailable slot',
        type: 'warning',
      });
      return;
    }
    if (!userId) {
      setNotification({ message: 'User ID not found', type: 'warning' });
      return;
    }
    const formattedDate = availabilityDate.format('MM/DD/YYYY');
    try {
      for (const time of selectedUnavailableSlots) {
        await axios.post(
          'http://localhost:5001/api/appointments/disable-slot',
          {
            therapistId: userId,
            date: formattedDate,
            time,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setNotification({
        message: 'Availability updated successfully',
        type: 'success',
      });
      setIsAvailabilityModalVisible(false);
      setAvailabilityDate(null);
      setSelectedUnavailableSlots([]);
      refreshData();
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Failed to update availability',
        type: 'error',
      });
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const response = await axios.put(
        'http://localhost:5001/api/appointments/complete',
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setNotification({
          message: 'Appointment marked as completed',
          type: 'success',
        });
        refreshData();
      } else {
        setNotification({
          message: response.data.message || 'Failed to complete appointment',
          type: 'error',
        });
      }
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Failed to complete appointment',
        type: 'error',
      });
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      const response = await axios.put(
        'http://localhost:5001/api/appointments/status',
        { appointmentId, status: APPOINTMENT_STATUS.CONFIRMED },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setNotification({
          message: 'Appointment confirmed successfully',
          type: 'success',
        });
        refreshData();
      } else {
        setNotification({
          message: response.data.message || 'Failed to confirm appointment',
          type: 'error',
        });
      }
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Failed to confirm appointment',
        type: 'error',
      });
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.put(
        'http://localhost:5001/api/appointments/modify',
        { appointmentId, action: 'cancel' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification({
        message: response.data.message || 'Appointment cancelled successfully',
        type: 'success',
      });
      refreshData();
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Failed to cancel appointment',
        type: 'error',
      });
    }
  };

  const disabledDate = (current) => {
    // Disable dates before today and weekends (Saturday = 6, Sunday = 0)
    return current && (current < moment().startOf('day') || [0, 6].includes(current.day()));
  };

  const renderSlotOptions = (type = 'book') => {
    const isToday = bookingDate && bookingDate.isSame(moment(), 'day');
    let availableSlots = SLOT_TIMES.filter((slot) => !bookedSlots.includes(slot));

    // If the selected date is today, filter out past slots (handled by backend, but ensure consistency)
    if (isToday) {
      const now = moment();
      const currentHour = now.hour();
      const currentMinute = now.minute();
      availableSlots = availableSlots.filter((slot) => {
        const [hour, minute] = slot.split(':').map(Number);
        return hour > currentHour || (hour === currentHour && minute > currentMinute);
      });
    }

    return (
      <Select
        mode={type === 'availability' ? 'multiple' : undefined}
        placeholder={
          type === 'availability' ? 'Select unavailable slots' : 'Select Time'
        }
        value={type === 'availability' ? selectedUnavailableSlots : bookingTime}
        onChange={(val) =>
          type === 'availability'
            ? setSelectedUnavailableSlots(val)
            : setBookingTime(val)
        }
        style={{ width: '100%' }}
        disabled={
          !availabilityDate && type === 'availability' ||
          !bookingDate && type !== 'availability' ||
          availableSlots.length === 0
        }
      >
        {availableSlots.map((slot) => (
          <Select.Option key={slot} value={slot}>
            {slot}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderPatientActionButtons = (record) => {
    if (
      record.status === APPOINTMENT_STATUS.CANCELLED ||
      record.status === APPOINTMENT_STATUS.COMPLETED
    ) {
      return (
        <Space>
          <Button disabled>Cancel</Button>
          <Button disabled>Reschedule</Button>
        </Space>
      );
    }

    if (record.status === APPOINTMENT_STATUS.CONFIRMED) {
      return (
        <Space>
          <Button danger onClick={() => handleCancelAppointment(record._id)}>
            Cancel
          </Button>
          <Button disabled>Reschedule</Button>
          <Button disabled>Video Call</Button>
          <Button
            type="primary"
            onClick={() => {
              navigate(`/appointments/video-call?appointmentId=${record._id}`);
            }}
          >
            Video Call
          </Button>
        </Space>
      );
    }

    return (
      <Space>
        <Button danger onClick={() => handleCancelAppointment(record._id)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            setReschedulingAppointment(record);
            setBookingDate(moment(record.date));
            setBookingTime(
              `${new Date(record.date)
                .getHours()
                .toString()
                .padStart(2, '0')}:${new Date(record.date)
                .getMinutes()
                .toString()
                .padStart(2, '0')}`
            );
            setNotification({ message: '', type: '' });
            setIsRescheduleModalVisible(true);
            fetchSlots(record.therapist._id, moment(record.date));
          }}
        >
          Reschedule
        </Button>
        <Button
          type="primary"
          onClick={() => {
            navigate(`/appointments/video-call?appointmentId=${record._id}`);
          }}
        >
          Video Call
        </Button>
      </Space>
    );
  };

  const renderTherapistActionButtons = (record) => {
    if (record.status === APPOINTMENT_STATUS.COMPLETED) {
      return (
        <Space>
          <Button disabled>Completed</Button>
        </Space>
      );
    }

    if (record.status === APPOINTMENT_STATUS.CANCELLED) {
      return (
        <Space>
          <Button disabled>Confirm</Button>
          <Button disabled>Cancel</Button>
          <Button disabled>Reschedule</Button>
          <Button disabled>Complete</Button>
        </Space>
      );
    }

    if (record.status === APPOINTMENT_STATUS.CONFIRMED) {
      return (
        <Space>
          <Button danger onClick={() => handleCancelAppointment(record._id)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setReschedulingAppointment(record);
              setBookingDate(moment(record.date));
              setBookingTime(
                `${new Date(record.date)
                  .getHours()
                  .toString()
                  .padStart(2, '0')}:${new Date(record.date)
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`
              );
              setNotification({ message: '', type: '' });
              setIsRescheduleModalVisible(true);
              fetchSlots(record.therapist._id, moment(record.date));
            }}
          >
            Reschedule
          </Button>
          <Button
            type="primary"
            onClick={() => handleCompleteAppointment(record._id)}
          >
            Complete
          </Button>
        </Space>
      );
    }

    return (
      <Space>
        <Button onClick={() => handleAcceptAppointment(record._id)}>
          Confirm
        </Button>
        <Button danger onClick={() => handleCancelAppointment(record._id)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            setReschedulingAppointment(record);
            setBookingDate(moment(record.date));
            setBookingTime(
              `${new Date(record.date)
                .getHours()
                .toString()
                .padStart(2, '0')}:${new Date(record.date)
                .getMinutes()
                .toString()
                .padStart(2, '0')}`
            );
            setNotification({ message: '', type: '' });
            setIsRescheduleModalVisible(true);
            fetchSlots(record.therapist._id, moment(record.date));
          }}
        >
          Reschedule
        </Button>
      </Space>
    );
  };

  return (
    <div style={{ padding: 24, paddingTop: 80 }}>
      <Title level={3}>Therapists</Title>
      {role !== 'therapist' && (
        <Table
          rowKey="_id"
          columns={[
            { title: 'Therapist', dataIndex: 'username' },
            { title: 'Specialization', dataIndex: 'specialization' },
            {
              title: 'Action',
              render: (_, record) => (
                <Button
                  type="primary"
                  onClick={() => {
                    setBookingTherapist(record);
                    setNotification({ message: '', type: '' });
                    setIsBookingModalVisible(true);
                  }}
                >
                  Book
                </Button>
              ),
            },
          ]}
          dataSource={therapists}
          pagination={{ pageSize: 5 }}
        />
      )}

      {role === 'therapist' && (
        <>
          <Button
            type="primary"
            onClick={() => {
              setNotification({ message: '', type: '' });
              setIsAvailabilityModalVisible(true);
            }}
            style={{ marginBottom: 16 }}
          >
            Set Availability
          </Button>

          <Title level={3}>Your Patients</Title>
          <Table
            rowKey="_id"
            columns={[
              { title: 'Patient', dataIndex: ['patient', 'username'], key: 'patient' },
              {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (date) => formatDate(date),
              },
              { title: 'Status', dataIndex: 'status', key: 'status' },
            ]}
            dataSource={therapistAppointments}
            pagination={{ pageSize: 5 }}
          />
        </>
      )}

      {role === 'therapist' && (
        <>
          <Title level={3} style={{ marginTop: 32 }}>
            Manage Appointments
          </Title>
          <Table
            rowKey="_id"
            columns={[
              { title: 'Patient', dataIndex: ['patient', 'username'], key: 'patient' },
              {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (date) => formatDate(date),
              },
              { title: 'Status', dataIndex: 'status', key: 'status' },
              {
                title: 'Action',
                key: 'action',
                render: (_, record) => renderTherapistActionButtons(record),
              },
            ]}
            dataSource={therapistAppointments}
            pagination={{ pageSize: 5 }}
          />
        </>
      )}

      {role !== 'therapist' && (
        <>
          <Title level={3} style={{ marginTop: 32 }}>
            Your Appointments
          </Title>
          <Table
            rowKey="_id"
            columns={[
              { title: 'Therapist', dataIndex: ['therapist', 'username'], key: 'therapist' },
              { title: 'Patient', dataIndex: ['patient', 'username'], key: 'patient' },
              {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (date) => formatDate(date),
              },
              { title: 'Status', dataIndex: 'status', key: 'status' },
              {
                title: 'Action',
                key: 'action',
                render: (_, record) => renderPatientActionButtons(record),
              },
            ]}
            dataSource={appointments}
            pagination={{ pageSize: 5 }}
          />
        </>
      )}

      <Modal
        title={
          role !== 'therapist'
            ? `Book with ${bookingTherapist?.username}`
            : 'Set Availability'
        }
        open={isBookingModalVisible || isAvailabilityModalVisible}
        onOk={role !== 'therapist' ? handleBook : handleSetAvailability}
        onCancel={() => {
          if (isBookingModalVisible) {
            setIsBookingModalVisible(false);
            setBookingDate(null);
            setBookingTime(null);
          } else {
            setIsAvailabilityModalVisible(false);
            setAvailabilityDate(null);
            setSelectedUnavailableSlots([]);
          }
          setNotification({ message: '', type: '' });
        }}
      >
        {notification.message && (
          <Alert
            message={notification.message}
            type={notification.type}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <DatePicker
          style={{ width: '100%', marginBottom: 16 }}
          value={role !== 'therapist' ? bookingDate : availabilityDate}
          format="MM/DD/YYYY"
          onChange={(date) => {
            if (role !== 'therapist') {
              setBookingDate(date);
              setBookingTime(null);
              if (date && bookingTherapist) fetchSlots(bookingTherapist._id, date);
            } else {
              setAvailabilityDate(date);
              setSelectedUnavailableSlots([]);
              if (date && userId) fetchSlots(userId, date);
            }
          }}
          disabledDate={disabledDate}
        />
        {renderSlotOptions(role === 'therapist' ? 'availability' : 'book')}
      </Modal>

      <Modal
        title="Reschedule Appointment"
        open={isRescheduleModalVisible}
        onOk={handleReschedule}
        onCancel={() => {
          setIsRescheduleModalVisible(false);
          setBookingDate(null);
          setBookingTime(null);
          setNotification({ message: '', type: '' });
        }}
      >
        {notification.message && (
          <Alert
            message={notification.message}
            type={notification.type}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <DatePicker
          style={{ width: '100%', marginBottom: 16 }}
          value={bookingDate}
          format="MM/DD/YYYY"
          onChange={(date) => {
            setBookingDate(date);
            setBookingTime(null);
            if (date && reschedulingAppointment)
              fetchSlots(reschedulingAppointment.therapist._id, date);
          }}
          disabledDate={disabledDate}
        />
        {renderSlotOptions()}
      </Modal>
    </div>
  );
};

export default Appointments;
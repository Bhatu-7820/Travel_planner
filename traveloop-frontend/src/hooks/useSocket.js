import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '@/store/slices/notificationSlice';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const socketRef = useRef();

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_user_room', user.id);
    });

    socketRef.current.on('new_notification', (notification) => {
      dispatch(addNotification(notification));
      toast(notification.message, { icon: '🔔' });
    });

    socketRef.current.on('ticket_update', (ticket) => {
      // Could dispatch an action to update ticket state if on the Support page
      toast.success(`Support Ticket Update: ${ticket.subject}`);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user, dispatch]);

  return socketRef.current;
};

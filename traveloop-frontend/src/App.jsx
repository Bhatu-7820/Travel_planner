import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes.jsx';
import { useSocket } from './hooks/useSocket';
import { fetchCurrentUser } from './store/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();
  useSocket();
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <AppRoutes />;
}

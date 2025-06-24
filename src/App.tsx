import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, RootState } from './store';
import { setTheme } from './store/slices/themeSlice';

// Layout
import Layout from './components/Layout/Layout';
import NotificationBanner from './components/common/NotificationBanner';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deals from './pages/Deals';
import CreateDeal from './pages/CreateDeal';
import Chat from './pages/Chat';
import VideoCall from './pages/VideoCall';

// Theme Initializer
const ThemeInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        dispatch(setTheme(e.matches ? 'dark' : 'light'));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode, dispatch]);

  return null;
};

const AppContent: React.FC = () => {
  return (
    <>
      <ThemeInitializer />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="deals" element={<Deals />} />
            <Route path="deals/create" element={<CreateDeal />} />
            <Route path="deals/:dealId/chat" element={<Chat />} />
            <Route path="deals/:dealId/video" element={<VideoCall />} />
            <Route path="chat" element={<Chat />} />
            <Route path="video" element={<VideoCall />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <NotificationBanner />
      </Router>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;

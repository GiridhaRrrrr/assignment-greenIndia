import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { X, Bell, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';
import { RootState } from '../../store';
import { removeNotification, markNotificationRead } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';

const NotificationBanner: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { notifications } = useSelector((state: RootState) => state.ui);
  
  // Only show notifications if user is authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  const unreadNotifications = notifications.filter(n => !n.read).slice(0, 3);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-error-500" />;
      default:
        return <Info className="h-5 w-5 text-primary-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 dark:bg-success-900/60 border-success-200 dark:border-success-700';
      case 'warning':
        return 'bg-warning-50 dark:bg-warning-900/60 border-warning-200 dark:border-warning-700';
      case 'error':
        return 'bg-error-50 dark:bg-error-900/60 border-error-200 dark:border-error-700';
      default:
        return 'bg-primary-50 dark:bg-primary-900/60 border-primary-200 dark:border-primary-700';
    }
  };
  

  const handleNotificationClick = (notification: any) => {
    dispatch(markNotificationRead(notification.id));
    if (notification.actionUrl) {
      // In a real app, you'd navigate to the URL
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const handleDismiss = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeNotification(notificationId));
  };

  if (unreadNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {unreadNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              border rounded-lg p-4 shadow-lg cursor-pointer
              ${getBgColor(notification.type)}
            `}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <button
                onClick={(e) => handleDismiss(notification.id, e)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBanner;
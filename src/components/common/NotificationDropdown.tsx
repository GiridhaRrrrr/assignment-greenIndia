import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  X,
  Check,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { RootState } from '../../store';
import { 
  removeNotification, 
  markNotificationRead, 
  clearAllNotifications 
} from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

const NotificationDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { notifications } = useSelector((state: RootState) => state.ui);
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show notifications if user is authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-error-500" />;
      default:
        return <Info className="h-4 w-4 text-primary-500" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      dispatch(markNotificationRead(notification.id));
    }
    if (notification.actionUrl) {
      // In a real app, you'd navigate to the URL
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const handleMarkAllRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        dispatch(markNotificationRead(notification.id));
      }
    });
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllRead}
                      leftIcon={<Check className="h-3 w-3" />}
                    >
                      Mark all read
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      leftIcon={<Trash2 className="h-3 w-3" />}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      No notifications
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You're all caught up!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                          p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors
                          ${!notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                        `}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className={`text-sm font-medium ${
                                !notification.read 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center space-x-2 ml-2">
                                {notification.actionUrl && (
                                  <ExternalLink className="h-3 w-3 text-gray-400" />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(removeNotification(notification.id));
                                  }}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(notification.createdAt)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
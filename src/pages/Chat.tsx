import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Image,
  File,
  Check,
  CheckCheck,
  Clock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockMessages, mockDeals, mockUsers } from '../data/mockData';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Chat: React.FC = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(mockMessages.filter(m => m.dealId === dealId));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const deal = mockDeals.find(d => d.id === dealId);
  const otherUserId = deal?.buyerId === user?.id ? deal?.sellerId : deal?.buyerId;
  const otherUser = mockUsers.find(u => u.id === otherUserId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Mock typing indicator
    let typingTimeout: NodeJS.Timeout;
    
    const handleTyping = () => {
      setIsTyping(true);
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => setIsTyping(false), 2000);
    };

    // Simulate random typing from other user
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        handleTyping();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(typingTimeout);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      dealId: dealId!,
      senderId: user!.id,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      type: 'text' as const,
      readBy: [user!.id],
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Mock auto-reply after 2-3 seconds
    setTimeout(() => {
      const autoReply = {
        id: (Date.now() + 1).toString(),
        dealId: dealId!,
        senderId: otherUserId!,
        content: getAutoReply(message),
        timestamp: new Date().toISOString(),
        type: 'text' as const,
        readBy: [otherUserId!],
      };
      setMessages(prev => [...prev, autoReply]);
    }, 2000 + Math.random() * 1000);
  };

  const getAutoReply = (userMessage: string): string => {
    const replies = [
      "Thanks for the message! I'll review this and get back to you shortly.",
      "That sounds good. Let me check on the details and respond soon.",
      "I appreciate you reaching out. I'll have an update for you within the next few hours.",
      "Great question! I'm looking into this now and will provide a detailed response.",
      "Thanks for the clarification. This helps me understand your requirements better.",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getMessageStatus = (msg: any) => {
    if (msg.senderId !== user?.id) return null;
    
    if (msg.readBy.includes(otherUserId!)) {
      return <CheckCheck className="h-3 w-3 text-primary-500" />;
    } else {
      return <Check className="h-3 w-3 text-gray-400" />;
    }
  };

  if (!deal || !otherUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Deal not found
          </h3>
          <Button onClick={() => navigate('/deals')}>
            Back to Deals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <Card padding="none" className="flex-shrink-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/deals')}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            
            <div className="flex items-center space-x-3">
              {otherUser.avatar ? (
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {otherUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {otherUser.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {deal.title}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" leftIcon={<Phone className="h-4 w-4" />}>
              Call
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Video className="h-4 w-4" />}>
              Video
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Info className="h-4 w-4" />}>
              Info
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<MoreVertical className="h-4 w-4" />} />
          </div>
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isOwn = msg.senderId === user?.id;
            const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
            const sender = mockUsers.find(u => u.id === msg.senderId);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {!isOwn && showAvatar && (
                    <div className="flex-shrink-0">
                      {sender?.avatar ? (
                        <img
                          src={sender.avatar}
                          alt={sender.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-6 w-6 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {sender?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`${!isOwn && !showAvatar ? 'ml-8' : ''}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    
                    <div className={`flex items-center space-x-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(msg.timestamp)}
                      </span>
                      {getMessageStatus(msg)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                <div className="flex-shrink-0">
                  {otherUser.avatar ? (
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {otherUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Card padding="none" className="flex-shrink-0">
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" leftIcon={<Paperclip className="h-4 w-4" />} />
              <Button variant="ghost" size="sm" leftIcon={<Image className="h-4 w-4" />} />
              <Button variant="ghost" size="sm" leftIcon={<File className="h-4 w-4" />} />
            </div>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                leftIcon={<Smile className="h-4 w-4" />}
              />
            </div>
            
            <Button
              onClick={sendMessage}
              disabled={!message.trim()}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
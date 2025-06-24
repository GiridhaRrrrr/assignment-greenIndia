import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDeals, mockUsers } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {
  Briefcase,
  MessageCircle,
  Calendar,
  Clock,
  DollarSign,
} from 'lucide-react';

const ChatList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

 // Show only deals where user is either buyer or seller
 const userDeals = mockDeals;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Your Conversations
      </h1>

      {userDeals.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">No deals available to chat.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {userDeals.map((deal) => {
          const { user } = useAuth();
          const otherUserId = deal?.buyerId === user?.$id ? deal?.sellerId : deal?.buyerId;
          const otherUser = mockUsers.find(u => u.$id === otherUserId);

          return (
            <Card key={deal.id} hover className="cursor-pointer" onClick={() => navigate(`/deals/${deal.id}/chat`)}>
              <div className="flex items-start space-x-4">
                {otherUser?.avatar ? (
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {otherUser?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {deal.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {deal.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${deal.price.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(deal.updatedAt).toLocaleDateString()}</span>
                    </span>
                    {deal.dueDate && (
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Due {new Date(deal.dueDate).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="ghost" leftIcon={<MessageCircle className="h-4 w-4" />}>
                  Chat
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;

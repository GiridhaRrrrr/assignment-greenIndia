import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Clock } from 'lucide-react';
import { mockDeals } from '../data/mockData';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const VideoCall: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Select a Deal to Start Video Call
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDeals.map((deal) => (
          <Card
            key={deal.id}
            hover
            className="cursor-pointer transition-all"
            onClick={() => navigate(`/deals/${deal.id}/video`)}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {deal.title}
                </h3>
                <Video className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {deal.description}
              </p>
              <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(deal.updatedAt).toLocaleDateString()}
              </div>
              {deal.dueDate && (
                <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Due {new Date(deal.dueDate).toLocaleDateString()}
                </div>
              )}
              <div className="mt-2">
                <Button size="sm">Start Call</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoCall;

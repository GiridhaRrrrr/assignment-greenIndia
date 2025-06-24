import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockDeals } from '../data/mockData';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Deals: React.FC = () => {
  const { user, isBuyer, isSeller } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');

  const statusColors = {
    pending: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    in_progress: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    completed: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    cancelled: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200',
  };

  const statusIcons = {
    pending: AlertCircle,
    in_progress: Clock,
    completed: CheckCircle,
    cancelled: XCircle,
  };

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-warning-600',
    high: 'text-error-600',
  };

  // Filter deals based on user role
  const userDeals = mockDeals.filter(deal => {
    if (isBuyer) return deal.buyerId === user?.$id;
    if (isSeller) return deal.sellerId === user?.$id;
    return true; // Admin sees all
  });

  const filteredDeals = userDeals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const getActionButtons = (deal: any) => {
    if (isBuyer) {
      return (
        <div className="flex items-center space-x-2">
          <Link to={`/deals/${deal.id}/chat`}>
            <Button variant="ghost" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
              Chat
            </Button>
          </Link>
          <Link to={`/deals/${deal.id}`}>
            <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
              View
            </Button>
          </Link>
          {deal.status === 'pending' && (
            <Button variant="ghost" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
              Edit
            </Button>
          )}
        </div>
      );
    }

    if (isSeller) {
      return (
        <div className="flex items-center space-x-2">
          <Link to={`/deals/${deal.id}/chat`}>
            <Button variant="ghost" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
              Chat
            </Button>
          </Link>
          {deal.status === 'pending' && (
            <>
              <Button variant="primary" size="sm">
                Accept
              </Button>
              <Button variant="outline" size="sm">
                Counter
              </Button>
              <Button variant="danger" size="sm">
                Reject
              </Button>
            </>
          )}
          {deal.status !== 'pending' && (
            <Link to={`/deals/${deal.id}`}>
              <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                View
              </Button>
            </Link>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isBuyer ? 'My Deals' : isSeller ? 'Incoming Deals' : 'All Deals'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isBuyer 
              ? 'Manage and track your submitted deals'
              : isSeller 
              ? 'Review and respond to deal requests'
              : 'Overview of all platform deals'
            }
          </p>
        </div>
        {isBuyer && (
          <div className="mt-4 sm:mt-0">
            <Link to="/deals/create">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Create New Deal
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
            >
              <option value="updatedAt">Last Updated</option>
              <option value="createdAt">Date Created</option>
              <option value="price">Price</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedDeals.map((deal, index) => {
          const StatusIcon = statusIcons[deal.status];
          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {deal.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[deal.status]}`}>
                          <StatusIcon className="inline h-3 w-3 mr-1" />
                          {deal.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs font-medium ${priorityColors[deal.priority]}`}>
                          {deal.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                    {deal.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-success-600" />
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${deal.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {deal.tags && deal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {deal.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {deal.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                          +{deal.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(deal.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {deal.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Due {new Date(deal.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {getActionButtons(deal)}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedDeals.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              {isBuyer ? (
                <Plus className="h-12 w-12 text-gray-400" />
              ) : (
                <AlertCircle className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== 'all' 
                ? 'No deals found'
                : isBuyer 
                ? 'No deals created yet'
                : 'No incoming deals'
              }
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : isBuyer 
                ? 'Create your first deal to get started'
                : 'Deals will appear here when buyers submit requests'
              }
            </p>
            {isBuyer && !searchTerm && statusFilter === 'all' && (
              <Link to="/deals/create">
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  Create Your First Deal
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* Stats Summary */}
      {sortedDeals.length > 0 && (
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {sortedDeals.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Deals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {sortedDeals.filter(d => d.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {sortedDeals.filter(d => d.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {sortedDeals.filter(d => d.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Deals;
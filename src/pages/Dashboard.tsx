import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getAllDeals } from '../services/appwrite/deals';
import { Deal } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // const stats = [
  //   {
  //     title: 'Active Deals',
  //     value: mockAnalytics.activeDeals,
  //     change: '+12%',
  //     trend: 'up',
  //     icon: Briefcase,
  //     color: 'primary',
  //   },
  //   {
  //     title: 'Total Revenue',
  //     value: `$${(mockAnalytics.totalRevenue / 1000000).toFixed(1)}M`,
  //     change: '+23%',
  //     trend: 'up',
  //     icon: DollarSign,
  //     color: 'success',
  //   },
  //   {
  //     title: 'Completed Deals',
  //     value: mockAnalytics.completedDeals,
  //     change: '+8%',
  //     trend: 'up',
  //     icon: CheckCircle,
  //     color: 'secondary',
  //   },
  //   {
  //     title: 'Avg Deal Size',
  //     value: `$${(mockAnalytics.avgDealSize / 1000).toFixed(0)}K`,
  //     change: '-3%',
  //     trend: 'down',
  //     icon: TrendingUp,
  //     color: 'warning',
  //   },
  // ];
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await getAllDeals();
  
        const formattedDeals: Deal[] = response.documents.map((doc: any) => ({
          id: doc.$id,
          title: doc.title,
          description: doc.description,
          price: doc.price,
          status: doc.status,
          buyerId: doc.buyerId,
          sellerId: doc.sellerId,
          createdAt: doc.$createdAt,
          updatedAt: doc.$updatedAt,
          dueDate: doc.dueDate || undefined,
          tags: doc.tags || [],
          priority: doc.priority,
        }));
  
        setDeals(formattedDeals);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDeals();
  }, []);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Loading deals...</p>
      </div>
    );
  }
  


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

  interface StatItem {
    title: string;
    value: string | number;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<{ className?: string }>;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  }

  const stats: StatItem[] = [
    {
      title: 'Active Deals',
      value: deals.filter(d => d.status === 'in_progress').length,
      change: '+12%',
      trend: 'up',
      icon: Briefcase,
      color: 'primary',
    },
    {
      title: 'Completed Deals',
      value: deals.filter(d => d.status === 'completed').length,
      change: '+8%',
      trend: 'up',
      icon: CheckCircle,
      color: 'secondary',
    },
    {
      title: 'Total Revenue',
      value: `$${deals.reduce((acc, d) => acc + (d.status === 'completed' ? d.price : 0), 0).toLocaleString()}`,
      change: '+20%',
      trend: 'up',
      icon: DollarSign,
      color: 'success',
    },
    {
      title: 'Avg Deal Size',
      value: `$${Math.round(deals.reduce((acc, d) => acc + d.price, 0) / deals.length || 0)}`,
      change: '-2%',
      trend: 'down',
      icon: TrendingUp,
      color: 'warning',
    },
  ];
  
  

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your deals today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/deals/create">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Create New Deal
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-error-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Deals Section */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Deals
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredDeals.map((deal, index) => {
            const StatusIcon = statusIcons[deal.status];
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${statusColors[deal.status]}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {deal.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {deal.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ${deal.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(deal.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[deal.status]}`}>
                    {deal.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No deals found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first deal'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link to="/deals/create">
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  Create Deal
                </Button>
              </Link>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
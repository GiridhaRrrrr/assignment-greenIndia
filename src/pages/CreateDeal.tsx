import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { createDeal } from "../services/appwrite/deals"


const dealSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be less than 1000 characters'),
  price: z.number().min(1, 'Price must be greater than 0').max(10000000, 'Price must be less than $10M'),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().min(1, 'Please select a category'),
});

type DealFormData = z.infer<typeof dealSchema>;

const CreateDeal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dealSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(1000),
    price: z.number().min(1).max(10000000),
    dueDate: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']),
    tags: z.string().array().optional(), // ← if you want to validate tags too
    // category: z.string(), ← remove if not storing in DB
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      priority: 'medium',
      category: '',
    },
  });

  const categories = [
    'Software & Technology',
    'Marketing & Advertising',
    'Consulting Services',
    'Design & Creative',
    'Development & Programming',
    'Business Services',
    'Legal Services',
    'Financial Services',
    'Real Estate',
    'Manufacturing',
    'Healthcare',
    'Education',
    'Other',
  ];


  

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: DealFormData) => {
    setIsSubmitting(true);
  
    try {
      const newDeal: Parameters<typeof createDeal>[0] = {
        title: data.title,
        description: data.description,
        price: data.price,
        dueDate: data.dueDate || undefined,
        priority: data.priority,
        buyerId: user?.$id || '',
        sellerId: '',
        status: 'pending',
        tags,
      };      
  
      const created = await createDeal(newDeal);
  
  
      navigate("/deals", {
        state: {
          message: "Deal created successfully! Sellers will be notified.",
          type: "success",
        },
      });
    } catch (error) {
      console.error("Error creating deal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const watchedPrice = watch('price');
  const watchedDescription = watch('description');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/deals')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Deals
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Deal
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Submit a deal request to connect with qualified sellers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deal Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="e.g., Enterprise CRM Software Implementation"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-error-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  placeholder="Provide detailed requirements, specifications, and expectations for this deal..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description ? (
                    <p className="text-sm text-error-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description.message}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Minimum 20 characters required
                    </p>
                  )}
                  <span className="text-sm text-gray-400">
                    {watchedDescription?.length || 0}/1000
                  </span>
                </div>
              </div>

              {/* Price and Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget (USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('price', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      step="1"
                      placeholder="50000"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-error-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority *
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Completion Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('dueDate')}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-primary-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      disabled={tags.length >= 5}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim() || tags.includes(tagInput.trim()) || tags.length >= 5}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add up to 5 tags to help sellers find your deal
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/deals')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  leftIcon={<FileText className="h-4 w-4" />}
                >
                  Create Deal
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Deal Preview
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Budget:</span>
                <div className="text-lg font-semibold text-success-600">
                  {watchedPrice ? `$${watchedPrice.toLocaleString()}` : '$0'}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No tags added</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Tips Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💡 Tips for Success
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Be specific about your requirements and expectations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Set a realistic budget based on market rates</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Add relevant tags to help sellers find your deal</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Include a reasonable timeline for completion</span>
              </li>
            </ul>
          </Card>

          {/* Process Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What happens next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-semibold">
                  1
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Your deal is posted to qualified sellers
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Sellers review and submit proposals
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-semibold">
                  3
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  You review proposals and start negotiations
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateDeal;
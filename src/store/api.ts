import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Deal, User, Message, ChatRoom } from '../types';

// Mock API base URL - replace with actual API endpoint
const API_BASE_URL = 'https://api.virtual-deal-room.com';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Deal', 'User', 'Message', 'ChatRoom'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<{ user: User; token: string }, { email: string; password: string; role: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    register: builder.mutation<{ user: User; token: string }, { email: string; password: string; name: string; role: string }>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Deal endpoints
    getDeals: builder.query<Deal[], { status?: string; search?: string }>({
      query: (params) => ({
        url: '/deals',
        params,
      }),
      providesTags: ['Deal'],
    }),

    getDeal: builder.query<Deal, string>({
      query: (id) => `/deals/${id}`,
      providesTags: ['Deal'],
    }),

    createDeal: builder.mutation<Deal, Partial<Deal>>({
      query: (deal) => ({
        url: '/deals',
        method: 'POST',
        body: deal,
      }),
      invalidatesTags: ['Deal'],
    }),

    updateDeal: builder.mutation<Deal, { id: string; updates: Partial<Deal> }>({
      query: ({ id, updates }) => ({
        url: `/deals/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Deal'],
    }),

    // Chat endpoints
    getChatRoom: builder.query<ChatRoom, string>({
      query: (dealId) => `/chat/room/${dealId}`,
      providesTags: ['ChatRoom'],
    }),

    getMessages: builder.query<Message[], { dealId: string; page?: number; limit?: number }>({
      query: ({ dealId, page = 1, limit = 50 }) => ({
        url: `/chat/messages/${dealId}`,
        params: { page, limit },
      }),
      providesTags: ['Message'],
    }),

    sendMessage: builder.mutation<Message, { dealId: string; content: string; type?: string }>({
      query: ({ dealId, content, type = 'text' }) => ({
        url: '/chat/send',
        method: 'POST',
        body: { dealId, content, type },
      }),
      invalidatesTags: ['Message', 'ChatRoom'],
    }),

    // User endpoints
    getProfile: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetDealsQuery,
  useGetDealQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useGetChatRoomQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = api;
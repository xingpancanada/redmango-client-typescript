import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//227. add query to fetch menu items https://localhost:7183
const menuItemApi = createApi({
  reducerPath: 'menuItemApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_AZUREAPI_URL,
    //baseUrl: 'https://localhost:7183/api/',
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem('redmangousertoken');
      token && headers.append("Authorization", "Bearer " + token);
    } 
  }),
  tagTypes: ['MenuItems'],
  endpoints: (builder) => ({
    getMenuItems: builder.query({
      query: () => ({
        url: 'menuitem'
      }),
      providesTags: ['MenuItems']
    }),
    getMenuItemById: builder.query({
      query: (id) => ({
        url: `menuitem/${id}`
      }),
      providesTags: ['MenuItems'] //todo: should change???
    }),
    createMenuItem: builder.mutation({
      query: (data) => ({
        url: 'menuitem',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['MenuItems'],
    }),
    updateMenuItem: builder.mutation({
      query: ({ data, id }) => ({
        url: `menuitem/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['MenuItems'],
    }),
    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: `menuitem/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuItems'],
    }),
  })
});


export const {
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
  useUpdateMenuItemMutation
} = menuItemApi;

export default menuItemApi;
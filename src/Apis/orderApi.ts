import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AZUREAPI_URL,
    //baseUrl: 'https://localhost:7183/api/',
    //when backend api add [Authorize] attribute for api endpoint, need setting as below
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem('redmangousertoken');
      token && headers.append("Authorization", "Bearer " + token);
    }
  }),
  tagTypes: ['Orders'], // only need tagtypes when using GET, it will update orders when orders was updated
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderDetails) => ({
        url: 'order',
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: orderDetails,
      }),
      invalidatesTags: ['Orders'], // 294 must use invalidatesTags when using providesTags on GET
    }),
    getOrders: builder.query({
      query: ({ userId, searchString, status, pageSize, pageNumber }) => ({
        url: 'order',
        params: {
          ...(userId && { userId }),
          ...(searchString && { searchString }),
          ...(status && { status }),
          ...(pageSize && { pageSize }),
          ...(pageNumber && { pageNumber }),
        }
      }),
      transformResponse(apiResponse: {result: any}, meta: any){
        return {
          apiResponse,
          totalRecords: meta.response.headers.get("X-Pagination"),
        };
      },
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `order/${id}`,
      }),
      providesTags: ["Orders"],
    }),
    updateOrderDetails: builder.mutation({
      query: (orderDetails) => ({
        url: `order/${orderDetails.orderHeaderId}`,
        method: "PUT",
        headers: { 'Content-type': 'application/json' },
        body: orderDetails,
      }),
      invalidatesTags: ['Orders'],
    }),
  })
});


export const {
  useCreateOrderMutation, useGetOrderByIdQuery, useGetOrdersQuery, useUpdateOrderDetailsMutation
} = orderApi;

export default orderApi;
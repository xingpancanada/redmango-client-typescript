import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//227. add query to fetch menu items
const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AZUREAPI_URL,
    //when backend api add [Authorize] attribute for api endpoint, need setting as below
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem('redmangousertoken');
      token && headers.append("Authorization", "Bearer " + token);
    }
  }),
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (userId) => ({
        url: 'payment',
        method: 'POST',
        params: { userId: userId }
      }),
    }),
  })
});


export const {
  useInitiatePaymentMutation
} = paymentApi;

export default paymentApi;
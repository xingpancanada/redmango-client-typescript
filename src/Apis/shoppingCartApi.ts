import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//227. add query to fetch menu items
const shoppingCartApi = createApi({
  reducerPath: 'shoppingCartApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_AZUREAPI_URL, 
    //when backend api add [Authorize] attribute for api endpoint, need setting as below
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem('redmangousertoken');
      token && headers.append("Authorization", "Bearer " + token);
    }
  }),
  tagTypes: ['ShoppingCart'],
  endpoints: (builder) => ({
    getShoppingCart: builder.query({
      query: (userId) => ({
        url: `shoppingCart`,
        params: {
          userId: userId,
        }
      }),
      providesTags: ['ShoppingCart']
    }),
    updateShoppingCart: builder.mutation({
      query: ({ userId, menuItemId, updateQuantityBy }) => ({
        url: "shoppingCart",
        method: 'POST',
        params: {
          userId: userId,
          menuItemId: menuItemId,
          updateQuantityBy: updateQuantityBy
        },
      }),
      invalidatesTags: ['ShoppingCart']
    }),
  }),
});

//use..Query, use...Mutation
export const {
  useGetShoppingCartQuery,
  useUpdateShoppingCartMutation
} = shoppingCartApi;

export default shoppingCartApi;
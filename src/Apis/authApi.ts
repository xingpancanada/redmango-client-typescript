import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_AZUREAPI_URL, }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: userData
      })
    }),
    loginUser: builder.mutation({
      query: (userCredentials) => ({
        url: "auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: userCredentials
      })
    })
  })
})


export const { useRegisterUserMutation, useLoginUserMutation} = authApi;

export default authApi;
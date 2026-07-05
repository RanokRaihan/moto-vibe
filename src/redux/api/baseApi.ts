import { verifyToken } from "@/lib/utils";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "../features/auth/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:3000/api/v1",
  baseUrl: "https://motovibe-api.ranoklab.com/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    // refresh token
    const res = await fetch(
      "https://motovibe-api.ranoklab.com/api/v1/auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
      },
    );
    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = verifyToken(data?.data?.accessToken);
      api.dispatch(setUser({ token: data?.data?.accessToken, user }));
      return baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["products", "adminOrders", "users"],
  endpoints: () => ({}),
});

export default baseApi;

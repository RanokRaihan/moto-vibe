import baseApi from "@/redux/api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchDashboardData: builder.query({
      query: () => ({
        url: "/admin/get-insight",
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchDashboardDataQuery } = dashboardApi;

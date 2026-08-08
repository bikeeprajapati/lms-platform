import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "user/registration",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "user/activate-user",
                method: "POST",
                body: { activation_token, activation_code },
                credentials: "include" as const,
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "user/login",
                method: "POST",
                body: { email, password },
                credentials: "include" as const,
            }),
        }),
        logout: builder.query({
            query: () => ({
                url: "user/logout",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useActivationMutation,
    useLoginMutation,
    useLazyLogoutQuery,
} = authApi;

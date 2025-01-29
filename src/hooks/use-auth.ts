// import { useQuery, useMutation } from "@tanstack/react-query";
// import { api } from "@/lib/api";
// import type { LoginResponse, User } from "@/types/api";

// export const useLogin = () => {
//   return useMutation({
//     mutationFn: async (credentials: { email: string; password: string }) => {
//       const { data } = await api.post<LoginResponse>(
//         "/auth/login",
//         credentials
//       );
//       return data;
//     },
//   });
// };

// export const useUser = () => {
//   return useQuery({
//     queryKey: ["user"],
//     queryFn: async () => {
//       const { data } = await api.get<User>("/auth/me");
//       return data;
//     },
//   });
// };

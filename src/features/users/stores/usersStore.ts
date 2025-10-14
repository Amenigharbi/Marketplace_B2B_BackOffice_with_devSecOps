import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUsersStore: any = create(
  persist(
    (set) => ({
      userOnReviewUsername: "",
      setUserOnReviewUsername: (userOnReviewUsername: string) =>
        set({ userOnReviewUsername }),
    }),
    {
      name: "usersStore",
      getStorage: () => localStorage,
    },
  ),
);

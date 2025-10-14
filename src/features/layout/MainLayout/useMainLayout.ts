"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/shared/hooks/useAuth";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useUsersStore } from "@/features/users/stores/usersStore";

export const useMainLayout = () => {
  const {
    storeId,
    setStoreId,
    setIsAdmin,
    setIsNoEditUser,
    setIsMultipleStoreAccessUser,
  } = useGlobalStore();

  const { user } = useAuth();

  const pathname = usePathname();

  const { navigateToOrders } = useNavigation();

  const { setUserOnReviewUsername } = useUsersStore();

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const { isAdmin, isNoEditUser, isMultipleStoreAccessUser } = useGlobalStore();

  useEffect(() => {
    //@ts-ignore
    if (user?.roleId !== "5") {
      setIsNoEditUser(false);
      setIsMultipleStoreAccessUser(false);
    }
  }, [storeId, setIsMultipleStoreAccessUser, user, setIsNoEditUser]);

  useEffect(() => {
    //@ts-ignore
    if (user?.roleId !== "1") {
      setIsAdmin(false);
    }
  }, [storeId, setIsAdmin, user]);

  useEffect(() => {
    //admin:1
    //read only : 5
    // agent tunis :2
    // agent sousse :4
    // agent kmarket :3

    // store default : 0
    // store tunis :1
    // store sousse : 2
    // store kmarket  : 4

    //@ts-ignore
    switch (user?.roleId) {
      case "1":
        setIsAdmin(true);

        break;

      case "5":
        setIsNoEditUser(true);
        setIsMultipleStoreAccessUser(true);
        break;

      case "2":
        setStoreId("1");
        break;

      case "3":
        setStoreId("4");

        break;

      case "4":
        setStoreId("2");
        break;
      case "6":
        setStoreId("6");
        break;
      case "7":
        setStoreId("7");
        break;
      case "8":
        setStoreId("8");
        break;
    }
  }, [
    user,
    setStoreId,
    setIsAdmin,
    setIsMultipleStoreAccessUser,
    setIsNoEditUser,
  ]);

  useEffect(() => {
    if (pathname !== "/en/access/edit-user") {
      setUserOnReviewUsername("");
    }
    //NO More Dependencies !!
  }, [pathname]);

  useEffect(() => {
    if (window.innerWidth > 1400) {
      setSidebarIsOpen(true);
    } else {
      setSidebarIsOpen(false);
    }
    const handleResize = () => {
      if (window.innerWidth < 1400) {
        setSidebarIsOpen(false);
      } else {
        setSidebarIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isAdmin,
    isNoEditUser,
    sidebarIsOpen,
    navigateToOrders,
    setSidebarIsOpen,
    isMultipleStoreAccessUser,
  };
};

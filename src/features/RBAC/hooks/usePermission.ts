import { useEffect, useState } from "react";
import { Permission } from "@/typesrbac";

type PermissionResponse = {
  message: string;
  permissions: Permission[];
};

export const usePermissions = () => {
  const [data, setData] = useState<PermissionResponse>({
    message: "",
    permissions: [],
  });

  useEffect(() => {
    fetch("/api/marketplace/permissions/getAll")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return data;
};

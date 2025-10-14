import { useEffect, useState } from "react";
import { Role } from "@/typesrbac";

export const useRoles = () => {
  const [data, setData] = useState<{ message: string; roles: Role[] }>({
    message: "",
    roles: [],
  });

  useEffect(() => {
    fetch("/api/marketplace/roles/getAll")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return data;
};

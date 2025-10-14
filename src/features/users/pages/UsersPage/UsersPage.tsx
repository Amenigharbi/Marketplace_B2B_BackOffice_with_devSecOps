import UsersTable from "../../tables/UsersTable";
import UsersTableHeader from "@/features/users/widgets/UsersTableHeader";
import { useGetAllUsers } from "@/features/users/hooks/queries/useGetAllUsers";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import Pagination from "../../../shared/elements/Pagination/Pagination";
import { useState, useEffect } from "react";

const UsersPage = () => {
  const { users, isLoading } = useGetAllUsers();
  const { navigateToCreateUserForm } = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  useEffect(() => {
    if (users && users.length > 0) {
      const pages = Math.ceil(users.length / itemsPerPage);
      setTotalPages(pages);
    } else {
      setTotalPages(1);
    }
  }, [users, itemsPerPage]);

  return (
    <div className=" mt-24 flex flex-grow flex-col">
      <UsersTableHeader onButtonClick={navigateToCreateUserForm} />
      <div className=" flex  w-full flex-grow flex-col bg-n10">
        <UsersTable users={users} isLoading={isLoading} />
      </div>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default UsersPage;

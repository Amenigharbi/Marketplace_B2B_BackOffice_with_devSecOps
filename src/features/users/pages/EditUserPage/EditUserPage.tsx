import EditUserForm from "../../forms/EditUserForm";
import { useGetUser } from "../../hooks/queries/useGetUser";

const EditUserPage = () => {
  return (
    <div className="flex h-full flex-grow ">
      <div className=" h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <EditUserForm />
      </div>
    </div>
  );
};

export default EditUserPage;

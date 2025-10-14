const UsersTableHeader = ({ onButtonClick }: any) => {
  return (
    <div className=" flex w-full flex-wrap items-center justify-between gap-3 bg-n10  p-1">
      <div className="flex items-center justify-center">
        <p className="ml-6 text-xl font-bold capitalize">Users Table</p>
      </div>

      <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
        <div
          className="flex h-16 w-56  items-center justify-center  "
          onClick={onButtonClick}
        >
          <button className="btn ">Add New User</button>
        </div>
      </div>
    </div>
  );
};

export default UsersTableHeader;

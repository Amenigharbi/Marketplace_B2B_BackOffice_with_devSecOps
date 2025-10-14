import Banner from "@/features/layout/widgets/Banner";
import Box from "@/features/layout/Box";
import Checkbox from "@/features/shared/inputs/Checkbox";

const roles = ["manager", "ops", " customer service", "sales", "Finance"];

const UsersTable = () => {
  return (
    <Box title="Roles ">
      <Banner>
        <div className="flex gap-4 xl:gap-6">
          <div className="btn cursor-pointer">Add Role</div>
        </div>
      </Banner>
      <table
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ borderSpacing: "0 12px" }}
        className="relative bottom-0  left-0 right-0 top-0 h-full w-full  border-separate whitespace-nowrap border-none  "
      >
        <thead className="sticky  left-0 right-0 top-14 w-full  cursor-pointer bg-n30 even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3">
          <tr className=" h-16 p-4   font-semibold">
            <td>
              <div className="flex items-center justify-center text-2xl ">
                Role
              </div>
            </td>
            <td>
              <div className="flex items-center justify-center text-2xl ">
                Read
              </div>
            </td>
            <td>
              <div className="flex items-center justify-center text-2xl ">
                Edit
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          {roles.map((e, i) => {
            return (
              <tr
                key={i}
                className="h-4 max-h-2 cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
                onClick={() => {}}
              >
                <td>
                  <div className="flex items-center justify-center text-3xl font-bold">
                    {e}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center">
                    <Checkbox />
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center">
                    <Checkbox />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};

export default UsersTable;

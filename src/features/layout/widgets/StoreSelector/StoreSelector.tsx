import { IconBuildingWarehouse } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { IconChevronDown } from "@tabler/icons-react";
import { useAuth } from "@/features/shared/hooks/useAuth";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const layoutList = ["All", "Old Mghira", "Sousse", "Kamarket" , "Mnihla" , "Charguia","Mghira"];
//export const layoutList = ["All", "Tunis", "Sousse", "Kamarket" , "Mnihla" , "Charguia"];

const StoreSelector = ({ isWhite }: { isWhite?: boolean }) => {
  const { open, ref, toggleOpen } = useDropdown();
  const { setStoreId } = useGlobalStore();
  const [storesList, setStoresList] = useState<string[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    //@ts-ignore
    switch (user?.roleId) {
      case "1":
        setStoresList(["All", "Old Mghira", "Sousse", "Kamarket" , "Mnihla" , "Charguia","Mghira"]);
        break;
      case "5":
        setStoresList(["All", "Old Mghira", "Sousse", "Kamarket" , "Mnihla" , "Charguia","Mghira"]);
        break;
      case "2":
        setStoresList(["Old Mghira"]);
        break;
      case "3":
        setStoresList(["Kmarket"]);
        break;
      case "4":
        setStoresList(["Sousse"]);
        break;
        case "6":
          setStoresList(["Mnihla"]);
          break;
          case "7":
            setStoresList(["Charguia"]);
            break;
            case "8":
            setStoresList(["Mghira"]);
            break;
    }
  }, [user]);

  const [layout, setLayout] = useState(layoutList[0]);

  useEffect(() => {
    switch (layout) {
      case "All":
        setStoreId("");
        break;
      case "Old Mghira":
        setStoreId("1");
        break;
      case "Sousse":
        setStoreId("2");
        break;

      case "Kamarket":
        setStoreId("4");
        break;
        case "Mnihla":
          setStoreId("6");
          break;
          case "Charguia":
            setStoreId("7");
            break;
          case "Mghira":
              setStoreId("8");
              break;
    }
  }, [layout, setStoreId]);

  return (
    <div
      ref={ref}
      className="relative hidden min-w-[250px] lg:block xxl:min-w-[272px]"
    >
      <div
        onClick={toggleOpen}
        className={` ${
          isWhite
            ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
            : "bg-primary/5 dark:bg-bg3"
        } flex w-full cursor-pointer items-center justify-between gap-2 rounded-[30px] px-4 py-3 xxl:px-6`}
      >
        <span className="flex select-none items-center gap-2">
          {/* <IconLayoutSidebar className="text-primary" /> */}
          <IconBuildingWarehouse className="text-primary" />
          {storesList.length == 1 ? (
            <div>{storesList[0]}</div>
          ) : (
            <div>{layout}</div>
          )}
        </span>
        {storesList.length > 1 && (
          <IconChevronDown
            className={`shrink-0 ${open && "rotate-180"} duration-300`}
          />
        )}
      </div>

      {storesList.length > 1 && (
        <ul
          className={`absolute left-0 top-full z-20 w-full origin-top rounded-lg bg-n0 p-2 shadow-md duration-300 dark:bg-n800 ${
            open
              ? "visible scale-100 opacity-100"
              : "invisible scale-0 opacity-0"
          }`}
        >
          {storesList.map((item) => (
            <li
              onClick={() => {
                //  changeLayout(item);
                setLayout(item);
                toggleOpen();
              }}
              className={`block cursor-pointer select-none rounded-md p-2 duration-300 hover:text-primary ${
                layout == item ? "bg-primary text-n0 hover:!text-n0" : ""
              }`}
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StoreSelector;

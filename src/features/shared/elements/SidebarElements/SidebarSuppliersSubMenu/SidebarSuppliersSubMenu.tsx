import { useState, useEffect } from "react";
import AnimateHeight from "react-animate-height";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";
import { IconDeviceAnalytics } from "@tabler/icons-react";
import { useRouter } from "@/libs/next-intl/i18nNavigation";
import { API_BASE_URL } from "../../../../SupplierAnalytics/config";

interface Supplier {
  _id: string;
  manufacturerId: number;
  code: string;
  company_name: string;
  contact_name: string;
  phone_number?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  capital?: string;
  email?: string;
  createdAt?: string;
}

interface SidebarSuppliersSubMenuProps {
  name: string;
  icon: React.ReactNode;
  isActive?: boolean;
  items?: Array<{ name: string; status: string }>;
  selectedSupplierStatus?: string;
  onSubMenuItemClick?: (status: string) => void;
}

const SidebarSuppliersSubMenu = ({
  isActive = false,
  items = [],
  selectedSupplierStatus,
  onSubMenuItemClick = () => {},
}: SidebarSuppliersSubMenuProps) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const [searchTerm, setSearchTerm] = useState("");
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    const fetchSuppliers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/suppliers`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from server");
        }

        // Validate and transform supplier data
        const validatedSuppliers = data.map((item: any) => ({
          _id: item._id,
          manufacturerId: Number(item.manufacturerId) || 0,
          code: item.code || "N/A",
          company_name: item.company_name || "Unnamed Supplier",
          contact_name: item.contact_name || "N/A",
          phone_number: item.phone_number,
          postal_code: item.postal_code,
          city: item.city,
          country: item.country,
          capital: item.capital,
          email: item.email,
          createdAt: item.createdAt,
        }));

        setAllSuppliers(validatedSuppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch suppliers",
        );
        setAllSuppliers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isDropdownVisible) {
      fetchSuppliers();
    }
  }, [isDropdownVisible]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!searchTerm) {
        setFilteredSuppliers([]);
        return;
      }

      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      const filtered = allSuppliers.filter((supplier) => {
        const id = String(supplier?.manufacturerId ?? "").toLowerCase();
        const name = (supplier?.company_name ?? "").toLowerCase();
        return id.includes(lowerSearchTerm) || name.includes(lowerSearchTerm);
      });

      setFilteredSuppliers(filtered);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, allSuppliers]);

  const handleShowDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    setSearchTerm("");
    setFilteredSuppliers([]);
  };

  const handleSupplierSelect = (supplier: Supplier) => {
    if (!supplier.manufacturerId) return;

    setSelectedSupplier(supplier);
    router.push(`/supplierDashboard?supplierId=${supplier.manufacturerId}`);
    setIsDropdownVisible(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative rounded-xl duration-300 ${
          isActive && "bg-primary/5 dark:bg-bg3"
        }`}
      >
        <SidebarButton
          onClick={handleShowDropdown}
          isActive={isActive}
          withSubMenu
          isOpen={isOpen}
          name="Suppliers"
          icon={<IconDeviceAnalytics />}
        />

        <AnimateHeight height={isDropdownVisible ? "auto" : 0}>
          <ul className="px-3 py-3 4xl:px-5">
            <SidebarSubMenuItem
              key="all-suppliers"
              name="All Suppliers"
              onClick={() => router.push("/suppliers")}
              isActive={selectedSupplierStatus === "all"}
            />

            {items.map(({ name, status }) => (
              <SidebarSubMenuItem
                key={name}
                name={name}
                onClick={() => onSubMenuItemClick(status)}
                isActive={selectedSupplierStatus === status}
              />
            ))}

            <Divider />

            {isDropdownVisible && (
              <div className="relative flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by ID or name..."
                    className="w-full rounded-md border p-2 pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  {isLoading && (
                    <div className="absolute right-3 top-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-2 text-sm text-red-500">{error}</div>
                )}

                {!isLoading && !error && (
                  <>
                    {filteredSuppliers.length > 0 ? (
                      <div className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                        {filteredSuppliers.map((supplier) => (
                          <div
                            key={supplier._id}
                            className="cursor-pointer p-2 hover:bg-gray-100"
                            onClick={() => handleSupplierSelect(supplier)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                ID: {supplier.manufacturerId}
                              </span>
                              <span className="text-sm text-gray-500">
                                {supplier.code}
                              </span>
                            </div>
                            <div className="text-gray-600">
                              {supplier.company_name}
                            </div>
                            <div className="text-sm text-gray-400">
                              Contact: {supplier.contact_name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      searchTerm && (
                        <div className="p-2 text-gray-500">
                          No matching suppliers found
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            )}
          </ul>
        </AnimateHeight>
      </div>
    </div>
  );
};

export default SidebarSuppliersSubMenu;

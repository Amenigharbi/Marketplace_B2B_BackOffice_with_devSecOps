import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useSearchParams } from "next/navigation";
import CardDataStats from "../charts/suppliers/CardDataStats";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaUsers,
  FaUndo,
} from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import orderData from "../../../../data_test.json";
import ProductRevenueLossChart from "../charts/suppliers/ProductRevenueLossChart";
import TopArticlesOrdered from "../charts/suppliers/TopArticlesOrdered";
import SupplierAreaChart from "../charts/suppliers/SupplierAreaChart";
import RegionsOrders from "../charts/suppliers/RegionsOrders";
import AvailableProducts from "../charts/suppliers/AvailableProducts";
import DatePicker from "react-datepicker";
import ClientSegment from "../charts/suppliers/ClientSegment";
import SupplierQuarterlyMetrics from "../charts/suppliers/SupplierQuarterlyMetrics";
import SupplierCategoryPieChart from "../charts/suppliers/SupplierCategoryPieChart";
import SupplierTopProductsChart from "../charts/suppliers/SupplierTopProductsChart";
import InventoryTrendChart from "../charts/suppliers/InventoryTrendChart";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "./footer";
import { API_BASE_URL } from "../config";

// const supplierId = "27"; // Example supplier ID (e.g., Technofood)

const SupplierDashboard = () => {
  const router = useRouter(); // Initialize useRouter hook to access the query parameters
  const searchParams = useSearchParams();
  const supplierId: string = searchParams.get("supplierId") ?? "";

  const [startDate, setStartDate] = useState<Date | null>(null); // Default to null
  const [endDate, setEndDate] = useState<Date | null>(null); // Default to null

  const [appliedStartDate, setAppliedStartDate] = useState<Date | null>(null);
  const [appliedEndDate, setAppliedEndDate] = useState<Date | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [customers, setCustomers] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchData = async () => {
      try {
        const [
          categoriesRes,
          suppliersRes,
          ordersRes,
          productsRes,
          customersRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/suppliers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/supplier_products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/customers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSuppliers(suppliersRes.data);
        setCategories(categoriesRes.data);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setCustomers(customersRes.data);

        const foundSupplier: any = suppliersRes.data.find(
          (supplier: any) => supplier.manufacturerId === Number(supplierId),
        );
        if (foundSupplier) {
          setSupplier(foundSupplier);
        } else {
          console.error("Supplier not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("authToken");
        }
      }
    };

    fetchData();
  }, [supplierId]);

  const handleApplyFilters = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  //Total orders
  const supplierProducts = products.filter(
    (p) => p.manufacturer === supplierId,
  );
  const supplierProductIds = new Set(supplierProducts.map((p) => p.product_id));

  const totalValidOrders = orders.filter(
    (order) =>
      order.state != "canceled" &&
      (!appliedStartDate || new Date(order.created_at) >= appliedStartDate) &&
      (!appliedEndDate || new Date(order.created_at) <= appliedEndDate) &&
      order.items.some((item: { product_id: number }) =>
        supplierProductIds.has(item.product_id),
      ),
  ).length;

  //Total unique customers
  const uniqueCustomers = new Set<number>();
  orders.forEach((order) => {
    if (
      order.state != "canceled" &&
      (!appliedStartDate || new Date(order.created_at) >= appliedStartDate) &&
      (!appliedEndDate || new Date(order.created_at) <= appliedEndDate) &&
      order.items.some((item: { product_id: number }) =>
        supplierProductIds.has(item.product_id),
      )
    ) {
      if (order.customer_id) {
        uniqueCustomers.add(order.customer_id);
      }
    }
  });
  const totalUniqueCustomers = uniqueCustomers.size;

  //Total returned products
  const totalReturns = orders
    .filter(
      (order) =>
        order.state !== "canceled" &&
        (!appliedStartDate || new Date(order.created_at) >= appliedStartDate) &&
        (!appliedEndDate || new Date(order.created_at) <= appliedEndDate),
    )
    .flatMap((order) => order.items)
    .filter(
      (item) =>
        supplierProductIds.has(item.product_id) && item.qty_refunded > 0,
    )
    .reduce((sum, item) => sum + item.qty_refunded, 0);

  //Chiffre d'affaires
  const totalTurnover = orders
    .filter(
      (order) =>
        order.state !== "canceled" &&
        (!appliedStartDate || new Date(order.created_at) >= appliedStartDate) &&
        (!appliedEndDate || new Date(order.created_at) <= appliedEndDate),
    )
    .flatMap((order) => order.items)
    .filter((item) => supplierProductIds.has(item.product_id))
    .reduce((sum, item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      return sum + item.qty_invoiced * (product?.cost || 0);
    }, 0);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date === null) {
      setAppliedStartDate(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (date === null) {
      setAppliedEndDate(null);
    }
  };
  return (
    <div>
      <div className="mt-[4.8rem] w-full bg-n20 p-6">
        {supplier ? (
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {supplier.company_name}
            </h1>
            {supplier.city && supplier.country && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {supplier.city}, {supplier.country}
              </p>
            )}
          </div>
        ) : (
          <p>Loading supplier data...</p> // Add a loading message or spinner
        )}

        {/* Filter Section */}
        <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
          <div className="flex flex-col md:mr-4">
            <label htmlFor="startDate" className="text-lg">
              Date Début:
            </label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy/MM/dd"
              className="rounded border p-2 text-lg"
              isClearable
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-lg">
              Date Fin:
            </label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy/MM/dd"
              className="rounded border p-2 text-lg"
              isClearable
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="h-[42px] rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Appliquer Filtre
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <CardDataStats
            title="Chiffre d'affaires"
            total={`${totalTurnover.toFixed(2)} TND`}
          >
            <FaMoneyBillWave className="text-green-500" />
          </CardDataStats>

          <CardDataStats
            title="Totale des commandes"
            total={totalValidOrders.toString()}
          >
            <FaClipboardList className="text-blue-500" />
          </CardDataStats>

          <CardDataStats
            title="Clients Uniques"
            total={totalUniqueCustomers.toString()}
          >
            <FaUsers className="text-orange-500" />
          </CardDataStats>

          <CardDataStats
            title="Produits retournés"
            total={totalReturns.toString()}
          >
            <FaUndo className="text-red-500" />
          </CardDataStats>
        </div>

        {/* Charts Grid */}
        <div className="mt-6 grid w-full grid-cols-1 justify-center gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <SupplierAreaChart
              supplierId={supplierId!}
              orders={orders}
              products={products}
            />{" "}
          </div>
          <div className="mt-6 flex w-full justify-center">
            <SupplierQuarterlyMetrics
              supplierId={supplierId!}
              orders={orders}
              products={products}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex w-full justify-center md:col-span-2">
            <ProductRevenueLossChart
              supplierId={supplierId!}
              orders={orders}
              products={products}
            />
          </div>
          <div className="mt-6 flex w-full justify-center">
            <AvailableProducts supplierId={supplierId!} products={products} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-1">
          <div>
            <TopArticlesOrdered
              supplierId={supplierId!}
              orders={orders}
              products={products}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex w-full justify-center">
            <SupplierCategoryPieChart
              supplierId={supplierId!}
              orders={orders}
              products={products}
              categories={categories}
              suppliers={suppliers}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div className="flex w-full justify-center">
            <ClientSegment
              supplierId={supplierId!}
              orders={orders}
              customers={customers}
              products={products}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex w-full justify-center md:col-span-2">
            <RegionsOrders
              supplierId={supplierId!}
              orders={orders}
              products={products}
              customers={customers}
            />
          </div>
          <div className="flex w-full justify-center md:col-span-1">
            <InventoryTrendChart
              supplierId={supplierId!}
              products={products}
              orders={orders}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-1">
          <div>
            <SupplierTopProductsChart
              supplierId={supplierId!}
              products={products}
              orders={orders}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
        <Footer supplier={supplier} />
      </div>
    </div>
  );
};

export default SupplierDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import CardDataStats from "../charts/suppliers/CardDataStats";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaUsers,
  FaUndo,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SupplierAreaChart from "../charts/super_admin/SupplierAreaChart";
import SupplierQuarterlyMetrics from "../charts/super_admin/SupplierQuarterlyMetrics";
import ProductRevenueLossChart from "../charts/super_admin/ProductRevenueLossChart";
import AvailableProducts from "../charts/super_admin/AvailableProducts";
import SupplierCategoryPieChart from "../charts/super_admin/SupplierCategoryPieChart";
import ClientSegment from "../charts/super_admin/ClientSegment";
import RegionsOrders from "../charts/super_admin/RegionsOrders";
import InventoryTrendChart from "../charts/super_admin/InventoryTrendChart";
import SupplierTopProductsChart from "../charts/super_admin/SupplierTopProductsChart";

import TopArticlesOrdered from "../charts/super_admin/TopArticlesOrdered";
import { API_BASE_URL } from "../config";

const AllSuppliersDashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    null,
  );

  const [appliedStartDate, setAppliedStartDate] = useState<Date | null>(null);
  const [appliedEndDate, setAppliedEndDate] = useState<Date | null>(null);
  const [appliedWarehouse, setAppliedWarehouse] = useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products_stock, setProductsStock] = useState<any[]>([]);

  const [customers, setCustomers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const [
          categoriesRes,
          productsRes,
          ordersRes,
          productsStockRes,
          customersRes,
          warehousesRes,
        ] = await Promise.all([
          // Add Authorization header to ALL requests
          axios.get(`${API_BASE_URL}/api/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/supplier_products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/products_stock`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/customers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/warehouses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCategories(categoriesRes.data);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setProductsStock(productsStockRes.data);
        setCustomers(customersRes.data);
        setWarehouses(warehousesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  const handleApplyFilters = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setAppliedWarehouse(selectedWarehouse);
  };

  // Calculate global metrics with warehouse filter
  const totalValidOrders = orders.filter(
    (order) =>
      order.state !== "canceled" &&
      (!appliedStartDate || new Date(order.created_at) >= appliedStartDate) &&
      (!appliedEndDate || new Date(order.created_at) <= appliedEndDate) &&
      (!appliedWarehouse || order.store_id === Number(appliedWarehouse)),
  ).length;

  const validCustomerIds = new Set(customers.map((c) => c.id));

  const uniqueCustomers = new Set(
    orders
      .filter((order) => {
        const orderTime = new Date(order.created_at).getTime();
        return (
          order.state !== "canceled" &&
          order.customer_id &&
          validCustomerIds.has(order.customer_id) &&
          (!appliedStartDate ||
            orderTime >= appliedStartDate.setHours(0, 0, 0, 0)) &&
          (!appliedEndDate ||
            orderTime <= appliedEndDate.setHours(23, 59, 59, 999)) &&
          (!appliedWarehouse || order.store_id === Number(appliedWarehouse))
        );
      })
      .map((order) => order.customer_id),
  ).size;

  const totalReturns = orders
    .filter(
      (order) =>
        order.state !== "canceled" &&
        (!appliedStartDate || new Date(order.created_at) >= appliedStartDate) &&
        (!appliedEndDate || new Date(order.created_at) <= appliedEndDate) &&
        (!appliedWarehouse || order.store_id === Number(appliedWarehouse)),
    )
    .flatMap((order) => order.items)
    .reduce((sum, item) => sum + item.qty_refunded, 0);

  const totalTurnover = orders
    .filter(
      (order) =>
        order.state !== "canceled" &&
        (!appliedStartDate || new Date(order.created_at) >= appliedStartDate) &&
        (!appliedEndDate || new Date(order.created_at) <= appliedEndDate) &&
        (!appliedWarehouse || order.store_id === Number(appliedWarehouse)),
    )
    .flatMap((order) => order.items)
    .reduce((sum, item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      return sum + item.qty_invoiced * (product?.price || 0);
    }, 0);

  return (
    <div>
      <div className="mt-[4.8rem] w-full bg-n20 p-6">
        <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
          {/* Warehouse Filter */}
          <div className="flex flex-col md:mr-4">
            <label className="text-lg">Warehouse:</label>
            <select
              value={selectedWarehouse || ""}
              onChange={(e) => setSelectedWarehouse(e.target.value || null)}
              className="rounded border p-2 text-lg"
            >
              {warehouses.map((warehouse) => (
                <option
                  key={warehouse.warehouseId}
                  value={warehouse.warehouseId}
                >
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filters */}
          <div className="flex flex-col md:mr-4">
            <label className="text-lg">Date Début:</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy/MM/dd"
              className="rounded border p-2 text-lg"
              isClearable
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg">Date Fin:</label>
            <DatePicker
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
              Appliquer Filtres
            </button>
          </div>
        </div>

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
            total={uniqueCustomers.toString()}
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

        <div className="mt-6 grid w-full grid-cols-1 justify-center gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <SupplierAreaChart
              warehouseId={appliedWarehouse ? Number(appliedWarehouse) : null} // ➕ Change default to null
              orders={orders}
              products={products}
            />
          </div>
          <div className="mt-6 flex w-full justify-center">
            <SupplierQuarterlyMetrics
              warehouseId={appliedWarehouse ? Number(appliedWarehouse) : null}
              orders={orders}
              products={products}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex w-full justify-center md:col-span-2">
            <ProductRevenueLossChart
              warehouseId={appliedWarehouse ? Number(appliedWarehouse) : null}
              orders={orders}
            />
          </div>
          <div className="flex w-full justify-center">
            <AvailableProducts
              products={products}
              products_stock={products_stock}
              warehouses={warehouses}
              warehouseId={appliedWarehouse ? Number(appliedWarehouse) : null}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-1">
          <div>{/* <TopArticlesOrdered/> */}</div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-1">
          <SupplierCategoryPieChart
            orders={orders}
            products={products}
            categories={categories}
            warehouseId={appliedWarehouse ? Number(appliedWarehouse) : null}
            startDate={appliedStartDate}
            endDate={appliedEndDate}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex w-full justify-center">
            <ClientSegment
              orders={orders}
              customers={customers}
              warehouseId={appliedWarehouse ? Number(appliedWarehouse) : null}
              startDate={appliedStartDate}
              endDate={appliedEndDate}
            />
          </div>

          <div className="flex w-full justify-center">
            <InventoryTrendChart
              warehouseId={appliedWarehouse ? Number(appliedWarehouse) : null}
              warehouses={warehouses}
              products={products}
              orders={orders}
              productsStock={products_stock}
              categories={categories}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-1">
          <RegionsOrders
            orders={orders}
            customers={customers}
            warehouseId={appliedWarehouse ? Number(appliedWarehouse) : null}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-1">
          <SupplierTopProductsChart
            orders={orders}
            products={products}
            warehouseId={appliedWarehouse ? Number(appliedWarehouse) : null}
            startDate={appliedStartDate}
            endDate={appliedEndDate}
          />
        </div>

        {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RevenueTrendChart orders={orders} products={products} />
        </div>
        <div>
          <GlobalQuarterlyMetrics orders={orders} products={products} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TopProductsChart orders={orders} products={products} />
        </div>
        <div>
          <InventoryStatusChart products={products} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <CategoryDistributionChart 
            orders={orders} 
            products={products} 
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div>
          <GlobalClientSegment 
            orders={orders}
            customers={customers}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      <div className="mt-6">
        <RegionalSalesHeatmap 
          orders={orders} 
          customers={customers}
          products={products}
        />
      </div> */}
      </div>
    </div>
  );
};

export default AllSuppliersDashboard;

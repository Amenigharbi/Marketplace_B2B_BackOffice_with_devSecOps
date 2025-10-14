import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Calendar } from "lucide-react";
import {
  PurchaseOrder,
  PurchaseOrderUpdate,
  PurchaseOrderStatus,
  Product,
  Supplier,
  Warehouse,
} from "./types/purchaseOrder";
import { updatePurchaseOrder } from "./services/puchaseService";
import { supabase } from "@/libs/supabaseClient";
export default function EditOrderForm({
  order,
  onClose,
  onUpdate,
}: {
  order: PurchaseOrder;
  onClose: () => void;
  onUpdate: (updatedOrder: PurchaseOrder) => void;
}) {
  const [formData, setFormData] = useState<PurchaseOrderUpdate>({
    deliveryDate: new Date(order.deliveryDate),
    totalAmount: order.totalAmount || 0,
    status: order.status,
    supplierId: order.manufacturerId,
    warehouseId: order.warehouseId,
    products: order.products,
  });
  const [fileList, setFileList] = useState<{ name: string; url: string }[]>(
    order.files || [],
  );
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [productRows, setProductRows] = useState<Product[]>(order.products);
  const [comment, setComment] = useState(order.comment || "");
  const [newUploadedFiles, setNewUploadedFiles] = useState<
    { name: string; url: string }[]
  >([]);
  const [paymentTypes, setPaymentTypes] = useState<
    {
      type: string;
      percentage: number;
      amount: number;
      paymentDate: Date;
    }[]
  >(
    order.paymentTypes?.map((pt) => ({
      type: pt.type,
      percentage: pt.percentage,
      amount: pt.amount,
      paymentDate: pt.paymentDate ? new Date(pt.paymentDate) : new Date(),
    })) || [{ type: "", percentage: 0, amount: 0, paymentDate: new Date() }],
  );

  const [remainingAmount, setRemainingAmount] = useState(
    formData.totalAmount || 0,
  );

  useEffect(() => {
    const newTotal = productRows.reduce((sum, row) => sum + row.total, 0);
    setFormData((prev) => ({
      ...prev,
      totalAmount: newTotal,
    }));
  }, [productRows]);
  useEffect(() => {
    const totalAllocated = paymentTypes.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0,
    );
    const newRemaining = Math.max(
      (formData.totalAmount || 0) - totalAllocated,
      0,
    );
    setRemainingAmount(newRemaining);
  }, [paymentTypes, formData.totalAmount]);
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      console.log("fetchPurchaseOrder called for order.id:", order.id);
      try {
        const response = await fetch(`/api/purchaseOrder/${order.id}`);
        console.log("API response status:", response.status);
        const data = await response.json();
        console.log("API response data:", data);

        if (response.ok) {
          setFormData({
            deliveryDate: new Date(data.deliveryDate),
            totalAmount: data.totalAmount,
            status: data.status,
            supplierId: data.manufacturer.manufacturer_id,
            warehouseId: data.warehouse.warehouse_id,
            products: data.products,
          });
          setSelectedSupplier(data.manufacturer);

          if (data.manufacturer.id) {
            const productsRes = await fetch("/api/marketplace/products/getAll");
            const productsData = await productsRes.json();
            const allProducts = productsData.data || [];
            const filteredProducts = allProducts.filter(
              (product: any) =>
                String(product.supplierId) === String(data.manufacturer.id),
            );
            const mappedProducts = filteredProducts.map((product: any) => ({
              ...product,
              priceExclTax: product.price,
            }));
            setAvailableProducts(mappedProducts);
          }

          const initialProductRows = data.products.map((product: any) => ({
            productId: product.id,
            name: product.name,
            quantity: product.quantity,
            sku: product.sku,
            priceExclTax: product.priceExclTax,
            total: product.quantity * product.priceExclTax,
          }));
          setProductRows(initialProductRows);

          setSelectedWarehouse(data.warehouse);
          setComment(data.comment || "");
          setFileList(data.files || []);
          if (data.paymentTypes && data.paymentTypes.length > 0) {
            setPaymentTypes(
              data.paymentTypes.map((pt: any) => ({
                type: pt.type,
                percentage: pt.percentage,
                amount: pt.amount,
                paymentDate: new Date(pt.paymentDate),
              })),
            );
          }
        } else {
          toast.error(data.error || "Failed to fetch purchase order");
        }
      } catch (error) {
        toast.error("Error fetching purchase order");
      }
    };

    fetchPurchaseOrder();
  }, [order.id]);
  const removePayment = (index: number) => {
    setPaymentTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const removeProduct = (index: number) => {
    setProductRows((rows) => rows.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    const newRows = [...productRows];
    newRows[index] = {
      ...newRows[index],
      quantity,
      total: quantity * newRows[index].priceExclTax,
    };

    const newTotal = newRows.reduce((sum, row) => sum + row.total, 0);

    setProductRows(newRows);
    setFormData((prev) => ({
      ...prev,
      totalAmount: newTotal,
    }));

    const updatedPayments = paymentTypes.map((payment) => {
      if (!payment.type || payment.amount === 0) return payment;

      return {
        ...payment,
        amount: parseFloat(((newTotal * payment.percentage) / 100).toFixed(2)),
        percentage: payment.percentage,
      };
    });

    setPaymentTypes(updatedPayments);

    const totalAllocated = updatedPayments.reduce(
      (acc, payment) => acc + (payment.amount || 0),
      0,
    );
    const newRemaining = newTotal - totalAllocated;
    setRemainingAmount(Math.max(newRemaining, 0));
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `purchase-orders/${order.id}/${fileName}`;

    const { error } = await supabase.storage
      .from("supplier")
      .upload(filePath, file);

    if (error) {
      toast.error("Upload failed");
      return;
    }

    const { data } = supabase.storage.from("supplier").getPublicUrl(filePath);

    setNewUploadedFiles((prev) => [
      ...prev,
      { name: file.name, url: data.publicUrl },
    ]);

    toast.success("File uploaded successfully");
  };

  const handlePaymentTypeChange = (index: number, type: string) => {
    const updatedPaymentTypes = [...paymentTypes];
    updatedPaymentTypes[index].type = type;
    setPaymentTypes(updatedPaymentTypes);
  };

  const handlePaymentPercentageChange = (index: number, value: string) => {
    const newPercentage = Math.min(parseFloat(value) || 0, 100);
    const updatedPayments = [...paymentTypes];

    const newAmount = parseFloat(
      (((formData.totalAmount || 0) * newPercentage) / 100).toFixed(2),
    );

    updatedPayments[index] = {
      ...updatedPayments[index],
      percentage: newPercentage,
      amount: newAmount,
    };
    const totalAllocated = updatedPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0,
    );
    const remaining = (formData.totalAmount || 0) - totalAllocated;
    setRemainingAmount(Math.max(remaining, 0));
    if (remaining > 0 && index === updatedPayments.length - 1) {
      updatedPayments.push({
        type: "",
        percentage: 0,
        amount: 0,
        paymentDate: new Date(),
      });
    }

    setPaymentTypes(updatedPayments);
  };
  const handlePaymentAmountChange = (index: number, value: string) => {
    const numericValue = value === "" ? 0 : parseFloat(value);
    const updatedPayments = [...paymentTypes];

    updatedPayments[index] = {
      ...updatedPayments[index],
      amount: numericValue,
      percentage:
        formData.totalAmount && formData.totalAmount !== 0
          ? parseFloat(((numericValue / formData.totalAmount) * 100).toFixed(2))
          : 0,
    };

    const totalAllocated = updatedPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0,
    );
    const remaining = (formData.totalAmount || 0) - totalAllocated;
    setRemainingAmount(Math.max(remaining, 0));

    if (remaining > 0 && index === updatedPayments.length - 1) {
      updatedPayments.push({
        type: "",
        percentage: 0,
        amount: 0,
        paymentDate: new Date(),
      });
    }

    setPaymentTypes(updatedPayments);
  };

  const handlePaymentDateChange = (index: number, date: Date) => {
    const updatedPayments = [...paymentTypes];
    updatedPayments[index].paymentDate = date;
    setPaymentTypes(updatedPayments);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allFiles = [
        ...fileList,
        ...newUploadedFiles.map(({ name, url }) => ({ name, url })),
      ];

      const updatedOrder = await updatePurchaseOrder(order.id, {
        ...formData,
        supplierId: selectedSupplier?.manufacturer_id || 0,
        warehouseId: selectedWarehouse?.warehouse_id || 0,
        products: productRows,
        paymentTypes: paymentTypes
          .filter((payment) => payment.type && payment.amount)
          .map((payment) => ({
            type: payment.type,
            percentage: payment.percentage,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
          })),
        comment,
        files: allFiles,
      });

      onUpdate(updatedOrder);
      toast.success("Order updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Error updating the order.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[80vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Edit Order
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Delivery Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Delivery Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.deliveryDate?.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryDate: new Date(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-lg border-gray-300 p-3 pl-12 shadow-md focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as PurchaseOrderStatus,
                })
              }
              className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="IN_PROGRESS">In Progress</option>
              <option value="READY">Ready</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <input
              type="text"
              value={selectedSupplier?.companyName || ""}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-md"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Warehouse
            </label>
            <input
              type="text"
              value={selectedWarehouse?.name || ""}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-md"
            />
          </div>

          <div className="relative col-span-1 md:col-span-2">
            <div className="relative col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Supplier products
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedProductId(selectedId);

                  const selectedProduct = availableProducts.find(
                    (product) => product.id === selectedId,
                  );

                  if (selectedProduct) {
                    setProductRows((prevRows) => [
                      ...prevRows,
                      {
                        id: selectedProduct.id,
                        name: selectedProduct.name,
                        quantity: 1,
                        sku: selectedProduct.sku,
                        priceExclTax: selectedProduct.priceExclTax,
                        total: selectedProduct.priceExclTax,
                      },
                    ]);
                    setSelectedProductId("");
                  }
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">select product</option>
                {availableProducts
                  .filter(
                    (product) =>
                      !productRows.some((row) => row.id === product.id),
                  )
                  .map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.priceExclTax.toFixed(2)} DT
                    </option>
                  ))}
              </select>
            </div>

            {/* Selected Products */}
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold">Products Ordered </h3>
              <div className="space-y-4">
                {productRows.map((row, index) => {
                  return (
                    <div
                      key={index}
                      className="rounded-lg border bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {row.name || "Unknown product"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) =>
                              updateQuantity(index, Number(e.target.value))
                            }
                            className="w-full rounded-md border p-2"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Unit Price
                          </label>
                          <div className="rounded-md bg-gray-100 p-2">
                            {row.priceExclTax.toFixed(2)} DT
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Total
                          </label>
                          <div className="rounded-md bg-blue-50 p-2 font-medium text-blue-600">
                            {row.total.toFixed(2)} DT
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Total Amount (DT)
            </label>
            <input
              type="number"
              value={(formData.totalAmount || 0).toFixed(2)}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Payment Section */}
          <div className="relative col-span-1 md:col-span-2">
            <h3 className="mb-3 text-lg font-semibold">Payment Information</h3>
            {paymentTypes.some((payment) => payment.type) && (
              <div className="mb-4 grid grid-cols-5 gap-4 px-2">
                <span className="text-sm font-medium text-gray-700">Type</span>
                <span className="w-20 text-sm font-medium text-gray-700">
                  %
                </span>
                <span className="text-sm font-medium text-gray-700">
                  Amount
                </span>
                <span className="text-sm font-medium text-gray-700">Date</span>
                <span className="text-sm font-medium text-gray-700">
                  Remaining
                </span>
              </div>
            )}
            {paymentTypes.map((payment, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-5 items-center gap-4"
              >
                <select
                  value={payment.type}
                  onChange={(e) =>
                    handlePaymentTypeChange(index, e.target.value)
                  }
                  className="w-24 rounded-md border border-gray-300 p-2 text-sm"
                >
                  <option value="">Select</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CASH">Cash</option>
                  <option value="TRAITE">Traite</option>
                </select>
                {payment.type && (
                  <input
                    type="number"
                    value={payment.percentage}
                    onChange={(e) =>
                      handlePaymentPercentageChange(index, e.target.value)
                    }
                    className="w-20 rounded-md border border-gray-300 p-2 text-sm"
                    placeholder="%"
                    min="0"
                    max="100"
                    step="any"
                  />
                )}
                {payment.type && (
                  <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) =>
                      handlePaymentAmountChange(index, e.target.value)
                    }
                    className="w-32 rounded-md border border-gray-300 p-2 text-sm"
                    placeholder="Amount"
                    step="any"
                    min="0"
                  />
                )}
                {payment.type && (
                  <input
                    type="date"
                    value={
                      payment.paymentDate
                        ? payment.paymentDate.toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      handlePaymentDateChange(index, newDate);
                    }}
                    className="w-32 rounded-md border border-gray-300 p-2 text-sm"
                  />
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={remainingAmount.toFixed(2) || "0.00"}
                    disabled
                    className="w-24 rounded-md border border-gray-300 bg-gray-100 p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removePayment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="relative col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="relative w-full">
            <input
              type="file"
              id="fileInput"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="mt-1 block w-full flex-grow cursor-pointer rounded-lg border-gray-300 bg-blue-600 p-3 text-center text-white shadow-md transition hover:bg-blue-700"
            >
              📁 Upload New File
            </label>

            {[...fileList, ...newUploadedFiles].map((file, index) => (
              <div
                key={index}
                className="mt-2 flex items-center justify-between"
              >
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {file.name}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const isNew = newUploadedFiles.includes(file);
                    if (isNew) {
                      setNewUploadedFiles((prev) =>
                        prev.filter((_, i) => i !== index - fileList.length),
                      );
                    } else {
                      setFileList((prev) => prev.filter((_, i) => i !== index));
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-5 py-2 font-medium text-gray-800 transition hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

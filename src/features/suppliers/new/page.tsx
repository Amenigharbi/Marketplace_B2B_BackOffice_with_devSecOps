import { useState, useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import {
  Supplier,
  Product,
  Warehouse,
  PaymentType,
  SimplifiedProduct,
} from "./utils/types";
import { supabase } from "@/libs/supabaseClient";
import { generateOrderPDF } from "./utils/generatePdf";
import "@/features/suppliers/styles/NeonButton.css";
import jsPDF from "jspdf";
import { FaFileDownload } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { sendOrderEmail } from "./utils/emailService";
const SupplierForm = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [query, setQuery] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>(
    {},
  );
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );

  const [productRows, setProductRows] = useState([
    { productId: "", quantity: 0, sku: "", priceExclTax: 0, total: 0 },
  ]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [createdAt] = useState<Date>(new Date());
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [paymentPercentage, setPaymentPercentage] = useState<string>("");

  const [newPaymentType, setNewPaymentType] = useState<string>("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([
    { type: "", percentage: "", amount: "", date: new Date() },
  ]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [productsWithQuantities, setProductsWithQuantities] = useState<
    {
      product: Product;
      quantity: number;
      sku: string;
      id: string;
      priceExclTax: number;
      total: number;
    }[]
  >([]);
  const [products, setProducts] = useState<SimplifiedProduct[]>([]);
  const totalPercentage = paymentTypes.reduce(
    (acc, payment) => acc + (parseFloat(payment.percentage) || 0),
    0,
  );
  interface UploadedFile {
    path: string;
    name: string;
  }

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [fileList, setFileList] = useState<
    {
      name: string;
      url: string;
    }[]
  >([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [suppliersRes, warehousesRes, productsRes] = await Promise.all([
          fetch("/api/marketplace/supplier/getAll"),
          fetch("/api/warehouse"),
          fetch("/api/marketplace/products/getAll"),
        ]);

        const warehousesData = await warehousesRes.json();
        const validatedWarehouses = warehousesData.map((w: any) => ({
          warehouseId: w.warehouseId || w.warehouse_id,
          name: w.warehouseName || w.name,
          location: w.location,
          capacity: w.capacity,
          manager: w.manager,
        }));
        setWarehouses(validatedWarehouses);
        const productsResponse = await productsRes.json();
        if (!productsResponse.data || !Array.isArray(productsResponse.data)) {
          throw new Error(
            "Format de données de produit invalide: " +
              JSON.stringify(productsResponse),
          );
        }

        const productsData = productsResponse.data;
        console.log("Products data sample:", productsData.slice(0, 2)); // Log first 2 products to see structure

        const validatedProducts: SimplifiedProduct[] = productsData.map(
          (p: any) => ({
            id: String(p.id),

            product_id: Number(p.product_id || p.id),

            sku: String(p.sku),

            name: String(p.name),

            price: Number(p.price),

            cost: p.cost ? Number(p.cost) : null,

            website_ids: Array.isArray(p.website_ids)
              ? p.website_ids.map(Number)
              : [],

            manufacturer: p.manufacturer ? Number(p.manufacturer) : null,

            supplierId: p.supplierId ? String(p.supplierId) : null,
          }),
        );

        setProducts(validatedProducts);

        const suppliersData = await suppliersRes.json();
        const supplierArray = Array.isArray(suppliersData.data)
          ? suppliersData.data
          : [];
        const validatedSuppliers = supplierArray
          .map((s: any) => ({
            id: s.id, // <-- l'ObjectId MongoDB
            manufacturer_id: s.manufacturerId,
            companyName: s.companyName,
            contact_name: s.contactName,
            email: s.email,
            phone_number: s.phoneNumber,
            postal_code: s.postalCode,
            city: s.city,
            country: s.country,
            capital: s.capital,
          }))
          .filter((s: { manufacturer_id: any }) => s.manufacturer_id);
        setSuppliers(validatedSuppliers);
        console.log(
          "Available suppliers:",
          validatedSuppliers.map((s: any) => ({
            name: s.companyName,
            id: s.manufacturer_id,
          })),
        );
      } catch (error) {
        console.error("Data loading error::", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const remaining = totalAmount * ((100 - totalPercentage) / 100);
    setRemainingAmount(remaining);
  }, [paymentTypes, totalPercentage, totalAmount]);

  useEffect(() => {
    if (
      newPaymentType &&
      paymentPercentage &&
      parseFloat(paymentPercentage) < 100
    ) {
      const remainingPercentage = 100 - parseFloat(paymentPercentage);
      setPaymentPercentage(remainingPercentage.toString());
    }
  }, [newPaymentType, paymentPercentage]);

  useEffect(() => {
    const totalAllocated = paymentTypes.reduce(
      (acc, payment) => acc + (parseFloat(payment.amount || "0") || 0),

      0,
    );

    const remaining = totalAmount - totalAllocated;

    setRemainingAmount(Math.round(remaining * 100) / 100);
  }, [paymentTypes, totalAmount]);

  const handlePaymentTypeChange = (index: number, type: string) => {
    const updatedPaymentTypes = [...paymentTypes];
    updatedPaymentTypes[index].type = type;

    setPaymentTypes(updatedPaymentTypes);
  };
  const handlePaymentPercentageChange = (index: number, value: string) => {
    const newPercentage = Math.min(parseFloat(value) || 0, 100);

    const updatedPayments = [...paymentTypes];

    updatedPayments[index] = {
      ...updatedPayments[index],

      percentage: newPercentage.toString(),

      amount: ((totalAmount * newPercentage) / 100).toFixed(2),
    };

    const totalAllocated = updatedPayments.reduce(
      (acc, payment) => acc + (parseFloat(payment.percentage || "0") || 0),

      0,
    );

    if (totalAllocated < 100 && index === updatedPayments.length - 1) {
      updatedPayments.push({
        type: "",

        percentage: "",

        amount: "",

        date: new Date(),
      });
    }

    setPaymentTypes(updatedPayments);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `purchase-orders/${fileName}`;

      // Upload vers Supabase
      const { error: uploadError } = await supabase.storage
        .from("supplier") // Assurez-vous que ce bucket existe
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const {
        data: { publicUrl },
      } = supabase.storage.from("supplier").getPublicUrl(filePath);

      // Mettre à jour l'état
      setUploadedFiles((prev) => [
        ...prev,
        {
          path: filePath,
          name: file.name,
        },
      ]);

      toast.success("Fichier uploadé avec succès!");
    } catch (error) {
      console.error("Erreur d'upload:", error);
      toast.error("Échec de l'upload");
    }
  };
  const handleSelectState = (state: string): void => setSelectedState(state);

  useEffect(() => {
    if (newPaymentType) {
      const remainingPercentage = 100 - parseFloat(paymentPercentage || "0");
      setPaymentPercentage(remainingPercentage.toString());
    }
  }, [newPaymentType]);
  useEffect(() => {
    if (paymentPercentage && parseFloat(paymentPercentage) < 100) {
      const remainingPercentage = 100 - parseFloat(paymentPercentage);
      setRemainingAmount((totalAmount * remainingPercentage) / 100); // Recalculer montant restant
    }
  }, [paymentPercentage, totalAmount]);

  const [state, dispatch] = useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case "UPDATE_REMAINING":
          return {
            ...prevState,

            remainingAmounts: action.payload,
          };

        default:
          return prevState;
      }
    },

    { remainingAmounts: [] },
  );
  const handleSelectSupplier = (supplier: Supplier): void => {
    setQuery(supplier.companyName);
    setSelectedSupplier(supplier);
    resetFormFields();

    // Correction de la comparaison de types
    const filteredProducts = products.filter(
      (product) => String(product.supplierId) === String(supplier.id),
    );

    // Adapter au format attendu par le formulaire
    const updatedProducts = filteredProducts.map((product) => ({
      product: { ...product, skuPartner: null },
      quantity: 0,
      sku: product.sku,
      id: product.id,
      priceExclTax: product.price || 0,
      total: 0,
    }));

    setProductsWithQuantities(updatedProducts);
  };

  const handleSaveOrder = async () => {
    try {
      // Validation des données
      if (!selectedSupplier) throw new Error("Fournisseur requis");
      if (!selectedWarehouse) throw new Error("Entrepôt requis");
      if (!selectedState) throw new Error("État de commande requis");
      if (productsWithQuantities.length === 0)
        throw new Error("Au moins un produit requis");

      // 1. Créer la commande d'abord (sans les fichiers)
      const orderResponse = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manufacturerId: selectedSupplier.manufacturer_id,
          warehouseId: selectedWarehouse.warehouseId,
          deliveryDate: deliveryDate.toISOString(),
          totalAmount: totalAmount,
          status: selectedState,
          comments: comment,
          payments: paymentTypes
            .filter((payment) => payment.type && payment.amount)
            .map((payment) => ({
              paymentMethod: payment.type.toUpperCase(),
              amount: parseFloat(payment.amount) || 0,
              percentage: parseFloat(payment.percentage) || 0,
              date: payment.date,
            })),
          products: productsWithQuantities
            .filter((item) => item.quantity > 0)
            .map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              priceExclTax: item.priceExclTax,
              total: item.total,
              sku: item.sku,
            })),
          // On envoie juste les références aux fichiers
          fileReferences: uploadedFiles.map((file) => ({
            name: file.name,
            url: supabase.storage.from("supplier").getPublicUrl(file.path).data
              .publicUrl,
          })),
        }),
      });

      if (!orderResponse.ok) throw await orderResponse.json();
      const order = await orderResponse.json();

      toast.success("Commande enregistrée avec succès!");
      return order;
    } catch (error) {
      // Nettoyage en cas d'erreur
      if (uploadedFiles.length > 0) {
        await supabase.storage
          .from("supplier")
          .remove(uploadedFiles.map((f) => f.path))
          .catch(console.error);
      }
      throw error;
    }
  };

  const handleSelectWarehouse = (warehouseName: string): void => {
    const warehouse = warehouses.find((w) => w.name === warehouseName);
    if (warehouse && selectedSupplier) {
      setSelectedWarehouse(warehouse);
    } else {
      console.error("Warehouse not found or supplier not selected");
    }
  };
  const resetFormFields = (): void => {
    setQuantities({});
    setSelectedProducts([]);
    setTotalPayment(0);
    setSelectedPaymentMode("");
    setSelectedWarehouse(null);
    setSelectedState("");
  };
  const handleSendEmail = async () => {
    try {
      await sendOrderEmail({
        supplier: selectedSupplier,

        warehouse: selectedWarehouse,

        products: productsWithQuantities,

        totalAmount,
        comment,
      });
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
    }
  };
  const handlePaymentAmountChange = (index: number, value: string) => {
    const numericValue = value === "" ? "" : parseFloat(value);
    if (numericValue !== "" && isNaN(numericValue)) return;

    const updatedPayments = [...paymentTypes];

    updatedPayments[index] = {
      ...updatedPayments[index],
      amount: value,
      percentage:
        totalAmount !== 0
          ? (
              ((numericValue === "" ? 0 : numericValue) / totalAmount) *
              100
            ).toFixed(2)
          : "0",
    };

    const totalAllocated = updatedPayments.reduce(
      (acc, payment) => acc + (parseFloat(payment.amount || "0") || 0),
      0,
    );

    if (index === updatedPayments.length - 1 && totalAllocated < totalAmount) {
      updatedPayments.push({
        type: "",
        percentage: "",
        amount: "",
        date: new Date(),
      });
    }

    setPaymentTypes(updatedPayments);
  };

  const handleDownloadPDF = () => {
    if (productsWithQuantities.length === 0) {
      toast.error("Please add products before generating the PDF");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);

    generateOrderPDF(
      doc,
      selectedSupplier,
      selectedWarehouse,
      selectedState,
      productsWithQuantities,
      totalAmount,
      paymentTypes,
      deliveryDate,
      userName,
    );

    doc.save("order.pdf");
  };

  const calculateRemainingAmount = (
    totalAmount: number,
    amount: number | null,
    percentage: number | null,
  ) => {
    if (percentage !== null && percentage > 0) {
      return totalAmount * (percentage / 100);
    } else if (amount !== null && amount > 0) {
      return totalAmount - amount;
    }
    return 0;
  };
  useEffect(() => {
    const updatedRemainingAmounts = paymentTypes.map((payment) => {
      const amount = parseFloat(payment.amount || "0");

      const percentage = parseFloat(payment.percentage || "0");

      return calculateRemainingAmount(totalAmount, amount, percentage);
    });

    dispatch({ type: "UPDATE_REMAINING", payload: updatedRemainingAmounts });
  }, [paymentTypes, totalAmount]);

  useEffect(() => {
    const newTotalAmount = productRows.reduce((acc, row) => {
      const product = productsWithQuantities.find(
        (p) => p.id === row.productId,
      );
      if (product) {
        return acc + row.quantity * product.priceExclTax;
      }
      return acc;
    }, 0);

    setTotalAmount(newTotalAmount);
  }, [productRows, productsWithQuantities]);
  const handleProductChange = (index: number, productId: string) => {
    const updatedRows = [...productRows];
    const selectedProduct = productsWithQuantities.find(
      (p) => p.id === productId,
    );

    if (selectedProduct) {
      updatedRows[index] = {
        ...updatedRows[index],
        productId: selectedProduct.id,
        sku: selectedProduct.sku,
        priceExclTax: selectedProduct.priceExclTax,
        quantity: 1,
        total: 1 * selectedProduct.priceExclTax,
      };

      const updatedProducts = productsWithQuantities.map((item) =>
        item.id === selectedProduct.id
          ? { ...item, quantity: 1, total: selectedProduct.priceExclTax }
          : item,
      );
      setProductsWithQuantities(updatedProducts);

      if (index === updatedRows.length - 1) {
        updatedRows.push({
          productId: "",
          quantity: 0,
          sku: "",
          priceExclTax: 0,
          total: 0,
        });
      }

      setProductRows(updatedRows);
    }
  };
  const handleQuantityChange = (index: number, quantity: number) => {
    const qty = Math.max(quantity, 1);
    const updatedRows = [...productRows];
    updatedRows[index].quantity = quantity;

    const product = productsWithQuantities.find(
      (p) => p.id === updatedRows[index].productId,
    );

    if (product) {
      updatedRows[index].total = quantity * product.priceExclTax;

      const updatedProductsWithQuantities = productsWithQuantities.map(
        (item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: quantity,
              total: quantity * item.priceExclTax,
            };
          }
          return item;
        },
      );

      setProductsWithQuantities(updatedProductsWithQuantities);
    }

    if (quantity > 0 && index === updatedRows.length - 1) {
      updatedRows.push({
        productId: "",
        quantity: 0,
        sku: "",
        priceExclTax: 0,
        total: 0,
      });
    }

    setProductRows(updatedRows);
    const newTotalAmount = updatedRows.reduce((acc, row) => {
      const product = productsWithQuantities.find(
        (p) => p.id === row.productId,
      );
      if (product) {
        return acc + row.quantity * product.priceExclTax;
      }
      return acc;
    }, 0);

    setTotalAmount(newTotalAmount);
  };
  const getAvailableProducts = (currentIndex: number) => {
    return productsWithQuantities.filter((product) => {
      return !productRows.some(
        (row, rowIndex) =>
          rowIndex !== currentIndex && row.productId === product.id,
      );
    });
  };
  const handleSaveAndSendEmail = async () => {
    try {
      await handleSaveOrder();
      handleSendEmail();
      toast.success("Order saved and email sent successfully!");
      handleCancel(); // Réinitialise la form après succès
    } catch (error) {
      toast.error("Failed to save order or send email.");
    }
  };
  const handleCancel = async () => {
    resetFormState();
  };

  const resetFormState = (): void => {
    setQuery("");
    setSelectedSupplier(null);
    setSelectedWarehouse(null);
    setSelectedState("");
    setDeliveryDate(new Date());
    setComment("");
    setTotalAmount(0);
    setRemainingAmount(0);
    setProductRows([
      { productId: "", quantity: 0, sku: "", priceExclTax: 0, total: 0 },
    ]);
    setProductsWithQuantities([]);
    setPaymentTypes([
      { type: "", percentage: "", amount: "", date: new Date() },
    ]);
    setUploadedFiles([]);
    setFileList([]);
  };
  const handlePaymentDateChange = (index: number, date: Date) => {
    const updatedPayments = [...paymentTypes];

    updatedPayments[index].date = date;

    setPaymentTypes(updatedPayments);
  };
  const { data: session } = useSession();

  if (!session?.user) {
    return <p>Unauthorized</p>;
  }
  const userName = session.user?.name || "Guest";
  return (
    <div className="mt-7 flex h-full flex-grow">
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <div className="relative mt-8 grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-8">
            <div className="rounded-lg border-2 border-gray-300 bg-white p-8 shadow-lg">
              <div className="bb-dashed mb-6 mt-9 flex items-center pb-6">
                <p className="ml-4 mt-6 text-xl font-bold">Select Supplier</p>
                <div
                  onClick={handleDownloadPDF}
                  className="ml-auto cursor-pointer text-2xl text-gray-700 hover:text-primary"
                  title="Download PDF"
                >
                  <FaFileDownload />
                </div>
              </div>

              {/* Supplier Search Section */}
              <div className="box mb-5 mt-5 flex w-full justify-between rounded-lg bg-primary/5 p-4 dark:bg-bg3">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search and select supplier..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedSupplier(null);
                    }}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                  {!selectedSupplier && suppliers.length > 0 && (
                    <ul className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                      {suppliers
                        .filter(
                          (supplier) =>
                            supplier.companyName
                              ?.toLowerCase()
                              .includes(query.toLowerCase()),
                        )
                        .map((supplier) => (
                          <li
                            key={supplier.manufacturerId}
                            onClick={() => handleSelectSupplier(supplier)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          >
                            {supplier.companyName}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Supplier Details Section */}
              {selectedSupplier && (
                <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                  <h3 className="mb-4 text-xl font-semibold">
                    Supplier Details
                  </h3>
                  <form>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Created At
                        </label>
                        <input
                          type="text"
                          value={createdAt.toLocaleDateString()}
                          disabled
                          className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          From
                        </label>
                        <input
                          type="text"
                          value={selectedSupplier.companyName}
                          disabled
                          className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                        />
                      </div>

                      {/* Select Warehouse */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Warehouse
                        </label>
                        <select
                          value={selectedWarehouse?.name || ""}
                          onChange={(e) =>
                            handleSelectWarehouse(e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 p-2"
                        >
                          <option value="">Select Warehouse</option>
                          {warehouses.map((warehouse) => (
                            <option key={warehouse.name} value={warehouse.name}>
                              {warehouse.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <select
                          value={selectedState}
                          onChange={(e) => handleSelectState(e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2"
                        >
                          <option value="">Select State</option>
                          <option value="IN_PROGRESS"> In progress </option>
                          <option value="READY"> Ready</option>
                          <option value="DELIVERED"> Delivered </option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          value={deliveryDate.toISOString().split("T")[0]}
                          onChange={(e) =>
                            setDeliveryDate(new Date(e.target.value))
                          }
                          className="w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}
              {selectedSupplier && (
                <div className="mt-8 max-h-[500px] overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                  <h4 className="mb-6 text-lg font-semibold text-gray-800">
                    Select Product
                  </h4>
                  {productsWithQuantities.length > 0 ? (
                    <div className="mb-4 rounded-lg bg-blue-50 p-3">
                      <p className="text-sm text-blue-700">
                        📦 Showing {productsWithQuantities.length} product
                        {productsWithQuantities.length !== 1 ? "s" : ""}{" "}
                        available from{" "}
                        <strong>{selectedSupplier.companyName}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4 rounded-lg bg-yellow-50 p-3">
                      <p className="text-sm text-yellow-700">
                        ⚠️ No products found for{" "}
                        <strong>{selectedSupplier.companyName}</strong>. Please
                        check if products are assigned to this manufacturer.
                      </p>
                    </div>
                  )}
                  <div className="space-y-6">
                    {productRows.map((row, index) => (
                      <div
                        key={index}
                        className="mb-6 flex items-center justify-between gap-6"
                      >
                        <div className="w-1/3">
                          <label className="block text-sm font-medium text-gray-700">
                            Product
                          </label>
                          <select
                            value={row.productId || ""}
                            onChange={(e) =>
                              handleProductChange(index, e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 p-3"
                          >
                            <option value="">Select a product</option>
                            {getAvailableProducts(index).map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.product.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantité */}
                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                Number(e.target.value),
                              )
                            }
                            className="w-full rounded-md border border-gray-300 p-3"
                          />
                        </div>

                        {/* Prix Hors Taxe */}
                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            Price exc.tax
                          </label>
                          <input
                            type="number"
                            value={
                              productsWithQuantities.find(
                                (p) => p.id === row.productId,
                              )?.priceExclTax
                            }
                            disabled
                            className="w-full rounded-md border border-gray-300 bg-gray-100 p-3"
                          />
                        </div>

                        {/* Total */}
                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            Total
                          </label>
                          <input
                            type="text"
                            value={(
                              row.quantity *
                              (productsWithQuantities.find(
                                (p) => p.id === row.productId,
                              )?.priceExclTax || 0)
                            ).toFixed(2)}
                            disabled
                            className="w-full rounded-md border border-gray-300 bg-gray-100 p-3"
                          />
                        </div>

                        {/* SKU */}
                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            SKU
                          </label>
                          <input
                            type="text"
                            value={
                              productsWithQuantities.find(
                                (p) => p.id === row.productId,
                              )?.sku || ""
                            }
                            disabled
                            className="w-full rounded-md border border-gray-300 bg-gray-100 p-3"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                    <h4 className="mb-6 text-lg font-semibold text-gray-800">
                      Total Amount
                    </h4>
                    {paymentTypes.some((payment) => payment.type) && (
                      <div className="mb-4 grid grid-cols-5 gap-4 px-2">
                        <span className="text-sm font-medium text-gray-700">
                          Type
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Percentage
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Amount
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Payment date
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Remaining
                        </span>
                      </div>
                    )}
                    {paymentTypes.map((payment, index) => (
                      <div key={index} className="mb-6 grid grid-cols-5 gap-4">
                        <select
                          value={payment.type}
                          onChange={(e) =>
                            handlePaymentTypeChange(index, e.target.value)
                          }
                          className="rounded-md border border-gray-300 p-3"
                        >
                          <option value="0">Select a payment method</option>
                          <option value="CHEQUE">Cheque</option>
                          <option value="CASH">Cash</option>
                          <option value="TRAITE">Traite</option>
                        </select>
                        {payment.type && (
                          <input
                            type="number"
                            value={payment.percentage}
                            onChange={(e) => {
                              const value = e.target.value;
                              setPaymentTypes((prev) => {
                                const updatedPayments = [...prev];
                                updatedPayments[index].percentage = value;
                                return updatedPayments;
                              });
                            }}
                            onBlur={() =>
                              handlePaymentPercentageChange(
                                index,
                                payment.percentage,
                              )
                            }
                            className="rounded-md border border-gray-300 p-3"
                            placeholder="Percentage"
                            min="0"
                            max="100"
                            step="any"
                          />
                        )}
                        {payment.type && (
                          <input
                            type="number"
                            value={payment.amount || ""}
                            onChange={(e) =>
                              handlePaymentAmountChange(index, e.target.value)
                            }
                            className="rounded-md border border-gray-300 p-3"
                            placeholder="Amount"
                            step="any"
                            min="0"
                            max={
                              totalAmount -
                              paymentTypes.reduce(
                                (acc, p, i) =>
                                  i === index
                                    ? acc
                                    : acc + Number(p.amount || 0),
                                0,
                              )
                            }
                          />
                        )}
                        {payment.type && (
                          <input
                            type="date"
                            value={payment.date.toISOString().split("T")[0]}
                            onChange={(e) => {
                              const newDate = new Date(e.target.value);
                              handlePaymentDateChange(index, newDate);
                            }}
                            className="rounded-md border border-gray-300 p-3"
                          />
                        )}
                        <input
                          type="number"
                          value={remainingAmount.toFixed(2) || "0.00"}
                          disabled
                          className="rounded-md border border-gray-300 bg-gray-100 p-3"
                        />
                      </div>
                    ))}
                    <div className="mt-6 flex justify-between">
                      <span className="text-lg font-medium text-gray-800">
                        Total Amount
                      </span>
                      <span className="text-lg font-semibold text-gray-800">
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload File Section */}
              <div className="mt-6 rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
                <label className="mb-2 block text-lg font-semibold text-gray-700">
                  Upload File
                </label>

                <div className="relative w-full">
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="fileInput"
                    className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-3 text-center text-gray-700 hover:bg-gray-200"
                  >
                    📁 Choose File
                  </label>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
                <label className="mb-2 block text-lg font-semibold text-gray-700">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="type your comment"
                  className="w-full rounded border p-2"
                />

                {message && (
                  <p className="mt-2 text-sm text-green-600">{message}</p>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button onClick={handleCancel} className="neon-button">
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndSendEmail}
                  className="neon-button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;

"use client";
import { useState, useEffect } from "react";
import { OrderWithRelations, OrderItemWithRelations } from "../types/order";
import { Status, State, Customers, Agent, OrderPayment } from "@prisma/client";
import ModalOrderItems from "../Modal/EditOrderItems";
import {
  XMarkIcon,
  PencilSquareIcon,
  CheckIcon,
  ArrowPathIcon,
  CalculatorIcon,
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  StarIcon,
  TruckIcon,
  CreditCardIcon,
  ScaleIcon,
  DevicePhoneMobileIcon,
  CheckBadgeIcon,
  UserCircleIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface AmountField {
  label: string;
  value: number;
  setter: (value: number) => void;
  icon: any;
  name: string;
}

const EditOrderForm = ({
  order,
  onClose,
  onUpdate,
}: {
  order: OrderWithRelations;
  onClose: () => void;
  onUpdate: (updatedOrder: OrderWithRelations) => void;
}) => {
  const [amountTTC, setAmountTTC] = useState(order.amountTTC);
  const [amountRefunded, setAmountRefunded] = useState(order.amountRefunded);
  const [amountOrdered, setAmountOrdered] = useState(order.amountOrdered);
  const [amountShipped, setAmountShipped] = useState(order.amountShipped);
  const [amountCanceled, setAmountCanceled] = useState(order.amountCanceled);
  const [shippingAmount, setShippingAmount] = useState(
    order.shippingAmount || 0,
  );
  const [shippingMethod, setShippingMethod] = useState(
    order.shippingMethod || "",
  );
  const [weight, setWeight] = useState(order.weight || 0);
  const [fromMobile, setFromMobile] = useState(order.fromMobile || false);
  const [isActive, setIsActive] = useState(order.isActive);
  const [stateId, setStateId] = useState(order.state?.id || "");
  const [statusId, setStatusId] = useState(order.status?.id || "");
  const [customerId, setCustomerId] = useState(order.customer?.id || "");
  const [agentId, setAgentId] = useState(order.agent?.id || "");
  const [paymentMethodId, setPaymentMethodId] = useState(
    order.paymentMethod?.id || "",
  );
  const [orderItems, setOrderItems] = useState<OrderItemWithRelations[]>(
    order.orderItems || [],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOrderItemsModal, setShowOrderItemsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<OrderPayment[]>([]);

  const amountFields: AmountField[] = [
    {
      label: "Amount TTC",
      value: amountTTC,
      setter: setAmountTTC,
      icon: CurrencyDollarIcon,
      name: "amountTTC",
    },
    {
      label: "Amount Refunded",
      value: amountRefunded,
      setter: setAmountRefunded,
      icon: CurrencyDollarIcon,
      name: "amountRefunded",
    },
    {
      label: "Amount Ordered",
      value: amountOrdered,
      setter: setAmountOrdered,
      icon: CurrencyDollarIcon,
      name: "amountOrdered",
    },
    {
      label: "Amount Shipped",
      value: amountShipped,
      setter: setAmountShipped,
      icon: CurrencyDollarIcon,
      name: "amountShipped",
    },
    {
      label: "Amount Canceled",
      value: amountCanceled,
      setter: setAmountCanceled,
      icon: CurrencyDollarIcon,
      name: "amountCanceled",
    },
    {
      label: "Shipping Amount",
      value: shippingAmount,
      setter: setShippingAmount,
      icon: TruckIcon,
      name: "shippingAmount",
    },
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/api/marketplace/state/getAll",
            name: "states",
            filterFn: (item: State) => item.id && item.name,
          },
          {
            url: "/api/marketplace/status/getAll",
            name: "statuses",
            filterFn: (item: Status) => item.id && item.name,
          },
          {
            url: "/api/marketplace/customers/getAll",
            name: "customers",
            filterFn: (item: Customers) =>
              item.id && item.firstName && item.lastName,
          },
          {
            url: "/api/marketplace/agents/getAll",
            name: "agents",
            filterFn: (item: Agent) =>
              item.id && item.firstName && item.lastName,
          },
          {
            url: "/api/marketplace/payment_method/getAll",
            name: "paymentMethods",
            filterFn: (item: OrderPayment) => item.id && item.name,
            responseKey: "paymentMethods",
          },
        ];

        const results = await Promise.allSettled(
          endpoints.map((endpoint) =>
            fetch(endpoint.url).then((res) => res.json()),
          ),
        );

        results.forEach((result, index) => {
          const endpoint = endpoints[index];

          if (result.status === "fulfilled") {
            try {
              const responseData = result.value;
              let dataArray =
                responseData[endpoint.name] ||
                responseData.data ||
                responseData;
              if (Array.isArray(dataArray)) {
                const filteredData = dataArray.filter(endpoint.filterFn);

                switch (endpoint.name) {
                  case "states":
                    setStates(filteredData);
                    break;
                  case "statuses":
                    setStatuses(filteredData);
                    break;
                  case "customers":
                    setCustomers(filteredData);
                    break;
                  case "agents":
                    setAgents(filteredData);
                    break;
                  case "paymentMethods":
                    setPaymentMethods(filteredData);
                    break;
                }
              }
            } catch (parseError) {
              console.error(`Error processing ${endpoint.name}:`, parseError);
            }
          } else {
            console.error(`Failed to fetch ${endpoint.name}:`, result.reason);
          }
        });
      } catch (error) {
        console.error("Error in fetchOptions:", error);
        toast.error("Failed to load form options", {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    };

    fetchOptions();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    amountFields.forEach(({ name, value, label }) => {
      if (value < 0) {
        newErrors[name] = `${label} must be a positive number`;
      }
    });

    // Validate required fields
    if (!stateId) newErrors.stateId = "State is required";
    if (!statusId) newErrors.statusId = "Status is required";
    if (!customerId) newErrors.customerId = "Customer is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        position: "bottom-right",
        autoClose: 5000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedOrder: OrderWithRelations = {
        ...order,
        amountTTC,
        amountRefunded,
        amountOrdered,
        amountShipped,
        amountCanceled,
        shippingAmount,
        shippingMethod,
        weight,
        fromMobile,
        isActive,
        stateId,
        statusId,
        customerId,
        agentId: agentId || null,
        paymentMethodId,
        orderItems,
        updatedAt: new Date(),
        state: states.find((s) => s.id === stateId) || null,
        status: statuses.find((s) => s.id === statusId) || null,
        customer: customers.find((c) => c.id === customerId) || null,
        agent: agents.find((a) => a.id === agentId) || null,
        paymentMethod:
          paymentMethods.find((p) => p.id === paymentMethodId) || null,
      };

      onUpdate(updatedOrder);
    } catch (error) {
      toast.error("An error occurred while updating the order", {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOrderItems = () => {
    setShowOrderItemsModal(true);
  };

  const renderFieldError = (fieldName: string) => {
    if (!errors[fieldName]) return null;

    return (
      <div className="mt-1 flex items-center text-sm text-red-600">
        <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
        <span>{errors[fieldName]}</span>
      </div>
    );
  };

  const renderAmountField = ({
    label,
    value,
    setter,
    icon: Icon,
    name,
  }: AmountField) => (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Icon className="mr-1 h-4 w-4" />
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const numValue = Number(e.target.value);
          if (numValue >= 0) {
            setter(numValue);
            if (errors[name]) {
              const newErrors = { ...errors };
              delete newErrors[name];
              setErrors(newErrors);
            }
          }
        }}
        min="0"
        step={label.includes("Amount") ? "0.01" : "1"}
        className={`w-full rounded-lg border px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
          errors[name] ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
        }`}
      />
      {renderFieldError(name)}
    </div>
  );

  const renderSelectField = ({
    label,
    value,
    onChange,
    options,
    icon: Icon,
    name,
    placeholder = "Select an option",
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { id: string; name: string }[];
    icon: any;
    name: string;
    placeholder?: string;
  }) => (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Icon className="mr-1 h-4 w-4" />
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
          }
        }}
        className={`w-full rounded-lg border px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
          errors[name] ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {renderFieldError(name)}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Order Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {Object.keys(errors).length > 0 && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="mr-2 mt-0.5 h-5 w-5 text-red-500" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    There {Object.keys(errors).length === 1 ? "is" : "are"}{" "}
                    {Object.keys(errors).length} error
                    {Object.keys(errors).length === 1 ? "" : "s"} in your form
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc space-y-1 pl-5">
                      {Object.values(errors).map((errorMsg, index) => (
                        <li key={index}>{errorMsg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
              <CalculatorIcon className="mr-2 h-5 w-5" />
              Amounts
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {amountFields.map((field) => renderAmountField(field))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                <ClipboardDocumentIcon className="mr-2 h-5 w-5" />
                Order Details
              </h3>
              <div className="space-y-4">
                {renderSelectField({
                  label: "State",
                  value: stateId,
                  onChange: setStateId,
                  options: states,
                  icon: CheckBadgeIcon,
                  name: "stateId",
                })}

                {renderSelectField({
                  label: "Status",
                  value: statusId,
                  onChange: setStatusId,
                  options: statuses,
                  icon: CheckBadgeIcon,
                  name: "statusId",
                })}

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <TruckIcon className="mr-1 h-4 w-4" />
                    Shipping Method
                  </label>
                  <input
                    type="text"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {renderSelectField({
                  label: "Payment Method",
                  value: paymentMethodId,
                  onChange: setPaymentMethodId,
                  options: paymentMethods,
                  icon: CreditCardIcon,
                  name: "paymentMethodId",
                })}

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <ScaleIcon className="mr-1 h-4 w-4" />
                    Weight
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <DevicePhoneMobileIcon className="mr-1 h-4 w-4" />
                    From Mobile
                  </span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={fromMobile}
                      onChange={(e) => setFromMobile(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <ShieldCheckIcon className="mr-1 h-4 w-4" />
                    Active Order
                  </span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                <UserCircleIcon className="mr-2 h-5 w-5" />
                Associations
              </h3>
              <div className="space-y-4">
                {renderSelectField({
                  label: "Customer",
                  value: customerId,
                  onChange: setCustomerId,
                  options: customers.map((c) => ({
                    id: c.id,
                    name: `${c.firstName} ${c.lastName}`,
                  })),
                  icon: UserCircleIcon,
                  name: "customerId",
                })}

                {renderSelectField({
                  label: "Agent",
                  value: agentId,
                  onChange: setAgentId,
                  options: agents.map((a) => ({
                    id: a.id,
                    name: `${a.firstName} ${a.lastName}`,
                  })),
                  icon: IdentificationIcon,
                  name: "agentId",
                })}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEditOrderItems}
            className="flex w-full transform items-center justify-center gap-x-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-md transition-colors duration-200 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            <PencilSquareIcon className="h-5 w-5" />
            Edit Order Items
          </button>
        </div>

        <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Update Order
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {showOrderItemsModal && (
        <ModalOrderItems
          isOpen={showOrderItemsModal}
          orderItems={order.orderItems || []}
          onClose={() => setShowOrderItemsModal(false)}
          onUpdate={({
            updatedItems,
            amountRefunded,
            amountOrdered,
            amountShipped,
            amountCanceled,
          }) => {
            setAmountRefunded(amountRefunded);
            setAmountOrdered(amountOrdered);
            setAmountShipped(amountShipped);
            setAmountCanceled(amountCanceled);
            setOrderItems(updatedItems);
            setShowOrderItemsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default EditOrderForm;

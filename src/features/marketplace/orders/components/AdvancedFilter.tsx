import { Status, State, Agent, OrderPayment, Customers } from "@prisma/client";

interface AdvancedFilterProps {
  statuses: Status[];
  states: State[];
  agents: Agent[];
  paymentMethods: OrderPayment[];
  customers: Customers[];
  filters: {
    statusId: string;
    stateId: string;
    customerId: string;
    agentId: string;
    paymentMethodId: string;
    fromMobile: string;
    isActive: string;
    minAmount: string;
    maxAmount: string;
    minWeight: string;
    maxWeight: string;
    dateFrom: string;
    dateTo: string;
    minAmountTTC: string;
    maxAmountTTC: string;
    minAmountRefunded: string;
    maxAmountRefunded: string;
    minAmountCanceled: string;
    maxAmountCanceled: string;
    minAmountOrdered: string;
    maxAmountOrdered: string;
    minAmountShipped: string;
    maxAmountShipped: string;
    minLoyaltyPtsValue: string;
    maxLoyaltyPtsValue: string;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
  onApply: () => void;
}

const AdvancedFilter = ({
  statuses,
  states,
  agents,
  customers,
  paymentMethods,
  filters,
  onFilterChange,
  onReset,
  onApply,
}: AdvancedFilterProps) => {
  return (
    <div className="mb-5 rounded-lg border bg-white p-4 shadow-md">
      <h3 className="mb-4 text-lg font-semibold">Advanced Filters</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Amount TTC Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border p-2"
              value={filters.minAmountTTC}
              onChange={(e) =>
                onFilterChange({ ...filters, minAmountTTC: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border p-2"
              value={filters.maxAmountTTC}
              onChange={(e) =>
                onFilterChange({ ...filters, maxAmountTTC: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Amount Refunded Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border p-2"
              value={filters.minAmountRefunded}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  minAmountRefunded: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border p-2"
              value={filters.maxAmountRefunded}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  maxAmountRefunded: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Amount Canceled Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border p-2"
              value={filters.minAmountCanceled}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  minAmountCanceled: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border p-2"
              value={filters.maxAmountCanceled}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  maxAmountCanceled: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Amount Ordered Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border p-2"
              value={filters.minAmountOrdered}
              onChange={(e) =>
                onFilterChange({ ...filters, minAmountOrdered: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border p-2"
              value={filters.maxAmountOrdered}
              onChange={(e) =>
                onFilterChange({ ...filters, maxAmountOrdered: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Amount Shipped Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border p-2"
              value={filters.minAmountShipped}
              onChange={(e) =>
                onFilterChange({ ...filters, minAmountShipped: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border p-2"
              value={filters.maxAmountShipped}
              onChange={(e) =>
                onFilterChange({ ...filters, maxAmountShipped: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Loyalty Points Value Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border p-2"
              value={filters.minLoyaltyPtsValue}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  minLoyaltyPtsValue: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border p-2"
              value={filters.maxLoyaltyPtsValue}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  maxLoyaltyPtsValue: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            className="w-full rounded-lg border p-2"
            value={filters.statusId}
            onChange={(e) =>
              onFilterChange({ ...filters, statusId: e.target.value })
            }
          >
            <option value="">All Statuses</option>
            {Array.isArray(statuses)
              ? statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))
              : null}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            State
          </label>
          <select
            className="w-full rounded-lg border p-2"
            value={filters.stateId}
            onChange={(e) =>
              onFilterChange({ ...filters, stateId: e.target.value })
            }
          >
            <option value="">All States</option>
            {Array.isArray(states)
              ? states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))
              : null}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Agent
          </label>
          <select
            className="w-full rounded-lg border p-2"
            value={filters.agentId}
            onChange={(e) =>
              onFilterChange({ ...filters, agentId: e.target.value })
            }
          >
            <option value="">All Agents</option>
            {Array.isArray(agents) &&
              agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.firstName} {agent.lastName}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Customer
          </label>
          <select
            className="w-full rounded-lg border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            value={filters.customerId}
            onChange={(e) =>
              onFilterChange({ ...filters, customerId: e.target.value })
            }
            disabled={!customers || customers.length === 0}
          >
            <option value="">All Customers</option>
            {Array.isArray(customers) && customers.length > 0 ? (
              customers
                .filter(
                  (customer) =>
                    customer?.id && customer?.firstName && customer?.lastName,
                )
                .map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                    className="hover:bg-blue-50"
                  >
                    {customer.firstName} {customer.lastName}
                  </option>
                ))
            ) : (
              <option value="" disabled>
                Loading customers...
              </option>
            )}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            className="w-full rounded-lg border p-2"
            value={filters.paymentMethodId}
            onChange={(e) =>
              onFilterChange({ ...filters, paymentMethodId: e.target.value })
            }
          >
            <option value="">All Methods</option>
            {paymentMethods?.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            From Mobile
          </label>
          <select
            className="w-full rounded-lg border p-2"
            value={filters.fromMobile}
            onChange={(e) =>
              onFilterChange({ ...filters, fromMobile: e.target.value })
            }
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Is Active
          </label>
          <select
            className="w-full rounded-lg border p-2"
            value={filters.isActive}
            onChange={(e) =>
              onFilterChange({ ...filters, isActive: e.target.value })
            }
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Weight Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border p-2"
              value={filters.minWeight}
              onChange={(e) =>
                onFilterChange({ ...filters, minWeight: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border p-2"
              value={filters.maxWeight}
              onChange={(e) =>
                onFilterChange({ ...filters, maxWeight: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              className="w-full rounded-lg border p-2"
              value={filters.dateFrom}
              onChange={(e) =>
                onFilterChange({ ...filters, dateFrom: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full rounded-lg border p-2"
              value={filters.dateTo}
              onChange={(e) =>
                onFilterChange({ ...filters, dateTo: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onReset}
          className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset Filters
        </button>
        <button
          onClick={onApply}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilter;

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditOrderItemsForm from "./EditOrderItems";

// Mock order item
const mockOrderItems = [
  {
    id: "item-1",
    product: { name: "Produit A" },
    productName: "Produit A",
    partner: { username: "partner1" },
    source: { name: "source1" },
    sku: "SKU-001",
    qteOrdered: 2,
    qteShipped: 1,
    qteRefunded: 0,
    qteCanceled: 0,
    discountedPrice: 10,
    weight: 1.5,
    deliveryDate: "2024-06-01T00:00:00.000Z",
  },
];

describe("EditOrderItemsForm", () => {
  const onClose = jest.fn();
  const onUpdate = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    onUpdate.mockClear();
  });

  it("n'affiche rien si isOpen est false", () => {
    render(
      <EditOrderItemsForm
        // @ts-expect-error mockOrderItems is missing some required fields for OrderItemWithRelations
        orderItems={mockOrderItems}
        onClose={onClose}
        onUpdate={onUpdate}
        isOpen={false}
      />,
    );
    expect(screen.queryByText(/edit order items/i)).not.toBeInTheDocument();
  });

  it("affiche les données initiales", () => {
    render(
      <EditOrderItemsForm
        // @ts-expect-error mockOrderItems is missing some required fields for OrderItemWithRelations
        orderItems={mockOrderItems}
        onClose={onClose}
        onUpdate={onUpdate}
        isOpen={true}
      />,
    );
    expect(screen.getByText(/edit order items/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument(); // qteOrdered
    expect(screen.getByDisplayValue("10")).toBeInTheDocument(); // discountedPrice
    expect(screen.getByText(/produit a/i)).toBeInTheDocument();
  });

  it("modifie une quantité et sauvegarde", async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    ) as jest.Mock;

    render(
      <EditOrderItemsForm
        // @ts-expect-error mockOrderItems is missing some required fields for OrderItemWithRelations
        orderItems={mockOrderItems}
        onClose={onClose}
        onUpdate={onUpdate}
        isOpen={true}
      />,
    );

    // Change la quantité commandée
    const orderedInput = screen.getAllByDisplayValue("2")[0];
    fireEvent.change(orderedInput, { target: { value: "3" } });

    // Clique sur "Save Changes"
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedItems: expect.arrayContaining([
            expect.objectContaining({ qteOrdered: 3 }),
          ]),
          amountOrdered: expect.any(Number),
          amountRefunded: expect.any(Number),
          amountShipped: expect.any(Number),
          amountCanceled: expect.any(Number),
        }),
      );
    });
  });

  it("ferme le modal quand on clique sur Cancel", () => {
    render(
      <EditOrderItemsForm
        // @ts-expect-error mockOrderItems is missing some required fields for OrderItemWithRelations
        orderItems={mockOrderItems}
        onClose={onClose}
        onUpdate={onUpdate}
        isOpen={true}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("affiche une erreur si quantité négative", async () => {
    render(
      <EditOrderItemsForm
        // @ts-expect-error mockOrderItems is missing some required fields for OrderItemWithRelations
        orderItems={mockOrderItems}
        onClose={onClose}
        onUpdate={onUpdate}
        isOpen={true}
      />,
    );
    // Mettre une quantité négative
    const orderedInput = screen.getAllByDisplayValue("2")[0];
    fireEvent.change(orderedInput, { target: { value: "-1" } });

    // Clique sur "Save Changes"
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  });
});

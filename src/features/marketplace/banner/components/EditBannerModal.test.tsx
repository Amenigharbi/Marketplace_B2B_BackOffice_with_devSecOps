import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditBannerModal from "./EditBannerModal";

// Mock Banner data
const mockBanner = {
  id: "1",
  altText: "Bannière existante",
  url: "http://example.com/banner.jpg",
  description: "Description existante",
};

describe("EditBannerModal", () => {
  const onClose = jest.fn();
  const onEdit = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    onEdit.mockClear();
  });

  it("ne s'affiche pas si isOpen est false", () => {
    render(
      <EditBannerModal
        isOpen={false}
        onClose={onClose}
        onEdit={onEdit}
        initialData={{
          ...mockBanner,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        }}
      />,
    );
    expect(screen.queryByText(/edit banner/i)).not.toBeInTheDocument();
  });

  it("ne s'affiche pas si initialData est null", () => {
    render(
      <EditBannerModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        initialData={null}
      />,
    );
    expect(screen.queryByText(/edit banner/i)).not.toBeInTheDocument();
  });

  it("affiche les données initiales", () => {
    render(
      <EditBannerModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        initialData={{
          ...mockBanner,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        }}
      />,
    );
    expect(screen.getByDisplayValue("Bannière existante")).toBeInTheDocument();
    expect(screen.getByAltText(/bannière existante/i)).toBeInTheDocument();
  });

  it("ferme le modal quand on clique sur le bouton Cancel", () => {
    render(
      <EditBannerModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        initialData={{
          ...mockBanner,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        }}
      />,
    );
    fireEvent.click(screen.getByText(/cancel/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("appelle onEdit avec les bonnes valeurs", () => {
    render(
      <EditBannerModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        initialData={{
          ...mockBanner,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        }}
      />,
    );
    // Change altText
    fireEvent.change(screen.getByLabelText(/alt text/i), {
      target: { value: "Nouveau alt" },
    });
    // Change description
    fireEvent.change(screen.getByPlaceholderText(/enter banner description/i), {
      target: { value: "Nouvelle description" },
    });
    // Simule un fichier image
    const file = new File(["dummy"], "new-banner.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/banner image/i), {
      target: { files: [file] },
    });

    // Clique sur "Save Changes"
    fireEvent.click(screen.getByText(/save changes/i));

    expect(onEdit).toHaveBeenCalledWith({
      id: "1",
      altText: "Nouveau alt",
      description: "Nouvelle description",
      image: file,
    });
  });
});

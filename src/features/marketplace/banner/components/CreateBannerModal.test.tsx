import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateBannerModal from "./CreateBannerModal";

// Mock pour URL.createObjectURL
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mock-url");
});

// Mock pour File
const createFile = (name = "image.png", size = 1024, type = "image/png") => {
  const file = new File(["dummy content"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("CreateBannerModal", () => {
  const onClose = jest.fn();
  const onCreate = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    onCreate.mockClear();
  });

  it("n'affiche rien si isOpen est false", () => {
    render(
      <CreateBannerModal
        isOpen={false}
        onClose={onClose}
        onCreate={onCreate}
      />,
    );
    expect(screen.queryByText(/create new banner/i)).not.toBeInTheDocument();
  });

  it("affiche le modal si isOpen est true", () => {
    render(
      <CreateBannerModal isOpen={true} onClose={onClose} onCreate={onCreate} />,
    );
    expect(screen.getByText(/create new banner/i)).toBeInTheDocument();
  });

  it("ferme le modal quand on clique sur le bouton close", () => {
    render(
      <CreateBannerModal isOpen={true} onClose={onClose} onCreate={onCreate} />,
    );
    fireEvent.click(screen.getByLabelText(/close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("affiche une erreur si on essaie de créer sans image", () => {
    render(
      <CreateBannerModal isOpen={true} onClose={onClose} onCreate={onCreate} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    expect(
      screen.getByText(/please select an image file/i),
    ).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("appelle onCreate avec les bonnes valeurs", async () => {
    render(
      <CreateBannerModal isOpen={true} onClose={onClose} onCreate={onCreate} />,
    );
    // Sélectionner une image
    const file = createFile();
    const input = screen.getByLabelText(/banner image/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    // Remplir les champs
    fireEvent.change(screen.getByLabelText(/alt text/i), {
      target: { value: "Bannière" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Description test" },
    });

    // Cliquer sur "Create"
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        altText: "Bannière",
        image: file,
        description: "Description test",
      });
    });
  });
});

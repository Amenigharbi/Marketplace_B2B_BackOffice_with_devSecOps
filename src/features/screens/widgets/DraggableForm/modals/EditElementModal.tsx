import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import ImageModal from "./ImageModal";
import CarouselModal from "./CarouselModal";
import ProductShowcaseModal from "./ProductShowcaseModal";

interface Element {
  _id: string;
  adType?: string;
  title?: string;
}

interface EditElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement: Element | null;
}
interface Product {
  _id: string;
  name: string;
}
interface SelectedElement {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string[];
  products?: Product[];
  startDate?: string;
  endDate?: string;
}

const EditElementModal: React.FC<EditElementModalProps> = ({
  isOpen,
  onClose,
  selectedElement,
}) => {
  if (!selectedElement) return null;

  const renderModalContent = () => {
    const elementType = selectedElement.adType ?? selectedElement.title;

    switch (elementType) {
      case "image":
        return (
          <ImageModal
            selectedElement={selectedElement as SelectedElement}
            onClose={onClose}
          />
        );
      case "carousel":
        return (
          <CarouselModal
            selectedElement={selectedElement as SelectedElement}
            onClose={onClose}
          />
        );
      case "ProductShowcase":
        return (
          <ProductShowcaseModal
            selectedElement={selectedElement as SelectedElement}
            onClose={onClose}
          />
        );
      default:
        return (
          <>
            <ModalHeader>
              <h2 className="text-xl font-bold">Edit Element</h2>
            </ModalHeader>
            <ModalBody>
              <div className="text-gray-700">
                <p>This is the default editor.</p>
                <p>No specific content type detected.</p>
              </div>
            </ModalBody>
          </>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>{renderModalContent()}</ModalContent>
    </Modal>
  );
};

export default EditElementModal;

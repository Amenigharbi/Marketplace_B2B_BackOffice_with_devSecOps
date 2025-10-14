import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import EditElementModal from "./modals/EditElementModal";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-hot-toast";

interface FormElement {
  id: string;
  _id: string;
  title: string;
}

interface ScreenBuilderSectionProps {
  formElements: FormElement[];
  setFormElements: (elements: FormElement[]) => void;
}

const ScreenBuilderSection: React.FC<ScreenBuilderSectionProps> = ({
  formElements,
  setFormElements,
}) => {
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { fetchData } = useAxios();

  const handleElementClick = (element: FormElement) => {
    setSelectedElement(element);
    setIsModalOpen(true);
  };

  const handleDeleteElement = async (elementId: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      await fetchData(`api/ad/${elementId}`, "delete", undefined, {
        headers: {
          "X-API-Key": apiKey,
        },
      });

      const updatedElements = formElements.filter(
        (element) => element._id !== elementId,
      );
      setFormElements(updatedElements);

      toast.success("Element deleted successfully!");
    } catch (error) {
      console.error("Error deleting element:", error);
      toast.error("Failed to delete element. Please try again.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedElement(null);
  };

  return (
    <>
      <Droppable droppableId="formElements">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-full rounded bg-black bg-opacity-50 p-4"
          >
            <h2 className="mb-4 text-xl font-bold">Screen Builder</h2>
            {formElements.map((element, index) => (
              <Draggable
                key={element.id}
                draggableId={element.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2 cursor-move rounded bg-white p-2 shadow"
                    onClick={() => handleElementClick(element)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-gray-700">{element.title}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteElement(element._id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Click for properties or drag to move
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {formElements.length >= 2 && (
              <div className="mt-2 text-red-500">
                Maximum of 2 ad reached. Remove an ad to add a new one.
              </div>
            )}
          </div>
        )}
      </Droppable>

      <EditElementModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedElement={selectedElement}
      />
    </>
  );
};

export default ScreenBuilderSection;

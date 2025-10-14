import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import ElementsSection from "./ElementsSection";
import ScreenBuilderSection from "./ScreenBuilderSection";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-hot-toast";

interface FormElement {
  id: string;
  _id: string;
  title: string;
}

interface DraggableFormProps {
  elements: FormElement[];
  formElements: FormElement[];
  setFormElements: (elements: FormElement[]) => void;
}

const DraggableForm: React.FC<DraggableFormProps> = ({
  elements,
  formElements,
  setFormElements,
}) => {
  const { fetchData } = useAxios();

  const onDragEnd = async (result: DropResult): Promise<void> => {
    const { source, destination } = result;

    if (
      !destination ||
      destination.droppableId !== "formElements" ||
      formElements.length >= 2
    ) {
      return;
    }

    const element = elements.find((el) => el.id === result.draggableId);
    if (!element) return;

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      const response: any = await fetchData(
        "api/ad",
        "post",
        { adType: element.title },
        { headers: { "X-API-Key": apiKey } },
      );

      if (response.data) {
        const newElement: FormElement = {
          id: response.data.id,
          _id: response.data._id,
          title: response.data.adType,
        };

        const newFormElements = Array.from(formElements);
        newFormElements.splice(destination.index, 0, newElement);

        setFormElements(newFormElements);

        toast.success("Element added successfully!");
      } else {
        console.error("Failed to create new element");
        toast.error("Failed to add element. Please try again.");
      }
    } catch (error) {
      console.error("Error creating new element:", error);
      toast.error("Failed to add element. Please try again.");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full">
        <ElementsSection elements={elements} />
        <ScreenBuilderSection
          formElements={formElements}
          setFormElements={setFormElements}
        />
      </div>
    </DragDropContext>
  );
};

export default DraggableForm;

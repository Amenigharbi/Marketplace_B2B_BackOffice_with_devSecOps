import React from "react";
import {
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

interface FormElement {
  id: string;
  title: string;
}

interface ElementsSectionProps {
  elements: FormElement[];
}

const ElementsSection: React.FC<ElementsSectionProps> = ({ elements }) => {
  return (
    <Droppable droppableId="elements" isDropDisabled={true}>
      {(provided: DroppableProvided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex h-full w-1/3 flex-col gap-5 rounded bg-white px-4"
        >
          <h2 className="mb-4 text-xl font-bold">Elements</h2>
          {elements.map((element, index) => (
            <Draggable key={element.id} draggableId={element.id} index={index}>
              {(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot,
              ) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`focus-visible:ring-ring border-input flex h-[120px] w-full cursor-grab flex-col items-center justify-center gap-5 rounded-md border bg-transparent px-4 py-4 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 ${
                    snapshot.isDragging ? "bg-gray-100" : ""
                  }`}
                >
                  {element.title}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default ElementsSection;

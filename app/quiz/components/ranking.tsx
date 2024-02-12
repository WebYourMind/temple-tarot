import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Choice, RankingQuestion } from "lib/quiz";
import { DragHandleHorizontalIcon } from "@radix-ui/react-icons";

interface Props {
  section: RankingQuestion;
  onReorder: (choices: Choice[]) => void;
  currentOrder: Choice[];
}

const Ranking = ({ section, currentOrder, onReorder }: Props) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(currentOrder, result.source.index, result.destination.index);
    onReorder(items);
  };

  // Reordering logic: reorder the list
  const reorder = (list: Choice[], startIndex: number, endIndex: number): Choice[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="my-5">
        <h2 className="mb-10 block text-xl text-foreground">{section.statement}</h2>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col space-y-4">
              {currentOrder.map((choice: Choice, index: number) => (
                <Draggable key={choice.option} draggableId={choice.option} index={index}>
                  {(provided, snapshot) => (
                    <label
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex cursor-pointer items-center justify-between rounded-sm border p-2`}
                    >
                      <span className="ml-2">{choice.option}</span>
                      <DragHandleHorizontalIcon />
                    </label>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default Ranking;

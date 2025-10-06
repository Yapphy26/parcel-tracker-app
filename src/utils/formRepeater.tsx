"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS, Transform } from "@dnd-kit/utilities";

// Icons
import { CirclePlus } from "lucide-react";

interface FormRepeaterProps<T extends { id: string; }> {
  items: T[];
  onAdd: (totalFields: number) => void;
  onRemove: (index: number) => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  children: (item: T, index: number) => React.ReactNode;
}

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
};

function removeScaleY(transform: Transform | null) {
  if (!transform) return undefined;
  // Clone the transform and set scaleY to 1 (neutral)
  const { ...rest } = transform;
  return CSS.Transform.toString({ ...rest, scaleY: 1 });
}

export function FormRepeater<T extends { id: string; }>({
  items,
  onAdd,
  onReorder,
  children,
}: FormRepeaterProps<T>) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        onReorder?.(oldIndex, newIndex);
      }
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => onAdd(items.length)}
        className="block mt-[-32px] ms-auto me-[4px] cursor-pointer"
      >
        <CirclePlus size={32} strokeWidth={0.75} className="transition duration-300 ease hover:dark:text-green-500 active:dark:text-green-700 hover:text-green-600 active:text-green-800" />
      </button>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {children(item, index)}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
  const isCursorGrabbing = attributes["aria-pressed"];
  
  const style = {
    transform: removeScaleY(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} key={id} className={`flex flex-wrap gap-x-2 ms-[-10px] ${id}`}>
      <button type="button" {...attributes} {...listeners} className={`w-[15px] ${isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"}`} aria-describedby={`DndContext-${id}`}>
        <svg viewBox="0 0 20 20" width="15">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
            fill="currentColor"></path>
        </svg>
      </button>
      {children}
    </div>
  );
}
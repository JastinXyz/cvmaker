import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { GripVertical, PlusCircle, Trash2 } from "lucide-react";
import type { CustomExperience } from "~/types";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useFormStore } from "~/hooks/use-form-store";
import { Button } from "~/components/ui/button";
import QuillEditor from "~/components/quill-editor";

export default function MakerExperienceCustom() {
  const { formData, updateField } = useFormStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addCustomExperiences = () => {
    updateField("custom_experiences", [
      ...formData.custom_experiences,
      {
        id: formData.custom_experiences.length.toString(),
        title: "",
        description: "",
      },
    ]);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={formData.custom_experiences.map((x) => x.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p>Custom Block</p>
            <Button onClick={addCustomExperiences} size={"sm"}>
              <PlusCircle /> New
            </Button>
          </div>
          {formData.custom_experiences.map((x, idx) => (
            <SortableItem key={idx} item={x} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any): void {
    const { active, over } = event;
    if (active.id === over.id) return;

    const oldIndex = formData.custom_experiences.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = formData.custom_experiences.findIndex(
      (item) => item.id === over.id
    );

    updateField(
      "custom_experiences",
      arrayMove(formData.custom_experiences, oldIndex, newIndex)
    );
  }
}

function SortableItem(props: { item: CustomExperience }) {
  const { formData, updateField } = useFormStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteCustomExperiences = (id: string) => {
    updateField(
      "custom_experiences",
      formData.custom_experiences.filter((item) => item.id !== id)
    );
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion type="single" collapsible className="w-full max-w-xl">
        <AccordionItem value="item-1">
          <AccordionTrigger
            action={
              <button onClick={() => deleteCustomExperiences(props.item.id)}>
                <Trash2 className="w-5 h-5 text-red-700" />
              </button>
            }
          >
            <div className="flex items-center gap-2">
              <button {...attributes} {...listeners}>
                <GripVertical className="w-5 h-5" />
              </button>
              <span>{props.item.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                type="text"
                value={props.item.title}
                onChange={(e) =>
                  updateField(
                    "custom_experiences",
                    e.target.value,
                    props.item.id,
                    "title"
                  )
                }
                placeholder="Custom Experience Title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <QuillEditor
                value={props.item.description}
                onChange={(e) =>
                  updateField(
                    "custom_experiences",
                    e,
                    props.item.id,
                    "description"
                  )
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

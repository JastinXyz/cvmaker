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
import type { Language } from "~/types";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useFormStore } from "~/hooks/use-form-store";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";

export default function MakerExperienceLanguages() {
  const { formData, updateField } = useFormStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addLanguages = () => {
    updateField("languages", [
      ...formData.languages,
      { id: formData.languages.length.toString(), name: "", level: "" },
    ]);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={formData.languages.map((x) => x.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p>Languages</p>
            <Button onClick={addLanguages} size={"sm"}>
              <PlusCircle /> New
            </Button>
          </div>
          {formData.languages.map((x, idx) => (
            <SortableItem key={idx} item={x} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any): void {
    const { active, over } = event;
    if (active.id === over.id) return;

    const oldIndex = formData.languages.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = formData.languages.findIndex(
      (item) => item.id === over.id
    );

    updateField("languages", arrayMove(formData.languages, oldIndex, newIndex));
  }
}

function SortableItem(props: { item: Language }) {
  const { formData, updateField } = useFormStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteLanguages = (id: string) => {
    updateField(
      "languages",
      formData.languages.filter((item) => item.id !== id)
    );
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion type="single" collapsible className="w-full max-w-xl">
        <AccordionItem value="item-1">
          <AccordionTrigger
            action={
              <button onClick={() => deleteLanguages(props.item.id)}>
                <Trash2 className="w-5 h-5 text-red-700" />
              </button>
            }
          >
            <div className="flex items-center gap-2">
              <button {...attributes} {...listeners}>
                <GripVertical className="w-5 h-5" />
              </button>
              <span>{props.item.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={props.item.name}
                  onChange={(e) =>
                    updateField(
                      "languages",
                      e.target.value,
                      props.item.id,
                      "name"
                    )
                  }
                  placeholder="English"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={props.item.level}
                  onValueChange={(e) =>
                    updateField("languages", e, props.item.id, "level")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={"Select a level"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[
                        "Beginner",
                        "Elementary",
                        "Intermediate",
                        "Upper Intermediate",
                        "Advanced",
                        "Proficient",
                      ].map((x, idx) => (
                        <SelectItem key={idx} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

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
import type { Skills } from "~/types";
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
import { useTranslation } from "react-i18next";

export default function MakerExperienceSkills() {
  const { t } = useTranslation();
  const { formData, updateField } = useFormStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSkills = () => {
    updateField("skills", [
      ...formData?.skills!,
      { id: formData?.skills.length.toString(), name: "", level: "" },
    ]);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={formData?.skills.map((x) => x.id)!}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p>{t('skills.skills')}</p>
            <Button onClick={addSkills} size={"sm"}>
              <PlusCircle /> {t('general.add')}
            </Button>
          </div>
          {formData?.skills.map((x, idx) => (
            <SortableItem key={idx} item={x} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any): void {
    const { active, over } = event;
    if (active.id === over.id) return;

    const oldIndex = formData?.skills.findIndex((item) => item.id === active.id);
    const newIndex = formData?.skills.findIndex((item) => item.id === over.id);

    updateField("skills", arrayMove(formData?.skills!, oldIndex!, newIndex!));
  }
}

function SortableItem(props: { item: Skills }) {
  const { t } = useTranslation();
  const { formData, updateField } = useFormStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteSkills = (id: string) => {
    updateField(
      "skills",
      formData?.skills.filter((item) => item.id !== id)
    );
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion type="single" collapsible className="w-full max-w-xl">
        <AccordionItem value="item-1">
          <AccordionTrigger
            action={
              <button onClick={() => deleteSkills(props.item.id)}>
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
                <Label htmlFor="name">{t('general.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={props.item.name}
                  onChange={(e) =>
                    updateField("skills", e.target.value, props.item.id, "name")
                  }
                  placeholder="UI/UX Designer"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">{t('general.level')}</Label>
                <Select
                  value={props.item.level}
                  onValueChange={(e) =>
                    updateField("skills", e, props.item.id, "level")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('general.select_level_label')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[
                        t('levels.beginner'),
                        t('levels.intermediate'),
                        t('levels.advanced'),
                        t('levels.expert'),
                        t('levels.master'),
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

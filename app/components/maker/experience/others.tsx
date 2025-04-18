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
import type { OtherExperience } from "~/types";
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
import YearSelect from "~/components/year-select";
import { useTranslation } from "react-i18next";

export default function MakerExperienceOther() {
  const { t } = useTranslation();
  const { formData, updateField } = useFormStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addOtherExperience = () => {
    updateField("other_experiences", [
      ...formData?.other_experiences!,
      {
        id: formData?.other_experiences.length.toString(),
        category: "",
        year: "",
        elaboration: "",
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
        items={formData?.other_experiences.map((x) => x.id)!}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p>{t('otherExperience.other_experience_block')}</p>
            <Button onClick={addOtherExperience} size={"sm"}>
              <PlusCircle /> {t('general.add')}
            </Button>
          </div>
          {formData?.other_experiences.map((x, idx) => (
            <SortableItem key={idx} item={x} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any): void {
    const { active, over } = event;
    if (active.id === over.id) return;

    const oldIndex = formData?.other_experiences.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = formData?.other_experiences.findIndex(
      (item) => item.id === over.id
    );

    updateField(
      "other_experiences",
      arrayMove(formData?.other_experiences!, oldIndex!, newIndex!)
    );
  }
}

function SortableItem(props: { item: OtherExperience }) {
  const { t } = useTranslation();
  const { formData, updateField } = useFormStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteOtherExperience = (id: string) => {
    updateField(
      "other_experiences",
      formData?.other_experiences.filter((item) => item.id !== id)
    );
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion type="single" collapsible className="w-full max-w-xl">
        <AccordionItem value="item-1">
          <AccordionTrigger
            action={
              <button onClick={() => deleteOtherExperience(props.item.id)}>
                <Trash2 className="w-5 h-5 text-red-700" />
              </button>
            }
          >
            <div className="flex items-center gap-2">
              <button {...attributes} {...listeners}>
                <GripVertical className="w-5 h-5" />
              </button>
              <span>{props.item.category}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="category">{t('general.category')}</Label>
                <Select
                  value={props.item.category}
                  onValueChange={(e) =>
                    updateField(
                      "other_experiences",
                      e,
                      props.item.id,
                      "category"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('general.select_category_label')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[
                        t('otherExperience.achievements'),
                        t('otherExperience.publication'),
                        t('otherExperience.course'),
                        t('otherExperience.webinars_attended'),
                      ].map((x, idx) => (
                        <SelectItem key={idx} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <YearSelect
                label={t('general.year')}
                value={props.item.year || ""}
                onChange={(e) =>
                  updateField("other_experiences", e, props.item.id, "year")
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="elaboration">{t('general.elaboration')}</Label>
              <Input
                id="elaboration"
                type="text"
                value={props.item.elaboration}
                onChange={(e) =>
                  updateField(
                    "other_experiences",
                    e.target.value,
                    props.item.id,
                    "elaboration"
                  )
                }
                placeholder="1st at National Hackathon"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

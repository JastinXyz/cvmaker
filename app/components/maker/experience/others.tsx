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
import { GripVertical, PlusCircle, Settings, Trash2 } from "lucide-react";
import type { OtherExperience } from "~/types";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useFormStore } from "~/hooks/use-form-store";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../../ui/dialog";

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
            <p className="line-clamp-1">{formData?.titles.other}</p>
            <div className="flex gap-2">
              <Button onClick={addOtherExperience} size={"sm"}>
                <PlusCircle />
                <span className="hidden sm:block">{t('general.add')}</span>
              </Button>
              <MakerExperienceOtherSetting />
            </div>
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
              <span className="line-clamp-1">{props.item.category}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="category">{t('general.title')} {t('general.category')}</Label>
                <Input
                  id="category"
                  type="text"
                  value={props.item.category}
                  onChange={(e) =>
                    updateField(
                      "other_experiences",
                      e.target.value,
                      props.item.id,
                      "category"
                    )
                  }
                  placeholder="Achievement"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">{t('general.year')}</Label>
                <Input
                  id="year"
                  type="number"
                  value={props.item.year}
                  onChange={(e) =>
                    updateField(
                      "other_experiences",
                      e.target.value,
                      props.item.id,
                      "year"
                    )
                  }
                  placeholder="2025"
                />
              </div>
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

export function MakerExperienceOtherSetting() {
  const { t } = useTranslation();
  const { formData, updateField } = useFormStore();

  return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'neutral'} size={'sm'}>
              <Settings />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">{t('general.title')}</Label>
                <Input id="name" name="name" placeholder="My Awards" value={formData?.titles.other} onChange={(e) => updateField('titles', e.target.value, undefined, 'other')} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="neutral">{t('navigation.close')}</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  )
}
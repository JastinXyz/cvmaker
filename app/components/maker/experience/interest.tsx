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
import type { Interest } from "~/types";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useFormStore } from "~/hooks/use-form-store";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../../ui/dialog";

export default function MakerExperienceInterest() {
  const { t } = useTranslation();
  const { formData, updateField } = useFormStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addInterest = () => {
    updateField("interest", [
      ...formData?.interest!,
      { id: formData?.interest.length.toString(), name: "" },
    ]);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={formData?.interest.map((x) => x.id)!}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p>{formData?.titles.interest}</p>
            <div className="flex gap-2">
              <Button onClick={addInterest} size={"sm"}>
                <PlusCircle /> {t('general.add')}
              </Button>
              <MakerExperienceInterestSetting />
            </div>
          </div>
          {formData?.interest.map((x, idx) => (
            <SortableItem key={idx} item={x} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any): void {
    const { active, over } = event;
    if (active.id === over.id) return;

    const oldIndex = formData?.interest.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = formData?.interest.findIndex((item) => item.id === over.id);

    updateField("interest", arrayMove(formData?.interest!, oldIndex!, newIndex!));
  }
}

function SortableItem(props: { item: Interest }) {
  const { t } = useTranslation();
  const { formData, updateField } = useFormStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteInterest = (id: string) => {
    updateField(
      "interest",
      formData?.interest.filter((item) => item.id !== id)
    );
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion type="single" collapsible className="w-full max-w-xl">
        <AccordionItem value="item-1">
          <AccordionTrigger
            action={
              <button onClick={() => deleteInterest(props.item.id)}>
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
            <div>
              <div className="grid gap-2">
                <Label htmlFor="name">{t('general.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={props.item.name}
                  onChange={(e) =>
                    updateField(
                      "interest",
                      e.target.value,
                      props.item.id,
                      "name"
                    )
                  }
                  placeholder="Hiking"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function MakerExperienceInterestSetting() {
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
                <Input id="name" name="name" placeholder="My Interest" value={formData?.titles.interest} onChange={(e) => updateField('titles', e.target.value, undefined, 'interest')} />
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
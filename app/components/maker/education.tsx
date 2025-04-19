import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion"
import { GripVertical, PlusCircle, Settings, Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";
import type { Education } from "~/types";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFormStore } from "~/hooks/use-form-store";
import QuillEditor from "../quill-editor";
import MonthSelect from '../month-select';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export default function MakerEducation() {
    const { t } = useTranslation();
    const { formData, updateField } = useFormStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addEducation = () => {
        updateField('education', [
            ...formData?.education!,
            { id: formData?.education.length.toString(), name: '', degree: '', location: '', description: '', startMonth: '', startYear: '', endMonth: '', endYear: '' }
        ]);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={formData?.education.map((x) => x.id)!}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-2">
                    {formData?.education.map((x, idx) => <SortableItem key={idx} item={x} />)}
                    <button onClick={addEducation} className="cursor-pointer mt-2 rounded border-dashed border-2 p-3 flex gap-2 items-center text-sm">
                        <PlusCircle className="w-5 h-5" />
                        <span>{t('general.add')} {t('education.education')}</span>
                    </button>
                </div>
            </SortableContext>
        </DndContext>
    )

    function handleDragEnd(event: any): void {
        const { active, over } = event;
        if (active.id === over.id) return;

        const oldIndex = formData?.education.findIndex((item) => item.id === active.id);
        const newIndex = formData?.education.findIndex((item) => item.id === over.id);

        updateField('education', arrayMove(formData?.education!, oldIndex!, newIndex!));
    }
}

function SortableItem(props: { item: Education }) {
    const { t } = useTranslation();
    const { formData, updateField } = useFormStore();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const deleteEducation = (id: string) => {
        updateField('education', formData?.education.filter((item) => item.id !== id));
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Accordion type="single" collapsible className="w-full max-w-xl">
                <AccordionItem value="item-1">
                    <AccordionTrigger action={<button onClick={() => deleteEducation(props.item.id)}><Trash2 className="w-5 h-5 text-red-700" /></button>}>
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
                                <Label htmlFor="name">{t('education.school_name')}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={props.item.name}
                                    onChange={(e) => updateField('education', e.target.value, props.item.id, 'name')}
                                    placeholder="SMKN 1 Jakarta"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="degree">{t('education.degree')}</Label>
                                <Input
                                    id="degree"
                                    type="text"
                                    value={props.item.degree}
                                    onChange={(e) => updateField('education', e.target.value, props.item.id, 'degree')}
                                    placeholder="Software Engineering"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">{t('workExperience.location')}</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    value={props.item.location}
                                    onChange={(e) => updateField('education', e.target.value, props.item.id, 'location')}
                                    placeholder="Jakarta, Indonesia"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">{t('general.description')}</Label>
                                <QuillEditor value={props.item.description} onChange={(e) => updateField('education', e, props.item.id, 'description')} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <MonthSelect label={t('general.start_month')} value={props.item.startMonth} onChange={(e) => updateField('education', e, props.item.id, 'startMonth')} />
                            <div className="grid gap-2">
                              <Label htmlFor="start_year">{t('general.start_year')}</Label>
                              <Input
                                id="start_year"
                                type="number"
                                value={props.item.startYear}
                                onChange={(e) =>
                                  updateField(
                                    "education",
                                    e.target.value,
                                    props.item.id,
                                    "startYear"
                                  )
                                }
                                placeholder="2022"
                              />
                            </div>

                            <MonthSelect label={t('general.end_month')} value={props.item.endMonth} onChange={(e) => updateField('education', e, props.item.id, 'endMonth')} />
                            <div className="grid gap-2">
                              <Label htmlFor="end_year">{t('general.end_year')}</Label>
                              <Input
                                id="end_year"
                                type="number"
                                value={props.item.endYear}
                                onChange={(e) =>
                                  updateField(
                                    "education",
                                    e.target.value,
                                    props.item.id,
                                    "endYear"
                                  )
                                }
                                placeholder="2025"
                              />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </div>
    );
}

export function MakerEducationSetting() {
    const { t } = useTranslation();
    const { formData, updateField } = useFormStore();
  
    return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'neutral'} className="w-10 h-8">
                <Settings />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">{t('general.title')}</Label>
                  <Input id="name" name="name" placeholder="My Education Journey" value={formData?.titles.education} onChange={(e) => updateField('titles', e.target.value, undefined, 'education')} />
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
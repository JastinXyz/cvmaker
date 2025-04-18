import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FormData } from '~/types';

interface FormStoreState {
  activeFormId: string | null;
  forms: Record<string, FormData>;
  formData: FormData | null;
  setActiveForm: (formId: string) => void;
  deleteForm: (formId: string) => void;
  updateField: (
    field: keyof FormData,
    value: any,
    id?: string,
    subField?: string
  ) => void;
  createForm: (formId: string, initialData?: Partial<FormData>) => void;
}

export const useFormStore = create<FormStoreState>()(
  persist(
    (set, get) => ({
      activeFormId: null,
      forms: {},
      formData: null, // computed on setActiveForm

      createForm(formId, initialData = {}) {
        const newForm: FormData = {
          croppedImage: null,
          name: '',
          email: '',
          phone: '',
          linkedin: '',
          website: '',
          address: '',
          short_description: '',
          work_experience: [],
          education: [],
          skills: [],
          languages: [],
          interest: [],
          other_experiences: [],
          custom_experiences: [],
          ...initialData,
        };

        set((state) => ({
          forms: {
            ...state.forms,
            [formId]: newForm,
          },
        }));

        // optionally auto-set as active
        get().setActiveForm(formId);
      },

      setActiveForm(formId) {
        const form = get().forms[formId];
        if (!form) return;

        set({
          activeFormId: formId,
          formData: form,
        });
      },

      updateField(field, value, id, subField) {
        const formId = get().activeFormId;
        if (!formId) return;

        set((state) => {
          const form = state.forms[formId];
          if (!form) return {};

          let updatedForm = { ...form };

          if (id && subField) {
            const arr = form[field] as Array<any>;
            const index = arr.findIndex((item) => item.id === id);
            if (index === -1) return {};

            const updatedItem = { ...arr[index], [subField]: value };
            const updatedArray = [...arr];
            updatedArray[index] = updatedItem;
            (updatedForm[field] as any) = updatedArray;
          } else {
            updatedForm[field] = value;
          }

          return {
            forms: {
              ...state.forms,
              [formId]: updatedForm,
            },
            formData: updatedForm,
          };
        });
      },
      deleteForm(formId) {
        set((state) => {
          const { [formId]: _, ...remaining } = state.forms;
          const isActive = state.activeFormId === formId;

          return {
            forms: remaining,
            ...(isActive && {
              activeFormId: null,
              formData: null,
            }),
          };
        });
      },
    }),
    {
      name: 'drafts',
      partialize: (state) => ({
        forms: state.forms,
        activeFormId: state.activeFormId,
      }),
    }
  )
);

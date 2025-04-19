import { t, type TFunction } from 'i18next';
import slug from "slug";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AvailableLanguage, FormData } from '~/types';

interface FormStoreState {
  activeFormId: string | null;
  forms: Record<string, FormData>;
  formData: FormData | null;
  setActiveForm: (formId: string) => void;
  resetActiveForm: () => void;
  setTitlesLanguage: (t: TFunction, lang: AvailableLanguage) => void;
  deleteForm: (formId: string) => void;
  formExists: (formId: string) => boolean;
  updateField: (
    field: keyof FormData,
    value: any,
    id?: string,
    subField?: string
  ) => void;
  createForm: (formName: string, initialData?: Partial<FormData>) => void;
}

export const useFormStore = create<FormStoreState>()(
  persist(
    (set, get) => ({
      activeFormId: null,
      forms: {},
      formData: null, // computed on setActiveForm

      createForm(formName, initialData = {}) {
        const formId = slug(formName);
        const newForm: FormData = {
          draft: formName,
          lang: 'en',
          croppedImage: null,
          name: '',
          email: '',
          birth_date: '',
          birth_place: '',
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
          titles: {
              personal_information: t('personalInformation.personal_information'),
              profile: t('personalInformation.profile'),
              work_experience: t('workExperience.work_experience'),
              education: t('education.education'),
              skills: t('skills.skills'),
              language: t('general.language'),
              interest: t('interest.interest'),
              other: t('otherExperience.other_experience_block')
          },
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

      formExists(formId) {
        return !!get().forms[formId];
      },      

      setActiveForm(formId) {
        const form = get().forms[formId];
        if (!form) return;

        set({
          activeFormId: formId,
          formData: form,
        });
      },

      resetActiveForm() {
        set({ activeFormId: null })
      },

      setTitlesLanguage(t, lang) {
        const formId = get().activeFormId;
        if (!formId) return;
        
        set((state) => {
          const form = state.forms[formId];
          if (!form) return {};

          let updatedForm = { ...form };
          updatedForm.lang = lang;
          updatedForm.titles.personal_information = t('personalInformation.personal_information');
          updatedForm.titles.profile = t('personalInformation.profile');
          updatedForm.titles.work_experience = t('workExperience.work_experience');
          updatedForm.titles.education = t('education.education');
          updatedForm.titles.skills = t('skills.skills');
          updatedForm.titles.language = t('general.language');
          updatedForm.titles.interest = t('interest.interest');
          updatedForm.titles.other = t('otherExperience.other_experience_block');

          return {
            forms: {
              ...state.forms,
              [formId]: updatedForm,
            },
            formData: updatedForm,
          };
        })
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
          } else if(!id && subField) {
            let d = updatedForm[field] as any;
            d[subField] = value;
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

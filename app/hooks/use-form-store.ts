import { create } from 'zustand';
import type { FormData } from '~/types';

interface FormStoreState {
    formData: FormData;
    updateField: (field: keyof FormData, value: any, id?: string, subField?: string) => void;
}

export const useFormStore = create<FormStoreState>((set) => ({
    formData: {
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
        custom_experiences: []
    },
    updateField(field: keyof FormData, value: any, id?: string, subField?: string) {
        set((state) => {
            if (id && subField) {
                const arr = state.formData[field] as Array<any>;
                const index = arr.findIndex((item) => item.id === id);
    
                if (index === -1) return {}; // no update if item not found
    
                const updatedItem = { ...arr[index], [subField]: value };
    
                // Only update the changed item
                const updatedArray = [...arr];
                updatedArray[index] = updatedItem;
    
                return {
                    formData: {
                        ...state.formData,
                        [field]: updatedArray,
                    },
                };
            }
    
            return {
                formData: {
                    ...state.formData,
                    [field]: value,
                },
            };
        });
    }    
}));
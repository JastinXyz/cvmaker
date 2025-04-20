export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    location: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    present: boolean;
    description: string;
}

export interface Education {
    id: string;
    name: string;
    degree: string;
    location: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    description: string;
}

export interface Skills {
    id: string;
    name: string;
    level: string;
}

export interface Language {
    id: string;
    name: string;
    level: string;
}

export interface Interest {
    id: string;
    name: string;
}

export interface OtherExperience {
    id: string;
    category: string;
    year?: string;
    elaboration: string;
}

export interface CustomExperience {
    id: string;
    title: string;
    description: string;
}

export type AvailableLanguage = "en" | "id";
export interface FormData {
    draft: string;
    lang: AvailableLanguage;
    croppedImage: string | null;
    name: string;
    email: string;
    birth_date: string;
    birth_place: string;
    phone: string;
    linkedin: string;
    website: string;
    address: string;
    short_description: string;
    work_experience: Array<WorkExperience>;
    education: Array<Education>;
    skills: Array<Skills>;
    languages: Array<Language>;
    interest: Array<Interest>;
    other_experiences: Array<OtherExperience>;
    custom_experiences: Array<CustomExperience>;
    titles: {
        personal_information: string;
        profile: string;
        work_experience: string;
        education: string;
        skills: string;
        language: string;
        interest: string;
        other: string;
    }
}

export interface PDFDetail { 
    title: string, 
    value?: string, 
    case?: 'lowercase' | 'uppercase' | 'capitalize' | 'none'; 
}

export interface TemplateParam {
    activeFormId?: string;
}
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '~/components/ui/select'
import { useFormStore } from '~/hooks/use-form-store';
import type { AvailableLanguage } from '~/types';

export default function MakerLanguage() {
    const { t, i18n } = useTranslation();
    const { formData, setTitlesLanguage } = useFormStore();

    const changeLanguage = (x: AvailableLanguage) => {
      i18n.changeLanguage(x).then(() => {
        setTitlesLanguage(t, i18n.language as AvailableLanguage);
      });
    }

    useEffect(() => {
      i18n.changeLanguage(formData?.lang)
    }, [formData?.lang]);

    if(!formData?.lang || i18n.language !== formData.lang) return <>loading...</>

    return (
        <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
          <SelectTrigger>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="id">Bahasa Indonesia</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
    )
}
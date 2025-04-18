import { useTranslation } from 'react-i18next';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '~/components/ui/select'
  

export default function MakerLanguage() {
    const { i18n } = useTranslation();
    return (
        <Select onValueChange={(x) => i18n.changeLanguage(x)} defaultValue={i18n.language}>
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
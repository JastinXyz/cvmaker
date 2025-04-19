import { useFormStore } from "~/hooks/use-form-store"
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

let templates = [
    { name: "Berkeley", path: "/template/berkeley" },
]

export default function MakerTemplate() {
    const { activeFormId } = useFormStore();
    return (
        <div className="grid grid-cols-2 gap-2">
            {templates.map((x, idx) => (
                <div key={idx}>
                    <a href={x.path + `?draft=${activeFormId}`} target="_blank">
                        <iframe src={x.path + `?draft=${activeFormId}`} className="w-56 h-64"></iframe>
                        <Button variant={'neutral'} className="w-56 mt-2">{x.name} <ExternalLink /></Button>
                    </a>
                </div>
            ))}
        </div>
    )
}
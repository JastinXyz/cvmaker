import { useFormStore } from "~/hooks/use-form-store"
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import PdfExport from "../pdf-export";
import { Otago } from "~/pages/template/otago";
import { Simple } from "~/pages/template/simple";
import { Berkeley } from "~/pages/template/berkeley";

let templates = [
    { name: "Simple", path: "/template/simple", document: Simple },
    { name: "Berkeley", path: "/template/berkeley", document: Berkeley },
    { name: "Otago", path: "/template/otago", document: Otago },
]

export default function MakerTemplate() {
    const { activeFormId, formData } = useFormStore();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 space-y-2">
            {templates.map((x, idx) => (
                <div key={idx} className="flex justify-center">
                    <div>
                        <iframe src={x.path + `?draft=${activeFormId}`} className="w-56 h-64"></iframe>
                        <PdfExport document={<x.document activeFormId={activeFormId!} />} filename={`${formData?.draft}-${x.name}.pdf`} downloadDisplay={x.name} download />
                        {/* <Dialog>
                            <DialogTrigger asChild>
                              <Button variant={'neutral'} className="w-56 mt-2">{x.name} <ExternalLink /></Button>
                            </DialogTrigger>
                            <DialogContent className="flex gap-2">
                                <iframe src={x.path + `?draft=${activeFormId}`} className="w-56 h-64"></iframe>
                                <PdfExport document={<x.document activeFormId={activeFormId!} />} filename={`${formData?.draft}-${x.name}.pdf`} download />
                            </DialogContent>
                        </Dialog> */}
                    </div>
                </div>
            ))}
        </div>
    )
}
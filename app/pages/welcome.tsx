import { Link, redirect, useNavigate } from "react-router";
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useFormStore } from "~/hooks/use-form-store";
import slug from "slug";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Footer from "~/components/footer";

export function Welcome() {
  const { i18n } = useTranslation();
  const { createForm, forms, deleteForm, resetActiveForm } = useFormStore();
  const [draftName, setDraftName] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    resetActiveForm();
    i18n.changeLanguage("en");
  }, [])

  return (
    <Card className="w-full min-[300px]:w-72 min-[364px]:w-80 min-[444px]:w-96 sm:w-[34rem]">
      <CardHeader>
        <CardTitle>Resume Maker</CardTitle>
        <CardDescription>
          Your draft is stored locally.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {Object.entries(forms).map(([id, form]) => (
              <div className="flex gap-2 items-center">
                <Button variant={'neutral'} className="w-40 min-[300px]:w-full" size={'sm'} asChild>
                  <Link to={`/app?draft=${id}`}>
                    <p className="truncate">{form.draft ? form.draft : 'Untitled'} {form.name ? <span className="text-xs">- {form.name}</span> : ''}</p>
                  </Link>
                </Button>
                <Button onClick={() => deleteForm(id)} variant={'danger'} size={'sm'}><Trash2 className="w-5 h-5" /></Button>
              </div>
          ))}
        </div>
        {!Object.entries(forms).length && (
          <div className="text-center text-xs">No drafts found.</div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                New Draft
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Draft Name</Label>
                  <Input id="name" name="name" placeholder="Something cool" value={draftName} onChange={(e) => setDraftName(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="neutral">Cancel</Button>
                </DialogClose>
                <Button onClick={() => {
                  let slugifyDraft = slug(draftName as string);

                  createForm(draftName as string);
                  navigate(`/app?draft=${slugifyDraft}`)
                }} disabled={!draftName}>Continue</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
        
        <Footer />
      </CardFooter>
    </Card>
  );
}

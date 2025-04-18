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
import slugify from "slugify";
import { useEffect, useState } from "react";

/** @ts-ignore */
import unslugify from "unslugify";
import { Trash2 } from "lucide-react";

export function Welcome() {
  const { createForm, forms, deleteForm  } = useFormStore();
  const [draftName, setDraftName] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(Object.entries(forms))
  }, [forms])

  return (
    <Card className="w-[34rem]">
      <CardHeader>
        <CardTitle>Your Draft</CardTitle>
        <CardDescription>
          Your draft is stored locally.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {Object.entries(forms).map(([id, form]) => (
              <div className="flex gap-2 items-center">
                <Button variant={'neutral'} className="w-full" size={'sm'} asChild>
                  <Link to={`/app?draft=${id}`}>
                    {unslugify(id)} {form.name ? <span className="text-xs">- {form.name}</span> : ''}
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
                  let slugifyDraft = slugify(draftName as string);

                  createForm(slugifyDraft);
                  navigate(`/app?draft=${slugifyDraft}`)
                }} disabled={!draftName}>Continue</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>

      </CardFooter>
    </Card>
  );
}

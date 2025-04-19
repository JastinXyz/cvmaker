import { CalendarIcon, Settings, UploadCloudIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useCallback, useRef, useState } from "react";
import Cropper from 'react-easy-crop'
import { getCroppedImg } from "~/lib/get-cropped-img";
import { useFormStore } from "~/hooks/use-form-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from 'date-fns'
import { Calendar } from "../ui/calendar";

export default function MakerPersonal() {
  const { formData, updateField } = useFormStore();
  const { t } = useTranslation();
  
  return (
    <>
      <div className="grid grid-cols-5">
        <div className="col-span-2">
          <InputAvatar />
        </div>
        <div className="col-span-3 flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" required>{t('general.name')}</Label>
            <Input
              id="name"
              type="text"
              value={formData?.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" required>{t('personalInformation.email_address')}</Label>
            <Input
              id="email"
              type="email"
              value={formData?.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="johndoe@example.com"
            />
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-2">
            <Label htmlFor="birth_place">{t('personalInformation.birth_place')}</Label>
            <Input
              id="birth_place"
              type="text"
              value={formData?.birth_place}
              onChange={(e) => updateField('birth_place', e.target.value)}
              placeholder="Jakarta"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="birth_date">{t('personalInformation.birth_date')}</Label>
            <Input
              id="birth_date"
              type="date"
              className="block"
              value={formData?.birth_date ? format(formData.birth_date, "yyyy-MM-dd") : ''}
              onChange={(e) => updateField('birth_date', e.target.value ? new Date(e.target.value) : '')}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">{t('personalInformation.phone_number')}</Label>
          <Input
            id="phone"
            type="text"
            value={formData?.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+6281234567890"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-2">
            <Label htmlFor="linkedin">Linkedin Profile URL</Label>
            <Input
              id="linkedin"
              type="text"
              value={formData?.linkedin}
              onChange={(e) => updateField('linkedin', e.target.value)}
              placeholder="linkedin.com/xxxxxxx"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">{t('personalInformation.website')}</Label>
            <Input
              id="website"
              type="text"
              value={formData?.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">{t('personalInformation.address')}</Label>
          <Input
            id="address"
            type="text"
            value={formData?.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Jl. Example No. 123, Jakarta"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="short_description">{t('general.description')}</Label>
          <Textarea 
            id="short_description" 
            value={formData?.short_description}
            onChange={(e) => updateField('short_description', e.target.value)}
            placeholder="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur placeat perspiciatis dolorum dignissimos possimus voluptatem excepturi, doloremque esse corrupti hic." />
        </div>
      </div>
    </>
  )
}

function InputAvatar() {
    const inputImageRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const { formData, updateField } = useFormStore();

    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          const imageDataUrl = await readFile(file);
          setImageSrc(imageDataUrl);
        }
    };

    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.addEventListener("load", () => resolve(reader.result as string));
          reader.readAsDataURL(file);
        });
    };

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    }, []);
  
    const showCroppedImage = useCallback(async () => {
      try {
        const croppedBlobUrl = await getCroppedImg(imageSrc!, croppedAreaPixels);
        const blob = await fetch(croppedBlobUrl).then((res) => res.blob());
        const base64 = await blobToBase64(blob);

        updateField('croppedImage', base64)
        setOpenImageDialog(false);
        setImageSrc(null);
      } catch (e) {
        console.error(e);
      }
    }, [imageSrc, croppedAreaPixels]);

    const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    return (
        <>
          <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
              <DialogTrigger asChild>
                {formData?.croppedImage ? (
                  <img
                    src={formData?.croppedImage}
                    alt="Avatar"
                    className="w-38 h-38 rounded border-2"
                  />
                ) : (
                  <button className="rounded border-2 w-38 h-38 flex flex-col justify-center items-center text-xs">
                      <UploadCloudIcon />
                      <p>{t('upload.upload_image')}</p>
                  </button>
                )}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('upload.upload_image')}</DialogTitle>
                </DialogHeader>
                <div>
                  <input
                      ref={inputImageRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="hidden"
                  />
                  {imageSrc ? (
                      <div className="relative w-full h-[300px] border-dashed border-2 rounded">
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                        />
                      </div>
                  ) : (
                    <button onClick={() => inputImageRef.current?.click()} className="w-full border-dashed border-2 rounded p-6 flex flex-col justify-center items-center text-xs">
                      <UploadCloudIcon />
                      <p>{t('upload.click_to_upload')}</p>
                    </button>
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="neutral" onClick={() => {
                      updateField('croppedImage', null)
                      setImageSrc(null)
                    }}>{t('navigation.clear')}</Button>
                  </DialogClose>
                  <Button onClick={showCroppedImage} disabled={!imageSrc}>{t('navigation.save')}</Button>
                </DialogFooter>
              </DialogContent>
          </Dialog>
        </>
    )
}

export function MakerPersonalSetting() {
  const { t } = useTranslation();
  const { formData, updateField } = useFormStore();

  return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'neutral'} className="w-10 h-8">
              <Settings />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-col gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">{t('general.title')}</Label>
                <Input id="name" name="name" placeholder="About Me" value={formData?.titles.personal_information} onChange={(e) => updateField('titles', e.target.value, undefined, 'personal_information')} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="profile">{t('general.title')} {t('personalInformation.profile')}</Label>
                <Input id="profile" name="profile" placeholder="My Profile" value={formData?.titles.profile} onChange={(e) => updateField('titles', e.target.value, undefined, 'profile')} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="neutral">{t('navigation.close')}</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  )
}
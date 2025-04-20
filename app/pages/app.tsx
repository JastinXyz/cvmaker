import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import MakerEducation, { MakerEducationSetting } from "~/components/maker/education";
import MakerExperience from "~/components/maker/experience";
import MakerLanguage from "~/components/maker/language";
import MakerPersonal, { MakerPersonalSetting } from "~/components/maker/personal";
import MakerTemplate from "~/components/maker/template";
import MakerWork, { MakerWorkSetting } from "~/components/maker/work";
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { useFormStore } from "~/hooks/use-form-store";

export function AppPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, setActiveForm, formExists } = useFormStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const steps = [
    {
        title: t('general.cv_language'),
        component: <MakerLanguage />,
    },
    {
        title: formData?.titles.personal_information,
        component: <MakerPersonal />,
        setting: <MakerPersonalSetting />
    },
    {
        title: formData?.titles.work_experience,
        component: <MakerWork />,
        setting: <MakerWorkSetting />
    },
    {
        title: formData?.titles.education,
        component: <MakerEducation />,
        setting: <MakerEducationSetting />
    },
    {
        title: t('otherExperience.other_experience'),
        component: <MakerExperience />
    },
    {
        title: "Template",
        component: <MakerTemplate />
    }
  ]

  useEffect(() => {
    let draftId = searchParams.get('draft') as string;

    if (formExists(draftId)) {
      setActiveForm(draftId);
    } else {
      navigate('/');
    }
  }, [])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/')
    }
  }
  
  return (
    //min-[322px]:w-72
    <Card className="w-full min-[364px]:w-80 min-[444px]:w-96 sm:w-[34rem]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {steps[currentStep].title}
          {steps[currentStep].setting && steps[currentStep].setting}
        </CardTitle>
      </CardHeader>
      <CardContent>
          {steps[currentStep].component}
      </CardContent>
      <CardFooter className="flex flex-col sm:gap-0 gap-2 sm:flex-row justify-between items-center">
        <Button onClick={prevStep} size={'sm'} className="mr-2 sm:w-auto w-full">
            {t('navigation.back')}
        </Button>
        <Button onClick={nextStep} size={'sm'} className="mr-2 sm:w-auto w-full" disabled={currentStep === steps.length - 1 || (currentStep !== 0 && (formData?.name === '' || formData?.email === ''))}>
            {t('navigation.continue')}
        </Button>
      </CardFooter>
    </Card>
  );
}

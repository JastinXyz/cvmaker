import { useState } from "react";
import { useTranslation } from "react-i18next";
import MakerEducation from "~/components/maker/education";
import MakerExperience from "~/components/maker/experience";
import MakerLanguage from "~/components/maker/language";
import MakerPersonal from "~/components/maker/personal";
import MakerWork from "~/components/maker/work";
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export function AppPage() {
  const { t } = useTranslation();

  const steps = [
    {
        title: t('language'),
        component: <MakerLanguage />,
    },
    {
        title: t('personal_information'),
        component: <MakerPersonal />
    },
    {
        title: t('work_experience'),
        component: <MakerWork />
    },
    {
        title: t('education'),
        component: <MakerEducation />
    },
    {
        title: t('other_experience'),
        component: <MakerExperience />
    },
  ]

  const [currentStep, setCurrentStep] = useState(0);
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }
  
  return (
    <Card className="w-[34rem]">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
      </CardHeader>
      <CardContent>
          {steps[currentStep].component}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={prevStep} size={'sm'} className="mr-2" disabled={currentStep === 0}>
            {t('back')}
        </Button>
        <Button onClick={nextStep} size={'sm'} disabled={currentStep === steps.length - 1}>
            {t('continue')}
        </Button>
      </CardFooter>
    </Card>
  );
}

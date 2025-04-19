import { useEffect, useState } from 'react';
import type { ComponentType, ReactElement, JSXElementConstructor } from 'react';
import type { DocumentProps, PDFViewerProps } from '@react-pdf/renderer';
import { useFormStore } from '~/hooks/use-form-store';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function PDFViewerWrapper({ children }: { children: ReactElement<DocumentProps, string | JSXElementConstructor<any>> }) {
  const [PDFViewer, setPDFViewer] = useState<ComponentType<PDFViewerProps> | null>(null);
  const { formData, setActiveForm, formExists } = useFormStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    import('@react-pdf/renderer').then((mod) => {
      setPDFViewer(() => mod.PDFViewer);
    });

    let draftId = searchParams.get('draft') as string;  

    if (formExists(draftId)) {
      setActiveForm(draftId);
    } else {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    i18n.changeLanguage(formData?.lang)
  }, [formData?.lang]);

  if (!formData?.lang || i18n.language !== formData.lang) return null;
  if (!PDFViewer) return null;

  return (
    <main className='w-screen h-screen'>
        <div className="h-full flex-1">
            <PDFViewer showToolbar={false} className="size-full">
                {children}
            </PDFViewer>
        </div>
    </main>
  );
}

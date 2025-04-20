import { useEffect, useRef, useState } from 'react';
import { useFormStore } from '~/hooks/use-form-store';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Download, Loader } from 'lucide-react';
import { Button } from './ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "/js/pdf.worker.min.js",
  import.meta.url
).toString();

type Props = {
  document: any;
  download?: boolean;
  downloadDisplay?: string;
  filename?: string;
  isLoading?: boolean;
  className?: React.CSSProperties | string;
};

const LoadingScreen = () => (
  <div className="pt-10">
    <Loader color="default" />
  </div>
);

const PdfExport = (props: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [BlobProvider, setBlobProvider] = useState<any>(null);
  const { formData, setActiveForm, formExists } = useFormStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>(0);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    import('@react-pdf/renderer').then((mod) => {
      setBlobProvider(() => mod.BlobProvider);
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
  if(!BlobProvider) return null;

  return (
    <div id="pdf" ref={parentRef} className={props.className + ""}>
      <BlobProvider document={props.document}>
        {({ blob, url, loading, error }: any) =>
          loading ? (
            <LoadingScreen />
          ) : (
            <>
              {props.download ? (
                <Button variant={'neutral'} className='w-full mt-2' asChild>
                  <a
                    href={url!}
                    download={props.filename || "cvmaker.pdf"}
                  >
                    {props.downloadDisplay || "Download PDF"} <Download />
                  </a>
                </Button>
              ) : (
                <Document file={url} onLoadSuccess={({ numPages }) => setNumPages(numPages)} loading={loading ? <LoadingScreen /> : null}>
                  {Array.from(new Array(numPages), (_, index) => (
                    <>
                      <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          width={parentRef.current?.clientWidth}
                      />
                    </>
                  ))}
                </Document>
              )}
            </>
          )
        }
      </BlobProvider>
    </div>
  );
};

export default PdfExport;

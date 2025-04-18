import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function QuillEditor({ value = "", onChange }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState(value);
  const [debounceValue] = useDebounce(text, 500);

  useEffect(() => {
    if (quillInstanceRef.current && quillInstanceRef.current.root.innerHTML !== value) {
      quillInstanceRef.current.root.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    onChange(debounceValue)
  }, [debounceValue])

  useEffect(() => {
    if (!editorRef.current) return;

    let isMounted = true;

    import('quill').then((QuillModule) => {
      if (!isMounted) return;

      const Quill = QuillModule.default;

      const instance = new Quill(editorRef.current!, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
          ],
        },
      });

      instance.root.innerHTML = value;

      instance.on('text-change', () => {
        const html = instance.root.innerHTML;
        setText(html);
      });

      quillInstanceRef.current = instance;
      setLoaded(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className='h-24 mb-12'>
      {!loaded && <p>Loading editor...</p>}
      <div ref={editorRef} />
    </div>
  );
}

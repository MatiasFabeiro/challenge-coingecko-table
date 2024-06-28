import { useRef, useEffect, useState } from 'react';
import { EditorView, EditorState, basicSetup } from "@codemirror/basic-setup";
import AppSourceCode from './AppSourceCode.txt';

const ComponentCodeEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await fetch(AppSourceCode);
        const fetchedCode = await response.text();
        setCode(fetchedCode);
      } catch (error) {
        console.error('Error fetching source code:', error);
      }
    };

    fetchCode();
  }, []);

  useEffect(() => {
    if (editorRef.current && code) {
      const state = EditorState.create({
        doc: code,
        extensions: [basicSetup],
      });

      const view = new EditorView({
        state,
        parent: editorRef.current,
      });

      return () => {
        view.destroy();
      };
    }
  }, [code]);

  return <div ref={editorRef} className="border border-gray-300 rounded-lg shadow-md"/>;
};

export default ComponentCodeEditor;
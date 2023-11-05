import Editor, { monaco } from "@monaco-editor/react";
import React, { useState, useEffect } from "react";
import "./CodeEditorWindow.css";

const CodeEditorWindow = ({
  handleEditorContentChange,
  onChange,
  language,
  code,
  theme,
}) => {
  const [editorContent, setEditorContent] = useState(code || "");

  const handleEditorChange = (newEditorContent) => {
    setEditorContent(newEditorContent);
    handleEditorContentChange(editorContent);
    onChange("code", editorContent);
  };

  const handleEditorMount = (editor, monaco) => {
    let decorations = []; // Store decoration ids

    editor.onDidChangeModelContent(() => {
      // Remove previous decorations
      decorations = editor.deltaDecorations(decorations, []);

      // Add new decorations
      decorations = editor.deltaDecorations([], [
        {
          range: new monaco.Range(2, 1, 2, Number.MAX_VALUE),
          options: { inlineClassName: "myInlineDecoration" },
        },
      ]);
    });
  };


  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "python"}
        value={editorContent}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
        onMount={handleEditorMount}
      />
    </div>
  );
};

export default CodeEditorWindow;

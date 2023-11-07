import Editor, { monaco } from "@monaco-editor/react";
import React, { useState, useEffect } from "react";
import "./CodeEditorWindow.css";

let editorContentPersistent = `/* Harvest AI editor. Write your code here. */
print("Hello World")
`;

const CodeEditorWindow = ({
  handleEditorContentChange,
  onChange,
  language,
  code,
  theme,
}) => {

  useEffect(() => { 
    handleEditorContentChange(editorContentPersistent);
  }, []);

  const handleEditorChange = (newEditorContent) => {
    editorContentPersistent = newEditorContent;
    // Notify Landing that editor content has changed
    handleEditorContentChange(editorContentPersistent);
    //onChange("code", editorContent);
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
        value={editorContentPersistent}
        theme={theme}
        defaultValue={editorContentPersistent}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
      />
    </div>
  );
};

export default CodeEditorWindow;

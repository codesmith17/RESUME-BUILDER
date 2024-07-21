import React, { useState, useEffect } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnStrikeThrough,
  Toolbar,
  BtnUnderline,
  Editor,
  BtnNumberedList,
  EditorProvider,
  Separator,
} from "react-simple-wysiwyg";

const RichTextEditor = React.memo(
  ({ onRichTextEditorChange, index, defaultValue, name }) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    const handleChange = (e) => {
      const newValue = e.target.value;
      setValue(newValue);
      onRichTextEditorChange(newValue, name, index);
    };

    return (
      <EditorProvider>
        <Editor value={value} onChange={handleChange}>
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    );
  }
);

export default RichTextEditor;

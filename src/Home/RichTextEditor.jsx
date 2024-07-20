import { useScroll } from "framer-motion";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Brain } from "lucide-react";
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

const RichTextEditor = ({ onRichTextEditorChange, index, defaultValue }) => {
  const [value, setValue] = useState();
  return (
    <div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e);
          }}
        >
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
    </div>
  );
};

export default RichTextEditor;

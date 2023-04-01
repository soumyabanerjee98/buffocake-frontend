import React, { useState } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
// @ts-ignore
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export type RTEditorProps = {
  editorClassName: string;
  wrapperClassName: string;
  text: string;
  setText: any;
};
const RTEditor = (props: RTEditorProps) => {
  const { editorClassName, wrapperClassName, text, setText } = props;
  const initialValue = (html: any) => {
    const blocksFromHtml = htmlToDraft(html);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    const editorState = EditorState.createWithContent(contentState);
    return editorState;
  };
  const [editorText, setEditorText] = useState({
    fieldState: initialValue(text),
    value: "",
  });
  const onEditorStateChange = (e: any) => {
    const rawContentState = convertToRaw(e.getCurrentContent());
    const markup = draftToHtml(rawContentState);
    setEditorText((prev: any) => {
      return { ...prev, fieldState: e, value: markup };
    });
    setText((prev: any) => {
      return { ...prev, description: markup };
    });
  };
  return (
    <div className={`${wrapperClassName} editor`}>
      <Editor
        editorState={editorText?.fieldState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: ["inline"],
          inline: {
            inDropdown: false,
            options: ["bold", "italic", "underline"],
          },
        }}
        editorClassName={`${editorClassName} rt-editor`}
      />
    </div>
  );
};

export default RTEditor;

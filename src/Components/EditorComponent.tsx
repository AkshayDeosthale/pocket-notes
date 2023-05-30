import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ItemType } from "./TopTabs";

type Props = {};

const EditorComponent = (props: Props) => {
  const [editorData, seteditorData] = useState<any>();
  let { id } = useParams();

  const handlesave = () => {
    const storageData = JSON.parse(localStorage.getItem("app_config")!);
    const index = storageData?.findIndex(
      (obj: any) => obj.key === editorData.key
    );
    if (index) {
      const combinedData = storageData?.slice(index, 1, editorData);
      window.localStorage.setItem("app_config", JSON.stringify(combinedData));
    } else {
      window.localStorage.setItem(
        "app_config",
        JSON.stringify([...storageData, editorData])
      );
    }

    console.log({ editorData, storageData, index });
  };

  useEffect(() => {
    const handleKeyDown = function (event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault(); // Prevent the default browser save action
        // Perform the save operation here
        console.log("Save operation triggered");
        handlesave();
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let activetab = localStorage.getItem("activeTab");
    let storage: ItemType[] = JSON.parse(localStorage.getItem("app_config")!);
    let active = storage?.filter((store, index) => store.key === id);
    seteditorData(active[0]);
    console.log({ activetab, storage, active });
  }, [id]);

  return (
    <div className="document-editor">
      <CKEditor
        editor={DecoupledEditor}
        data={editorData?.content}
        onReady={(editor: any) => {
          // Insert the toolbar before the editable area.
          document.querySelector("#editor");
          editor.ui
            .getEditableElement()
            .parentElement.insertBefore(
              editor.ui.view.toolbar.element,
              editor.ui.getEditableElement()
            );
        }}
        onError={(error: any, { willEditorRestart }: any) => {
          // If the editor is restarted, the toolbar element will be created once again.
          // The `onReady` callback will be called again and the new toolbar will be added.
          // This is why you need to remove the older toolbar.
          if (willEditorRestart) {
            // this.editor.ui.view.toolbar.element.remove();
          }
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          seteditorData({ ...editorData, content: data });
          //   console.log({ event, editor, data });
        }}
        onBlur={(event: any, editor: any) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event: any, editor: any) => {
          console.log("Focus.", editor);
        }}
      />
    </div>
  );
};

export default EditorComponent;

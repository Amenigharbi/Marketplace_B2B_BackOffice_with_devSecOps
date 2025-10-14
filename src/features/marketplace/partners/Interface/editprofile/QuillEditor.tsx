import { useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
const QuillEditor = () => {
  const [text, updateText] = useState("Write text");
  const quillRef = useRef(null);
  // quillRef.get
  let data = text;
  const handleChange = (e: any) => {
    console.log("quill updated ", e);
    data = e;
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "code-block"],
      ["clean"],
      [
        {
          imageResize: {
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
        },
      ],
    ],
  };

  return <div></div>;
};

export default QuillEditor;

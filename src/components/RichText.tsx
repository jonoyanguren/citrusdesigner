"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BiBold,
  BiItalic,
  BiListUl,
  BiListOl,
  BiSolidQuoteAltLeft,
} from "react-icons/bi";
import { TbH1, TbH2 } from "react-icons/tb";
import "./RichText.css";

interface RichTextProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export const RichText = ({ initialContent = "", onChange }: RichTextProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl h-full w-full focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="border rounded-lg border-gray-200 h-[500px] flex flex-col">
      <div className="flex flex-wrap gap-2 p-3 border-b border-gray-200 bg-gray-50">
        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Negrita"
          type="button"
        >
          <BiBold size={20} />
        </button>

        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Cursiva"
          type="button"
        >
          <BiItalic size={20} />
        </button>

        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }`}
          title="Título 1"
          type="button"
        >
          <TbH1 size={20} />
        </button>

        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          title="Título 2"
          type="button"
        >
          <TbH2 size={20} />
        </button>

        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Lista con viñetas"
          type="button"
        >
          <BiListUl size={20} />
        </button>

        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Lista numerada"
          type="button"
        >
          <BiListOl size={20} />
        </button>

        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("blockquote") ? "bg-gray-200" : ""
          }`}
          title="Cita"
          type="button"
        >
          <BiSolidQuoteAltLeft size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <EditorContent editor={editor} className="h-full p-4" />
      </div>
    </div>
  );
};

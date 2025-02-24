"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { Plugin } from "prosemirror-state";
import {
  BiBold,
  BiItalic,
  BiListUl,
  BiListOl,
  BiSolidQuoteAltLeft,
} from "react-icons/bi";
import { TbH1, TbH2 } from "react-icons/tb";
import "./RichText.css";
import React, { forwardRef } from "react";

const CustomImage = Image.extend({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop(view, event) {
              const hasFiles = event.dataTransfer?.files?.length;

              if (!hasFiles) return false;

              const images = Array.from(event.dataTransfer.files).filter(
                (file) => /image/i.test(file.type)
              );

              if (images.length === 0) return false;

              event.preventDefault();

              const { schema } = view.state;
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              images.forEach((image) => {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                  if (!coordinates?.pos || !readerEvent.target?.result) return;

                  const node = schema.nodes.image.create({
                    src: readerEvent.target.result,
                  });
                  const transaction = view.state.tr.insert(
                    coordinates.pos,
                    node
                  );
                  view.dispatch(transaction);
                };
                reader.readAsDataURL(image);
              });

              return true;
            },
            paste(view, event) {
              console.log("paste", event);
              const hasFiles = event.clipboardData?.files?.length;

              if (!hasFiles) return false;

              const images = Array.from(event.clipboardData.files).filter(
                (file) => /image/i.test(file.type)
              );

              if (images.length === 0) return false;

              event.preventDefault();

              const { schema } = view.state;

              images.forEach((image) => {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                  if (!readerEvent.target?.result) return;

                  const node = schema.nodes.image.create({
                    src: readerEvent.target.result,
                  });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                };
                reader.readAsDataURL(image);
              });

              return true;
            },
          },
        },
      }),
    ];
  },
});

interface RichTextProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  value?: string;
}

export const RichText = forwardRef<{ clearContent: () => void }, RichTextProps>(
  ({ initialContent = "", onChange, value }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        CustomImage.configure({
          inline: true,
          allowBase64: true,
        }),
      ],
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

    React.useEffect(() => {
      if (editor && value !== undefined) {
        editor.commands.setContent(value);
      }
    }, [editor, value]);

    // Exponemos un método para limpiar el editor
    React.useImperativeHandle(ref, () => ({
      clearContent: () => {
        editor?.commands.setContent("");
      },
    }));

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
  }
);

RichText.displayName = "RichText";

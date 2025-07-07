"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Plugin } from "prosemirror-state";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  BiBold,
  BiCollapse,
  BiExpand,
  BiItalic,
  BiLink,
  BiListOl,
  BiListUl,
  BiPaperclip,
  BiSolidQuoteAltLeft,
} from "react-icons/bi";
import { TbH1, TbH2 } from "react-icons/tb";
import "./RichText.css";

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
                if (image.size > 5 * 1024 * 1024) {
                  // 5MB limit
                  alert("Image too large. Maximum size is 5MB");
                  return;
                }

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
              const hasFiles = event.clipboardData?.files?.length;
              if (!hasFiles) return false;

              const images = Array.from(event.clipboardData.files).filter(
                (file) => /image/i.test(file.type)
              );

              if (images.length === 0) return false;
              event.preventDefault();

              const { schema } = view.state;

              images.forEach((image) => {
                if (image.size > 5 * 1024 * 1024) {
                  // 5MB limit
                  alert("Image too large. Maximum size is 5MB");
                  return;
                }

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

export interface RichTextHandle {
  getValue: () => string;
  clearContent: () => void;
  setContent: (content: string) => void;
}

export const RichText = forwardRef<RichTextHandle, RichTextProps>(
  ({ initialContent = "", onChange, value }, ref) => {
    const [bigArea, setBigArea] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const editor = useEditor({
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-600 hover:text-blue-800 underline",
          },
        }),
        CustomImage.configure({
          inline: true,
          allowBase64: true,
        }),
      ],
      content: value || initialContent,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-xl w-full focus:outline-none",
        },
      },
    });

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        if (!readerEvent.target?.result) return;

        const node = editor.schema.nodes.image.create({
          src: readerEvent.target.result,
        });
        const transaction = editor.state.tr.replaceSelectionWith(node);
        editor.view.dispatch(transaction);
      };
      reader.readAsDataURL(file);
    };

    React.useEffect(() => {
      if (editor && value !== undefined) {
        editor.commands.setContent(value);
      }
    }, [editor, value]);

    useImperativeHandle(ref, () => ({
      getValue: () => editor?.getHTML() || "",
      clearContent: () => {
        editor?.commands.setContent("");
      },
      setContent: (newContent: string) => {
        editor?.commands.setContent(newContent);
      },
    }));

    if (!editor) {
      return null;
    }

    const handleButtonMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleLinkSubmit = () => {
      if (linkUrl && editor) {
        if (editor.isActive("link")) {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: linkUrl })
            .run();
        } else {
          const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
          );
          if (selectedText) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
          } else {
            editor
              .chain()
              .focus()
              .insertContent(`<a href="${linkUrl}">${linkUrl}</a>`)
              .run();
          }
        }
        setLinkUrl("");
        setShowLinkModal(false);
      }
    };

    const removeLink = () => {
      if (editor) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      }
    };

    return (
      <div
        className={`border rounded-lg border-gray-200 flex flex-col ${
          bigArea ? "h-[500px]" : "h-[300px]"
        }`}
      >
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

          <button
            onMouseDown={handleButtonMouseDown}
            onClick={() => setShowLinkModal(true)}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive("link") ? "bg-gray-200" : ""
            }`}
            title="Insertar enlace"
            type="button"
          >
            <BiLink size={20} />
          </button>

          <button
            onMouseDown={handleButtonMouseDown}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Subir imagen"
            type="button"
          >
            <BiPaperclip size={20} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onMouseDown={handleButtonMouseDown}
            onClick={() => setBigArea(!bigArea)}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title={bigArea ? "Reducir" : "Expandir"}
            type="button"
          >
            {bigArea ? <BiCollapse size={20} /> : <BiExpand size={20} />}
          </button>
        </div>

        <EditorContent editor={editor} className="flex-1 overflow-y-auto p-4" />

        {/* Link Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Insertar enlace</h3>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://ejemplo.com"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLinkSubmit();
                  }
                  if (e.key === "Escape") {
                    setShowLinkModal(false);
                    setLinkUrl("");
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleLinkSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Insertar
                </button>
                <button
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkUrl("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                {editor?.isActive("link") && (
                  <button
                    onClick={() => {
                      removeLink();
                      setShowLinkModal(false);
                      setLinkUrl("");
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

RichText.displayName = "RichText";

export default RichText;

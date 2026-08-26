import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Pencil,
  RefreshCw,
  X,
} from 'lucide-react';

import { MarkdownMessage } from './MarkdownMessage';
import type { MessageModel } from './types';

interface MessageProps {
  message: MessageModel;
  isStreaming: boolean;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
  onEdit?: (content: string) => void;
  canEdit?: boolean;
}

export function Message({
  message,
  isStreaming,
  onRegenerate,
  canRegenerate = false,
  onEdit,
  canEdit = false,
}: MessageProps) {
  const isUser = message.role === 'user';

  const [isEditing, setIsEditing] =
    useState(false);

  const [editedContent, setEditedContent] =
    useState(message.content);

  function startEditing() {
    setEditedContent(message.content);
    setIsEditing(true);
  }

  function cancelEditing() {
    setEditedContent(message.content);
    setIsEditing(false);
  }

  function saveEditing() {
    const value = editedContent.trim();

    if (!value || !onEdit) return;

    onEdit(value);
    setIsEditing(false);
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`flex ${
        isUser
          ? 'justify-end'
          : 'justify-start'
      }`}
    >
      <div className="max-w-[70%]">
        <div
          className={`
            rounded-3xl
            px-6
            py-4
            leading-7
            whitespace-pre-wrap

            ${
              isUser
                ? 'bg-blue-500 text-white'
                : 'border border-blue-500/10 bg-[#141821] text-white'
            }
          `}
        >
          {isUser && isEditing ? (
            <div className="min-w-[280px]">
              <textarea
                value={editedContent}
                onChange={event =>
                  setEditedContent(
                    event.target.value,
                  )
                }
                autoFocus
                rows={3}
                className="
                  w-full
                  resize-none
                  bg-transparent
                  text-white
                  outline-none
                  placeholder:text-white/50
                "
              />

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={cancelEditing}
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    text-white/70
                    transition-all
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <X size={15} />
                  Cancelar
                </button>

                <button
                  onClick={saveEditing}
                  disabled={!editedContent.trim()}
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    bg-white/10
                    px-3
                    py-2
                    text-sm
                    text-white
                    transition-all
                    hover:bg-white/20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Check size={15} />
                  Salvar
                </button>
              </div>
            </div>
          ) : isUser ? (
            message.content
          ) : (
            <MarkdownMessage
              content={message.content}
              isStreaming={isStreaming}
            />
          )}
        </div>

        {isUser &&
          canEdit &&
          !isEditing && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={startEditing}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  text-slate-400
                  transition-all

                  hover:bg-blue-500/10
                  hover:text-white
                "
              >
                <Pencil size={15} />
                Editar
              </button>
            </div>
          )}

        {!isUser &&
          canRegenerate &&
          !isStreaming &&
          onRegenerate && (
            <button
              onClick={onRegenerate}
              className="
                mt-2
                flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                text-sm
                text-slate-400
                transition-all

                hover:bg-blue-500/10
                hover:text-white
              "
            >
              <RefreshCw size={15} />
              Regenerar
            </button>
          )}
      </div>
    </motion.div>
  );
}
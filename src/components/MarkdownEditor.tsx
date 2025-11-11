"use client";

import React, { useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Link, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder,
  rows = 10,
  disabled,
  className,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const applyFormatting = useCallback((prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    let newCursorPos = start + prefix.length;

    if (start !== end) {
      // Text is selected, wrap it
      newText = prefix + selectedText + suffix;
      newCursorPos = start + newText.length;
    } else {
      // No text selected, insert placeholder
      const placeholderText = 'text';
      newText = prefix + placeholderText + suffix;
      newCursorPos = start + prefix.length;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Restore cursor position after state update
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;
      }
    }, 0);
  }, [value, onChange]);

  const handleList = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = value.substring(0, start).split('\n');
    const lastLine = lines[lines.length - 1];
    
    // If the current line is empty or only whitespace, insert a list item marker
    if (!lastLine || lastLine.trim() === '') {
      applyFormatting('* ', '');
    } else {
      // If text exists on the line, insert a newline and then the marker
      applyFormatting('\n* ', '');
    }
  }, [applyFormatting, value]);

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => applyFormatting('**', '**')}
          disabled={disabled}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => applyFormatting('*', '*')}
          disabled={disabled}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => applyFormatting('`', '`')}
          disabled={disabled}
          aria-label="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={handleList}
          disabled={disabled}
          aria-label="Unordered List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => applyFormatting('[', '](url)')}
          disabled={disabled}
          aria-label="Link"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-t-none"
      />
    </div>
  );
};

export default MarkdownEditor;
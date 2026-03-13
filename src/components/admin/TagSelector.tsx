"use client";

import React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const NEWS_TAGS = [
  "Academic",
  "Welfare",
  "Events",
  "Notice",
  "Sports",
  "Elections",
  "Opportunities",
  "Announcement",
  "Policy",
];

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange }) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (tag: string) => {
    const normalizedTag = tag.toLowerCase();
    if (selectedTags.includes(normalizedTag)) {
      onChange(selectedTags.filter((t) => t !== normalizedTag));
    } else {
      onChange([...selectedTags, normalizedTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 rounded-xl border-brand-100 bg-white/50 focus:ring-brand-gold"
          >
            <span className="text-muted-foreground">
              {selectedTags.length > 0 
                ? `${selectedTags.length} tag(s) selected` 
                : "Select categories..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 rounded-xl shadow-2xl border-brand-100" align="start">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tag found.</CommandEmpty>
              <CommandGroup>
                {NEWS_TAGS.map((tag) => {
                  const normalized = tag.toLowerCase();
                  const isSelected = selectedTags.includes(normalized);
                  return (
                    <CommandItem
                      key={normalized}
                      value={normalized}
                      onSelect={() => handleSelect(normalized)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-brand-600",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tag}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="bg-brand-50 text-brand-700 border-brand-100 px-3 py-1 rounded-full flex items-center gap-1 capitalize"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
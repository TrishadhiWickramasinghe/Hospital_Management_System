'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AllergyTagInputProps {
  value: string[];
  onChange: (allergies: string[]) => void;
  placeholder?: string;
}

export function AllergyTagInput({ 
  value, 
  onChange, 
  placeholder = 'Enter allergy and press Enter' 
}: AllergyTagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
        setInputValue('');
      }
    }
  };

  const handleRemove = (allergy: string) => {
    onChange(value.filter((a) => a !== allergy));
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="rounded-lg border border-slate-300 px-3 py-2"
      />
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((allergy) => (
            <div
              key={allergy}
              className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
            >
              <span>{allergy}</span>
              <button
                type="button"
                onClick={() => handleRemove(allergy)}
                className="inline-flex items-center hover:opacity-75"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

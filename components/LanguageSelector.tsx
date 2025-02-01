"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  onLanguageSelect: (sourceLang: string, targetLang: string) => void;
}

export function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  const [open, setOpen] = useState(true);
  const [selectedLang, setSelectedLang] = useState<string>('tel');

  const { setLanguage } = useLanguage();

  const handleSelect = () => {
    const targetLang = selectedLang === 'tel' ? 'eng' : 'tel';
    onLanguageSelect(selectedLang, targetLang);
    setLanguage(selectedLang);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Your Language</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup
            defaultValue="tel"
            onValueChange={setSelectedLang}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tel" id="tel" />
              <Label htmlFor="tel">Telugu</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="eng" id="eng" />
              <Label htmlFor="eng">English</Label>
            </div>
          </RadioGroup>
          <Button onClick={handleSelect} className="w-full">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
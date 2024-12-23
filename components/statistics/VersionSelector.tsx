import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VersionSelectorProps {
  versions: string[];
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  getVersionLabel: (version: string) => string;
}

export function VersionSelector({ versions, selectedVersion, onVersionChange, getVersionLabel }: VersionSelectorProps) {
  return (
    <Select value={selectedVersion} onValueChange={onVersionChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select version" />
      </SelectTrigger>
      <SelectContent>
        {versions.map((version) => (
          <SelectItem key={version} value={version}>
            {getVersionLabel(version)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

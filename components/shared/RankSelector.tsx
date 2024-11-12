import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { RANK_OPTIONS } from '@/app/state/types/tekkenTypes';
  
  interface RankSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
  }
  
  export const RankSelector: React.FC<RankSelectorProps> = ({ value, onValueChange }) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select rank" />
      </SelectTrigger>
      <SelectContent>
        {RANK_OPTIONS.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
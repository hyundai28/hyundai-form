import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming you have Label from Shadcn; install if needed: npx shadcn-ui@latest add label

interface DateFiltersProps {
  startDate: string;
  endDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}

export function DateFilters({ startDate, endDate, onStartChange, onEndChange }: DateFiltersProps) {
  return (
    <>
      <div className="flex-1 w-full md:w-auto">
        <Label htmlFor="start-date">Data Inicial</Label>
        <Input id="start-date" type="date" value={startDate} onChange={(e) => onStartChange(e.target.value)} />
      </div>
      <div className="flex-1 w-full md:w-auto">
        <Label htmlFor="end-date">Data Final</Label>
        <Input id="end-date" type="date" value={endDate} onChange={(e) => onEndChange(e.target.value)} />
      </div>
    </>
  );
}
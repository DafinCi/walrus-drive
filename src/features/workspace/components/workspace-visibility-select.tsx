// src/features/workspace/components/workspace-visibility-select.tsx
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WorkspaceVisibilitySelect({
  value,
  onValueChange,
}: {
  value: "private" | "public";
  onValueChange: (v: "private" | "public") => void;
}) {
  return (
    <FormItem className="space-y-1.5">
      <FormLabel className="text-xs font-semibold text-foreground">
        Visibility Mode
      </FormLabel>
      <Select value={value} onValueChange={onValueChange}>
        <FormControl>
          <SelectTrigger className="bg-background border-input h-9 text-xs rounded-sm shadow-none">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="rounded-sm">
          <SelectItem value="private" className="rounded-none text-xs py-2">
            <span className="font-semibold block">Private</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              Restricted token-gated metadata access.
            </span>
          </SelectItem>
          <SelectItem value="public" className="rounded-none text-xs py-2">
            <span className="font-semibold block">Public</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              Openly indexable storage manifests.
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      <FormMessage className="text-[11px]" />
    </FormItem>
  );
}

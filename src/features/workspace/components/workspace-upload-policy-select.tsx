// src/features/workspace/components/workspace-upload-policy-select.tsx
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

export function WorkspaceUploadPolicySelect({
  value,
  onValueChange,
}: {
  value: "owner_only" | "admins_only" | "members_only" | "public";
  onValueChange: (v: any) => void;
}) {
  return (
    <FormItem className="space-y-1.5">
      <FormLabel className="text-xs font-semibold text-foreground">
        Upload Governance
      </FormLabel>
      <Select value={value} onValueChange={onValueChange}>
        <FormControl>
          <SelectTrigger className="bg-background border-input h-9 text-xs rounded-[6px] shadow-none">
            <SelectValue placeholder="Select upload policy" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="rounded-[6px]">
          <SelectItem
            value="members_only"
            className="text-xs py-1.5 rounded-none"
          >
            Members Only
          </SelectItem>
          <SelectItem
            value="admins_only"
            className="text-xs py-1.5 rounded-none"
          >
            Admins Only
          </SelectItem>
          <SelectItem
            value="owner_only"
            className="text-xs py-1.5 rounded-none"
          >
            Owner Only
          </SelectItem>
          <SelectItem value="public" className="text-xs py-1.5 rounded-none">
            Public Dropbox
          </SelectItem>
        </SelectContent>
      </Select>
      <FormMessage className="text-[11px]" />
    </FormItem>
  );
}

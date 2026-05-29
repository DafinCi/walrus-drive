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

interface UploadPolicySelectProps {
  value: "owner_only" | "admins_only" | "members_only" | "public";
  onValueChange: (
    value: "owner_only" | "admins_only" | "members_only" | "public",
  ) => void;
}

export function WorkspaceUploadPolicySelect({
  value,
  onValueChange,
}: UploadPolicySelectProps) {
  return (
    <FormItem>
      <FormLabel className="text-sm font-semibold">
        Governance Upload Policy
      </FormLabel>
      <Select value={value} onValueChange={onValueChange}>
        <FormControl>
          <SelectTrigger className="bg-background/50 border-muted-foreground/20">
            <SelectValue placeholder="Pilih kebijakan upload" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="members_only" className="py-2">
            <span className="font-medium">Anggota Saja (Members Only)</span>
          </SelectItem>
          <SelectItem value="admins_only" className="py-2">
            <span className="font-medium">Hanya Admin & Owner</span>
          </SelectItem>
          <SelectItem value="owner_only" className="py-2">
            <span className="font-medium">
              Hanya Pemilik Mutlak (Owner Only)
            </span>
          </SelectItem>
          <SelectItem value="public" className="py-2">
            <span className="font-medium">
              Terbuka untuk Umum (Public Dropbox Mode)
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </FormItem>
  );
}

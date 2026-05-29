// src/features/workspace/components/workspace-visibility-select.tsx
import {
  FormControl,
  FormDescription,
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

interface VisibilitySelectProps {
  value: "private" | "public";
  onValueChange: (value: "private" | "public") => void;
}

export function WorkspaceVisibilitySelect({
  value,
  onValueChange,
}: VisibilitySelectProps) {
  return (
    <FormItem>
      <FormLabel className="text-sm font-semibold">
        Workspace Visibility
      </FormLabel>
      <Select value={value} onValueChange={onValueChange}>
        <FormControl>
          <SelectTrigger className="bg-background/50 border-muted-foreground/20">
            <SelectValue placeholder="Pilih visibilitas" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="private" className="py-2.5">
            <div className="font-medium text-sm">🔒 Private Workspace</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hanya wallet yang terdaftar sebagai anggota yang bisa mengakses
              storage metadata.
            </p>
          </SelectItem>
          <SelectItem value="public" className="py-2.5">
            <div className="font-medium text-sm">🌐 Public Space</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Siapapun bisa melihat isi metadata file di platform. Cocok untuk
              open archive / verification.
            </p>
          </SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SettingTagForm from "./SettingTagForm";
import { SiteSetting } from "@/services/setting.service";

export default function SettingTagDialogForm({
  open,
  onOpenChange,
  domain,
  setting,
  onSaveSetting,
}: SettingTagDialogFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Setting tag</DialogTitle>
        </DialogHeader>
        {domain && setting && (
          <SettingTagForm
            domain={domain}
            setting={setting}
            onSaveSetting={onSaveSetting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface SettingTagDialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: string | null;
  setting: SiteSetting | null;
  onSaveSetting?: () => void;
}

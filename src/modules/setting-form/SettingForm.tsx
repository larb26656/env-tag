import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import Tag from "@/components/tag/Tag";
import { deleteByDomain, save, SiteSetting } from "@/services/setting.service";

interface SettingFormProps {
  domain: string;
  setting: SiteSetting;
  onRefreshSetting: () => void;
}

export default function SettingForm({
  domain,
  setting,
  onRefreshSetting,
}: SettingFormProps) {
  const [enabled, setEnabled] = useState(setting.enable);
  const [label, setLabel] = useState(setting.tag.label);
  const [backgroundColor, setBackgroundColor] = useState(
    setting.tag.backgroundColor
  );
  const [foregroundColor, setForegroundColor] = useState(
    setting.tag.foregroundColor
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    try {
      await save(domain, {
        enable: enabled,
        tag: {
          label: label,
          backgroundColor: backgroundColor,
          foregroundColor: foregroundColor,
        },
      });
    } catch (err) {
      setError("Failed to save setting");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteByDomain(domain);
      onRefreshSetting();
    } catch (err) {
      setError("Failed to delete setting");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="w-80 shadow-none border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="enable-toggle" className="font-medium">
            Enable
          </Label>
          <Switch
            id="enable-toggle"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="label" className="font-medium">
            Label
          </Label>
          <Textarea
            id="label"
            placeholder="Enter label here..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color-picker" className="font-medium">
            Background color
          </Label>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: backgroundColor }}
            />
            <input
              id="color-picker"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-9 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color-picker" className="font-medium">
            Foreground color
          </Label>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: foregroundColor }}
            />
            <input
              id="color-picker"
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="w-full h-9 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color-picker" className="font-medium">
            Preview
          </Label>
          <div className="flex items-center gap-3">
            <Tag
              label={label}
              backgroundColor={backgroundColor}
              foregroundColor={foregroundColor}
            ></Tag>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="px-3"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button onClick={handleSave} size="sm">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

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
import {
  deleteByDomain,
  Position,
  save,
  SiteSetting,
} from "@/services/setting.service";
import { useLoader } from "@/providers/loader.provider";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import classNames from "classnames";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";

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
  const [margin, setMargin] = useState(setting.tag.margin);
  const [position, setPosition] = useState(setting.tag.position);

  const loader = useLoader();

  async function handleSave() {
    loader.startLoading();
    try {
      await save(domain, {
        enable: enabled,
        tag: {
          label: label,
          backgroundColor: backgroundColor,
          foregroundColor: foregroundColor,
          margin: margin,
          position: position,
        },
      });
    } catch (err) {
      toast("Failed to save setting");
      console.error(err);
    } finally {
      loader.stopLoading();
    }
  }

  async function handleDelete() {
    loader.startLoading();
    try {
      await deleteByDomain(domain);
      onRefreshSetting();
    } catch (err) {
      toast("Failed to delete setting");
      console.error(err);
    } finally {
      loader.stopLoading();
    }
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
          <Input
            id="label"
            placeholder="Enter label"
            value={margin}
            onChange={(e) => setLabel(e.target.value)}
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
          <Label htmlFor="margin" className="font-medium">
            Margin
          </Label>
          <Input
            id="margin"
            placeholder="Enter margin"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Position</Label>
          <RadioGroup
            defaultValue={position}
            onValueChange={(value) => setPosition(value as Position)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Position.LT} id="position-lt" />
              <Label htmlFor="position-lt">Left Top (LT)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Position.RT} id="position-rt" />
              <Label htmlFor="position-rt">Right Top (RT)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Position.LB} id="position-lb" />
              <Label htmlFor="position-lb">Left Bottom (LB)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Position.RB} id="position-rb" />
              <Label htmlFor="position-rb">Right Bottom (RB)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color-picker" className="font-medium">
            Preview
          </Label>
          <div className="flex items-center bg-secondary gap-3">
            <Tag
              label={label}
              backgroundColor={backgroundColor}
              foregroundColor={foregroundColor}
              margin={margin}
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

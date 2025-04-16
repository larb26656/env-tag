import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Tag from "@/components/tag/Tag";
import { Position, save, SiteSetting } from "@/services/setting.service";
import { useLoader } from "@/providers/loader.provider";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RenderTagFrame from "@/components/tag/RenderTagFrame";

interface SettingFormProps {
  domain: string;
  setting: SiteSetting;
}

const formSchema = z.object({
  enabled: z.boolean(),
  label: z.string().nonempty(),
  backgroundColor: z.string().nonempty(),
  foregroundColor: z.string().nonempty(),
  margin: z.number(),
  position: z.nativeEnum(Position),
});

type FromSchema = z.infer<typeof formSchema>;

export default function SettingTagForm({ domain, setting }: SettingFormProps) {
  const {
    enabled,
    tag: { label, backgroundColor, foregroundColor, margin, position },
  } = setting;

  const form = useForm<FromSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: enabled,
      label: label,
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor,
      margin: margin,
      position: position,
    },
  });

  const loader = useLoader();

  async function handleSubmit(data: FromSchema) {
    const {
      enabled,
      label,
      backgroundColor,
      foregroundColor,
      margin,
      position,
    } = data;

    loader.startLoading();
    try {
      await save(domain, {
        enabled: enabled,
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

  function EnabledField() {
    return (
      <FormField
        control={form.control}
        name="enabled"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enable</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={field.disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function LabelField() {
    return (
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function BackgroundColorField() {
    return (
      <FormField
        control={form.control}
        name="backgroundColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Background color</FormLabel>
            <FormControl>
              <div className="flex items-center gap-3">
                <input type="color" {...field} />
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: field.value }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function ForegroundColorField() {
    return (
      <FormField
        control={form.control}
        name="foregroundColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Foreground color</FormLabel>
            <FormControl>
              <div className="flex items-center gap-3">
                <input type="color" {...field} />
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: field.value }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function MarginField() {
    return (
      <FormField
        control={form.control}
        name="margin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Margin</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function PositionField() {
    return (
      <FormField
        control={form.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-col space-y-2"
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function Display() {
    const values = useWatch({
      control: form.control,
      name: [
        "label",
        "backgroundColor",
        "foregroundColor",
        "margin",
        "position",
      ],
    });

    const [label, backgroundColor, foregroundColor, margin, position] = values;

    return (
      <>
        <Label htmlFor="color-picker" className="font-medium">
          Preview
        </Label>
        <div className="flex items-center bg-secondary gap-3 relative w-[200px] h-[200px]">
          <RenderTagFrame isHaveParent={true} position={position}>
            <Tag
              label={label}
              backgroundColor={backgroundColor}
              foregroundColor={foregroundColor}
              margin={margin}
            ></Tag>
          </RenderTagFrame>
        </div>
      </>
    );
  }

  function Footer() {
    return (
      <div className="flex justify-center gap-2">
        <Button type="submit" size="sm">
          Save
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <EnabledField />
        <LabelField />
        <BackgroundColorField />
        <ForegroundColorField />
        <MarginField />
        <Display />
        <PositionField />
        <Footer />
      </form>
    </Form>
  );
}

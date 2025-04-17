// --- UI Component ---
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Tag from "@/components/tag/Tag";
import { Position, save, SiteSetting } from "@/services/setting.service";
import { useLoader } from "@/providers/loader.provider";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useForm, useWatch, Control } from "react-hook-form";
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

export default function SettingTagForm({
  domain,
  setting,
  onSaveSetting,
}: SettingFormProps) {
  const {
    enabled,
    tag: { label, backgroundColor, foregroundColor, margin, position },
  } = setting;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled,
      label,
      backgroundColor,
      foregroundColor,
      margin,
      position,
    },
  });

  const loader = useLoader();

  async function handleSubmit(data: FormSchema) {
    loader.startLoading();
    try {
      await save(domain, {
        enabled: data.enabled,
        tag: {
          label: data.label,
          backgroundColor: data.backgroundColor,
          foregroundColor: data.foregroundColor,
          margin: data.margin,
          position: data.position,
        },
      });

      onSaveSetting && onSaveSetting();
    } catch (err) {
      toast("Failed to save setting");
      console.error(err);
    } finally {
      loader.stopLoading();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <EnabledField control={form.control} />
        <LabelField control={form.control} />
        <BackgroundColorField control={form.control} />
        <ForegroundColorField control={form.control} />
        <MarginField control={form.control} />
        <DisplayPreview control={form.control} />
        <PositionField control={form.control} />
        <Footer />
      </form>
    </Form>
  );
}

function EnabledField({ control }: { control: Control<FormSchema> }) {
  return (
    <FormField
      control={control}
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

function LabelField({ control }: { control: Control<FormSchema> }) {
  return (
    <FormField
      control={control}
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

function BackgroundColorField({ control }: { control: Control<FormSchema> }) {
  return (
    <FormField
      control={control}
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

function ForegroundColorField({ control }: { control: Control<FormSchema> }) {
  return (
    <FormField
      control={control}
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

function MarginField({ control }: { control: Control<FormSchema> }) {
  return (
    <FormField
      control={control}
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

function PositionField({ control }: { control: Control<FormSchema> }) {
  return (
    <FormField
      control={control}
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
              {[
                { label: "Left Top (LT)", value: Position.LT },
                { label: "Right Top (RT)", value: Position.RT },
                { label: "Left Bottom (LB)", value: Position.LB },
                { label: "Right Bottom (RB)", value: Position.RB },
              ].map(({ label, value }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`position-${value}`} />
                  <Label htmlFor={`position-${value}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DisplayPreview({ control }: { control: Control<FormSchema> }) {
  const values = useWatch({
    control,
    name: ["label", "backgroundColor", "foregroundColor", "margin", "position"],
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
          />
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

interface SettingFormProps {
  domain: string;
  setting: SiteSetting;
  onSaveSetting?: () => void;
}

const formSchema = z.object({
  enabled: z.boolean(),
  label: z.string().nonempty(),
  backgroundColor: z.string().nonempty(),
  foregroundColor: z.string().nonempty(),
  margin: z.number(),
  position: z.nativeEnum(Position),
});

type FormSchema = z.infer<typeof formSchema>;

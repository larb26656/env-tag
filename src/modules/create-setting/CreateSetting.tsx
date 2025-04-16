import { Button } from "@/components/ui/button";
import { useLoader } from "@/providers/loader.provider";
import { DEFAULT_TAG, save } from "@/services/setting.service";
import { toast } from "sonner";

interface CreateSettingProps {
  domain: string;
  onRefreshSetting: () => void;
}

export default function CreateSetting({
  domain,
  onRefreshSetting: onSettingCreated,
}: CreateSettingProps) {
  const loader = useLoader();

  async function handleCreate() {
    loader.startLoading();
    try {
      await save(domain, {
        enabled: true,
        tag: DEFAULT_TAG,
      });
      onSettingCreated();
    } catch (err) {
      toast("Failed to create setting");
      console.error(err);
    } finally {
      loader.stopLoading();
    }
  }

  return (
    <>
      <p>No setting found</p>

      <div className="flex justify-center">
        <Button size="sm" onClick={handleCreate}>
          Create
        </Button>
      </div>
    </>
  );
}

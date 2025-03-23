import { Button } from "@/components/ui/button";
import { save } from "@/services/setting.service";
import { useState } from "react";

interface CreateSettingProps {
  domain: string;
  onRefreshSetting: () => void;
}

export default function CreateSetting({
  domain,
  onRefreshSetting: onSettingCreated,
}: CreateSettingProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    try {
      await save(domain, {
        enable: true,
        tag: {
          label: "tag",
          backgroundColor: "#000000",
          foregroundColor: "#ffffff",
        },
      });
      onSettingCreated();
    } catch (err) {
      setError("Failed to create setting");
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

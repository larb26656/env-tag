import {
  deleteByDomain,
  getByDomain,
  SiteSetting,
} from "@/services/setting.service";
import { getCurrentTab } from "@/services/tab.service";
import { extractDomain, openNewTab } from "@/utils/url.utils";
import { useEffect, useState } from "react";
import CreateSetting from "@/components/setting-tab-form/CreateSetting";
import SettingTagForm from "@/components/setting-tab-form/SettingTagForm";
import DomainNavBar from "@/components/navigator/DomainNavBar";
import { Home, Trash } from "lucide-react";
import { useLoader } from "@/providers/loader.provider";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";

export default function HomePage() {
  const loader = useLoader();
  const [domain, setDomain] = useState<string | null>(null);
  const [currentSetting, setCurrentSetting] = useState<SiteSetting | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchInitData();
  }, []);

  async function fetchInitData() {
    setLoading(true);
    setDomain(null);
    setCurrentSetting(null);

    try {
      const currentTab = await getCurrentTab();
      const url = currentTab.url!;

      const domain = extractDomain(url);
      setDomain(domain);

      const currentSetting = await getByDomain(domain);
      if (currentSetting) {
        setCurrentSetting(currentSetting);
      }
    } catch (err) {
      setError("Failed to get current tab");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleHome() {
    openNewTab("home");
  }

  async function handleDelete() {
    setConfirmDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    if (!domain) {
      toast("No domain to delete");
      return;
    }

    loader.startLoading();
    try {
      await deleteByDomain(domain);
      fetchInitData();
    } catch (err) {
      toast("Failed to delete setting");
      console.error(err);
    } finally {
      loader.stopLoading();
    }
  }

  let content: React.ReactNode = null;

  if (loading) {
    content = <div>Loading...</div>;
  } else if (error) {
    content = <div>Error: {error}</div>;
  } else if (!domain) {
    content = <div>No active tab found.</div>;
  } else if (currentSetting) {
    content = <SettingTagForm domain={domain} setting={currentSetting} />;
  } else {
    content = (
      <CreateSetting domain={domain} onRefreshSetting={fetchInitData} />
    );
  }

  return (
    <>
      <DialogRegistry
        confirmDeleteOpen={confirmDeleteOpen}
        setConfirmDeleteOpen={setConfirmDeleteOpen}
        onConfirmDelete={handleConfirmDelete}
      />
      <div className="flex flex-col min-w-[350px] min-h-[500px]">
        <DomainNavBar
          domain={domain ?? "-"}
          menuItems={
            currentSetting
              ? [
                  {
                    icon: Home,
                    label: "Home",
                    onClick: handleHome,
                  },
                  {
                    icon: Trash,
                    label: "Delete",
                    onClick: () => handleDelete(),
                  },
                ]
              : [
                  {
                    icon: Home,
                    label: "Home",
                    onClick: handleHome,
                  },
                ]
          }
        />
        <div className="p-5">{content}</div>
      </div>
    </>
  );
}

function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      description={"Are you sure to delete?"}
      onConfirm={onConfirm}
    />
  );
}

function DialogRegistry({
  confirmDeleteOpen,
  setConfirmDeleteOpen,
  onConfirmDelete,
}: {
  confirmDeleteOpen: boolean;
  setConfirmDeleteOpen: (open: boolean) => void;
  onConfirmDelete: () => void;
}) {
  return (
    <>
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}

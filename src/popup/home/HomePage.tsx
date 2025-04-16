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

export default function HomePage() {
  const [domain, setDomain] = useState<string | null>(null);
  const [currentSetting, setCurrentSetting] = useState<SiteSetting | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loader = useLoader();

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

  async function handleDelete(domain: string) {
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
    <div className="flex flex-col min-w-[300px] min-h-[500px]">
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
                  onClick: () => handleDelete(domain!),
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
  );
}

import { getByDomain, SiteSetting } from "@/services/setting.service";
import { getCurrentTab } from "@/services/tab.service";
import { extractDomain } from "@/utils/url.utils";
import { useEffect, useState } from "react";
import CreateSetting from "./create-setting/CreateSetting";
import SettingForm from "./setting-form/SettingForm";
import SiteBar from "./SiteBar";

export default function HomePage() {
  const [domain, setDomain] = useState<string | null>(null);
  const [currentSetting, setCurrentSetting] = useState<SiteSetting | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  function RenderContent() {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!domain) {
      return <div>No active tab found.</div>;
    }

    if (!currentSetting) {
      return <CreateSetting domain={domain} onRefreshSetting={fetchInitData} />;
    }

    return (
      <SettingForm
        domain={domain}
        setting={currentSetting}
        onRefreshSetting={fetchInitData}
      />
    );
  }

  return (
    <div className="flex flex-col min-w-[300px] min-h-[500px]">
      <SiteBar site={domain || ""} />
      <div className="p-5">
        <RenderContent />
      </div>
    </div>
  );
}

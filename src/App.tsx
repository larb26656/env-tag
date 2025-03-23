// import { useState } from "react";
import { useEffect, useState } from "react";
import "./App.css";
import SettingForm from "@/modules/setting-form/SettingForm";
import { getByDomain, SiteSetting } from "@/services/setting.service";
import { getCurrentTab } from "@/services/tab.service";
import CreateSetting from "@/modules/create-setting/CreateSetting";
import { extractDomain } from "@/utils/url.utils";

function App() {
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
    return (
      <CreateSetting
        domain={domain}
        onRefreshSetting={fetchInitData}
      ></CreateSetting>
    );
  }

  return (
    <>
      <p>{domain}</p>
      <SettingForm
        domain={domain}
        setting={currentSetting}
        onRefreshSetting={fetchInitData}
      ></SettingForm>
    </>
  );
}

export default App;

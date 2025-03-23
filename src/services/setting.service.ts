const SITE_SETTING_KEY: string = "siteSetting";

export type Setting = Record<string, SiteSetting>;

export interface SiteSetting {
  tag: Tag;
  enable: boolean;
}

export interface Tag {
  label: string;
  backgroundColor: string;
  foregroundColor: string;
}

const storage = chrome.storage.local;

export async function get(): Promise<Setting> {
  const dataList = await storage.get(SITE_SETTING_KEY);
  const setting = dataList[SITE_SETTING_KEY] || {};

  return setting;
}

export async function getByDomain(
  domain: string
): Promise<SiteSetting | undefined> {
  const setting = await get();
  const data = setting[domain];

  return data;
}

export async function save(domain: string, data: SiteSetting): Promise<void> {
  const currentSettings = await get();
  currentSettings[domain] = data;

  await storage.set({ [SITE_SETTING_KEY]: currentSettings });
}

export async function deleteByDomain(domain: string): Promise<void> {
  const currentSettings = await get();
  delete currentSettings[domain];

  await storage.set({ [SITE_SETTING_KEY]: currentSettings });
}

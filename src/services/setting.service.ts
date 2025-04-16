const SITE_SETTING_KEY: string = "siteSetting";

export type Setting = Record<string, SiteSetting>;

export interface SiteSetting {
  tag: Tag;
  enabled: boolean;
}

export enum Position {
  LT = "LT",
  RT = "RT",
  LB = "LB",
  RB = "RB",
}

export interface Tag {
  label: string;
  backgroundColor: string;
  foregroundColor: string;
  margin: number;
  position: Position;
}

export const DEFAULT_TAG: Tag = {
  label: "tag",
  backgroundColor: "#000000",
  foregroundColor: "#ffffff",
  margin: 5,
  position: Position.LT,
};

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

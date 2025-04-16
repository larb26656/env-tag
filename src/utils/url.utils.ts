export function getCurrentDomain(): string {
  return window.location.origin;
}

export function extractDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch (error) {
    throw new Error("Invalid URL");
  }
}

export function openNewTab(url: string): void {
  const chromeUrl = chrome.runtime.getURL(`newtab.html#/${url}`);
  chrome.tabs.create({ url: chromeUrl });
}

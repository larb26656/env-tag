import React from "react";
import ReactDOM from "react-dom/client";
import "./content.css";
import Tag from "@/components/tag/Tag";
import { getByDomain, SiteSetting } from "@/services/setting.service";
import { getCurrentDomain } from "@/utils/url.utils";
import RenderTagFrame from "@/components/tag/RenderTagFrame";

async function getSiteSetting(): Promise<SiteSetting | undefined> {
  const domain = getCurrentDomain();
  return await getByDomain(domain);
}

function renderTag(setting: SiteSetting): void {
  const {
    tag: { label, backgroundColor, foregroundColor, margin, position },
  } = setting;
  const root = document.createElement("div");
  root.id = "app-env-tag-crx-root";
  document.body.appendChild(root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RenderTagFrame position={position}>
        <Tag
          label={label}
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          margin={margin}
        ></Tag>
      </RenderTagFrame>
    </React.StrictMode>
  );
}

async function bootstrap() {
  const setting = await getSiteSetting();

  if (!setting) {
    console.log("Skip cause setting is null");
    return;
  }

  if (!setting.enabled) {
    console.log("Skip cause enabled is false");
    return;
  }

  renderTag(setting);
}

bootstrap();

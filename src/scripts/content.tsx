import React from "react";
import ReactDOM from "react-dom/client";
import "./content.css";
import Tag from "../components/tag/Tag";

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Tag label="⚠️ Production Environment ⚠️"></Tag>
  </React.StrictMode>
);

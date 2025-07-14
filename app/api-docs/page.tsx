// app/api-docs/page.tsx
"use client";

import { useEffect } from "react";
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from "swagger-ui-dist";
import "swagger-ui-dist/swagger-ui.css";

export default function SwaggerPage() {
  useEffect(() => {
    SwaggerUIBundle({
      url: "/api-spec",
      dom_id: "#swagger-ui",
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    });
  }, []);

  return <div id="swagger-ui" style={{ height: "100vh" }} />;
}

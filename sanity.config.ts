"use client";

/**
 * Sanity Studio config — mounted at /app/studio/[[...tool]]/page.tsx
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  name: "punta-cana-private-excursions",
  title: "Punta Cana Private Excursions",
  projectId,
  dataset,
  apiVersion,
  schema,
  plugins: [
    structureTool({ structure }),
    media(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

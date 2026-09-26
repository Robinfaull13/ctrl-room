import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
export function studioConfig(projectId: string, dataset: string) {
  return defineConfig({
    name: "ctrl-room",
    title: "CTRL ROOM",
    projectId,
    dataset,
    basePath: "/cms",
    plugins: [structureTool({ structure })],
    schema: {
      types: schemaTypes,
      templates: (templates) =>
        templates.filter((t) => t.schemaType !== "siteSettings"),
    },
    document: {
      actions: (actions, { schemaType }) =>
        schemaType === "siteSettings"
          ? actions.filter(
              (a) =>
                a.action === "publish" ||
                a.action === "discardChanges" ||
                a.action === "restore",
            )
          : actions,
      newDocumentOptions: (options) =>
        options.filter((o) => o.templateId !== "siteSettings"),
    },
  });
}
export default studioConfig(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "unconfigured",
  process.env.NEXT_PUBLIC_SANITY_DATASET || "unconfigured",
);

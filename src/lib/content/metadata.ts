import "server-only";
import type { Metadata } from "next";
import { getContentRepository } from "./repository";
export async function siteMetadata(
  pageTitle?: string,
  canonical = "/",
): Promise<Metadata> {
  const settings = await getContentRepository().settings();
  return {
    title: {
      absolute: pageTitle ? pageTitle + " / " + settings.title : settings.title,
    },
    description: settings.description,
    alternates: { canonical },
  };
}

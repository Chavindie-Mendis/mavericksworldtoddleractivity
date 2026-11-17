import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { sitemapStaticPaths, sitemapXML } from "@/lib/sitemap";

describe("Public sitemap", () => {
  it("includes the generator without account or password recovery screens", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(sitemapStaticPaths(router)).toEqual(["/"]);
  });

  it("omits invented modification dates and uses the published origin", () => {
    const xml = sitemapXML("https://mavericksworldtoddleractivity.lovable.app", [{ path: "/" }]);
    expect(xml).toContain("<loc>https://mavericksworldtoddleractivity.lovable.app/</loc>");
    expect(xml).not.toContain("<lastmod>");
  });
});
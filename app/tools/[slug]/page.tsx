import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrganicAssetPage } from "@/components/marketing/OrganicAssetPage";
import { getToolAsset, TOOL_ASSETS } from "@/lib/organic-assets";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

type ToolPageProps = {
  params: {
    slug: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOL_ASSETS.map((asset) => ({ slug: asset.slug }));
}

export function generateMetadata({ params }: ToolPageProps): Metadata {
  const asset = getToolAsset(params.slug);

  if (!asset) {
    return {};
  }

  return {
    title: asset.title,
    description: asset.description,
    alternates: { canonical: absoluteUrl(asset.route) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: absoluteUrl(asset.route),
      title: asset.title,
      description: asset.description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: asset.title }],
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const asset = getToolAsset(params.slug);

  if (!asset) {
    notFound();
  }

  return <OrganicAssetPage asset={asset} kind="tool" />;
}

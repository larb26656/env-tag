interface SiteBarProps {
  site: string;
}

export default function SiteBar({ site }: SiteBarProps) {
  // TODO find variant text invert primary
  return <nav className="bg-primary text-white p-4">Site: {site}</nav>;
}

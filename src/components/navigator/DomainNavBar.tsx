import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

export interface NavMenuItem {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

interface DomainNavProps {
  domain: string;
  menuItems: NavMenuItem[];
}

export default function DomainNavBar({ domain, menuItems }: DomainNavProps) {
  // TODO find variant text invert primary
  return (
    <nav className="flex flex-col bg-primary p-4 gap-4">
      <p className="text-white">Domain: {domain}</p>
      {menuItems.length > 0 && (
        <div className="flex justify-end gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white h-10 w-10`}
                onClick={item.onClick}
              >
                <Icon />
              </Button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

import { SiteShellFrame } from "@/components/site-shell-frame";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return <SiteShellFrame>{children}</SiteShellFrame>;
}

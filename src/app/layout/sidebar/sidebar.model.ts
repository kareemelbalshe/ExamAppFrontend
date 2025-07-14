export interface SidebarItem {
  label: string;
  icon?: string;
  route?: string;
  isLogout?: boolean;
  children?: SidebarItem[];
}

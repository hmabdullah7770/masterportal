import type { LucideIcon } from "lucide-react";
import {
	Brain,
	CreditCard,
	Database,
	FileText,
	Home,
	LayoutDashboard,
	LayoutTemplate,
	Megaphone,
	Rocket,
	Server,
	Shield,
	Smartphone,
	Star,
	TrendingUp,
	Users,
	Wallet,
	Webhook,
	Workflow,
} from "lucide-react";

export type MasterPortalNavItem = {
	label: string;
	to: string;
	icon: LucideIcon;
};

export const masterPortalNav: MasterPortalNavItem[] = [
	{ label: "Home", to: "/", icon: Home },
	{ label: "Dashboard", to: "/Dashboard", icon: LayoutDashboard },
	{ label: "UI Manager", to: "/portal/ui-manager", icon: LayoutTemplate },
	{
		label: "Functionality Manager",
		to: "/portal/functionality-manager",
		icon: Workflow,
	},
	{ label: "User Management", to: "/portal/user-management", icon: Users },
	{ label: "Device Info", to: "/portal/device-info", icon: Smartphone },
	{ label: "Subscriptions", to: "/portal/subscriptions", icon: CreditCard },
	{ label: "Ads Manager", to: "/portal/ads-manager", icon: Megaphone },
	{ label: "API Control", to: "/portal/api-control", icon: Webhook },
	{ label: "App Logs", to: "/portal/app-logs", icon: FileText },
	{ label: "Server Logs", to: "/portal/server-logs", icon: Server },
	{
		label: "Database Performance",
		to: "/portal/database-performance",
		icon: Database,
	},
	{ label: "AI Manager", to: "/portal/ai-manager", icon: Brain },
	{ label: "Permissions", to: "/portal/permissions", icon: Shield },
	{ label: "Revenue", to: "/portal/revenue", icon: TrendingUp },
	{ label: "Ratings & Shares", to: "/portal/ratings-shares", icon: Star },
	{ label: "Payment Gateway", to: "/portal/payment-gateway", icon: Wallet },
	{ label: "OTA Updates", to: "/portal/ota-updates", icon: Rocket },
];

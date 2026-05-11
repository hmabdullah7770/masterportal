import { Link } from "@tanstack/react-router";
import { Bell, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { masterPortalNav } from "../config/masterPortalNav";
import MasterPortalSearch from "./MasterPortalSearch";
import ThemeToggle from "./ThemeToggle";

const SIDEBAR_STORAGE_KEY = "master-portal-sidebar-collapsed";

type AdminLayoutProps = {
	children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
	const [collapsed, setCollapsed] = useState(false);
	const [storageReady, setStorageReady] = useState(false);

	useEffect(() => {
		try {
			const raw = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
			setCollapsed(raw === "1");
		} catch {
			/* ignore */
		}
		setStorageReady(true);
	}, []);

	useEffect(() => {
		if (!storageReady) return;
		try {
			window.localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
		} catch {
			/* ignore */
		}
	}, [collapsed, storageReady]);

	return (
		<div className="master-portal-app flex min-h-screen bg-[var(--mp-main-bg)] text-[var(--mp-text)]">
			<aside
				className={`relative flex shrink-0 flex-col border-r border-[var(--mp-sidebar-border)] bg-[var(--mp-sidebar-bg)] transition-[width] duration-200 ease-out ${
					collapsed ? "w-[4.5rem]" : "w-64"
				}`}
			>
				<div
					className={`flex shrink-0 items-start gap-2 border-b border-[var(--mp-sidebar-border)] pt-4 pb-3 ${
						collapsed ? "flex-col px-2" : "px-4 pr-3"
					}`}
				>
					<div className={`min-w-0 flex-1 ${collapsed ? "w-full" : ""}`}>
						<div
							className={`font-semibold tracking-tight text-[var(--mp-brand)] ${
								collapsed ? "text-center text-sm" : "text-lg"
							}`}
						>
							{collapsed ? "MP" : "Master Portal"}
						</div>
						{!collapsed ? (
							<p className="mt-0.5 text-xs font-medium text-[var(--mp-muted)]">
								Admin Control
							</p>
						) : null}
					</div>
					<button
						type="button"
						onClick={() => setCollapsed((c) => !c)}
						className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--mp-sidebar-border)] bg-white text-[var(--mp-accent)] shadow-sm transition hover:bg-[var(--mp-active-bg)] ${
							collapsed ? "mx-auto" : ""
						}`}
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						{collapsed ? (
							<ChevronsRight className="h-4 w-4" strokeWidth={2.25} />
						) : (
							<ChevronsLeft className="h-4 w-4" strokeWidth={2.25} />
						)}
					</button>
				</div>

				<nav className="mt-2 flex-1 overflow-y-auto px-2 pb-4">
					<ul className="m-0 list-none space-y-0.5 p-0">
						{masterPortalNav.map((item) => {
							const Icon = item.icon;
							return (
								<li key={item.to}>
									<Link
										to={item.to}
										title={collapsed ? item.label : undefined}
										activeOptions={
											item.to === "/"
												? { exact: true }
												: { includeSearch: false }
										}
										className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--mp-nav)] no-underline transition-colors hover:bg-[var(--mp-hover-bg)] hover:text-[var(--mp-nav)]"
										activeProps={{
											className:
												"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold no-underline bg-[var(--mp-active-bg)] text-[var(--mp-nav-active)]",
										}}
									>
										<Icon
											className="h-[1.125rem] w-[1.125rem] shrink-0 opacity-90"
											strokeWidth={2}
										/>
										<span
											className={`min-w-0 truncate ${
												collapsed ? "sr-only" : ""
											}`}
										>
											{item.label}
										</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</aside>

			<div className="flex min-h-screen min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-20 flex shrink-0 items-center gap-4 border-b border-[var(--mp-topbar-border)] bg-[var(--mp-topbar-bg)] px-4 py-3 backdrop-blur-md sm:px-6">
					<MasterPortalSearch />
					<div className="ml-auto flex items-center gap-1 sm:gap-2">
						<button
							type="button"
							className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--mp-muted)] transition hover:bg-[var(--mp-hover-bg)] hover:text-[var(--mp-text)]"
							aria-label="Notifications"
						>
							<Bell className="h-5 w-5" strokeWidth={2} />
						</button>
						<ThemeToggle />
						<button
							type="button"
							className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--mp-sidebar-border)] bg-gradient-to-br from-[#c4b5fd] to-[#7c3aed] text-xs font-bold text-white shadow-sm"
							aria-label="Account menu"
						>
							AD
						</button>
					</div>
				</header>

				<div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
			</div>
		</div>
	);
}

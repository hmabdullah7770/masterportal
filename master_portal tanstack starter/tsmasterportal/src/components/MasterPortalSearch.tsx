import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { masterPortalNav } from "../config/masterPortalNav";

/** Starter routes not listed in the main admin nav */
const EXTRA_SEARCH = [
	{ label: "About", to: "/about" },
	{ label: "Contact", to: "/contact" },
	{ label: "Skills", to: "/skills" },
] as const;

const ALL_ITEMS = [...masterPortalNav, ...EXTRA_SEARCH];

function normalize(s: string) {
	return s.trim().toLowerCase();
}

export default function MasterPortalSearch() {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [highlight, setHighlight] = useState(0);
	const wrapRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const results = useMemo(() => {
		const q = normalize(query);
		const list = q
			? ALL_ITEMS.filter(
					(item) =>
						item.label.toLowerCase().includes(q) ||
						item.to.toLowerCase().includes(q),
				)
			: ALL_ITEMS.slice(0, 8);
		return list.slice(0, 12);
	}, [query]);

	const go = useCallback(
		(to: string) => {
			navigate({ to });
			setQuery("");
			setOpen(false);
			setHighlight(0);
			inputRef.current?.blur();
		},
		[navigate],
	);

	useEffect(() => {
		setHighlight(0);
	}, [query]);

	useEffect(() => {
		if (!open) return;
		function onDocMouseDown(e: MouseEvent) {
			if (!wrapRef.current?.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", onDocMouseDown);
		return () => document.removeEventListener("mousedown", onDocMouseDown);
	}, [open]);

	return (
		<div ref={wrapRef} className="relative max-w-xl flex-1">
			<Search
				className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mp-muted)]"
				strokeWidth={2}
				aria-hidden
			/>
			<input
				ref={inputRef}
				type="search"
				role="combobox"
				aria-expanded={open}
				aria-controls="master-portal-search-listbox"
				aria-autocomplete="list"
				placeholder="Search Master Portal..."
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
					setOpen(true);
				}}
				onFocus={() => setOpen(true)}
				onKeyDown={(e) => {
					if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
						setOpen(true);
						return;
					}
					if (e.key === "Escape") {
						setOpen(false);
						return;
					}
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setHighlight((i) => Math.min(i + 1, results.length - 1));
					}
					if (e.key === "ArrowUp") {
						e.preventDefault();
						setHighlight((i) => Math.max(i - 1, 0));
					}
					if (e.key === "Enter" && results.length > 0) {
						const item = results[highlight];
						if (item) {
							e.preventDefault();
							go(item.to);
						}
					}
				}}
				className="w-full rounded-full border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--mp-text)] outline-none ring-[var(--mp-accent)] placeholder:text-[var(--mp-muted)] focus:border-[var(--mp-accent)] focus:ring-2"
				aria-label="Search Master Portal"
			/>
			{open && results.length > 0 ? (
				<ul
					id="master-portal-search-listbox"
					role="listbox"
					className="absolute top-full z-30 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-[var(--mp-sidebar-border)] bg-white py-1 shadow-lg"
				>
					{results.map((item, i) => (
						<li key={item.to} role="presentation">
							<Link
								to={item.to}
								role="option"
								aria-selected={i === highlight}
								className={`block px-4 py-2.5 text-sm no-underline ${
									i === highlight
										? "bg-[var(--mp-active-bg)] text-[var(--mp-nav-active)]"
										: "text-[var(--mp-text)] hover:bg-[var(--mp-hover-bg)]"
								}`}
								onMouseEnter={() => setHighlight(i)}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => {
									setQuery("");
									setOpen(false);
									setHighlight(0);
								}}
							>
								<span className="font-medium">{item.label}</span>
								<span className="mt-0.5 block text-xs text-[var(--mp-muted)]">
									{item.to}
								</span>
							</Link>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}

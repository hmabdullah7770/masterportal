import { Filter, MoreVertical, Plus } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
	createApiControlItem,
	setApiControlItemStatus,
	updateApiControlItem,
} from "#/server/apiControl/apiControlSf";
import type {
	ApiControlCategory,
	ApiControlEndpointRow,
} from "#/types/apiControlEndpoint";

const CATEGORY_OPTIONS: string[] = [
	"Auth",
	"Data",
	"Payment",
	"Media",
];

const categoryBadgeClass: Record<string, string> = {
	Auth: "bg-sky-100 text-sky-800 ring-sky-200/80",
	Data: "bg-emerald-100 text-emerald-800 ring-emerald-200/80",
	Payment: "bg-violet-100 text-violet-800 ring-violet-200/80",
	Media: "bg-orange-100 text-orange-900 ring-orange-200/80",
};

type ToggleSwitchProps = {
	checked: boolean;
	onChange: (next: boolean) => void;
	ariaLabel: string;
};

function ToggleSwitch({ checked, onChange, ariaLabel }: ToggleSwitchProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={ariaLabel}
			onClick={() => onChange(!checked)}
			className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mp-accent)] ${
				checked ? "bg-[var(--mp-accent)]" : "bg-neutral-200 dark:bg-neutral-600"
			}`}
		>
			<span
				className={`pointer-events-none inline-block h-6 w-6 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
					checked ? "translate-x-5" : "translate-x-0.5"
				}`}
			/>
		</button>
	);
}

type FieldGroupProps = {
	label: string;
	id: string;
	children: React.ReactNode;
};

function FieldGroup({ label, id, children }: FieldGroupProps) {
	return (
		<div className="space-y-1.5">
			<label
				htmlFor={id}
				className="block text-sm font-medium text-[var(--mp-text)]"
			>
				{label}
			</label>
			{children}
		</div>
	);
}

type EditApiModalProps = {
	open: boolean;
	title: string;
	initialName: string;
	initialEndpoint: string;
	initialCategory: ApiControlCategory;
	confirmLabel: string;
	onClose: () => void;
	onSave: (payload: {
		name: string;
		endpoint: string;
		category: ApiControlCategory;
	}) => void | Promise<void>;
};

function EditApiModal({
	open,
	title,
	initialName,
	initialEndpoint,
	initialCategory,
	confirmLabel,
	onClose,
	onSave,
}: EditApiModalProps) {
	const baseId = useId();
	const nameId = `${baseId}-name`;
	const urlId = `${baseId}-url`;
	const catId = `${baseId}-cat`;

	const [name, setName] = useState(initialName);
	const [endpoint, setEndpoint] = useState(initialEndpoint);
	const [category, setCategory] =
		useState<ApiControlCategory>(initialCategory);

	useEffect(() => {
		if (!open) return;
		setName(initialName);
		setEndpoint(initialEndpoint);
		setCategory(initialCategory);
	}, [open, initialName, initialEndpoint, initialCategory]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const n = name.trim();
		const u = endpoint.trim();
		if (!n || !u) return;
		await onSave({ name: n, endpoint: u, category });
	};

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="presentation"
		>
			<button
				type="button"
				className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
				aria-label="Close dialog"
				onClick={onClose}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={`${baseId}-title`}
				className="relative w-full max-w-md rounded-2xl border border-[var(--mp-sidebar-border)] bg-white p-6 shadow-xl"
			>
				<h2
					id={`${baseId}-title`}
					className="text-lg font-bold text-[var(--mp-text)]"
				>
					{title}
				</h2>
				<p className="mt-1 text-sm text-[var(--mp-muted)]">
					Update the API display name, endpoint path, and category. Status stays
					on the table switch.
				</p>
				<form onSubmit={handleSubmit} className="mt-5 space-y-4">
					<FieldGroup label="API name" id={nameId}>
						<input
							id={nameId}
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded-xl border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] px-3 py-2.5 text-sm text-[var(--mp-text)] outline-none transition focus:border-[var(--mp-accent)] focus:ring-2 focus:ring-[var(--mp-accent)]/20"
							autoComplete="off"
						/>
					</FieldGroup>
					<FieldGroup label="Endpoint URL" id={urlId}>
						<input
							id={urlId}
							value={endpoint}
							onChange={(e) => setEndpoint(e.target.value)}
							placeholder="/api/v1/..."
							className="w-full rounded-xl border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] px-3 py-2.5 font-mono text-sm text-[var(--mp-text)] outline-none transition focus:border-[var(--mp-accent)] focus:ring-2 focus:ring-[var(--mp-accent)]/20"
							autoComplete="off"
						/>
					</FieldGroup>
					<FieldGroup label="Category" id={catId}>
						<input
							id={catId}
							list={`${baseId}-cat-options`}
							value={category}
							onChange={(e) =>
								setCategory(e.target.value)
							}
							placeholder="Type or select a category"
							className="w-full rounded-xl border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] px-3 py-2.5 text-sm text-[var(--mp-text)] outline-none transition focus:border-[var(--mp-accent)] focus:ring-2 focus:ring-[var(--mp-accent)]/20"
							autoComplete="off"
						/>
						<datalist id={`${baseId}-cat-options`}>
							{CATEGORY_OPTIONS.map((c) => (
								<option key={c} value={c} />
							))}
						</datalist>
					</FieldGroup>
					<div className="flex justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl border border-[var(--mp-sidebar-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--mp-text)] transition hover:bg-neutral-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="rounded-xl bg-[var(--mp-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
						>
							{confirmLabel}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

type AddApiModalProps = {
	open: boolean;
	onClose: () => void;
	onSave: (payload: {
		name: string;
		endpoint: string;
		category: ApiControlCategory;
		enabled: boolean;
	}) => void | Promise<void>;
};

function AddApiModal({ open, onClose, onSave }: AddApiModalProps) {
	const baseId = useId();
	const nameId = `${baseId}-add-name`;
	const urlId = `${baseId}-add-url`;
	const catId = `${baseId}-add-cat`;

	const [name, setName] = useState("");
	const [endpoint, setEndpoint] = useState("");
	const [category, setCategory] = useState<ApiControlCategory>("Auth");
	const [enabled, setEnabled] = useState(true);

	useEffect(() => {
		if (!open) return;
		setName("");
		setEndpoint("");
		setCategory("Auth");
		setEnabled(true);
	}, [open]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const n = name.trim();
		const u = endpoint.trim();
		if (!n || !u) return;
		await onSave({ name: n, endpoint: u, category, enabled });
	};

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="presentation"
		>
			<button
				type="button"
				className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
				aria-label="Close dialog"
				onClick={onClose}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={`${baseId}-add-title`}
				className="relative w-full max-w-md rounded-2xl border border-[var(--mp-sidebar-border)] bg-white p-6 shadow-xl"
			>
				<h2
					id={`${baseId}-add-title`}
					className="text-lg font-bold text-[var(--mp-text)]"
				>
					Add new endpoint
				</h2>
				<p className="mt-1 text-sm text-[var(--mp-muted)]">
					Register a name, URL, category, and whether the endpoint is enabled.
				</p>
				<form onSubmit={handleSubmit} className="mt-5 space-y-4">
					<FieldGroup label="API name" id={nameId}>
						<input
							id={nameId}
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded-xl border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] px-3 py-2.5 text-sm text-[var(--mp-text)] outline-none transition focus:border-[var(--mp-accent)] focus:ring-2 focus:ring-[var(--mp-accent)]/20"
							autoComplete="off"
						/>
					</FieldGroup>
					<FieldGroup label="Endpoint URL" id={urlId}>
						<input
							id={urlId}
							value={endpoint}
							onChange={(e) => setEndpoint(e.target.value)}
							placeholder="/api/v1/..."
							className="w-full rounded-xl border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] px-3 py-2.5 font-mono text-sm text-[var(--mp-text)] outline-none transition focus:border-[var(--mp-accent)] focus:ring-2 focus:ring-[var(--mp-accent)]/20"
							autoComplete="off"
						/>
					</FieldGroup>
					<FieldGroup label="Category" id={catId}>
						<input
							id={catId}
							list={`${baseId}-add-cat-options`}
							value={category}
							onChange={(e) =>
								setCategory(e.target.value)
							}
							placeholder="Type or select a category"
							className="w-full rounded-xl border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] px-3 py-2.5 text-sm text-[var(--mp-text)] outline-none transition focus:border-[var(--mp-accent)] focus:ring-2 focus:ring-[var(--mp-accent)]/20"
							autoComplete="off"
						/>
						<datalist id={`${baseId}-add-cat-options`}>
							{CATEGORY_OPTIONS.map((c) => (
								<option key={c} value={c} />
							))}
						</datalist>
					</FieldGroup>
					<div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] px-3 py-3">
						<div>
							<p className="text-sm font-medium text-[var(--mp-text)]">
								Enabled
							</p>
							<p className="text-xs text-[var(--mp-muted)]">
								Turn the endpoint on or off for clients.
							</p>
						</div>
						<ToggleSwitch
							checked={enabled}
							onChange={setEnabled}
							ariaLabel="New endpoint enabled"
						/>
					</div>
					<div className="flex justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl border border-[var(--mp-sidebar-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--mp-text)] transition hover:bg-neutral-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="rounded-xl bg-[var(--mp-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
						>
							Add endpoint
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

type ApiControlScreenProps = {
	initialRows: ApiControlEndpointRow[];
	/** Set when the route loader could not read from the database (e.g. missing `DATABASE_URL`). */
	loadError?: string;
};

function formatActionError(e: unknown): string {
	if (e instanceof Error) return e.message;
	return "Something went wrong. Try again.";
}

export default function ApiControlScreen({
	initialRows,
	loadError,
}: ApiControlScreenProps) {
	const [rows, setRows] = useState<ApiControlEndpointRow[]>(initialRows);
	const [filter, setFilter] = useState("");
	const [addOpen, setAddOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<ApiControlEndpointRow | null>(
		null,
	);
	const [actionError, setActionError] = useState<string | null>(null);

	const createFn = useServerFn(createApiControlItem);
	const updateFn = useServerFn(updateApiControlItem);
	const setStatusFn = useServerFn(setApiControlItemStatus);

	useEffect(() => {
		setRows(initialRows);
	}, [initialRows]);

	const filtered = useMemo(() => {
		const q = filter.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter((r) => {
			return (
				r.name.toLowerCase().includes(q) ||
				r.endpoint.toLowerCase().includes(q) ||
				r.category.toLowerCase().includes(q)
			);
		});
	}, [rows, filter]);

	const setEnabled = useCallback(
		async (id: string, enabled: boolean) => {
			try {
				setActionError(null);
				const updated = await setStatusFn({ data: { id, status: enabled } });
				setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
			} catch (e) {
				setActionError(formatActionError(e));
			}
		},
		[setStatusFn],
	);

	const onAddSave = useCallback(
		async (payload: {
			name: string;
			endpoint: string;
			category: ApiControlCategory;
			enabled: boolean;
		}) => {
			try {
				setActionError(null);
				const row = await createFn({
					data: {
						name: payload.name,
						path: payload.endpoint,
						category: payload.category,
						status: payload.enabled,
					},
				});
				setRows((prev) => [row, ...prev]);
				setAddOpen(false);
			} catch (e) {
				setActionError(formatActionError(e));
			}
		},
		[createFn],
	);

	const onEditSave = useCallback(
		async (payload: {
			name: string;
			endpoint: string;
			category: ApiControlCategory;
		}) => {
			if (!editTarget) return;
			try {
				setActionError(null);
				const updated = await updateFn({
					data: {
						id: editTarget.id,
						name: payload.name,
						path: payload.endpoint,
						category: payload.category,
					},
				});
				setRows((prev) =>
					prev.map((r) => (r.id === updated.id ? updated : r)),
				);
				setEditTarget(null);
			} catch (e) {
				setActionError(formatActionError(e));
			}
		},
		[editTarget, updateFn],
	);

	useEffect(() => {
		if (!editTarget) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setEditTarget(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [editTarget]);

	useEffect(() => {
		if (!addOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setAddOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [addOpen]);

	return (
		<>
			<div className="rounded-2xl border border-[var(--mp-sidebar-border)] bg-white px-4 py-6 shadow-[0_1px_3px_rgba(91,33,182,0.06)] sm:px-6 sm:py-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="m-0 text-2xl font-bold tracking-tight text-[var(--mp-text)] sm:text-3xl">
							API Control
						</h1>
						<p className="mt-1 text-sm text-[var(--mp-muted)]">
							Manage endpoint metadata, categories, and live enablement.
						</p>
						{loadError ? (
							<p
								className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
								role="status"
							>
								<strong className="font-semibold">Database:</strong> {loadError}{" "}
								Set <code className="text-xs">DATABASE_URL</code> in{" "}
								<code className="text-xs">.env</code>, run migrations, then refresh.
							</p>
						) : null}
					</div>
					<button
						type="button"
						onClick={() => setAddOpen(true)}
						className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--mp-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
					>
						<Plus className="h-4 w-4" strokeWidth={2.25} />
						Add New Endpoint
					</button>
				</div>

				{actionError ? (
					<p
						className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
						role="alert"
					>
						{actionError}
					</p>
				) : null}

				<div className="relative mt-6">
					<Filter
						className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mp-muted)]"
						strokeWidth={2}
					/>
					<input
						type="search"
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						placeholder="Filter endpoints by name, URL, or category..."
						className="w-full rounded-xl border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] py-2.5 pl-10 pr-3 text-sm text-[var(--mp-text)] outline-none transition placeholder:text-[var(--mp-muted)] focus:border-[var(--mp-accent)] focus:ring-2 focus:ring-[var(--mp-accent)]/20"
					/>
				</div>

				<div className="mt-6 overflow-x-auto rounded-xl border border-[var(--mp-sidebar-border)]">
					<table className="w-full min-w-[720px] border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-[var(--mp-sidebar-border)] bg-[var(--mp-input-bg)]/50">
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--mp-muted)]">
									Actions
								</th>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--mp-muted)]">
									API name
								</th>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--mp-muted)]">
									Endpoint URL
								</th>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--mp-muted)]">
									Category
								</th>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--mp-muted)]">
									Status
								</th>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--mp-muted)]">
									Last used
								</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="px-4 py-10 text-center text-[var(--mp-muted)]"
									>
										{rows.length === 0
											? "No endpoints yet. Add one with the button above."
											: "No endpoints match your filter."}
									</td>
								</tr>
							) : (
								filtered.map((row) => (
									<tr
										key={row.id}
										className="border-b border-[var(--mp-sidebar-border)] last:border-b-0 hover:bg-neutral-50/80"
									>
										<td className="px-4 py-3 align-middle">
											<button
												type="button"
												onClick={() => setEditTarget(row)}
												className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--mp-muted)] transition hover:bg-[var(--mp-hover-bg)] hover:text-[var(--mp-text)]"
												aria-label={`Edit ${row.name}`}
											>
												<MoreVertical className="h-5 w-5" strokeWidth={2} />
											</button>
										</td>
										<td className="px-4 py-3 align-middle font-semibold text-[var(--mp-text)]">
											{row.name}
										</td>
										<td className="px-4 py-3 align-middle">
											<code className="rounded-lg bg-[var(--mp-input-bg)] px-2.5 py-1 text-xs font-medium text-[var(--mp-accent)] ring-1 ring-[var(--mp-input-border)]">
												{row.endpoint}
											</code>
										</td>
										<td className="px-4 py-3 align-middle">
											<span
												className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${categoryBadgeClass[row.category] || "bg-neutral-100 text-neutral-800 ring-neutral-200/80"}`}
											>
												{row.category}
											</span>
										</td>
										<td className="px-4 py-3 align-middle">
											<ToggleSwitch
												checked={row.enabled}
												onChange={(on) => setEnabled(row.id, on)}
												ariaLabel={`${row.enabled ? "Disable" : "Enable"} ${row.name}`}
											/>
										</td>
										<td className="px-4 py-3 align-middle text-[var(--mp-muted)]">
											{row.lastUsed}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			<AddApiModal
				open={addOpen}
				onClose={() => setAddOpen(false)}
				onSave={onAddSave}
			/>

			<EditApiModal
				open={editTarget !== null}
				title="Edit endpoint"
				initialName={editTarget?.name ?? ""}
				initialEndpoint={editTarget?.endpoint ?? ""}
				initialCategory={editTarget?.category ?? "Auth"}
				confirmLabel="Save changes"
				onClose={() => setEditTarget(null)}
				onSave={onEditSave}
			/>
		</>
	);
}

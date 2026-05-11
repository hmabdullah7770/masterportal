import { createFileRoute, notFound } from "@tanstack/react-router";
import ApiControlScreen from "../../components/portal/ApiControlScreen";
import { masterPortalNav } from "../../config/masterPortalNav";
import { listApiControlRegistry } from "../../server/apiControl";

const labelByParam = Object.fromEntries(
	masterPortalNav
		.filter((item) => item.to.startsWith("/portal/"))
		.map((item) => [item.to.replace("/portal/", ""), item.label]),
) as Record<string, string>;

export const Route = createFileRoute("/portal/$module")({
	loader: async ({ params }) => {
		if (params.module !== "api-control") {
			return {
				portalModule: params.module,
				apiControlRegistry: undefined,
				apiControlLoadError: undefined,
			};
		}
		try {
			const apiControlRegistry = await listApiControlRegistry();
			return {
				portalModule: params.module,
				apiControlRegistry,
				apiControlLoadError: undefined,
			};
		} catch (e) {
			const message =
				e instanceof Error ? e.message : "Could not load API endpoints.";
			console.error("[api-control loader]", e);
			return {
				portalModule: params.module,
				apiControlRegistry: [],
				apiControlLoadError: message,
			};
		}
	},
	component: PortalModulePage,
});

function PortalModulePage() {
	const { module } = Route.useParams();
	const { apiControlRegistry, apiControlLoadError } = Route.useLoaderData({
		from: "/portal/$module",
	});
	const title = labelByParam[module];
	if (!title) throw notFound();

	if (module === "api-control") {
		return (
			<main className="mx-auto w-full max-w-6xl">
				<ApiControlScreen
					initialRows={apiControlRegistry ?? []}
					loadError={apiControlLoadError}
				/>
			</main>
		);
	}

	return (
		<main className="mx-auto w-full max-w-6xl">
			<div className="rounded-2xl border border-[var(--mp-sidebar-border)] bg-white px-6 py-8 shadow-[0_1px_3px_rgba(91,33,182,0.06)] sm:px-10 sm:py-10">
				<h1 className="m-0 text-2xl font-bold tracking-tight text-[var(--mp-text)] sm:text-3xl">
					{title}
				</h1>
				<p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--mp-muted)] sm:text-base">
					This admin section is a placeholder. Build out this screen with your
					real tables, forms, and server functions when you are ready.
				</p>
				<div className="mt-8 flex flex-wrap gap-3">
					<span className="rounded-full bg-[var(--mp-active-bg)] px-3 py-1 text-xs font-semibold text-[var(--mp-nav-active)]">
						Master Portal
					</span>
					<span className="rounded-full border border-[var(--mp-input-border)] bg-[var(--mp-input-bg)] px-3 py-1 text-xs font-medium text-[var(--mp-muted)]">
						Route: /portal/{module}
					</span>
				</div>
			</div>
		</main>
	);
}

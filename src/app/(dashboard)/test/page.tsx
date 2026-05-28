import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { HealthCheck } from "./health-check";
import { ErrorBoundary } from "react-error-boundary";

export default function TestPage() {

    prefetch(trpc.health.queryOptions()) ;

    return (
        <HydrateClient>
            <div className="flex">
                <ErrorBoundary fallback={<div>something went wrong</div>}>
                    <HealthCheck />
                </ErrorBoundary>
            </div>
        </HydrateClient>
    )
}
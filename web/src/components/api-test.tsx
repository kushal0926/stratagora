"use client";

import { useEffect, useState } from "react";
import { goService, type HealthData } from "@/lib/go-service";

interface DbStatus {
    status: string;
    message: string;
    postgresVersion?: string;
    userCount?: number;
}

export default function ApiStatus() {
    const [apiStatus, setApiStatus] = useState<HealthData | null>(null);
    const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkStatus() {
            try {
                // Test Go API
                const apiRes = await goService.health();
                if (apiRes.success && apiRes.data) {
                    setApiStatus(apiRes.data);
                }

                // Test Database
                const dbRes = await fetch("/api/test-db");
                const dbData: DbStatus = await dbRes.json();
                setDbStatus(dbData);
            } catch (error) {
                console.error("Status check failed:", error);
            } finally {
                setIsLoading(false);
            }
        }

        checkStatus();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div
                    className={`w-2 h-2 rounded-full ${
                        apiStatus?.status === "healthy"
                            ? "bg-green-500"
                            : "bg-red-500"
                    }`}
                />
                <p className="text-sm">
                    <strong>Go API:</strong>{" "}
                    <span
                        className={
                            apiStatus?.status === "healthy"
                                ? "text-green-600"
                                : "text-red-600"
                        }
                    >
                        {apiStatus?.status || "error"}
                    </span>
                    {apiStatus && (
                        <span className="text-xs text-gray-500 ml-2">
                            v{apiStatus.version} • {apiStatus.golang}
                        </span>
                    )}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <div
                    className={`w-2 h-2 rounded-full ${
                        dbStatus?.status === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                    }`}
                />
                <p className="text-sm">
                    <strong>Database:</strong>{" "}
                    <span
                        className={
                            dbStatus?.status === "success"
                                ? "text-green-600"
                                : "text-red-600"
                        }
                    >
                        {dbStatus?.message || "error"}
                    </span>
                </p>
            </div>

            {dbStatus?.postgresVersion && (
                <p className="text-xs text-gray-600">
                    🐘 PostgreSQL {dbStatus.postgresVersion}
                </p>
            )}
        </div>
    );
}

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DatabaseType } from "@/lib/projects/types";

type DBConnectionDialogProps = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    connectionDetails: {
        type?: DatabaseType;
        connectionString?: string;
    };
};

export function DBConnectionDialog({ open, onConfirm, onCancel, connectionDetails }: DBConnectionDialogProps) {
    // Format database type for display
    const formatDbType = (type?: DatabaseType) => {
        if (!type) return "Unknown";

        const typeMap: Record<DatabaseType, string> = {
            postgresql: "PostgreSQL",
            mysql: "MySQL",
            sqlite: "SQLite",
            mssql: "Microsoft SQL Server",
        };

        return typeMap[type] || type;
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Database Connection</DialogTitle>
                    <DialogDescription>
                        You&apos;re about to create a project with a database connection. This is just a simulation - no actual connection will be made at this
                        time.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Connection Type</p>
                        <p className="text-sm">{formatDbType(connectionDetails.type)}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Connection String</p>
                        <p className="text-sm break-all bg-muted p-2 rounded">{connectionDetails.connectionString || "Not provided"}</p>
                    </div>

                    <p className="text-amber-500 text-sm">Note: For security reasons, connection details will be stored locally and not sent to any server.</p>
                </div>

                <DialogFooter className="flex space-x-2 sm:justify-end">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={onConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

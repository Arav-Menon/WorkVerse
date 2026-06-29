"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.orgId as string;

  useEffect(() => {
    if (orgId) {
      router.replace(`/organization/${orgId}/workspaces`);
    }
  }, [orgId, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse space-y-6 w-full">
        <div className="h-48 bg-zinc-900/50 rounded-2xl"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-zinc-900/50 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

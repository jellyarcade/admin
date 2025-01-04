"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Home className="w-4 h-4" />
      <ChevronRight className="w-4 h-4" />
      {paths.length === 0 ? (
        <span className="font-medium text-gray-900">Dashboard</span>
      ) : (
        paths.map((path, index) => (
          <div key={path} className="flex items-center gap-2">
            <span className="capitalize font-medium text-gray-900">
              {path}
            </span>
            {index < paths.length - 1 && (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        ))
      )}
    </div>
  );
}
"use client";

import React from "react";
import { MapPin } from "lucide-react";

export default function WorkAreaPage() {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-border-hairline/60">
        <h2 className="font-heading text-xl font-bold tracking-tight text-text-primary">
          Work Area Setup
        </h2>
        <p className="font-sans text-xs text-text-secondary">
          Configure daily operational zones and postcodes.
        </p>
      </div>

      <div className="p-8 rounded-lg border border-dashed border-border-hairline bg-bg-surface/30 flex flex-col items-center justify-center text-center space-y-3">
        <div className="p-3 rounded-full bg-bg-surface border border-border-hairline">
          <MapPin className="w-6 h-6 text-accent-brass" />
        </div>
        <div>
          <p className="font-heading font-semibold text-sm text-text-primary">
            Work Area Module
          </p>
          <p className="font-sans text-xs text-text-secondary max-w-sm mt-1">
            Zone date picker and schedule list will be mounted in Step 8.
          </p>
        </div>
      </div>
    </div>
  );
}

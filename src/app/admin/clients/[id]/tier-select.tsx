"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateClientTier } from "@/app/admin/clients/[id]/actions";

const TIER_LABELS: Record<string, string> = {
  none: "Non assigné",
  starter: "Starter",
  croissance: "Croissance",
  "sur-mesure": "Sur-mesure",
};

export function TierSelect({ clientId, tier }: { clientId: string; tier: string | null }) {
  const [value, setValue] = useState(tier ?? "none");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        items={TIER_LABELS}
        onValueChange={(next) => {
          setValue(String(next));
          startTransition(() => {
            updateClientTier(clientId, String(next) === "none" ? "" : String(next));
          });
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Non assigné</SelectItem>
          <SelectItem value="starter">Starter</SelectItem>
          <SelectItem value="croissance">Croissance</SelectItem>
          <SelectItem value="sur-mesure">Sur-mesure</SelectItem>
        </SelectContent>
      </Select>
      {pending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
    </div>
  );
}

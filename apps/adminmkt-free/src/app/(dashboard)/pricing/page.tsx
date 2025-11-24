"use client";
import { mockWarehouses } from "@/core/mock-data";
import { WarehouseCard } from "@/sections/warehouse/components/warehouse-card";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockWarehouses.map((w) => (
          <WarehouseCard
            key={w.id}
            warehouse={w}
            onView={(w) => console.log("ver", w)}
            onEdit={(w) => console.log("editar", w)}
          />
        ))}
      </div>
    </div>
  );
}

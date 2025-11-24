"use client";

import NavTabsContainer from "@/components/ui-custom/nav-tabs/NavTabsContainer";
import TitleDashboard from "@/components/ui-custom/title/TitleDashboard";
import React, { useState } from "react";
import { WarehouseCard } from "../components/warehouse-card";
import { mockWarehouses } from "@/core/mock-data";
import { Warehouse } from "../types/Warehouse";

const WarehouseContainer = () => {
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );
  const [viewingWarehouse, setViewingWarehouse] = useState<Warehouse | null>(
    null
  );
  return (
    <div className="space-y-5">
      <TitleDashboard
        title="Gestión de Almacenes"
        subTitle="Administra los almacenes y centros de distribución."
      />
      <NavTabsContainer
        href="/products/warehouse/new"
        titleButtom="Nuevo Almacén"
      />

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
    </div>
  );
};

export default WarehouseContainer;

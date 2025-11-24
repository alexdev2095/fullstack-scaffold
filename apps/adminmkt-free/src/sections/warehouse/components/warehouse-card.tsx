"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Warehouse,
  Package,
  MapPin,
  Calendar,
  Pencil,
  Eye,
} from "lucide-react";
import type { Warehouse as WarehouseType } from "../types/Warehouse";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface WarehouseCardProps {
  warehouse: WarehouseType;
  onEdit: (warehouse: WarehouseType) => void;
  onView: (warehouse: WarehouseType) => void;
}

export function WarehouseCard({
  warehouse,
  onEdit,
  onView,
}: WarehouseCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30 overflow-hidden">
      <div className="relative">
        <img
          src={"/placeholder.svg"}
          alt={"all"}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-balance mb-2 group-hover:text-primary transition-colors">
            {warehouse.name}
          </h3>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{warehouse.address}</span>
          </div>
        </div>

        <div className="flex items-center gap-6 py-3 border-y border-border/50">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Capacidad</p>
              <p className="text-sm font-medium">{warehouse.capacity} m³</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Creado</p>
              <p className="text-sm font-medium">
                {format(warehouse.createdAt, "dd MMM yyyy", { locale: es })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onView(warehouse)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onEdit(warehouse)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
}

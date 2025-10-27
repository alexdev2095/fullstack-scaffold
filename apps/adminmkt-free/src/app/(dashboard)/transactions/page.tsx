import { DatePickerWithPresets } from "@/components/ui-custom/date-picker";
import { Title } from "@/components/ui-custom/title";
import { Button } from "@/components/ui/button";

import { IoCloudUploadOutline, IoReload } from "react-icons/io5";

export default function TransactionsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-2">
          <Title>Transacciones</Title>
          <p className="text-muted-foreground text-sm">
            Gestione sus transacciones de venta.
          </p>
        </div>
      </div>
    </div>
  );
}

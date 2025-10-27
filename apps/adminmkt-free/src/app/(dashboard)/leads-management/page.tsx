import { Title } from "@/components/ui-custom/title";

export default function LeadsManagement() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-2">
          <Title>Clientes potenciales</Title>
          <p className="text-muted-foreground text-sm">
            Siga y controle el rendimiento de sus clientes potenciales
          </p>
        </div>
      </div>
    </div>
  );
}

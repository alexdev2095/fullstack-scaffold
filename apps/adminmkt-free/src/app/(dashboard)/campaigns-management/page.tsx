import { PromoteCard } from "@/components/ui-custom/cards/promote-card";
import { Title } from "@/components/ui-custom/title";

export default function CampaignsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-2">
          <Title>Gestor de campañas</Title>
          <p className="text-muted-foreground text-sm">
            Gestione sus camapañas de marketing.
          </p>
        </div>
      </div>
    </div>
  );
}

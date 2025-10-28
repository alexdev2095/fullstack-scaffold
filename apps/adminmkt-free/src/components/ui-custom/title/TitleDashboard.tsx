import { Title } from ".";
import { cn } from "@/lib/utils";

type TitleProps = {
  title: string;
  subTitle: string;
  className?: string;
};
const TitleDashboard = ({ title, subTitle, className }: TitleProps) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-5",
        className
      )}
    >
      <div className="space-y-2">
        <Title>{title}</Title>
        <p className="text-muted-foreground text-sm">{subTitle}</p>
      </div>
    </div>
  );
};

export default TitleDashboard;

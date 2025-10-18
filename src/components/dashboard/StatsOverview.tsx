import { Card } from "@/components/ui/card";
import { Video, AlertTriangle, CheckCircle2, Users } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      label: "Active Cameras",
      value: "6",
      subtext: "2 recording",
      icon: <Video className="h-6 w-6 text-primary" />,
      color: "from-primary/20 to-primary/5",
    },
    {
      label: "Detections Today",
      value: "42",
      subtext: "+12% from yesterday",
      icon: <AlertTriangle className="h-6 w-6 text-accent" />,
      color: "from-accent/20 to-accent/5",
    },
    {
      label: "Verified Faces",
      value: "28",
      subtext: "Database size: 156",
      icon: <CheckCircle2 className="h-6 w-6 text-success" />,
      color: "from-success/20 to-success/5",
    },
    {
      label: "Unknown Alerts",
      value: "3",
      subtext: "Requires attention",
      icon: <Users className="h-6 w-6 text-destructive" />,
      color: "from-destructive/20 to-destructive/5",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="border-border/50 bg-gradient-to-br p-6 transition-all hover:border-primary/50 hover:shadow-glow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.subtext}</p>
            </div>
            <div className={`rounded-lg bg-gradient-to-br p-3 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;

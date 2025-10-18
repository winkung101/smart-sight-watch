import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Bell, 
  Users, 
  Settings, 
  BarChart3,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import CameraGrid from "@/components/dashboard/CameraGrid";
import EventFeed from "@/components/dashboard/EventFeed";
import StatsOverview from "@/components/dashboard/StatsOverview";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("cameras");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-foreground">
              RTSP <span className="text-primary">Analytics</span>
            </h1>
            <nav className="hidden md:flex items-center gap-1">
              <Button 
                variant={activeTab === "cameras" ? "default" : "ghost"}
                onClick={() => setActiveTab("cameras")}
              >
                <Video className="mr-2 h-4 w-4" />
                Cameras
              </Button>
              <Button 
                variant={activeTab === "events" ? "default" : "ghost"}
                onClick={() => setActiveTab("events")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Events
              </Button>
              <Button 
                variant={activeTab === "faces" ? "default" : "ghost"}
                onClick={() => setActiveTab("faces")}
              >
                <Users className="mr-2 h-4 w-4" />
                Faces
              </Button>
              <Button 
                variant={activeTab === "analytics" ? "default" : "ghost"}
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                3
              </span>
            </Button>
            <Button size="icon" variant="ghost">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsContent value="cameras" className="mt-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Camera Streams</h2>
              <Button className="bg-gradient-primary shadow-glow">
                <Plus className="mr-2 h-4 w-4" />
                Add Camera
              </Button>
            </div>
            <CameraGrid />
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-foreground">Event History</h2>
              <p className="text-muted-foreground">Real-time alerts and detection events</p>
            </div>
            <EventFeed />
          </TabsContent>

          <TabsContent value="faces" className="mt-0">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Face Database</h2>
                <p className="text-muted-foreground">Manage enrolled faces and recognition settings</p>
              </div>
              <Button className="bg-gradient-accent shadow-glow-accent">
                <Plus className="mr-2 h-4 w-4" />
                Enroll Face
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden border-border/50 bg-card">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">Person {i}</h3>
                    <p className="text-sm text-muted-foreground">Role: Employee</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-success/10 px-2 py-1 text-xs text-success">Verified</span>
                      <span className="text-xs text-muted-foreground">Last seen: 2h ago</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h2>
              <p className="text-muted-foreground">Security insights and performance metrics</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/50 bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Detection Activity</h3>
                <div className="h-64 rounded-lg bg-muted/50" />
              </Card>
              <Card className="border-border/50 bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Face Recognition Stats</h3>
                <div className="h-64 rounded-lg bg-muted/50" />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;

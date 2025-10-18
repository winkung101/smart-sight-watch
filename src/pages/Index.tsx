import { Button } from "@/components/ui/button";
import { Video, Shield, Bell, Users, BarChart3, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Enterprise-Grade Security Platform</span>
            </div>
            
            <h1 className="mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              RTSP Motion & Face Detection Platform
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl">
              Real-time video analytics with AI-powered motion detection, facial recognition, and intelligent alerting for modern security operations.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary shadow-glow hover:shadow-glow-accent"
                onClick={() => navigate("/dashboard")}
              >
                <Video className="mr-2 h-5 w-5" />
                Launch Dashboard
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary/30 hover:bg-primary/10"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>

        {/* Animated background grid */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Video className="h-10 w-10 text-primary" />}
            title="Multi-Stream RTSP"
            description="Connect and monitor multiple IP cameras simultaneously with real-time video streaming and snapshot fallback."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-accent" />}
            title="Motion Detection"
            description="Configurable sensitivity with background subtraction and frame differencing for accurate movement tracking."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Face Recognition"
            description="AI-powered face detection and matching against enrolled database with confidence scoring and auto-blur."
          />
          <FeatureCard
            icon={<Bell className="h-10 w-10 text-accent" />}
            title="Smart Alerts"
            description="Instant notifications via webhook, email, or Line Notify when unknown faces or events are detected."
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10 text-primary" />}
            title="Analytics & Reports"
            description="Comprehensive event logging, visual analytics, and exportable reports for security audits."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-accent" />}
            title="Enterprise Security"
            description="End-to-end encryption, access control, audit logs, and GDPR-compliant privacy features."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-12 text-center backdrop-blur-sm">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Ready to enhance your security operations?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Start monitoring your premises with AI-powered intelligence today.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-accent shadow-glow-accent"
            onClick={() => navigate("/dashboard")}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 RTSP Analytics Platform. Enterprise-grade security for modern operations.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-glow">
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;

import { useState } from "react";
import { User, Key, Bell, Palette, CreditCard, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "api", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  });

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                      activeTab === tab.id 
                        ? "bg-primary/10 text-primary border border-primary/30" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {activeTab === "profile" && (
                <div className="glass rounded-xl p-6 space-y-6">
                  <h2 className="font-display font-semibold text-xl">Profile Settings</h2>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
                      <User className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 2MB</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full bg-muted/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full bg-muted/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      rows={3}
                      defaultValue="Content creator and video enthusiast."
                      className="w-full bg-muted/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  <Button variant="gradient">Save Changes</Button>
                </div>
              )}

              {activeTab === "api" && (
                <div className="space-y-6">
                  <div className="glass rounded-xl p-6">
                    <h2 className="font-display font-semibold text-xl mb-4">API Configuration</h2>
                    <p className="text-muted-foreground mb-6">
                      Connect your Flask backend by configuring the API endpoint below.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Backend API URL</label>
                        <input
                          type="url"
                          placeholder="https://your-flask-api.com/api/v1"
                          className="w-full bg-muted/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your Flask backend endpoint for video generation
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Replicate API Key</label>
                        <input
                          type="password"
                          placeholder="r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-muted/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">ElevenLabs API Key</label>
                        <input
                          type="password"
                          placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-muted/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    <Button variant="gradient" className="mt-6">Save API Keys</Button>
                  </div>

                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Security Note</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      API keys are encrypted and stored securely. For production, we recommend 
                      storing keys in your Flask backend environment variables.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="glass rounded-xl p-6 space-y-6">
                  <h2 className="font-display font-semibold text-xl">Notification Preferences</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your video generation
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, email: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Get real-time alerts in your browser
                        </p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, push: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-muted-foreground">
                          Tips, tutorials, and product updates
                        </p>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, marketing: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div className="glass rounded-xl p-6">
                    <h2 className="font-display font-semibold text-xl mb-4">Current Plan</h2>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                      <div>
                        <h3 className="font-display font-bold text-xl gradient-text">Pro Plan</h3>
                        <p className="text-sm text-muted-foreground">50 videos/month • 4K export • Priority support</p>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-bold text-2xl">$29</div>
                        <div className="text-sm text-muted-foreground">/month</div>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-4 w-full">
                      Manage Subscription
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="glass rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Usage This Month</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Videos Generated</span>
                          <span>32 / 50</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-[64%] bg-gradient-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Storage Used</span>
                          <span>8.2 GB / 20 GB</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-[41%] bg-gradient-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;

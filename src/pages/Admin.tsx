import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LogOut,
  Users,
  Calendar,
  Building,
  Image,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeDIconPresets } from '@/components/ThreeDIcons';
import EventsManager from '@/components/admin/EventsManager';
import CoordinatorsManager from '@/components/admin/CoordinatorsManager';
import ClubsManager from '@/components/admin/ClubsManager';
import GalleryManager from '@/components/admin/GalleryManager';
import { getEvents, getCoordinators, getClubs, getGalleryImages } from '@/utils/dataService';

const Admin: React.FC = () => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    events: 0,
    coordinators: 0,
    clubs: 0,
    gallery: 0
  });

  useEffect(() => {
    // Load statistics
    const events = getEvents();
    const coordinators = getCoordinators();
    const clubs = getClubs();
    const gallery = getGalleryImages();

    setStats({
      events: events.length,
      coordinators: coordinators.length,
      clubs: clubs.length,
      gallery: gallery.length
    });
  }, []);

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'coordinators', name: 'Coordinators', icon: Users },
    { id: 'clubs', name: 'Clubs', icon: Building },
    { id: 'gallery', name: 'Gallery', icon: Image },
  ];

  const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: React.ComponentType<any> }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card border-glass-border"
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground-secondary mb-1">{title}</p>
            <p className="text-2xl font-bold gradient-text">{value}</p>
          </div>
          <div className="p-2 bg-gradient-to-br from-atom-primary/20 to-electric/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-5 h-5 text-atom-primary" />
          </div>
        </div>
      </CardContent>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card border-glass-border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold gradient-text mb-2">Welcome back, Admin!</h2>
                  <p className="text-foreground-secondary">Manage your website content from here.</p>
                </div>
                <ThreeDIconPresets.Target size={48} className="text-atom-primary" />
              </div>
            </motion.div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Events" value={stats.events} icon={Calendar} />
              <StatCard title="Coordinators" value={stats.coordinators} icon={Users} />
              <StatCard title="Active Clubs" value={stats.clubs} icon={Building} />
              <StatCard title="Gallery Images" value={stats.gallery} icon={Image} />
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card border-glass-border">
                <CardHeader>
                  <CardTitle className="gradient-text">Quick Actions</CardTitle>
                  <CardDescription className="text-foreground-secondary">Common tasks to manage your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {navigation.slice(1).map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            className="h-16 w-full flex flex-col items-center justify-center space-y-1 bg-glass/30 border-glass-border hover:bg-gradient-to-r hover:from-atom-primary/20 hover:to-electric/20 backdrop-blur-sm transition-all duration-300"
                            onClick={() => setActiveSection(item.id)}
                          >
                            <Icon className="w-5 h-5 text-atom-primary" />
                            <span className="text-xs text-foreground">{item.name}</span>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        );

      case 'events':
        return <EventsManager onBackToDashboard={() => setActiveSection('dashboard')} />;

      case 'coordinators':
        return <CoordinatorsManager onBackToDashboard={() => setActiveSection('dashboard')} />;

      case 'clubs':
        return <ClubsManager onBackToDashboard={() => setActiveSection('dashboard')} />;

      case 'gallery':
        return <GalleryManager onBackToDashboard={() => setActiveSection('dashboard')} />;

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-atom-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-electric/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-atom-primary/5 via-electric/5 to-atom-primary/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }}></div>
      </div>

      {/* Layout Container */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-card border-r border-glass-border transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-glass-border h-24">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-atom-primary to-electric rounded-lg flex items-center justify-center">
                <ThreeDIconPresets.Target size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold gradient-text">ATOM CMS</h2>
                <p className="text-xs text-foreground-secondary">Admin Panel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-foreground hover:bg-glass/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-atom-primary to-electric text-white shadow-lg'
                      : 'text-foreground hover:bg-glass/50 backdrop-blur-sm'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.name}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-glass-border">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-glass/50 text-red-400 border-red-500/30 hover:bg-red-500/10 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 glass-card border-b border-glass-border p-4 lg:px-6 h-24"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-foreground hover:bg-glass/50"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold gradient-text">
                    {navigation.find(item => item.id === activeSection)?.name || 'Dashboard'}
                  </h1>
                  <p className="text-xs lg:text-sm text-foreground-secondary">Manage your website content</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ThreeDIconPresets.Target size={36} className="text-atom-primary lg:w-12 lg:h-12" />
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                  Online
                </Badge>
              </div>
            </div>
          </motion.header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;

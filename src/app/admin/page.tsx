"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  Image,
  Film,
  TrendingUp,
  Plus,
} from "lucide-react";

interface DashboardStats {
  totalProjects: number;
  totalImages: number;
  totalVideos: number;
  publishedProjects: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalImages: 0,
    totalVideos: 0,
    publishedProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/portfolio", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const projects = await response.json();
        const totalImages = projects.reduce((sum: number, p: { images?: { url: string }[] }) => sum + (p.images?.length || 0), 0);
        const totalVideos = projects.reduce((sum: number, p: { videos?: { url: string }[] }) => sum + (p.videos?.length || 0), 0);
        const publishedProjects = projects.filter((p: { status: string }) => p.status === "PUBLISHED").length;

        setStats({
          totalProjects: projects.length,
          totalImages,
          totalVideos,
          publishedProjects,
        });
      } else {
        console.error("Failed to fetch stats:", response.status);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: "Total Projects",
      value: stats.totalProjects,
      icon: FolderOpen,
      color: "bg-blue-500",
    },
    {
      name: "Published Projects",
      value: stats.publishedProjects,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      name: "Total Images",
      value: stats.totalImages,
      icon: Image,
      color: "bg-purple-500",
    },
    {
      name: "Total Videos",
      value: stats.totalVideos,
      icon: Film,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to the admin dashboard. Manage your portfolio and media.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-full ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => router.push("/admin/portfolio")}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-accent hover:shadow-lg"
          >
            <div className="rounded-full bg-accent/10 p-3">
              <Plus className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">New Project</p>
              <p className="text-sm text-muted-foreground">Create a new portfolio project</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/admin/portfolio")}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-accent hover:shadow-lg"
          >
            <div className="rounded-full bg-accent/10 p-3">
              <FolderOpen className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Manage Projects</p>
              <p className="text-sm text-muted-foreground">View and edit all projects</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface PortfolioProject {
  id: string;
  title: string;
  description?: string;
  status: string;
  category: {
    name: string;
  };
  images: {
    id: string;
    url: string;
    thumbnail: string;
    alt?: string;
  }[];
  videos: {
    id: string;
    type: string;
    url: string;
    thumbnail?: string;
  }[];
}

export default function GalleryPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/public/portfolio");
      if (response.ok) {
        const data = await response.json();
        // Only show published projects
        setProjects(data.filter((p: PortfolioProject) => p.status === "PUBLISHED"));
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (project: PortfolioProject, mediaIndex: number) => {
    setSelectedProject(project);
    setCurrentMediaIndex(mediaIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedProject(null);
  };

  const nextMedia = () => {
    if (!selectedProject) return;
    const totalMedia = selectedProject.images.length + selectedProject.videos.length;
    setCurrentMediaIndex((currentMediaIndex + 1) % totalMedia);
  };

  const prevMedia = () => {
    if (!selectedProject) return;
    const totalMedia = selectedProject.images.length + selectedProject.videos.length;
    setCurrentMediaIndex((currentMediaIndex - 1 + totalMedia) % totalMedia);
  };

  const getCurrentMedia = () => {
    if (!selectedProject) return null;
    
    const imageCount = selectedProject.images.length;
    if (currentMediaIndex < imageCount) {
      return {
        type: "IMAGE",
        url: selectedProject.images[currentMediaIndex].url,
        thumbnail: selectedProject.images[currentMediaIndex].thumbnail,
      };
    } else {
      const videoIndex = currentMediaIndex - imageCount;
      return {
        type: "VIDEO",
        url: selectedProject.videos[videoIndex].url,
        videoType: selectedProject.videos[videoIndex].type,
      };
    }
  };

  const renderVideoEmbed = (url: string, videoType: string) => {
    if (videoType === "YOUTUBE") {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/)?.[1];
      if (!videoId) return null;
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    } else if (videoType === "VIMEO") {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      if (!videoId) return null;
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Project Gallery</h1>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Project Gallery</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our portfolio of stunning interior design projects
          </p>
        </div>

        {/* Projects Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-xl"
              onClick={() => openLightbox(project, 0)}
            >
              {/* Main Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {project.images[0] ? (
                  <Image
                    src={project.images[0].thumbnail || project.images[0].url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Media Count */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {project.videos.length > 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      <Play className="h-3 w-3" />
                      {project.videos.length}
                    </span>
                  )}
                  <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {project.images.length}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.category.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Buttons */}
          {selectedProject.images.length + selectedProject.videos.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Media Container */}
          <div className="relative h-[80vh] w-full max-w-6xl">
            {getCurrentMedia()?.type === "IMAGE" ? (
              <Image
                src={getCurrentMedia()?.url || ""}
                alt="Gallery image"
                fill
                className="object-contain"
              />
            ) : (
              <div className="h-full w-full">
                {renderVideoEmbed(getCurrentMedia()?.url || "", getCurrentMedia()?.videoType || "")}
              </div>
            )}
          </div>

          {/* Media Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            {currentMediaIndex + 1} / {selectedProject.images.length + selectedProject.videos.length}
          </div>
        </div>
      )}
    </div>
  );
}
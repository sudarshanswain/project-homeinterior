"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus,
  Upload,
  Video,
  Image as ImageIcon,
  GripVertical,
  Trash2,
  Edit,
  Save,
  X,
  ExternalLink,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description?: string;
  categoryId: string;
  location?: string;
  area?: string;
  budget?: string;
  duration?: string;
  isFeatured: boolean;
  status: string;
  publishedAt?: string;
  category: {
    id: string;
    name: string;
  };
  images: PortfolioImage[];
  videos: PortfolioVideo[];
}

interface PortfolioImage {
  id: string;
  url: string;
  thumbnail: string;
  alt?: string;
  sortOrder: number;
  type: string;
  fileSize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
}

interface PortfolioVideo {
  id: string;
  type: string;
  url: string;
  thumbnail?: string;
  title?: string;
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    location: "",
    area: "",
    budget: "",
    duration: "",
    isFeatured: false,
    status: "DRAFT",
  });

  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/portfolio", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/public/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingProject
        ? `/api/admin/portfolio/${editingProject.id}`
        : "/api/admin/portfolio";

      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          images,
          videos,
        }),
      });

      if (response.ok) {
        fetchProjects();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    const token = localStorage.getItem("adminToken");
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    });

    const results = await Promise.all(uploadPromises);
    const validImages = results.filter((img) => img !== null) as PortfolioImage[];

    setImages([...images, ...validImages]);
  };

  const handleAddVideo = () => {
    if (!videoUrl.trim()) return;

    const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");

    if (!isYouTube && !isVimeo) {
      alert("Please enter a valid YouTube or Vimeo URL");
      return;
    }

    const newVideo: PortfolioVideo = {
      id: `temp-${Date.now()}`,
      type: isYouTube ? "YOUTUBE" : "VIMEO",
      url: videoUrl,
      sortOrder: videos.length,
    };

    setVideos([...videos, newVideo]);
    setVideoUrl("");
  };

  const openModal = (project?: PortfolioProject) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        slug: project.slug,
        description: project.description || "",
        categoryId: project.categoryId,
        location: project.location || "",
        area: project.area || "",
        budget: project.budget || "",
        duration: project.duration || "",
        isFeatured: project.isFeatured,
        status: project.status,
      });
      setImages(project.images);
      setVideos(project.videos);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        slug: "",
        description: "",
        categoryId: categories[0]?.id || "",
        location: "",
        area: "",
        budget: "",
        duration: "",
        isFeatured: false,
        status: "DRAFT",
      });
      setImages([]);
      setVideos([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setImages([]);
    setVideos([]);
    setVideoUrl("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Portfolio Management</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your portfolio projects, images, and videos
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:scale-105 hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-xl"
              >
                {/* Image Preview */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {project.images[0] ? (
                    <img
                      src={project.images[0].thumbnail || project.images[0].url}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Actions */}
                  <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={() => openModal(project)}
                      className="rounded-lg bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <Edit className="h-4 w-4 text-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="rounded-lg bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute left-2 top-2">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        project.status === "PUBLISHED"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      )}
                    >
                      {project.status}
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
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {project.images.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Film className="h-3 w-3" />
                      {project.videos.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-background p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingProject ? "Edit Project" : "New Project"}
                </h2>
                <button
                  onClick={closeModal}
                  className="rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Project Details */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Area
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Budget
                    </label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-foreground">
                      Featured Project
                    </label>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Images (Max 30)
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleImageUpload(e.dataTransfer.files);
                    }}
                    className={cn(
                      "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                      dragOver
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag & drop images here, or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      disabled={images.length >= 30}
                    />
                  </div>

                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <div
                          key={img.id}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                        >
                          <img
                            src={img.thumbnail || img.url}
                            alt={img.alt || `Image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = images.filter((_, i) => i !== index);
                                setImages(newImages);
                              }}
                              className="rounded-lg bg-red-500 p-2"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Videos (YouTube/Vimeo)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Enter YouTube or Vimeo URL"
                      className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                    />
                    <button
                      type="button"
                      onClick={handleAddVideo}
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                    >
                      Add Video
                    </button>
                  </div>

                  {/* Video List */}
                  {videos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {videos.map((video, index) => (
                        <div
                          key={video.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Video className="h-5 w-5 text-accent" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {video.type} Video
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {video.url}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newVideos = videos.filter((_, i) => i !== index);
                              setVideos(newVideos);
                            }}
                            className="rounded-lg p-2 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-border px-6 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

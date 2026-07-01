"use client";

import { useState, useEffect } from "react";
import { SiteSettings } from "@/types/public-api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Upload } from "lucide-react";

type Tab = "company" | "contact" | "social" | "branding" | "seo" | "system";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("company");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Please login to access settings");
        return;
      }

      const response = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSettings(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Please login to save settings");
        return;
      }

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Settings saved successfully!");
        setSettings(result.data);
      } else {
        if (result.error && Array.isArray(result.error)) {
          const newErrors: Record<string, string> = {};
          result.error.forEach((err: { field: string; message: string }) => {
            newErrors[err.field] = err.message;
          });
          setErrors(newErrors);
          toast.error("Please fix the validation errors");
        } else {
          toast.error(result.error || "Failed to save settings");
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof SiteSettings>(field: K, value: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "favicon") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Please login to upload images");
        return;
      }

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
        updateField(type, data.url);
        toast.success(`${type === "logo" ? "Logo" : "Favicon"} uploaded successfully`);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "company", label: "Company" },
    { id: "contact", label: "Contact" },
    { id: "social", label: "Social Media" },
    { id: "branding", label: "Branding" },
    { id: "seo", label: "SEO" },
    { id: "system", label: "System" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your website configuration and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {/* Company Information */}
              {activeTab === "company" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">Company Information</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Basic information about your company
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={settings.companyName || ""}
                        onChange={(e) => updateField("companyName", e.target.value)}
                        className={`w-full rounded-lg border ${errors.companyName ? "border-destructive" : "border-input"} bg-background px-4 py-2`}
                        placeholder="Enter company name"
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-sm text-destructive">{errors.companyName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tagline</label>
                      <input
                        type="text"
                        value={settings.tagline || ""}
                        onChange={(e) => updateField("tagline", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="Enter tagline"
                        maxLength={200}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={settings.description || ""}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        rows={4}
                        placeholder="Enter company description"
                        maxLength={1000}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Logo</label>
                      <div className="flex items-center gap-4">
                        {settings.logo && (
                          <img
                            src={settings.logo}
                            alt="Logo"
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "logo")}
                            className="hidden"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Logo
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Favicon</label>
                      <div className="flex items-center gap-4">
                        {settings.favicon && (
                          <img
                            src={settings.favicon}
                            alt="Favicon"
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <input
                            type="file"
                            id="favicon-upload"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "favicon")}
                            className="hidden"
                          />
                          <label
                            htmlFor="favicon-upload"
                            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Favicon
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      How customers can reach you
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="tel"
                        value={settings.phone || ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={`w-full rounded-lg border ${errors.phone ? "border-destructive" : "border-input"} bg-background px-4 py-2`}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        value={settings.email || ""}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={`w-full rounded-lg border ${errors.email ? "border-destructive" : "border-input"} bg-background px-4 py-2`}
                        placeholder="hello@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        value={settings.whatsapp || ""}
                        onChange={(e) => updateField("whatsapp", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="919876543210"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Address</h3>

                    <div>
                      <label className="block text-sm font-medium mb-2">Address Line 1</label>
                      <input
                        type="text"
                        value={settings.addressLine1 || ""}
                        onChange={(e) => updateField("addressLine1", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="Street address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Address Line 2</label>
                      <input
                        type="text"
                        value={settings.addressLine2 || ""}
                        onChange={(e) => updateField("addressLine2", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          value={settings.city || ""}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="w-full rounded-lg border border-input bg-background px-4 py-2"
                          placeholder="Mumbai"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">State</label>
                        <input
                          type="text"
                          value={settings.state || ""}
                          onChange={(e) => updateField("state", e.target.value)}
                          className="w-full rounded-lg border border-input bg-background px-4 py-2"
                          placeholder="Maharashtra"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Country</label>
                        <input
                          type="text"
                          value={settings.country || ""}
                          onChange={(e) => updateField("country", e.target.value)}
                          className="w-full rounded-lg border border-input bg-background px-4 py-2"
                          placeholder="India"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={settings.postalCode || ""}
                          onChange={(e) => updateField("postalCode", e.target.value)}
                          className="w-full rounded-lg border border-input bg-background px-4 py-2"
                          placeholder="400050"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media */}
              {activeTab === "social" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">Social Media</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Connect your social media accounts
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Facebook</label>
                      <input
                        type="url"
                        value={settings.facebook || ""}
                        onChange={(e) => updateField("facebook", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Instagram</label>
                      <input
                        type="url"
                        value={settings.instagram || ""}
                        onChange={(e) => updateField("instagram", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="https://instagram.com/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={settings.linkedin || ""}
                        onChange={(e) => updateField("linkedin", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">YouTube</label>
                      <input
                        type="url"
                        value={settings.youtube || ""}
                        onChange={(e) => updateField("youtube", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="https://youtube.com/yourchannel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Twitter</label>
                      <input
                        type="url"
                        value={settings.twitter || ""}
                        onChange={(e) => updateField("twitter", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="https://twitter.com/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Pinterest</label>
                      <input
                        type="url"
                        value={settings.pinterest || ""}
                        onChange={(e) => updateField("pinterest", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="https://pinterest.com/yourprofile"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Branding */}
              {activeTab === "branding" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">Branding</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Customize your brand colors
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={settings.primaryColor || "#0f172a"}
                          onChange={(e) => updateField("primaryColor", e.target.value)}
                          className="h-12 w-12 rounded-lg border border-input cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor || ""}
                          onChange={(e) => updateField("primaryColor", e.target.value)}
                          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 font-mono text-sm"
                          placeholder="#0f172a"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={settings.secondaryColor || "#1e293b"}
                          onChange={(e) => updateField("secondaryColor", e.target.value)}
                          className="h-12 w-12 rounded-lg border border-input cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor || ""}
                          onChange={(e) => updateField("secondaryColor", e.target.value)}
                          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 font-mono text-sm"
                          placeholder="#1e293b"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={settings.accentColor || "#f59e0b"}
                          onChange={(e) => updateField("accentColor", e.target.value)}
                          className="h-12 w-12 rounded-lg border border-input cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.accentColor || ""}
                          onChange={(e) => updateField("accentColor", e.target.value)}
                          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 font-mono text-sm"
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>
                  </div>

                  {settings.logo && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Logo Preview</label>
                      <img
                        src={settings.logo}
                        alt="Logo preview"
                        className="h-24 w-auto rounded-lg border border-border"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* SEO */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">SEO & Analytics</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Search engine optimization and tracking codes
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Title</label>
                      <input
                        type="text"
                        value={settings.metaTitle || ""}
                        onChange={(e) => updateField("metaTitle", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="Your site title"
                        maxLength={60}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {(settings.metaTitle || "").length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Description</label>
                      <textarea
                        value={settings.metaDescription || ""}
                        onChange={(e) => updateField("metaDescription", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        rows={3}
                        placeholder="Brief description of your site"
                        maxLength={160}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {(settings.metaDescription || "").length}/160 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                      <input
                        type="text"
                        value={settings.metaKeywords || ""}
                        onChange={(e) => updateField("metaKeywords", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="interior design, home decor, etc."
                        maxLength={200}
                      />
                    </div>

                    <div className="border-t border-border pt-4">
                      <h3 className="text-lg font-medium mb-4">Analytics</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Google Analytics ID
                          </label>
                          <input
                            type="text"
                            value={settings.googleAnalyticsId || ""}
                            onChange={(e) => updateField("googleAnalyticsId", e.target.value || null)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2"
                            placeholder="G-XXXXXXXXXX"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Google Tag Manager ID
                          </label>
                          <input
                            type="text"
                            value={settings.googleTagManagerId || ""}
                            onChange={(e) => updateField("googleTagManagerId", e.target.value || null)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2"
                            placeholder="GTM-XXXXXXX"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Facebook Pixel ID
                          </label>
                          <input
                            type="text"
                            value={settings.facebookPixelId || ""}
                            onChange={(e) => updateField("facebookPixelId", e.target.value || null)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2"
                            placeholder="XXXXXXXXXXXXXXX"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">System Settings</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Language, timezone, and other system preferences
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Default Language</label>
                      <select
                        value={settings.defaultLanguage || "en"}
                        onChange={(e) => updateField("defaultLanguage", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Timezone</label>
                      <select
                        value={settings.timezone || "Asia/Kolkata"}
                        onChange={(e) => updateField("timezone", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                      >
                        <option value="Asia/Kolkata">India (IST)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Dubai">Dubai (GST)</option>
                        <option value="Asia/Singapore">Singapore (SGT)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Currency</label>
                      <select
                        value={settings.currency || "INR"}
                        onChange={(e) => updateField("currency", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                        <option value="AED">UAE Dirham (د.إ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Copyright Text</label>
                      <input
                        type="text"
                        value={settings.copyrightText || ""}
                        onChange={(e) => updateField("copyrightText", e.target.value || null)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        placeholder="© 2025 Your Company"
                        maxLength={200}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium">Maintenance Mode</label>
                        <p className="text-xs text-muted-foreground">
                          Enable to show maintenance page to visitors
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateField("maintenanceMode", !settings.maintenanceMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.maintenanceMode ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex items-center justify-end gap-4 border-t border-border pt-6">
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-w-[160px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
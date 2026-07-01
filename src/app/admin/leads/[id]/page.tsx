"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LEAD_STATUSES } from "@/lib/validations/lead";
import { Room, LeadAttachment, VendorAssignment } from "@/types/lead";

interface LeadDetail {
  id: string;
  leadNumber: string;
  status: string;
  notes?: string;
  estimatedValue?: number;
  priority: string;
  followUpDate?: string;
  createdAt: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    whatsapp?: string;
    city?: string;
    state?: string;
    preferredTime?: string;
  };
  property: {
    id: string;
    propertyType: string;
    configuration?: string;
    totalArea: number;
    status: string;
    expectedPossession?: string;
    rooms: Room[];
  };
  requirements: {
    id: string;
    services: string[];
    designStyle?: string;
    inspirationUrls?: string[];
    budgetMin?: number;
    budgetMax?: number;
    budgetCustom?: number;
  };
  attachments: LeadAttachment[];
  vendorAssignments: (VendorAssignment & { quotations: any[] })[];
  statusHistory: any[];
  notesList: any[];
}

export default function AdminLeadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [priority, setPriority] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchLead();
  }, [params.id]);

  const fetchLead = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`/api/admin/leads/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLead(data.data);
        setNotes(data.data.notes || "");
        setEstimatedValue(data.data.estimatedValue?.toString() || "");
        setPriority(data.data.priority || "MEDIUM");
        setFollowUpDate(data.data.followUpDate ? new Date(data.data.followUpDate).toISOString().split('T')[0] : "");
        setStatus(data.data.status);
      }
    } catch (error) {
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`/api/admin/leads/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          notes,
          estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
          priority,
          followUpDate: followUpDate || null,
        }),
      });

      if (response.ok) {
        alert("Lead updated successfully");
        fetchLead();
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Failed to update lead");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-500",
      CONTACTED: "bg-yellow-500",
      QUALIFIED: "bg-purple-500",
      CONVERTED: "bg-green-500",
      LOST: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
    if (min) return `₹${(min / 100000).toFixed(1)}L+`;
    return "Custom";
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Lead not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{lead.leadNumber}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
                lead.status
              )}`}
            >
              {lead.status}
            </span>
          </div>
          <p className="text-muted-foreground">
            Created on {new Date(lead.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Back to Leads
        </Button>
      </div>

      <div className="space-y-6">
        {/* Details Tab */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="text-foreground font-medium">{lead.customer.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-foreground font-medium">{lead.customer.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="text-foreground font-medium">{lead.customer.phone}</p>
                  </div>
                  {lead.customer.whatsapp && (
                    <div>
                      <Label className="text-muted-foreground">WhatsApp</Label>
                      <p className="text-foreground font-medium">{lead.customer.whatsapp}</p>
                    </div>
                  )}
                  {lead.customer.city && (
                    <div>
                      <Label className="text-muted-foreground">Location</Label>
                      <p className="text-foreground font-medium">
                        {lead.customer.city}, {lead.customer.state}
                      </p>
                    </div>
                  )}
                  {lead.customer.preferredTime && (
                    <div>
                      <Label className="text-muted-foreground">Preferred Contact Time</Label>
                      <p className="text-foreground font-medium">{lead.customer.preferredTime}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Property Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Property Type</Label>
                    <p className="text-foreground font-medium">
                      {lead.property.propertyType.replace(/_/g, " ")}
                    </p>
                  </div>
                  {lead.property.configuration && (
                    <div>
                      <Label className="text-muted-foreground">Configuration</Label>
                      <p className="text-foreground font-medium">{lead.property.configuration}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Total Area</Label>
                    <p className="text-foreground font-medium">{lead.property.totalArea} sq ft</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className="text-foreground font-medium">{lead.property.status}</p>
                  </div>
                  {lead.property.expectedPossession && (
                    <div>
                      <Label className="text-muted-foreground">Expected Possession</Label>
                      <p className="text-foreground font-medium">
                        {new Date(lead.property.expectedPossession).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Requirements
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Services Required</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {lead.requirements.services.map((service, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  {lead.requirements.designStyle && (
                    <div>
                      <Label className="text-muted-foreground">Design Style</Label>
                      <p className="text-foreground font-medium">{lead.requirements.designStyle}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Budget Range</Label>
                    <p className="text-foreground font-medium">
                      {formatBudget(lead.requirements.budgetMin, lead.requirements.budgetMax)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Form */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Update Lead
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedValue">Estimated Value (INR)</Label>
                    <Input
                      id="estimatedValue"
                      type="number"
                      value={estimatedValue}
                      onChange={(e) => setEstimatedValue(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Add notes about this lead..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <Button type="submit" onClick={handleUpdate} disabled={updating} className="w-full">
                    {updating ? "Updating..." : "Update Lead"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rooms Tab */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Room Configuration ({lead.property.rooms.length} rooms)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lead.property.rooms.map((room) => (
                  <div key={room.id} className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-2">{room.roomName}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {room.length && room.width && (
                        <p>Dimensions: {room.length}ft × {room.width}ft</p>
                      )}
                      {room.area && <p>Area: {room.area} sq ft</p>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {room.wardrobeNeeded && (
                          <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                            Wardrobe
                          </span>
                        )}
                        {room.falseCeiling && (
                          <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                            False Ceiling
                          </span>
                        )}
                        {room.lighting && (
                          <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                            Lighting
                          </span>
                        )}
                        {room.painting && (
                          <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                            Painting
                          </span>
                        )}
                        {room.flooring && (
                          <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                            Flooring
                          </span>
                        )}
                      </div>
                      {room.remarks && (
                        <p className="mt-2 text-xs italic">{room.remarks}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attachments Tab */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Uploaded Files ({lead.attachments.length})
              </h3>
              {lead.attachments.length === 0 ? (
                <p className="text-muted-foreground">No files uploaded</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lead.attachments.map((file) => (
                    <div key={file.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{file.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.fileType || "Unknown type"}
                          </p>
                          {file.fileSize && (
                            <p className="text-xs text-muted-foreground">
                              {(file.fileSize / 1024).toFixed(2)} KB
                            </p>
                          )}
                          <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent mt-2 inline-block">
                            {file.category}
                          </span>
                        </div>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline text-sm"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vendors Tab */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Vendor Assignments ({lead.vendorAssignments.length})
              </h3>
              {lead.vendorAssignments.length === 0 ? (
                <p className="text-muted-foreground">No vendors assigned yet</p>
              ) : (
                <div className="space-y-4">
                  {lead.vendorAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{assignment.vendorName}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.vendorEmail}</p>
                          <p className="text-sm text-muted-foreground">{assignment.vendorPhone}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                          {assignment.status}
                        </span>
                      </div>
                      {assignment.quotations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Quotations ({assignment.quotations.length})
                          </p>
                          {assignment.quotations.map((quotation) => (
                            <div key={quotation.id} className="text-sm">
                              <p className="text-muted-foreground">
                                ₹{quotation.estimatedCost.toLocaleString("en-IN")} - {quotation.timeline}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History Tab */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Status History
              </h3>
          <div className="space-y-3">
                {lead.statusHistory.map((entry, index) => (
                  <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                      {index < lead.statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {entry.fromStatus || "N/A"} → {entry.toStatus}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground mb-1">{entry.notes}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

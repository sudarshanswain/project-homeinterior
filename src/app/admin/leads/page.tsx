"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead, LeadStatus, LeadSource } from "@/types/lead";
import { LEAD_STATUSES, LEAD_SOURCES } from "@/lib/validations/lead";

interface LeadWithDetails extends Lead {
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    city?: string;
    state?: string;
  };
  property?: {
    id: string;
    propertyType: string;
    totalArea: number;
    configuration?: string;
  };
  requirements?: {
    id: string;
    services: string[];
    designStyle?: string;
    budgetMin?: number;
    budgetMax?: number;
  };
  _count?: {
    attachments: number;
    vendorAssignments: number;
  };
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, sourceFilter, page]);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (sourceFilter) params.append("source", sourceFilter);
      params.append("page", String(page));
      params.append("limit", "20");

      const response = await fetch(`/api/admin/leads?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeads(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      NEW: "bg-blue-500",
      CONTACTED: "bg-yellow-500",
      QUALIFIED: "bg-purple-500",
      CONVERTED: "bg-green-500",
      LOST: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Lead Management</h1>
        <p className="text-muted-foreground">
          Manage and track all project estimation requests
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All sources</SelectItem>
                  {LEAD_SOURCES.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setSourceFilter("");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      {leads.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No leads found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="h-full cursor-pointer transition-all hover:border-accent hover:shadow-lg"
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {lead.customer.fullName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {lead.leadNumber}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <span className="mr-2">📧</span>
                        {lead.customer.email}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <span className="mr-2">📱</span>
                        {lead.customer.phone}
                      </div>
                      {lead.property && (
                        <div className="flex items-center text-muted-foreground">
                          <span className="mr-2">🏠</span>
                          {lead.property.propertyType.replace(/_/g, " ")}
                          {lead.property.configuration && ` • ${lead.property.configuration}`}
                        </div>
                      )}
                      {lead.requirements && (
                        <div className="flex items-center text-muted-foreground">
                          <span className="mr-2">💰</span>
                          {formatBudget(lead.requirements.budgetMin, lead.requirements.budgetMax)}
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground">
                        <span className="mr-2">📅</span>
                        {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {lead._count?.attachments || 0} files
                      </span>
                      <span className="text-muted-foreground">
                        {lead._count?.vendorAssignments || 0} vendors
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
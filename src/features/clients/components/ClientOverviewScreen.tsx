import React, { useState, useMemo } from "react";
import type { CorporateClient } from "../types";
import DataTable, { type Column } from "@/components/common/DataTable";
import AddButton from "@/components/common/AddButton";
import StatusBadge from "@/components/common/StatusBadge";
import KpiCard from "@/components/common/KpiCard";
import {
  Building2,
  CheckCircle,
  Pause,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  Trash2,
  Edit,
} from "@/utils/icons";

interface ClientOverviewScreenProps {
  clients: CorporateClient[];
  filteredClients: CorporateClient[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  canManageClients: boolean;
  onAddClientClick: () => void;
  onClientDetailClick: (client: CorporateClient) => void;
  onToggleBlacklist: (id: string | number) => void;
  onDeleteClient: (id: string | number) => void;
  onEditClientClick?: (client: CorporateClient) => void;
  isLoading?: boolean;
}

export default function ClientOverviewScreen({
  clients,
  filteredClients,
  searchTerm,
  onSearchChange,
  selectedCategoryFilter,
  onCategoryFilterChange,
  canManageClients,
  onAddClientClick,
  onClientDetailClick,
  onToggleBlacklist,
  onDeleteClient,
  onEditClientClick,
  isLoading,
}: ClientOverviewScreenProps) {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dynamic pagination calculations
  const totalItems = filteredClients.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedClients = useMemo(
    () => filteredClients.slice(startIndex, startIndex + pageSize),
    [filteredClients, startIndex, pageSize],
  );

  const handleExportCsv = () => {
    const headers = [
      "ID",
      "Company Name",
      "GSTIN",
      "Contact Person",
      "Email",
      "Category",
      "Status",
      "Ratings",
    ];
    const rows = filteredClients.map((c) => [
      c.id,
      `"${c.company_name || c.companyName || ""}"`,
      c.gst_number || c.gstin || "",
      `"${c.contact_person || c.contactPerson || ""}"`,
      c.email,
      c.category,
      c.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `clients_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Client Table Column Definitions
  const columns: Column<CorporateClient>[] = [
    {
      header: "CLIENT IDENTITY",
      cell: (client) => {
        const companyName =
          client.companyName || client.company_name || "Corporate Entity";
        const address = client.address || "N/A";
        return (
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#135c4e] border border-teal-100 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
              <Building2 size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 text-sm group-hover:text-[#135c4e] transition-colors flex items-center gap-1">
                {companyName}
                <ArrowUpRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[#135c4e]"
                />
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                ID: {client.id} &bull; {address}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "TAXATION (GSTIN & PAN)",
      cell: (client) => {
        const gstin = client.gstin || client.gst_number || "N/A";
        const panNumber =
          client.pan_number ||
          (gstin.length >= 12 ? gstin.substring(2, 12) : "N/A");
        return (
          <div className="flex flex-col gap-0.5 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold bg-neutral-100 text-neutral-600 px-1 py-0.2 rounded uppercase">
                GST
              </span>
              <span className="font-bold text-neutral-900">{gstin}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span className="text-[9px] font-bold bg-neutral-100 text-neutral-600 px-1 py-0.2 rounded uppercase">
                PAN
              </span>
              <span>{panNumber}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "PRIMARY CONTACT",
      cell: (client) => {
        const contactPerson =
          client.contactPerson || client.contact_person || "Primary Contact";
        const email = client.email || "N/A";
        const phone = client.phone || client.mobile_number || "N/A";
        return (
          <div className="flex flex-col">
            <span className="font-bold text-neutral-900">{contactPerson}</span>
            <span className="text-[11px] text-neutral-500">{email}</span>
            <span className="text-[10px] text-neutral-400">{phone}</span>
          </div>
        );
      },
    },
    {
      header: "OPERATING CITIES",
      cell: (client) => (
        <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-[10px] font-bold uppercase tracking-wider">
          {client.operating_cities?.join(", ") || "N/A"}
        </span>
      ),
    },
    {
      header: "STATUS",
      cell: (client) => <StatusBadge status={client.status} />,
    },
    {
      header: "ACTIONS",
      align: "right",
      cell: (client) => (
        <div
          className="flex items-center justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {canManageClients && (
            <>
              {onEditClientClick && (
                <button
                  type="button"
                  onClick={() => onEditClientClick(client)}
                  className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Edit Corporate Client"
                >
                  <Edit size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => onToggleBlacklist(client.id)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  client.status === "suspended" || client.status === "blacklisted"
                    ? "text-emerald-600 hover:bg-emerald-50"
                    : "text-amber-500 hover:bg-amber-50"
                }`}
                title={
                  client.status === "suspended" || client.status === "blacklisted"
                    ? "Reactivate Client"
                    : "Suspend / Blacklist Client"
                }
              >
                <ShieldAlert size={16} />
              </button>
              <button
                type="button"
                onClick={() => onDeleteClient(client.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Corporate Account"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 relative pb-16 font-sans">
      {/* Header & Page Title with Reusable AddButton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>

          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Manage Clients
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Oversee corporate partnerships, verify taxation credentials, and
            monitor account operational status.
          </p>
        </div>

        {canManageClients && (
          <AddButton label="Add New Client" onClick={onAddClientClick} />
        )}
      </div>

      {/* 4 Reusable KpiCard Components Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="TOTAL CLIENTS"
          value={clients.length}
          subnote="Registered Fleet Accounts"
          subnoteStyle="text-[11px] font-semibold text-teal-700 mt-0.5"
          icon={Building2}
          iconStyle="bg-teal-50 text-[#135c4e] border-teal-100"
        />
        <KpiCard
          title="ACTIVE CLIENTS"
          value={clients.filter((c) => c.status === "active").length}
          subnote="SLA Dispatch Enabled"
          subnoteStyle="text-[11px] font-semibold text-emerald-700 mt-0.5"
          icon={CheckCircle}
          iconStyle="bg-emerald-50 text-emerald-600 border-emerald-100"
        />
        <KpiCard
          title="INACTIVE CLIENTS"
          value={clients.filter((c) => c.status === "inactive").length}
          subnote="Pending Renewal"
          subnoteStyle="text-[11px] font-semibold text-amber-700 mt-0.5"
          icon={Pause}
          iconStyle="bg-amber-50 text-amber-600 border-amber-100"
        />
        <KpiCard
          title="SUSPENDED / BLACKLISTED"
          value={
            clients.filter(
              (c) => c.status === "suspended" || c.status === "blacklisted",
            ).length
          }
          subnote="Access Restricted"
          subnoteStyle="text-[11px] font-semibold text-rose-700 mt-0.5"
          icon={AlertTriangle}
          iconStyle="bg-rose-50 text-rose-600 border-rose-100"
        />
      </div>

      {/* Merged Reusable DataTable Component with Integrated Search & Filter Toolbar */}
      <DataTable
        data={paginatedClients}
        columns={columns}
        keyExtractor={(client) => client.id}
        onRowClick={onClientDetailClick}
        emptyMessage="No Corporate Clients Found"
        emptyIcon={<Building2 size={28} />}
        searchQuery={searchTerm}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search company, GSTIN, contact..."
        filterOptions={[
          { key: "all", label: "All Categories", count: clients.length },
          {
            key: "Corporate",
            label: "Corporate",
            count: clients.filter((c) => c.category === "Corporate").length,
          },
          {
            key: "SME",
            label: "SME",
            count: clients.filter((c) => c.category === "SME").length,
          },
          {
            key: "Inter-City",
            label: "Inter-City",
            count: clients.filter((c) => c.category === "Inter-City").length,
          },
        ]}
        selectedFilter={selectedCategoryFilter}
        onFilterChange={onCategoryFilterChange}
        actionButtons={
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-[13px] rounded-md transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-neutral-200/60"
          >
            Export CSV
          </button>
        }
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          totalItems,
          pageSize,
        }}
      />
    </div>
  );
}

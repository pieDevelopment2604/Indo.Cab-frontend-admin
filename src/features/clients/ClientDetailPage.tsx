import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";
import { clientApi } from "@/api/client.api";
import { mapApiClient } from "./types";
import type { CorporateClient } from "./types";
import ClientDetailScreen from "./components/ClientDetailScreen";
import ClientFormModal, {
  type ClientFormData,
} from "./components/ClientFormModal";

/**
 * ClientDetailPage — standalone page for /clients/:id
 * Fetches the specific client by ID and renders the detail screen.
 */
export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission, isSuperAdmin } = usePermission();
  const canManageClients = isSuperAdmin || hasPermission("CLIENTS_MANAGE");

  const [client, setClient] = useState<CorporateClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<CorporateClient | null>(
    null,
  );
  const [clientFormData, setClientFormData] = useState<ClientFormData>({
    companyName: "",
    gstin: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    tierName: "Corporate Standard",
    baseRatePerKm: 18,
    extraHourRate: 150,
    nightSurchargePercent: 15,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchClient = async () => {
      setLoading(true);
      try {
        // Use dedicated getClientById endpoint — more efficient than fetching all clients
        const raw: any = await clientApi.getClientById(id!);
        if (isMounted) {
          if (raw && raw.id) {
            setClient(mapApiClient(raw));
          } else {
            navigate("/clients", { replace: true });
          }
        }
      } catch {
        // Endpoint not available or ID not found
        if (isMounted) navigate("/clients", { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchClient();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleToggleBlacklist = async (clientId: string | number) => {
    if (!canManageClients || !client) return;
    const newStatus =
      client.status === "suspended" || client.status === "blacklisted"
        ? "active"
        : "suspended";
    setClient((prev) => (prev ? { ...prev, status: newStatus as any } : prev));
    try {
      await clientApi.toggleStatus(clientId, newStatus);
    } catch {
      // Local state already updated optimistically
    }
  };

  const handleDeleteClient = async (clientId: string | number) => {
    if (!canManageClients) return;
    // TODO: Replace with an in-app confirmation modal
    if (
      !window.confirm(
        "Are you sure you want to delete this corporate client account?",
      )
    )
      return;
    try {
      await clientApi.deleteClient(clientId);
    } catch {
      console.warn("Delete API call failed");
    }
    navigate("/clients");
  };

  const handleEditClientClick = (c: CorporateClient) => {
    setEditingClient(c);
    setClientFormData({
      companyName: c.companyName || c.company_name || "",
      gstin: c.gstin || c.gst_number || "",
      contactPerson: c.contactPerson || c.contact_person || "",
      email: c.email || "",
      phone: c.phone || c.mobile_number || "",
      city: c.address || (c.operating_cities && c.operating_cities[0]) || "",
      tierName: c.contract?.tierName || "Corporate Standard",
      baseRatePerKm: c.contract?.baseRatePerKm ?? 18,
      extraHourRate: c.contract?.extraHourRate ?? 150,
      nightSurchargePercent: c.contract?.nightSurchargePercent ?? 15,
    });
  };

  const handleSaveClientEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageClients || !editingClient) return;
    const updatedPayload: Partial<CorporateClient> = {
      companyName: clientFormData.companyName,
      company_name: clientFormData.companyName,
      gstin: clientFormData.gstin,
      gst_number: clientFormData.gstin,
      contactPerson: clientFormData.contactPerson,
      contact_person: clientFormData.contactPerson,
      email: clientFormData.email,
      phone: clientFormData.phone,
      mobile_number: clientFormData.phone,
      address: clientFormData.city,
      contract: {
        ...editingClient.contract,
        id:
          editingClient.contract?.id ||
          `CNT-${Math.floor(100 + Math.random() * 900)}`,
        tierName: clientFormData.tierName,
        baseRatePerKm: clientFormData.baseRatePerKm,
        extraHourRate: clientFormData.extraHourRate,
        nightSurchargePercent: clientFormData.nightSurchargePercent,
        tollPolicy: editingClient.contract?.tollPolicy || "Billed to Client",
        contractStart: editingClient.contract?.contractStart || "Aug 01, 2026",
        contractEnd: editingClient.contract?.contractEnd || "Jul 31, 2027",
        status: editingClient.contract?.status || "Active",
      },
    };
    setClient((prev) => (prev ? { ...prev, ...updatedPayload } : prev));
    setEditingClient(null);
    try {
      await clientApi.updateClient(editingClient.id, updatedPayload);
    } catch {
      console.warn("Update API call failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-6 animate-pulse">
        <div className="h-8 bg-neutral-100 rounded-lg w-40" />
        <div className="h-32 bg-neutral-100 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <>
      <ClientDetailScreen
        client={client}
        canManageClients={canManageClients}
        onBackToOverview={() => navigate("/clients")}
        onToggleBlacklist={handleToggleBlacklist}
        onDeleteClient={handleDeleteClient}
        onEditClientClick={handleEditClientClick}
      />
      {editingClient && (
        <ClientFormModal
          isOpen={true}
          editingClient={editingClient}
          formData={clientFormData}
          setFormData={setClientFormData}
          onClose={() => setEditingClient(null)}
          onSubmit={handleSaveClientEdit}
        />
      )}
    </>
  );
}

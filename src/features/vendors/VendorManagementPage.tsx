import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";
import { vendorApi } from "@/api";
import type { Vendor } from "./types";
import { mapApiVendor } from "./types";
import VendorOverviewScreen from "./components/VendorOverviewScreen";
import VendorFormModal from "./components/VendorFormModal";
import VendorOnboardingWizard from "./components/VendorOnboardingWizard";
import { useVendorEditModal } from "./hooks/useVendorEditModal";

/**
 * VendorManagementPage — rendered at /vendors
 * Shows the vendors list/overview. Navigates to /vendors/:id for detail drawer.
 */
function VendorManagementPageComponent() {
  const { hasPermission, isSuperAdmin } = usePermission();
  const canManageVendors = isSuperAdmin || hasPermission("VENDORS_MANAGE");
  const navigate = useNavigate();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>("all");

  // Edit vendor modal hook
  const {
    editingVendor,
    formData,
    setFormData,
    handleEditVendorClick,
    closeEditModal,
  } = useVendorEditModal();

  // Fetch real vendors data from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchVendorsData = async () => {
      setLoading(true);
      try {
        const res = await vendorApi.getVendors();
        const rawData: any[] = Array.isArray(res)
          ? res
          : (res as any).data || (res as any).vendors || [];
        if (isMounted && Array.isArray(rawData)) {
          setVendors(rawData.map((item, idx) => mapApiVendor(item, idx)));
        }
      } catch {
        console.warn("Backend vendor API fetch returned error");
        if (isMounted) setVendors([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVendorsData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized filter vendors logic
  const filteredVendors = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return vendors.filter((v) => {
      const matchesSearch =
        !query ||
        v.name.toLowerCase().includes(query) ||
        v.companyName.toLowerCase().includes(query) ||
        v.contactPerson.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query) ||
        v.city.toLowerCase().includes(query) ||
        v.id.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatusFilter === "all" || v.status === selectedStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchTerm, selectedStatusFilter]);

  // Handlers
  const handleVendorAdded = useCallback(
    (newVendor: Vendor) => {
      setVendors((prev) => [newVendor, ...prev]);
      setShowOnboarding(false);
      navigate(`/vendors/${newVendor.id}`);
    },
    [navigate],
  );

  const handleSuspendToggle = useCallback(
    async (id: string) => {
      if (!canManageVendors) return;
      let targetStatus = "suspended";
      setVendors((prev) =>
        prev.map((v) => {
          if (v.id === id) {
            const nextStatus =
              v.status === "suspended" ? "active" : "suspended";
            targetStatus = nextStatus;
            return { ...v, status: nextStatus };
          }
          return v;
        }),
      );
      try {
        await vendorApi.toggleStatus(id, targetStatus);
      } catch {
        console.warn("SuspendToggle API call failed");
      }
    },
    [canManageVendors],
  );

  const handleDeleteVendor = useCallback(
    async (id: string) => {
      if (!canManageVendors) return;
      // TODO: Replace with an in-app confirmation modal
      if (
        !window.confirm("Are you sure you want to delete this vendor partner?")
      )
        return;
      setVendors((prev) => prev.filter((v) => String(v.id) !== String(id)));
      try {
        await vendorApi.deleteVendor(id);
      } catch {
        console.warn("Backend deleteVendor API call returned error");
      }
    },
    [canManageVendors],
  );

  const handleSaveVendor = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canManageVendors || !editingVendor) return;
      setVendors((prev) =>
        prev.map((v) =>
          v.id === editingVendor.id ? { ...v, ...formData } : v,
        ),
      );
      closeEditModal();
      try {
        await vendorApi.updateVendor(editingVendor.id, formData);
      } catch {
        console.warn("Backend updateVendor API call failed");
      }
    },
    [canManageVendors, editingVendor, formData, closeEditModal],
  );

  if (!loading && showOnboarding) {
    return (
      <VendorOnboardingWizard
        onBackToOverview={() => setShowOnboarding(false)}
        onVendorAdded={handleVendorAdded}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full mx-auto flex-1">
      <VendorOverviewScreen
        vendors={vendors}
        filteredVendors={filteredVendors}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatusFilter={selectedStatusFilter}
        onStatusFilterChange={setSelectedStatusFilter}
        canManageVendors={canManageVendors}
        onAddVendorClick={() => setShowOnboarding(true)}
        onVendorDetailClick={(vendor) => navigate(`/vendors/${vendor.id}`)}
        onEditVendorClick={handleEditVendorClick}
        onSuspendToggle={handleSuspendToggle}
        onDeleteVendor={handleDeleteVendor}
        isLoading={loading}
      />

      {/* Edit Vendor Modal */}
      {editingVendor && (
        <VendorFormModal
          isOpen={true}
          editingVendor={editingVendor}
          formData={formData}
          setFormData={setFormData}
          onClose={closeEditModal}
          onSubmit={handleSaveVendor}
        />
      )}
    </div>
  );
}

export default React.memo(VendorManagementPageComponent);

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useAdminContext } from "../context/AdminContext";
import { useGuestContext } from "../context/GuestContext";
import GuestDetailModal from "../components/GuestDetailModal";

function AdminPanel() {
  const { user } = useAdminContext();
  const { guests, loading, fetchAllGuests } = useGuestContext();
  const [selectedGuest, setSelectedGuest] = useState(null);

  useEffect(() => {
    fetchAllGuests();
  }, []);

  const sortedGuests = useMemo(
    () => [...guests].sort((a, b) => a.surname.localeCompare(b.surname)),
    [guests],
  );

  const stats = useMemo(() => {
    const attending = guests.filter((g) => g.isAttending);
    const notAttending = guests.filter((g) => !g.isAttending);
    const attendingCount = attending.reduce(
      (sum, g) => sum + g.personsCount,
      0,
    );
    return {
      attendingCount: attending.length,
      notAttendingCount: notAttending.length,
      headcount: attendingCount,
    };
  }, [guests]);

  const handleExport = () => console.log("exporting list");

  return (
    <section className="min-h-screen bg-admin-bg px-4 py-6 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="text-admin-text-muted text-sm">
            {user?.username}
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-admin-surface border border-admin-border text-admin-text text-sm rounded-lg px-3 py-2 hover:border-admin-accent transition-colors"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <h1 className="text-admin-text text-2xl font-semibold mb-4">
          Guest List
        </h1>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard
            label="Attending"
            value={stats.attendingCount}
            color="text-admin-success"
          />
          <StatCard
            label="Not Attending"
            value={stats.notAttendingCount}
            color="text-admin-danger"
          />
          <StatCard
            label="Total Headcount"
            value={stats.headcount}
            color="text-admin-accent"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-admin-accent" />
          </div>
        ) : (
          <div className="bg-admin-surface border border-admin-border rounded-2xl overflow-hidden">
            {sortedGuests.length === 0 ? (
              <p className="text-admin-text-muted text-sm text-center py-8">
                No guests yet
              </p>
            ) : (
              sortedGuests.map((guest) => (
                <button
                  key={guest._id}
                  onClick={() => setSelectedGuest(guest)}
                  className="w-full flex items-center justify-between px-4 py-3 border-b border-admin-border last:border-b-0 hover:bg-admin-bg/50 transition-colors text-left"
                >
                  <span className="text-admin-text text-sm font-medium">
                    {guest.surname} {guest.name}
                  </span>
                  <div className="flex items-center gap-3">
                    {guest.isAttending && (
                      <span className="text-admin-text-muted text-xs">
                        {guest.personsCount} pax
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        guest.isAttending
                          ? "bg-admin-success/20 text-admin-success"
                          : "bg-admin-danger/20 text-admin-danger"
                      }`}
                    >
                      {guest.isAttending ? "Attending" : "Not Attending"}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedGuest && (
        <GuestDetailModal
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
          onUpdated={setSelectedGuest}
        />
      )}
    </section>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-admin-surface border border-admin-border rounded-xl p-3 text-center">
      <p className={`text-xl font-semibold ${color}`}>{value}</p>
      <p className="text-admin-text-muted text-xs mt-1">{label}</p>
    </div>
  );
}

export default AdminPanel;

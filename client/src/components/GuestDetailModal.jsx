import { useState } from "react";
import { X, Pencil, Trash2, Check, Loader2 } from "lucide-react";
import { useGuestContext } from "../context/GuestContext";

function GuestDetailModal({ guest, onClose, onUpdated }) {
  const { updateGuest, deleteGuest, loading } = useGuestContext();
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({
    name: guest.name,
    surname: guest.surname,
    isAttending: guest.isAttending,
    personsCount: guest.personsCount,
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    const updated = await updateGuest(guest._id, form);
    if (updated) {
      onUpdated(updated);
      setEditMode(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteGuest(guest._id);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-md bg-admin-surface border border-admin-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-admin-text text-lg font-semibold">
            {guest.surname} {guest.name}
          </h2>
          <button
            onClick={onClose}
            className="text-admin-text-muted hover:text-admin-text"
          >
            <X size={20} />
          </button>
        </div>

        {!editMode ? (
          <div className="space-y-3">
            <Detail
              label="Status"
              value={
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    guest.isAttending
                      ? "bg-admin-success/20 text-admin-success"
                      : "bg-admin-danger/20 text-admin-danger"
                  }`}
                >
                  {guest.isAttending ? "Attending" : "Not Attending"}
                </span>
              }
            />
            {guest.isAttending && (
              <Detail label="Persons Count" value={guest.personsCount} />
            )}
            <Detail
              label="Submitted"
              value={new Date(guest.createdAt).toLocaleString()}
            />
            <Detail
              label="Last Updated"
              value={new Date(guest.updatedAt).toLocaleString()}
            />

            {!confirmDelete ? (
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 bg-admin-accent text-admin-bg font-medium rounded-lg py-2 flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex-1 bg-admin-danger text-admin-text font-medium rounded-lg py-2 flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-admin-border mt-4">
                <p className="text-admin-text text-sm mb-3">
                  Delete {guest.name} {guest.surname}? This can't be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 bg-admin-border text-admin-text rounded-lg py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 bg-admin-danger text-admin-text rounded-lg py-2 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <Field
              label="Name"
              value={form.name}
              onChange={(v) => handleChange("name", v)}
            />
            <Field
              label="Surname"
              value={form.surname}
              onChange={(v) => handleChange("surname", v)}
            />

            <div>
              <label className="text-admin-text-muted text-sm mb-1 block">
                Status
              </label>
              <select
                value={form.isAttending ? "yes" : "no"}
                onChange={(e) =>
                  handleChange("isAttending", e.target.value === "yes")
                }
                className="w-full bg-admin-bg border border-admin-border text-admin-text rounded-lg py-2 px-3 outline-none focus:border-admin-accent"
              >
                <option value="yes">Attending</option>
                <option value="no">Not Attending</option>
              </select>
            </div>

            {form.isAttending && (
              <Field
                label="Persons Count"
                type="number"
                value={form.personsCount}
                onChange={(v) => handleChange("personsCount", Number(v))}
              />
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-admin-border text-admin-text rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-admin-accent text-admin-bg font-medium rounded-lg py-2 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Check size={16} /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-admin-text-muted text-sm">{label}</span>
      <span className="text-admin-text text-sm font-medium">{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-admin-text-muted text-sm mb-1 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-admin-bg border border-admin-border text-admin-text rounded-lg py-2 px-3 outline-none focus:border-admin-accent"
      />
    </div>
  );
}

export default GuestDetailModal;

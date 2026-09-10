import axios from "../config/axios.js";
import { createContext, useContext, useState } from "react";

const GuestContext = createContext(null);
export const useGuestContext = () => useContext(GuestContext);

const GuestProvider = ({ children }) => {
  const [guests, setGuests] = useState([]);
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // public - the guest sumbitts his data
  const addGuest = async (guestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/guests/add", guestData);
      return response.data.guest;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit RSVP");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // admin - open guest details
  const findGuest = async (guestId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/guests/find/${guestId}`);
      setGuest(response.data.guest);
      return response.data.guest;
    } catch (err) {
      setError(err.response?.data?.message || "Guest not found");
      setGuest(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // admin - fetch all guests
  const fetchAllGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/guests/all");
      setGuests(response.data.guests);
      return response.data.guests;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch guests");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // admin - delete guest by id
  const deleteGuest = async (guestId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/guests/delete/${guestId}`);
      setGuests((prev) => prev.filter((g) => g._id !== guestId));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete guest");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // admin - update guest by id
  const updateGuest = async (guestId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/guests/edit/${guestId}`, updates);
      setGuests((prev) =>
        prev.map((g) => (g._id === guestId ? response.data.guest : g)),
      );
      return response.data.guest;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update guest");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestContext.Provider
      value={{
        guests,
        guest,
        loading,
        error,
        addGuest,
        findGuest,
        fetchAllGuests,
        deleteGuest,
        updateGuest,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
};

export default GuestProvider;

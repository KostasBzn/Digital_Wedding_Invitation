import axios from "../config/axios.js";
import { createContext, useContext, useState } from "react";

const InvitationContext = createContext(null);
export const useInvitationContext = () => useContext(InvitationContext);

const InvitationProvider = ({ children }) => {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <InvitationContext.Provider
      value={{
        guest,
        setGuest,
        loading,
        setLoading,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
};

export default InvitationProvider;

import React, { createContext, useState, useMemo } from "react";
import axios from "axios";

export const UserDataContext = createContext({
  user: null,
  setUser: () => {},
  items: [],
  setItems: () => {},
  backendUrl: "",
});
const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const backendUrl = useMemo(() => import.meta.env.VITE_BASE_URL, []);

  const getItems = async () => {
    try {
      const itemRes = await axios.get(`${backendUrl}/items`, {
        withCredentials: true,
      });
      if (itemRes.status == 200) {
        // console.log(itemRes.data);
        setItems(itemRes.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const getUser = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${backendUrl}/users/profile`);
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <UserDataContext.Provider
      value={{ user, setUser, getUser, items, setItems, backendUrl, getItems }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;

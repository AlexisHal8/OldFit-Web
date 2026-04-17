import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// URL fija sin condicionales de desarrollo
const BASE_URL = "https://backendoldfit-production.up.railway.app"; 

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      // Leemos el usuario directamente de tu sistema actual
      const usuarioGuardado = localStorage.getItem('usuario');
      
      if (usuarioGuardado && usuarioGuardado !== "undefined") {
        set({ authUser: JSON.parse(usuarioGuardado) });
        // Si hay usuario, conectamos los Sockets en tiempo real
        get().connectSocket(); 
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      console.log("Error en authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("¡Cuenta creada con éxito!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al registrarse");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Sesión iniciada");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al iniciar sesión");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Sesión cerrada");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  },

  updateProfile: async (data) => {
  try {
    // 'data' debe ser { profilePic: "data:image/..." }
    const res = await axiosInstance.put("/auth/update-profile", data);
    
    // 1. Actualizamos el estado de Zustand
    set({ authUser: res.data });
    
    // 2. CRÍTICO: Actualizamos el localStorage para que persista al recargar
    localStorage.setItem("usuario", JSON.stringify(res.data));
    
    toast.success("Perfil actualizado");
  } catch (error) {
    console.log("Error en updateProfile store:", error);
    toast.error(error.response?.data?.message || "Error al actualizar");
  }
},

  connectSocket: () => {
    const { authUser } = get();
    // Validamos que el usuario exista (sea cliente o geriatra)
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
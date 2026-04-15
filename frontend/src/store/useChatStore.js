import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    const nextState = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", nextState);
    set({ isSoundEnabled: nextState });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error("Error al cargar contactos");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      // ✅ Corregido: ruta que ahora existe en el backend
      const res = await axiosInstance.get("/messages/conversations");
      set({ chats: res.data });
    } catch (error) {
      toast.error("Error al cargar chats activos");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (targetId) => {
    set({ isMessagesLoading: true });
    try {
      // ✅ Corregido: el backend ahora resuelve la conversación por targetId
      const res = await axiosInstance.get(`/messages/${targetId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error("No se pudieron cargar los mensajes");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    // ✅ Corregido: authUser usa .id (aliasado en el backend), no .id_cliente/.id_geriatra
    const { authUser } = useAuthStore.getState();

    const optimisticMessage = {
      id_mensaje: Date.now(),
      id_remitente: authUser.id,
      // ✅ Corregido: campo correcto
      contenido_texto: messageData.contenido_texto,
      fecha_envio: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      // ✅ Corregido: ruta sin param en URL, targetId va en el body
      const res = await axiosInstance.post("/messages/send", {
        targetId: selectedUser.id,
        contenido_texto: messageData.contenido_texto,
      });
      set({ messages: [...get().messages.filter(m => !m.isOptimistic), res.data] });
    } catch (error) {
      set({ messages: messages.filter(m => !m.isOptimistic) });
      toast.error("Error al enviar mensaje");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      // ✅ Corregido: comparamos con selectedUser.id (ya normalizado)
      if (newMessage.id_remitente !== selectedUser.id) return;
      set({ messages: [...get().messages, newMessage] });

      if (get().isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.play().catch((e) => console.log("Error de audio:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },
}));
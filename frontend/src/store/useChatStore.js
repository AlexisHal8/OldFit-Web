import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null, // Este objeto ahora tendrá id_cliente o id_geriatra
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
    const { authUser } = useAuthStore.getState();

    // Identificar el ID actual (puede ser id_cliente o id_geriatra)
    const myId = authUser.id_cliente || authUser.id_geriatra;
    const targetId = selectedUser.id_cliente || selectedUser.id_geriatra;

    const optimisticMessage = {
      id_mensaje: Date.now(), // ID temporal numérico
      id_remitente: myId,
      contenido_texto: messageData.text,
      fecha_envio: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${targetId}`, messageData);
      // Reemplazamos los mensajes con la respuesta real del servidor (Postgres)
      set({ messages: [...get().messages.filter(m => !m.isOptimistic), res.data] });
    } catch (error) {
      set({ messages: messages.filter(m => !m.isOptimistic) });
      toast.error("Error al enviar mensaje");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const targetId = selectedUser.id_cliente || selectedUser.id_geriatra;

    socket.on("newMessage", (newMessage) => {
      // Validamos que el mensaje venga de la persona con la que estamos hablando
      if (newMessage.id_remitente !== targetId) return;

      set({ messages: [...get().messages, newMessage] });

      if (isSoundEnabled) {
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
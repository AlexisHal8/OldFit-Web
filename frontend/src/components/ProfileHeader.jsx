import { useState, useRef } from "react";
import { LogOutIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-emerald-200 group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser?.foto_perfil || "/avatar.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <span className="text-white text-[10px] font-semibold">Cambiar</span>
              </div>
            </button>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold text-sm truncate max-w-[160px]">
              Dr(a). {authUser?.nombre}
            </h3>
            <p className="text-emerald-600 text-xs font-medium">En línea</p>
          </div>
        </div>

        
      </div>
    </div>
  );
}
export default ProfileHeader;
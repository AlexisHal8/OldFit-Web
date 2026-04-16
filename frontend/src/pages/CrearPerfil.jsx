//CrearPerfil.jsx
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { 
  UserPlus, Mail, Lock, IdCard, Calendar, 
  Hash, ChevronRight, CheckCircle2, AlertCircle, Eye, EyeOff
} from "lucide-react";
import toast from "react-hot-toast";

// NOTA: El endpoint /api/auth/signup procesa: nombre, apellidop, correo, contrasena, rol
// Los campos apellidom, cedula, rfc y fecha_de_nacimiento están en el schema pero
// requieren un endpoint PUT /api/auth/update-profile adicional para guardarse.
// El formulario los recoge para cuando ese endpoint esté disponible.

export default function CrearPerfil() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidop: "",
    apellidom: "",
    correo: "",
    contrasena: "",
    fecha_de_nacimiento: "",
    cedula: "",
    rfc: "",
    rol: "geriatra",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [creado, setCreado]             = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.apellidop || !formData.correo || !formData.contrasena) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (formData.contrasena.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      // Solo enviamos los campos que el backend de signup acepta
      await axiosInstance.post("/auth/signup", {
        nombre:    formData.nombre,
        apellidop: formData.apellidop,
        correo:    formData.correo,
        contrasena: formData.contrasena,
        rol:       formData.rol,
      });

      setCreado(true);
      toast.success(`Geriatra ${formData.nombre} ${formData.apellidop} registrado con éxito.`);

      setFormData({
        nombre: "", apellidop: "", apellidom: "", correo: "",
        contrasena: "", fecha_de_nacimiento: "", cedula: "", rfc: "", rol: "geriatra",
      });

      setTimeout(() => setCreado(false), 4000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear el perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, icon: Icon, required = false, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label} {required && <span className="text-cyan-400">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />}
        {children || (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className={`w-full bg-slate-800/60 border border-slate-700/60 rounded-lg py-2.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/70 focus:bg-slate-800 transition-all ${Icon ? "pl-10 pr-4" : "px-4"}`}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-start justify-center py-12 px-4">
      {/* Decoradores de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative w-full max-w-2xl">

        {/* Cabecera */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="w-6 h-px bg-cyan-400" />
            Panel de Administración
          </div>
          <h1 className="text-3xl font-bold text-white">
            Registrar nuevo <span className="text-cyan-400">geriatra</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Los campos marcados con <span className="text-cyan-400">*</span> son obligatorios para crear la cuenta.
          </p>
        </div>

        {/* Éxito banner */}
        {creado && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            El geriatra ha sido registrado. Se le enviará un correo de bienvenida.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── SECCIÓN 1: Datos de cuenta ── */}
          <section className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6 space-y-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Datos de acceso</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Nombre(s)" name="nombre" placeholder="Ej. Roberto" icon={null} required />
              <InputField label="Apellido Paterno" name="apellidop" placeholder="Ej. Méndez" icon={null} required />
              <InputField label="Apellido Materno" name="apellidom" placeholder="Ej. Ruiz (opcional)" icon={null} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Rol <span className="text-cyan-400">*</span>
                </label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/70 transition-all"
                >
                  <option value="geriatra">Geriatra</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            </div>

            <InputField label="Correo electrónico" name="correo" type="email" placeholder="dr.roberto@oldfit.com" icon={Mail} required />

            {/* Contraseña con toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Contraseña temporal <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg pl-10 pr-11 py-2.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/70 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3 h-3" />
                El geriatra deberá cambiarla en su primer inicio de sesión.
              </p>
            </div>
          </section>

          {/* ── SECCIÓN 2: Datos profesionales ── */}
          <section className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6 space-y-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <IdCard className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Información profesional</h2>
                <p className="text-xs text-slate-600 mt-0.5">Estos datos se guardarán en una actualización de perfil posterior.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Fecha de nacimiento"
                name="fecha_de_nacimiento"
                type="date"
                icon={Calendar}
                placeholder=""
              />
              <InputField
                label="Cédula profesional"
                name="cedula"
                placeholder="Número de cédula"
                icon={IdCard}
              />
              <div className="sm:col-span-2">
                <InputField
                  label="RFC"
                  name="rfc"
                  placeholder="MENR850101ABC"
                  icon={Hash}
                />
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg px-4 py-3 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">
                La cédula y el RFC son únicos en el sistema. Si ya existe un registro con esos datos se rechazará el guardado. Pueden quedar vacíos por ahora.
              </p>
            </div>
          </section>

          {/* ── Acciones ── */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setFormData({ nombre: "", apellidop: "", apellidom: "", correo: "", contrasena: "", fecha_de_nacimiento: "", cedula: "", rfc: "", rol: "geriatra" })}
              className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 border border-slate-700/60 rounded-lg hover:border-slate-600 transition-all"
            >
              Limpiar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-sm font-bold rounded-lg transition-all active:scale-95"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {isLoading ? "Registrando..." : "Crear cuenta de geriatra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
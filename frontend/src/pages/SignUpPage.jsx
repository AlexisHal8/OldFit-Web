import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidop: "",
    correo: "",
    contrasena: "",
    rol: "geriatra", // valor por defecto; ajusta según tu flujo
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Crear cuenta</h2>
                  <p className="text-slate-400">Regístrate para acceder a OldFit</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="auth-input-label">Nombre</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="input"
                        placeholder="Juan"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-input-label">Apellido</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.apellidop}
                        onChange={(e) => setFormData({ ...formData, apellidop: e.target.value })}
                        className="input"
                        placeholder="García"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-input-label">Correo</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        className="input"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-input-label">Contraseña</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.contrasena}
                        onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                        className="input"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-input-label">Rol</label>
                    <select
                      value={formData.rol}
                      onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                      className="input"
                    >
                      <option value="geriatra">Geriatra</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>

                  <button className="auth-btn" type="submit" disabled={isSigningUp}>
                    {isSigningUp ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Crear cuenta"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    ¿Ya tienes cuenta? Inicia sesión
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img src="/signup.png" alt="Ilustración de registro" className="w-full h-auto object-contain" />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">Comienza tu camino hoy</h3>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Gratis</span>
                    <span className="auth-badge">Fácil configuración</span>
                    <span className="auth-badge">Privado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default SignUpPage;
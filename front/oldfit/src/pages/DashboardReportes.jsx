//DashboardReportes.jsx

import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { 
  Users, BrainCircuit, Dumbbell, Pill, FileDown,
  ChevronRight, Loader2, Search, Brain, Hash, 
  BookOpen, Calculator, Trophy, Clock, CheckCircle2,
  AlertCircle, Activity, X
} from "lucide-react";
import toast from "react-hot-toast";

// Mapeo de juegos a iconos y colores
const GAME_CONFIG = {
  "Memorama de Frutas": { icon: Brain,       color: "violet", label: "Memoria",   area: "Memoria"    },
  "Sudoku Simple":      { icon: Hash,        color: "blue",   label: "Atención",  area: "Atención"   },
  "Cálculo Rápido":    { icon: Calculator,  color: "amber",  label: "Cálculo",   area: "Cálculo"    },
  "Lenguaje":           { icon: BookOpen,    color: "emerald",label: "Lenguaje",  area: "Lenguaje"   },
};

const colorMap = {
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20"  },
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20"    },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20"   },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
};

export default function DashboardReportes() {
  const [patients,         setPatients]         = useState([]);
  const [selectedPatient,  setSelectedPatient]  = useState(null);
  const [patientData,      setPatientData]      = useState(null);
  const [isLoadingList,    setIsLoadingList]    = useState(true);
  const [isLoadingData,    setIsLoadingData]    = useState(false);
  const [isGeneratingPDF,  setIsGeneratingPDF]  = useState(false);
  const [search,           setSearch]           = useState("");
  const [activeSection,    setActiveSection]    = useState("cognitivo");

  // Obtener lista de pacientes del geriatra
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axiosInstance.get("/messages/contacts");
        // Solo mostramos clientes con rol 'Persona Mayor'
        setPatients(res.data.filter(c => c.rol === "Persona Mayor"));
      } catch {
        toast.error("No se pudo cargar la lista de pacientes.");
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchPatients();
  }, []);

  // Obtener datos del paciente seleccionado
  useEffect(() => {
    if (!selectedPatient) return;
    const fetchData = async () => {
      setIsLoadingData(true);
      setPatientData(null);
      try {
        const res = await axiosInstance.get(`/evaluations/patient/${selectedPatient.id}`);
        setPatientData(res.data);
      } catch {
        toast.error("No se pudo cargar el historial del paciente.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [selectedPatient]);

  // Generar y descargar PDF
  const handleGeneratePDF = async () => {
    if (!selectedPatient) return;
    setIsGeneratingPDF(true);
    try {
      const res = await axiosInstance.post("/evaluations", {
        patientId: selectedPatient.id,
        type: "Reporte Integral",
        results: {
          sesiones_cognitivas: patientData?.evaluaciones_cognitivas?.length ?? 0,
          evaluaciones_fisicas: patientData?.evaluaciones_fisicas?.length ?? 0,
          medicamentos_activos: patientData?.medicamentos_activos?.length ?? 0,
        },
      });
      // Abrir el PDF en nueva pestaña
      if (res.data.pdf_url) {
        window.open(res.data.pdf_url, "_blank");
        toast.success("Reporte generado exitosamente.");
      }
    } catch {
      toast.error("Error al generar el reporte PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Agrupar evaluaciones cognitivas por juego
  const getCognitivoByGame = () => {
    if (!patientData?.evaluaciones_cognitivas) return {};
    return patientData.evaluaciones_cognitivas.reduce((acc, sesion) => {
      const key = sesion.titulo;
      if (!acc[key]) acc[key] = [];
      acc[key].push(sesion);
      return acc;
    }, {});
  };

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const cognitivoAgrupado = getCognitivoByGame();

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* Sidebar: Lista de pacientes */}
      <aside className="w-72 shrink-0 border-r border-slate-800/80 flex flex-col bg-slate-900/50">
        <div className="p-5 border-b border-slate-800/80">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Mis Pacientes
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg pl-9 pr-4 py-2 text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {isLoadingList ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">Sin pacientes asignados.</p>
          ) : filteredPatients.map(patient => (
            <button
              key={patient.id}
              onClick={() => { setSelectedPatient(patient); setActiveSection("cognitivo"); }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all group ${
                selectedPatient?.id === patient.id
                  ? "bg-cyan-500/15 border border-cyan-500/30 text-white"
                  : "hover:bg-slate-800/60 text-slate-400 border border-transparent"
              }`}
            >
              <div className={`w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ${selectedPatient?.id === patient.id ? "ring-cyan-500/50" : "ring-slate-700"}`}>
                <img src={patient.profilePic || "/avatar.png"} alt={patient.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{patient.fullName}</p>
                <p className="text-xs text-slate-600">Persona Mayor</p>
              </div>
              <ChevronRight className={`w-4 h-4 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${selectedPatient?.id === patient.id ? "opacity-100 text-cyan-400" : ""}`} />
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {!selectedPatient ? (
          /* Estado vacío */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-6">
              <Activity className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Selecciona un paciente</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Elige un paciente del panel izquierdo para ver sus evaluaciones cognitivas, físicas y medicamentos.
            </p>
          </div>
        ) : (
          <>
            {/* Header del paciente */}
            <div className="border-b border-slate-800/80 px-8 py-5 flex items-center justify-between bg-slate-900/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-cyan-500/30">
                  <img src={selectedPatient.profilePic || "/avatar.png"} alt={selectedPatient.fullName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">{selectedPatient.fullName}</h1>
                  <p className="text-xs text-slate-500">Persona Mayor · ID #{selectedPatient.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Tabs de sección */}
                <div className="flex bg-slate-800/60 rounded-lg p-1 gap-1">
                  {[
                    { id: "cognitivo", label: "Cognitivo",  icon: BrainCircuit },
                    { id: "fisico",    label: "Físico",     icon: Dumbbell     },
                    { id: "medicamentos", label: "Medicamentos", icon: Pill    },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeSection === tab.id
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Botón PDF */}
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF || !patientData}
                  className="flex items-center gap-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-bold rounded-lg transition-all active:scale-95"
                >
                  {isGeneratingPDF
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <FileDown className="w-4 h-4" />
                  }
                  {isGeneratingPDF ? "Generando..." : "Exportar PDF"}
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {isLoadingData ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mr-3" />
                  <span className="text-slate-500 text-sm">Cargando historial del paciente...</span>
                </div>
              ) : patientData ? (
                <>
                  {/* ── TAB: EVALUACIONES COGNITIVAS ── */}
                  {activeSection === "cognitivo" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <BrainCircuit className="w-5 h-5 text-cyan-400" />
                          Evaluaciones Cognitivas
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                          Historial de sesiones de juego realizadas desde la app móvil, agrupadas por actividad.
                        </p>
                      </div>

                      {Object.keys(cognitivoAgrupado).length === 0 ? (
                        <EmptyState mensaje="Sin sesiones cognitivas registradas para este paciente." />
                      ) : (
                        <div className="space-y-6">
                          {Object.entries(cognitivoAgrupado).map(([juego, sesiones]) => {
                            const cfg    = GAME_CONFIG[juego] || { icon: BrainCircuit, color: "blue", label: "Cognitivo" };
                            const colors = colorMap[cfg.color];
                            const IconComponent = cfg.icon;

                            // Métricas promedio del juego
                            const avg = (field) => {
                              const valid = sesiones.filter(s => s[field] != null);
                              return valid.length ? Math.round(valid.reduce((a, s) => a + s[field], 0) / valid.length) : null;
                            };

                            return (
                              <div key={juego} className={`rounded-xl border ${colors.border} bg-slate-900/60 overflow-hidden`}>
                                {/* Header del juego */}
                                <div className={`flex items-center justify-between px-5 py-4 ${colors.bg}`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                                      <IconComponent className={`w-5 h-5 ${colors.text}`} />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-white text-sm">{juego}</h3>
                                      <p className={`text-xs ${colors.text}`}>{cfg.label} · {sesiones.length} sesión{sesiones.length !== 1 ? "es" : ""}</p>
                                    </div>
                                  </div>

                                  {/* Promedios */}
                                  <div className="hidden sm:flex items-center gap-4 text-xs">
                                    {[
                                      { label: "Puntaje prom.", value: avg("puntaje"), icon: Trophy   },
                                      { label: "Tiempo prom.", value: avg("tiempo") ? `${avg("tiempo")}s` : null, icon: Clock },
                                    ].map(m => m.value !== null && (
                                      <div key={m.label} className="text-center">
                                        <p className={`font-bold text-base ${colors.text}`}>{m.value}</p>
                                        <p className="text-slate-500">{m.label}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Tabla de sesiones */}
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-slate-800">
                                        {["Fecha", "Puntaje", "Aciertos", "Errores", "Tiempo"].map(h => (
                                          <th key={h} className="text-left px-5 py-2.5 text-slate-500 font-semibold uppercase tracking-wider">{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                      {sesiones.map((s, i) => (
                                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                          <td className="px-5 py-3 text-slate-400">
                                            {s.fecha ? new Date(s.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                          </td>
                                          <td className="px-5 py-3">
                                            <span className={`font-bold ${colors.text}`}>{s.puntaje ?? "—"}</span>
                                          </td>
                                          <td className="px-5 py-3 text-emerald-400 font-medium">{s.aciertos ?? "—"}</td>
                                          <td className="px-5 py-3 text-red-400 font-medium">{s.errores ?? "—"}</td>
                                          <td className="px-5 py-3 text-slate-400">{s.tiempo != null ? `${s.tiempo}s` : "—"}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB: EVALUACIONES FÍSICAS ── */}
                  {activeSection === "fisico" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Dumbbell className="w-5 h-5 text-cyan-400" />
                          Evaluaciones Físicas
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Actividades físicas registradas directamente por el geriatra.</p>
                      </div>

                      {patientData.evaluaciones_fisicas.length === 0 ? (
                        <EmptyState mensaje="Sin evaluaciones físicas registradas." />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {patientData.evaluaciones_fisicas.map((ev, i) => (
                            <div key={i} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-white text-sm">{ev.titulo || ev.nombre_ejercicio}</h3>
                                <span className="text-xs text-slate-500">
                                  {ev.fecha ? new Date(ev.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short" }) : "—"}
                                </span>
                              </div>
                              <p className="text-cyan-400 text-sm font-semibold mb-2">{ev.metrica}</p>
                              {ev.observaciones && (
                                <p className="text-xs text-slate-500 bg-slate-800/40 px-3 py-2 rounded-lg">
                                  {ev.observaciones}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB: MEDICAMENTOS ── */}
                  {activeSection === "medicamentos" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Pill className="w-5 h-5 text-cyan-400" />
                          Medicamentos Activos
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Tratamientos vigentes del paciente.</p>
                      </div>

                      {patientData.medicamentos_activos.length === 0 ? (
                        <EmptyState mensaje="Sin medicamentos activos registrados." />
                      ) : (
                        <div className="space-y-3">
                          {patientData.medicamentos_activos.map((m, i) => (
                            <div key={i} className="bg-slate-900/60 border border-slate-800/80 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <h3 className="font-bold text-white">{m.nombre_medicamento}</h3>
                                <p className="text-sm text-slate-400 mt-0.5">{m.dosis} · cada {m.frecuencia_horas}h</p>
                                {m.indicaciones && <p className="text-xs text-slate-600 mt-1">{m.indicaciones}</p>}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                                <div className="text-center">
                                  <p className="text-white font-medium">{m.fecha_inicio ?? "—"}</p>
                                  <p>Inicio</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-white font-medium">{m.fecha_fin ?? "Crónico"}</p>
                                  <p>Fin</p>
                                </div>
                                <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full font-semibold">
                                  <CheckCircle2 className="w-3 h-3" /> Activo
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <EmptyState mensaje="No se pudo cargar la información del paciente." />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Componente auxiliar
function EmptyState({ mensaje }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-slate-600" />
      </div>
      <p className="text-slate-500 text-sm max-w-xs">{mensaje}</p>
    </div>
  );
}
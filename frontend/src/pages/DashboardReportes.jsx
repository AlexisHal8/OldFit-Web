import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import {
  Users, BrainCircuit, Dumbbell, Pill, FileDown,
  ChevronRight, Loader2, Search, Brain, Hash,
  BookOpen, Calculator, Trophy, Clock, CheckCircle2,
  AlertCircle, Activity,
} from "lucide-react";
import toast from "react-hot-toast";

const GAME_CONFIG = {
  "Memorama de Frutas": { icon: Brain,       color: "violet", label: "Memoria"  },
  "Sudoku Simple":      { icon: Hash,        color: "blue",   label: "Atención" },
  "Cálculo Rápido":    { icon: Calculator,  color: "amber",  label: "Cálculo"  },
  "Lenguaje":           { icon: BookOpen,    color: "emerald",label: "Lenguaje" },
};

const colorMap = {
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100",  badge: "bg-violet-100"  },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100",    badge: "bg-blue-100"    },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   badge: "bg-amber-100"   },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", badge: "bg-emerald-100" },
};

export default function DashboardReportes() {
  const [patients,        setPatients]        = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData,     setPatientData]     = useState(null);
  const [isLoadingList,   setIsLoadingList]   = useState(true);
  const [isLoadingData,   setIsLoadingData]   = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [search,          setSearch]          = useState("");
  const [activeSection,   setActiveSection]   = useState("cognitivo");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axiosInstance.get("/messages/contacts");
        setPatients(res.data.filter(c => c.rol === "Persona Mayor"));
      } catch {
        toast.error("No se pudo cargar la lista de pacientes.");
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchPatients();
  }, []);

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

  const handleGeneratePDF = async () => {
    if (!selectedPatient) return;
    setIsGeneratingPDF(true);
    try {
      const res = await axiosInstance.post("/evaluations", {
        patientId: selectedPatient.id,
        type: "Reporte Integral",
        results: {
          sesiones_cognitivas:  patientData?.evaluaciones_cognitivas?.length  ?? 0,
          evaluaciones_fisicas: patientData?.evaluaciones_fisicas?.length     ?? 0,
          medicamentos_activos: patientData?.medicamentos_activos?.length     ?? 0,
        },
      });
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

  const getCognitivoByGame = () => {
    if (!patientData?.evaluaciones_cognitivas) return {};
    return patientData.evaluaciones_cognitivas.reduce((acc, s) => {
      const key = s.titulo;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {});
  };

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );
  const cognitivoAgrupado = getCognitivoByGame();

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            Mis Pacientes
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-gray-700 text-sm placeholder:text-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {isLoadingList ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin pacientes asignados.</p>
          ) : filteredPatients.map(patient => (
            <button
              key={patient.id}
              onClick={() => { setSelectedPatient(patient); setActiveSection("cognitivo"); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all group ${
                selectedPatient?.id === patient.id
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "hover:bg-gray-50 text-gray-600 border border-transparent"
              }`}
            >
              <div className={`w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ${selectedPatient?.id === patient.id ? "ring-emerald-300" : "ring-gray-200"}`}>
                <img src={patient.profilePic || "/avatar.png"} alt={patient.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{patient.fullName}</p>
                <p className="text-xs text-gray-400">Persona Mayor</p>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ml-auto shrink-0 transition-opacity ${selectedPatient?.id === patient.id ? "opacity-100 text-emerald-500" : "opacity-0 group-hover:opacity-60"}`} />
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {!selectedPatient ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-5">
              <Activity className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-600 mb-2">Selecciona un paciente</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Elige un paciente del panel izquierdo para visualizar su historial clínico completo.
            </p>
          </div>
        ) : (
          <>
            {/* Header paciente */}
            <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-200">
                  <img src={selectedPatient.profilePic || "/avatar.png"} alt={selectedPatient.fullName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-800">{selectedPatient.fullName}</h1>
                  <p className="text-xs text-gray-400">Persona Mayor · ID #{selectedPatient.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                  {[
                    { id: "cognitivo",     label: "Cognitivo",     icon: BrainCircuit },
                    { id: "fisico",        label: "Físico",        icon: Dumbbell     },
                    { id: "medicamentos",  label: "Medicamentos",  icon: Pill         },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeSection === tab.id
                          ? "bg-white text-emerald-700 shadow-sm border border-gray-200"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF || !patientData}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm"
                >
                  {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                  {isGeneratingPDF ? "Generando..." : "Exportar PDF"}
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {isLoadingData ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-5 h-5 text-emerald-500 animate-spin mr-3" />
                  <span className="text-gray-400 text-sm">Cargando historial...</span>
                </div>
              ) : patientData ? (
                <>
                  {/* ── COGNITIVO ── */}
                  {activeSection === "cognitivo" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                          <BrainCircuit className="w-5 h-5 text-emerald-600" />
                          Evaluaciones Cognitivas
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Historial de sesiones desde la app móvil, agrupadas por actividad.</p>
                      </div>

                      {Object.keys(cognitivoAgrupado).length === 0 ? (
                        <EmptyState mensaje="Sin sesiones cognitivas registradas." />
                      ) : (
                        <div className="space-y-5">
                          {Object.entries(cognitivoAgrupado).map(([juego, sesiones]) => {
                            const cfg = GAME_CONFIG[juego] || { icon: BrainCircuit, color: "emerald", label: "Cognitivo" };
                            const colors = colorMap[cfg.color];
                            const IconComponent = cfg.icon;
                            const avg = (f) => {
                              const v = sesiones.filter(s => s[f] != null);
                              return v.length ? Math.round(v.reduce((a, s) => a + s[f], 0) / v.length) : null;
                            };

                            return (
                              <div key={juego} className={`rounded-xl border ${colors.border} bg-white overflow-hidden shadow-sm`}>
                                <div className={`flex items-center justify-between px-5 py-4 ${colors.bg}`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg bg-white border ${colors.border} flex items-center justify-center shadow-sm`}>
                                      <IconComponent className={`w-5 h-5 ${colors.text}`} />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-gray-800 text-sm">{juego}</h3>
                                      <p className={`text-xs ${colors.text} font-semibold`}>{cfg.label} · {sesiones.length} sesión{sesiones.length !== 1 ? "es" : ""}</p>
                                    </div>
                                  </div>
                                  <div className="hidden sm:flex items-center gap-5 text-xs">
                                    {avg("puntaje") !== null && (
                                      <div className="text-center">
                                        <p className={`font-bold text-lg ${colors.text}`}>{avg("puntaje")}</p>
                                        <p className="text-gray-400">Puntaje prom.</p>
                                      </div>
                                    )}
                                    {avg("tiempo") !== null && (
                                      <div className="text-center">
                                        <p className={`font-bold text-lg ${colors.text}`}>{avg("tiempo")}s</p>
                                        <p className="text-gray-400">Tiempo prom.</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-gray-100">
                                        {["Fecha", "Puntaje", "Aciertos", "Errores", "Tiempo"].map(h => (
                                          <th key={h} className="text-left px-5 py-2.5 text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                      {sesiones.map((s, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                          <td className="px-5 py-3 text-gray-500">
                                            {s.fecha ? new Date(s.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                          </td>
                                          <td className="px-5 py-3"><span className={`font-bold ${colors.text}`}>{s.puntaje ?? "—"}</span></td>
                                          <td className="px-5 py-3 text-emerald-600 font-semibold">{s.aciertos ?? "—"}</td>
                                          <td className="px-5 py-3 text-red-500 font-semibold">{s.errores ?? "—"}</td>
                                          <td className="px-5 py-3 text-gray-500">{s.tiempo != null ? `${s.tiempo}s` : "—"}</td>
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

                  {/* ── FÍSICO ── */}
                  {activeSection === "fisico" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                          <Dumbbell className="w-5 h-5 text-emerald-600" />
                          Evaluaciones Físicas
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Actividades registradas por el geriatra.</p>
                      </div>
                      {patientData.evaluaciones_fisicas.length === 0 ? (
                        <EmptyState mensaje="Sin evaluaciones físicas registradas." />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {patientData.evaluaciones_fisicas.map((ev, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-gray-800 text-sm">{ev.titulo || ev.nombre_ejercicio}</h3>
                                <span className="text-xs text-gray-400">
                                  {ev.fecha ? new Date(ev.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short" }) : "—"}
                                </span>
                              </div>
                              <p className="text-emerald-600 text-sm font-semibold mb-2">{ev.metrica}</p>
                              {ev.observaciones && (
                                <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{ev.observaciones}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── MEDICAMENTOS ── */}
                  {activeSection === "medicamentos" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                          <Pill className="w-5 h-5 text-emerald-600" />
                          Medicamentos Activos
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Tratamientos vigentes del paciente.</p>
                      </div>
                      {patientData.medicamentos_activos.length === 0 ? (
                        <EmptyState mensaje="Sin medicamentos activos registrados." />
                      ) : (
                        <div className="space-y-3">
                          {patientData.medicamentos_activos.map((m, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                              <div>
                                <h3 className="font-bold text-gray-800">{m.nombre_medicamento}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">{m.dosis} · cada {m.frecuencia_horas}h</p>
                                {m.indicaciones && <p className="text-xs text-gray-400 mt-1">{m.indicaciones}</p>}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-400 shrink-0">
                                <div className="text-center">
                                  <p className="text-gray-700 font-semibold">{m.fecha_inicio ?? "—"}</p>
                                  <p>Inicio</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-700 font-semibold">{m.fecha_fin ?? "Crónico"}</p>
                                  <p>Fin</p>
                                </div>
                                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-semibold text-xs">
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

function EmptyState({ mensaje }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-gray-300" />
      </div>
      <p className="text-gray-400 text-sm max-w-xs">{mensaje}</p>
    </div>
  );
}
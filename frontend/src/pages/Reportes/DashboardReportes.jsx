import React from 'react';
import { 
  Activity, Users, CheckCircle, AlertTriangle, 
  Search, BrainCircuit, HeartPulse, Pill, CalendarClock, ChevronRight
} from 'lucide-react';

export default function DashboardReportes() {
  // Estos datos eventualmente vendrán de tu API (ej. la tabla de métricas y tomas)
  const metricasGenerales = [
    { titulo: 'Pacientes Activos', valor: '42', incremento: '+3', color: 'blue', icono: <Users className="w-6 h-6" /> },
    { titulo: 'Adherencia a Meds', valor: '89%', incremento: '+2.5%', color: 'emerald', icono: <Pill className="w-6 h-6" /> },
    { titulo: 'Rendimiento Cognitivo', valor: '75/100', incremento: 'Estable', color: 'purple', icono: <BrainCircuit className="w-6 h-6" /> },
    { titulo: 'Evaluaciones Físicas', valor: '128', incremento: '+12', color: 'orange', icono: <HeartPulse className="w-6 h-6" /> },
  ];

  const alertasCriticas = [
    { id: 1, paciente: 'Roberto Suárez', edad: 78, alerta: 'Omitió 3 tomas seguidas de Losartán', tipo: 'medicina', urgencia: 'Alta', tiempo: 'Hace 2 horas' },
    { id: 2, paciente: 'Carmen Méndez', edad: 82, alerta: 'Baja puntuación en Cálculo Rápido (-30% vs mes pasado)', tipo: 'cognitivo', urgencia: 'Media', tiempo: 'Ayer' },
    { id: 3, paciente: 'Arturo López', edad: 75, alerta: 'No ha registrado evaluación de "Levantarse de silla" en 14 días', tipo: 'fisico', urgencia: 'Baja', tiempo: 'Hace 3 días' },
  ];

  const proximasCitas = [
    { id: 101, paciente: 'Elena Torres', fecha: 'Hoy, 16:30 hrs', tipo: 'Seguimiento Mensual' },
    { id: 102, paciente: 'Luis Mendoza', fecha: 'Mañana, 09:00 hrs', tipo: 'Revisión de Tratamiento' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2D3436]">Panel de Monitoreo</h1>
            <p className="text-gray-500 mt-2 font-medium">Resumen general del estado de tus pacientes al día de hoy.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar paciente por nombre..." 
                className="w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
              />
            </div>
            <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold shadow-sm transition-colors">
              Generar Reporte PDF
            </button>
          </div>
        </div>

        {/* Top KPIs (Tarjetas de Métricas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricasGenerales.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-500`}>
                  {stat.icono}
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  {stat.incremento}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-[#2D3436]">{stat.valor}</h3>
                <p className="text-sm font-semibold text-gray-500 mt-1">{stat.titulo}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sección Central Dividida */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Gráfico de Adherencia (Simulado con Tailwind) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#2D3436]">Tendencia de Adherencia Médica</h3>
                <p className="text-sm text-gray-500">Porcentaje de tomas registradas a tiempo en los últimos 7 días.</p>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2 outline-none">
                <option>Últimos 7 días</option>
                <option>Último mes</option>
              </select>
            </div>
            
            {/* Simulación de Gráfico de Barras */}
            <div className="h-64 flex items-end justify-between space-x-2 border-b border-gray-200 pb-2">
              {[60, 75, 85, 90, 80, 95, 89].map((altura, i) => (
                <div key={i} className="w-1/7 flex flex-col items-center group relative w-full px-1">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded transition-opacity">
                    {altura}%
                  </div>
                  {/* Barra */}
                  <div 
                    className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${altura < 70 ? 'bg-amber-300' : 'bg-blue-500 group-hover:bg-blue-600'}`} 
                    style={{ height: `${altura}%` }}
                  ></div>
                  <span className="text-xs font-semibold text-gray-400 mt-3">Día {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Alertas de Atención Requerida */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2D3436] flex items-center">
                Atención Requerida <span className="ml-3 bg-red-100 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{alertasCriticas.length}</span>
              </h3>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {alertasCriticas.map((alerta) => (
                <div key={alerta.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{alerta.paciente}</h4>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${
                      alerta.urgencia === 'Alta' ? 'bg-red-100 text-red-700' : 
                      alerta.urgencia === 'Media' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {alerta.urgencia}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-snug mb-3">{alerta.alerta}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400 font-semibold">
                    <span className="flex items-center">
                      {alerta.tipo === 'medicina' ? <Pill className="w-3 h-3 mr-1" /> : <Activity className="w-3 h-3 mr-1" />}
                      {alerta.tiempo}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-gray-50 text-sm text-gray-700 font-bold rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors">
              Ver Centro de Alertas
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
<template>
  <div class="transition-colors duration-500">
    <!-- Fondos Especiales (Solo Dark Mode) -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    <div class="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,#00cf8d10,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_-20%,#00cf8d15,transparent_50%)]"></div>

    <!-- Encabezado / Barra de Estado del Sistema -->
    <div class="relative z-10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-gray-800/50 pb-8">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-500/80">Sistema MP y CRÉDITO // V 3</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
          PANEL <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">TERMINAL</span>
        </h1>
      </div>
      
      <div class="flex items-center gap-4 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-2 rounded-lg backdrop-blur-md shadow-sm dark:shadow-none">
        <div class="px-4 py-2">
          <button @click="obtenerEstadisticas" :disabled="cargando" class="group flex items-center gap-2 text-xs font-bold hover:text-cyan-500 transition-colors">
            <RefreshCw :class="['w-3 h-3', { 'animate-spin': cargando }]" />
            <span class="uppercase tracking-widest">Sincronizar_Datos</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Cuadrícula de Estadísticas Principales -->
    <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- Tarjeta: REPOSITORIO MP -->
      <div class="relative group bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-cyan-500/50 transition-all overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-none">
        <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Shield class="w-32 h-32 text-cyan-500" />
        </div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Shield class="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-950 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-800 uppercase">Repositorio_Seguro</span>
          </div>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Base_Datos_MP</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-black text-gray-900 dark:text-white">{{ estadisticas.listas.mp.toLocaleString() }}</h3>
            <span class="text-[10px] text-cyan-600 dark:text-cyan-500/60 font-bold uppercase">Bloques</span>
          </div>
          <div class="mt-4 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div class="h-full bg-cyan-500 w-[70%] shadow-[0_0_8px_#22d3ee]"></div>
          </div>
        </div>
      </div>

      <!-- Tarjeta: RIESGO CREDITICIO -->
      <div class="relative group bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-none">
        <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <CreditCard class="w-32 h-32 text-emerald-500" />
        </div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <CreditCard class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-950 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-800 uppercase">Límite_Riesgo</span>
          </div>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Lista_Créditos</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-black text-gray-900 dark:text-white">{{ estadisticas.listas.creditos.toLocaleString() }}</h3>
            <span class="text-[10px] text-emerald-600 dark:text-emerald-500/60 font-bold uppercase">Activos</span>
          </div>
          <div class="mt-4 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 w-[45%] shadow-[0_0_8px_#10b981]"></div>
          </div>
        </div>
      </div>

      <!-- Tarjeta: FIRMAS PENDIENTES -->
      <div class="relative group bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-amber-500/50 transition-all overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-none">
        <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Clock class="w-32 h-32 text-amber-500" />
        </div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Clock class="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div class="flex gap-1">
              <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></div>
              <span class="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase">Esperando_Firma</span>
            </div>
          </div>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Cola_Autorización</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-black text-gray-900 dark:text-white">{{ estadisticas.solicitudes.pendientes }}</h3>
            <span class="text-[10px] text-amber-600 dark:text-amber-500/60 font-bold uppercase">Transac</span>
          </div>
          <router-link to="/admin/solicitudes" class="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 mt-4 hover:brightness-125 transition-all">
            Procesar_Cola <Zap class="w-3 h-3" />
          </router-link>
        </div>
      </div>

      <!-- Tarjeta: NODOS POR VERIFICAR -->
      <div class="relative group bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-rose-500/50 transition-all overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-none">
        <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Activity class="w-32 h-32 text-rose-500" />
        </div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <Search class="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-950 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-800 uppercase">Sin_Verificar</span>
          </div>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Señales_Limpias</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-black text-gray-900 dark:text-white">{{ estadisticas.consultas.no_verificadas }}</h3>
            <span class="text-[10px] text-rose-600 dark:text-rose-500/60 font-bold uppercase">Chequeos</span>
          </div>
          <router-link to="/admin/reportes/consultas-sin-resultado" class="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 mt-4 hover:brightness-125 transition-all">
            Ejecutar_Revisión <Activity class="w-3 h-3" />
          </router-link>
        </div>
      </div>
    </div>

    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sección: VISUALIZADOR DE ESTADO DE AUTORIZACIÓN -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 backdrop-blur-md shadow-sm dark:shadow-none">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Zap class="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              FLUJO_DE_AUTENTICACIÓN
            </h2>
            <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mt-1">Protocolos de autorización de red</p>
          </div>
          <div class="flex gap-2">
             <div class="h-1 w-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
             <div class="h-1 w-12 bg-cyan-500 rounded-full"></div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <!-- Círculo Pendientes -->
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24 flex items-center justify-center mb-4">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="4" fill="transparent" class="text-gray-100 dark:text-gray-800" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="4" fill="transparent" 
                  class="text-amber-500" 
                  stroke-dasharray="251.2" 
                  :stroke-dashoffset="251.2 - (251.2 * 0.6)" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-black text-gray-900 dark:text-white">{{ estadisticas.solicitudes.pendientes }}</span>
              </div>
            </div>
            <span class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">PENDIENTES_TX</span>
          </div>

          <!-- Círculo Autorizadas -->
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24 flex items-center justify-center mb-4">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="4" fill="transparent" class="text-gray-100 dark:text-gray-800" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="4" fill="transparent" 
                  class="text-emerald-500" 
                  stroke-dasharray="251.2" 
                  :stroke-dashoffset="251.2 - (251.2 * 0.85)" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-black text-gray-900 dark:text-white">{{ estadisticas.solicitudes.autorizadas }}</span>
              </div>
            </div>
            <span class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">AUTORIZADAS</span>
          </div>

          <!-- Círculo Rechazadas -->
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24 flex items-center justify-center mb-4">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="4" fill="transparent" class="text-gray-100 dark:text-gray-800" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="4" fill="transparent" 
                  class="text-rose-500" 
                  stroke-dasharray="251.2" 
                  :stroke-dashoffset="251.2 - (251.2 * 0.3)" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-black text-gray-900 dark:text-white">{{ estadisticas.solicitudes.rechazadas }}</span>
              </div>
            </div>
            <span class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">RECHAZADAS</span>
          </div>
        </div>

        <div class="mt-12 p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between overflow-hidden relative shadow-inner dark:shadow-none">
          <div class="absolute left-0 top-0 h-full w-1 bg-cyan-500"></div>
          <div>
            <p class="text-[9px] font-black text-cyan-600 dark:text-cyan-500 uppercase tracking-widest mb-1">Consultas_Sin_Coinicdencia_Acumulada</p>
            <p class="text-sm font-bold text-gray-600 dark:text-gray-300">Reportes limpios verificados: <span class="text-gray-900 dark:text-white">{{ estadisticas.consultas.total }}</span></p>
          </div>
          <div class="flex items-center gap-2">
            <div v-for="i in 5" :key="i" class="w-1 h-4 bg-cyan-500/10 dark:bg-cyan-500/20" :class="{ 'bg-cyan-500': i <= 4 }"></div>
          </div>
        </div>
      </div>

      <!-- Sección: REGISTROS DE ACTIVIDAD EN VIVO -->
      <div class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 backdrop-blur-md shadow-sm dark:shadow-none">
        <h2 class="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 mb-8">
          <Activity class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Registros_de_Solciitudes
        </h2>

        <div class="space-y-4">
          <div v-if="cargando" class="space-y-4">
            <div v-for="i in 4" :key="i" class="h-16 bg-gray-100 dark:bg-gray-800/20 rounded-xl animate-pulse"></div>
          </div>
          <div v-else-if="estadisticas.recent_activity.length === 0" class="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            <p class="text-[10px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest">No se detectó actividad</p>
          </div>
          <div v-for="(actividad, idx) in estadisticas.recent_activity" :key="idx" 
            class="relative p-4 rounded-xl bg-gray-50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 transition-all group">
            <div class="flex items-start gap-4">
              <div :class="[
                'w-2 h-2 rounded-full mt-1.5',
                actividad.estado === 'completada' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-cyan-500 shadow-[0_0_8px_#22d3ee]'
              ]"></div>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-1">
                  <p class="text-[11px] font-black text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{{ actividad.mensaje }}</p>
                  <span class="text-[8px] font-bold text-gray-400 dark:text-gray-600">{{ formatearFecha(actividad.fecha) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">ESTADO_FIRMA: <span :class="actividad.estado === 'completada' ? 'text-emerald-600 dark:text-emerald-400' : 'text-cyan-600 dark:text-cyan-400'">{{ actividad.estado.toUpperCase() }}</span></span>
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight class="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <router-link to="/admin/solicitudes" class="block w-full text-center py-4 mt-8 bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-xl text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] transition-all">
          Acceder_Historial_Auditoría
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { 
  Shield, 
  CreditCard, 
  Clock, 
  Activity, 
  Zap, 
  Search, 
  RefreshCw,
  ArrowRight
} from 'lucide-vue-next';

const estadisticas = ref({
  listas: { mp: 0, creditos: 0 },
  solicitudes: { pendientes: 0, autorizadas: 0, rechazadas: 0 },
  consultas: { total: 0, no_verificadas: 0 },
  recent_activity: [] as any[]
});

const cargando = ref(true);

const obtenerEstadisticas = async () => {
  cargando.value = true;
  try {
    const respuesta = await api.get('/dashboard/stats');
    estadisticas.value = respuesta.data;
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
  } finally {
    cargando.value = false;
  }
};

const formatearFecha = (fechaString: string) => {
  const d = new Date(fechaString);
  return d.toLocaleTimeString('es-GT', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' ' + 
         d.toLocaleDateString('es-GT', { day: '2-digit', month: 'short' }).toUpperCase();
};

onMounted(obtenerEstadisticas);
</script>

<style scoped>
@reference "../assets/main.css";

/* Animaciones personalizadas para el look de trading */
@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.glow-active {
  animation: glow-pulse 2s infinite ease-in-out;
}

/* Estilo de barra de desplazamiento para ambos temas */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  @apply bg-gray-50 dark:bg-[#05070a];
}
::-webkit-scrollbar-thumb {
  @apply bg-gray-200 dark:bg-gray-800 rounded-full;
}
::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-300 dark:bg-gray-700;
}
</style>

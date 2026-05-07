<template>
  <div class="flex flex-col h-[calc(100vh-110px)] overflow-hidden">
    <!-- Encabezado -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
      <div>
        <h1 class="text-3xl font-extrabold text-[#013d7b] dark:text-[#5aba03] flex items-center gap-3">
          <span class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#013d7b] dark:text-[#5aba03]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Bandeja de Autorizaciones
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Gestión y auditoría de solicitudes de validación de riesgo.</p>
      </div>
    </div>

    <!-- Tabs de Navegación -->
    <div class="mb-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button 
          v-for="tab in availableTabs" 
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-[#013d7b] dark:border-[#5aba03] text-[#013d7b] dark:text-[#5aba03]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors duration-200 flex items-center gap-2'
          ]"
        >
          <svg v-if="tab.id === 'pendientes'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <svg v-else-if="tab.id === 'agencia'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          <svg v-else-if="tab.id === 'autorizadas'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <svg v-else-if="tab.id === 'rechazadas'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ tab.name }}
          <span 
            v-if="tab.count > 0"
            class="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-0.5 px-2.5 rounded-full text-xs font-bold"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4 shrink-0">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Destinatario</label>
          <select v-model="filters.destinatario" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:ring-[#013d7b] transition-all">
            <option value="todos">Todos los destinatarios</option>
            <option value="cumplimiento">Cumplimiento</option>
            <option value="jefatura">Jefe de Agencia</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Fecha Inicio</label>
          <input type="date" v-model="filters.fecha_inicio" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:ring-[#013d7b] transition-all" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Fecha Fin</label>
          <input type="date" v-model="filters.fecha_fin" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:ring-[#013d7b] transition-all" />
        </div>
        <div class="flex gap-2">
          <button @click="fetchData" class="flex-1 bg-[#013d7b] hover:bg-[#012a52] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Filtrar
          </button>
          <button @click="resetFilters" class="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all border border-gray-200 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de Resultados -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col min-h-0">
      <div v-if="loading" class="p-12 flex-1 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/20 backdrop-blur-sm">
        <div class="relative w-16 h-16 mb-4">
          <div class="absolute inset-0 border-4 border-[#013d7b]/20 dark:border-[#5aba03]/20 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-t-[#013d7b] dark:border-t-[#5aba03] rounded-full animate-spin"></div>
        </div>
        <p class="text-sm font-bold text-gray-500 animate-pulse uppercase tracking-widest">Sincronizando Solicitudes...</p>
      </div>
 
      <div v-else-if="solicitudes.length === 0" class="p-12 flex-1 flex flex-col items-center justify-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-gray-200 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-xl font-bold text-gray-400">Bandeja Vacía</p>
        <p class="text-xs uppercase tracking-widest font-bold text-gray-400 mt-2">No se encontraron registros activos</p>
      </div>

      <div v-else class="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider">Solicitante / Agencia</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider">Destinatario</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider">Estado Cumplimiento</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider">Estado Jefatura</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-for="s in solicitudes" :key="s.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-bold text-gray-900 dark:text-white">{{ s.usuario?.name || 'N/A' }}</span>
                  <span class="text-[10px] text-amber-600 font-bold uppercase tracking-wider">{{ s.usuario?.puesto || 'Colaborador' }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ s.agencia?.nombre || 'Sin Agencia' }}</span>
                  <span class="text-[10px] mt-1 text-gray-400">{{ formatDate(s.created_at) }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm" :class="getDestinatarioClass(s.destinatario)">
                    <ShieldCheck v-if="s.destinatario === 'cumplimiento'" class="w-3 h-3" />
                    <UserCheck v-else-if="s.destinatario === 'jefatura'" class="w-3 h-3" />
                    <Users v-else class="w-3 h-3" />
                    {{ s.destinatario }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm" :class="getStatusClass(s.estado_cumplimiento)">
                    <Clock v-if="!s.estado_cumplimiento || s.estado_cumplimiento === 'pendiente'" class="w-3 h-3" />
                    <CheckCircle2 v-else-if="s.estado_cumplimiento === 'autorizado'" class="w-3 h-3" />
                    <XCircle v-else class="w-3 h-3" />
                    {{ s.estado_cumplimiento || 'pendiente' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm" :class="getStatusClass(s.estado_jefatura)">
                    <Clock v-if="!s.estado_jefatura || s.estado_jefatura === 'pendiente'" class="w-3 h-3" />
                    <CheckCircle2 v-else-if="s.estado_jefatura === 'autorizado'" class="w-3 h-3" />
                    <XCircle v-else class="w-3 h-3" />
                    {{ s.estado_jefatura || 'pendiente' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-2">
                  <router-link :to="`/admin/solicitudes/${s.id}`" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all" title="Ver Detalle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                  <button v-if="s.autorizacion_completa && canDownload" @click="downloadPDF(s.id)" class="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all" title="Descargar PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación Premium -->
      <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500 font-medium">
            Página <span class="text-[#013d7b] dark:text-[#5aba03] font-bold">{{ pagination.current_page }}</span> de <span class="font-bold">{{ totalPages }}</span>
          </span>
        </div>
        <div class="flex gap-2">
          <button 
            @click="changePage(pagination.current_page - 1)" 
            :disabled="pagination.current_page === 1"
            class="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-[#013d7b] dark:text-[#5aba03] disabled:opacity-30 transition-all hover:bg-gray-50"
          > Anterior </button>
          <button 
            @click="changePage(pagination.current_page + 1)" 
            :disabled="pagination.current_page === totalPages"
            class="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-[#013d7b] dark:text-[#5aba03] disabled:opacity-30 transition-all hover:bg-gray-50"
          > Siguiente </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';
import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from 'lucide-vue-next';
import Swal from 'sweetalert2';

const authStore = useAuthStore();

const canDownload = computed(() => {
  return authStore.user?.roles_list?.includes('Super Admin') || authStore.hasPermission('solicitudes_descargar_pdf');
});

const availableTabs = computed(() => {
  const baseTabs = [
    { id: 'pendientes', name: 'Pendientes', count: 0 },
    { id: 'autorizadas', name: 'Autorizadas', count: 0 },
    { id: 'rechazadas', name: 'Rechazadas', count: 0 }
  ];

  if (authStore.user?.roles_list?.includes('Super Admin') || authStore.hasPermission('solicitudes_ver_agencia')) {
    baseTabs.splice(1, 0, { id: 'agencia', name: 'Mi Agencia', count: 0 });
  }

  return baseTabs;
});

const currentTab = ref('pendientes');
const solicitudes = ref([]);
const loading = ref(false);
const totalPages = ref(1);

const filters = ref({
  destinatario: 'todos',
  fecha_inicio: '',
  fecha_fin: ''
});

const pagination = ref({
  current_page: 1,
  per_page: 15
});

const fetchData = async () => {
  loading.value = true;
  try {
    const params = {
      tipo: currentTab.value,
      destinatario: filters.value.destinatario,
      fecha_inicio: filters.value.fecha_inicio,
      fecha_fin: filters.value.fecha_fin,
      page: pagination.value.current_page,
      per_page: pagination.value.per_page
    };
    
    const response = await api.get('/solicitudes', { params });
    solicitudes.value = response.data.data;
    totalPages.value = response.data.last_page;
    
    // Actualizar conteo de la tab actual si es necesario
    const activeTab = availableTabs.value.find(t => t.id === currentTab.value);
    if (activeTab) activeTab.count = response.data.total;

  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filters.value = {
    destinatario: 'todos',
    fecha_inicio: '',
    fecha_fin: ''
  };
  pagination.value.current_page = 1;
  fetchData();
};

const changePage = (page) => {
  pagination.value.current_page = page;
  fetchData();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status) => {
  if (!status || status === 'pendiente') return 'bg-amber-500 text-white dark:bg-amber-600/80';
  if (status === 'autorizado') return 'bg-verde-cope text-white dark:bg-emerald-600/80';
  if (status === 'rechazado') return 'bg-rose-500 text-white dark:bg-rose-600/80';
  return 'bg-gray-500 text-white';
};

const getDestinatarioClass = (dest) => {
  if (dest === 'cumplimiento') return 'bg-azul-cope text-white dark:bg-blue-600/80';
  if (dest === 'jefatura') return 'bg-purple-600 text-white dark:bg-purple-700/80';
  if (dest === 'ambos') return 'bg-indigo-600 text-white dark:bg-indigo-700/80';
  return 'bg-gray-500 text-white';
};

const downloadPDF = async (id) => {
  try {
    const response = await api.get(`/solicitudes/${id}/descargar-pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Autorizacion_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    Swal.fire('Error', 'No se pudo descargar el archivo', 'error');
  }
};

watch(currentTab, () => {
  pagination.value.current_page = 1;
  fetchData();
});

onMounted(fetchData);
</script>

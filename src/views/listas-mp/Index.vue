<template>
  <div>
    <!-- Header Section -->
    <div class="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800/50 pb-4">
      <div>
        <nav class="flex text-azul-cope/60 dark:text-verde-cope/60 text-[9px] font-black uppercase tracking-[0.2em] mb-1 items-center gap-2">
          <span>Portal</span>
          <span class="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
          <span>Lista MP</span>
        </nav>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Registros <span class="text-transparent bg-clip-text bg-gradient-to-r from-azul-cope via-blue-500 to-indigo-600 dark:from-verde-cope dark:via-emerald-400 dark:to-teal-400">MP</span>
        </h1>
      </div>
      
      <button 
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-azul-cope hover:bg-azul-cope/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-xs group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Expediente
      </button>
    </div>


    <!-- Unified Command Center -->
    <div class="bg-white dark:bg-slate-900 border-2 border-azul-cope/10 dark:border-white/5 p-2 rounded-xl shadow-xl shadow-azul-cope/5 mb-6 flex flex-wrap lg:flex-nowrap items-center gap-6">
      
      <!-- 2. Compact Stats (Centered) -->
      <div class="flex-1 flex flex-wrap justify-center items-center gap-3 min-w-fit">
        <div class="flex items-center gap-3 px-4 py-1.5 bg-azul-cope rounded-xl shadow-lg shadow-azul-cope/20 border border-white/5 group hover:scale-105 transition-transform">
          <div class="p-1.5 bg-white/10 rounded-lg">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-white/60 uppercase tracking-widest leading-none">Total</span>
            <span class="text-sm font-black text-white tabular-nums leading-none mt-1">{{ stats.total || 0 }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3 px-4 py-1.5 bg-verde-cope rounded-xl shadow-lg shadow-verde-cope/20 border border-white/5 group hover:scale-105 transition-transform">
          <div class="p-1.5 bg-white/10 rounded-lg">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-white/60 uppercase tracking-widest leading-none">Activos</span>
            <span class="text-sm font-black text-white tabular-nums leading-none mt-1">{{ (stats.total || 0) - (stats.inactive || 0) }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3 px-4 py-1.5 bg-red-600 rounded-xl shadow-lg shadow-red-600/20 border border-white/5 group hover:scale-105 transition-transform">
          <div class="p-1.5 bg-white/10 rounded-lg">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-white/60 uppercase tracking-widest leading-none">Bajas</span>
            <span class="text-sm font-black text-white tabular-nums leading-none mt-1">{{ stats.inactive || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="hidden lg:block h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1 shrink-0"></div>

      <!-- 1. Search Input (Left) -->
      <div class="w-full lg:w-80 relative group shrink-0 order-first">
        <input 
          v-model="searchQuery"
          @input="handleSearch"
          type="text" 
          placeholder="Buscar sujeto..."
          class="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-azul-cope/20 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-azul-cope focus:ring-4 focus:ring-azul-cope/10 transition-all shadow-inner"
        />
        <svg class="w-4 h-4 absolute left-3 top-3 text-azul-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <!-- Divider -->
      <div class="hidden lg:block h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

      <!-- Quick Actions & Filter -->
      <div class="flex items-center gap-2 ml-auto">
        <div class="relative">
          <select 
            v-model="statusFilter"
            @change="fetchData(1)"
            class="pl-3 pr-8 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-[11px] font-black text-gray-700 dark:text-gray-300 focus:outline-none appearance-none cursor-pointer transition-all hover:bg-gray-100"
          >
            <option value="all">TODOS</option>
            <option value="1">ACTIVOS</option>
            <option value="0">BAJAS</option>
          </select>
          <svg class="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
        </div>

        <button 
          @click="exportToCSV"
          class="p-2.5 bg-verde-cope/10 text-verde-cope rounded-lg transition-all hover:bg-verde-cope hover:text-white active:scale-95"
          title="Descargar Reporte CSV"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        <button 
          @click="fetchData(1)"
          class="p-2.5 text-azul-cope dark:text-blue-400 hover:bg-azul-cope/10 rounded-lg transition-all active:rotate-180"
          title="Refrescar Tabla"
        >
          <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-xl shadow-xl overflow-hidden mb-12">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-azul-cope text-white border-b border-azul-cope">
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80">Identificación del Sujeto</th>
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80">Documentación Legal</th>
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80">Historial de Oficios</th>
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80 text-center">Estatus Operativo</th>
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80 text-right">Gestión</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="5" class="px-8 py-16 text-center text-gray-400 font-bold italic tracking-wide">
                Sincronizando con el servidor central...
              </td>
            </tr>
            <tr v-else-if="list.length === 0">
              <td colspan="5" class="px-8 py-16 text-center text-gray-400 font-bold italic tracking-wide">
                No se han encontrado registros que coincidan con la búsqueda.
              </td>
            </tr>
            <tr v-for="item in list" :key="item.iddatos" class="group hover:bg-azul-cope/[0.02] dark:hover:bg-blue-400/[0.02] transition-all duration-300">
              <td class="px-8 py-3">
                <div class="font-black text-gray-900 dark:text-white text-sm mb-0.5 group-hover:text-azul-cope transition-colors">{{ item.nombre }}</div>
                <div class="flex items-center gap-2">
                  <span class="px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded text-[8px] font-black uppercase text-gray-400 dark:text-slate-500 tracking-wider">{{ item.tipo_p }}</span>
                  <span class="text-[9px] font-bold text-gray-300">/</span>
                  <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{{ item.tipo_identificacion }}</span>
                </div>
              </td>
              <td class="px-8 py-3">
                <div v-if="item.cui" class="flex items-center gap-2 mb-0.5">
                  <span class="text-[9px] font-black text-azul-cope/40 uppercase w-7">CUI</span>
                  <span class="text-xs font-bold text-gray-700 dark:text-slate-300 tabular-nums">{{ item.cui }}</span>
                </div>
                <div v-if="item.nit" class="flex items-center gap-2">
                  <span class="text-[9px] font-black text-azul-cope/40 uppercase w-7">NIT</span>
                  <span class="text-xs font-bold text-gray-700 dark:text-slate-300 tabular-nums">{{ item.nit }}</span>
                </div>
              </td>
              <td class="px-8 py-3">
                <div class="flex items-center gap-2 mb-0.5">
                  <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span class="text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-tight">{{ formatDate(item.fecha_respuesta) }}</span>
                </div>
                <div v-if="item.oficio" class="text-[9px] font-bold text-gray-400 uppercase tracking-wider pl-5">Nº {{ item.oficio }}</div>
              </td>
              <td class="px-8 py-3 text-center">
                <span 
                  class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 transition-all duration-300 shadow-sm"
                  :class="item.estado === '1' 
                    ? 'bg-verde-cope/10 text-verde-cope border border-verde-cope/20' 
                    : 'bg-red-500/10 text-red-600 border border-red-500/20'"
                >
                  <svg v-if="item.estado === '1'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  {{ item.estado === '1' ? 'Vigente' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-8 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button @click="openEditModal(item)" class="p-1.5 text-gray-400 hover:text-azul-cope hover:bg-azul-cope/10 rounded-lg transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2.5"/></svg>
                  </button>
                  <button v-if="item.estado === '1' && authStore.hasRole('Super Admin')" @click="openDeactivateModal(item)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-600/10 rounded-lg transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636" stroke-width="2.5"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Section -->
      <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div class="text-xs text-gray-500 font-medium">
          Registros: <span class="font-bold text-gray-700 dark:text-gray-300">{{ pagination.total }}</span>
        </div>

        <div class="flex items-center gap-1">
          <button @click="fetchData(1)" :disabled="pagination.current_page === 1 || loading" class="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" stroke-width="2"/></svg>
          </button>
          <button @click="fetchData(pagination.current_page - 1)" :disabled="pagination.current_page === 1 || loading" class="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2"/></svg>
          </button>
          
          <div class="flex items-center gap-1 mx-2">
            <button 
              v-for="p in paginationPages" :key="p" @click="fetchData(p)"
              class="w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors"
              :class="p === pagination.current_page ? 'bg-azul-cope text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              {{ p }}
            </button>
          </div>

          <button @click="fetchData(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page || loading" class="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2"/></svg>
          </button>
          <button @click="fetchData(pagination.last_page)" :disabled="pagination.current_page === pagination.last_page || loading" class="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7M5 5l7 7-7 7" stroke-width="2"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <ListaMpFormModal :show="showModal" :is-editing="isEditing" :initial-data="form" :submitting="submitting" @close="showModal = false" @save="saveRecord" />

    <!-- Deactivate Modal -->
    <Transition name="fade">
      <div v-if="showDeactivateModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeDeactivateModal"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirmar Baja</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">Por favor, indique el motivo de la baja para <span class="font-bold">{{ selectedItem?.nombre }}</span>.</p>
          <textarea v-model="deactivateReason" required rows="3" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm mb-6 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all" placeholder="Motivo de la baja..."></textarea>
          <div class="flex gap-3">
            <button @click="deactivateRecord" :disabled="!deactivateReason || submitting" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all disabled:opacity-30 text-sm">Confirmar Baja</button>
            <button @click="closeDeactivateModal" class="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm">Cancelar</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import ListaMpFormModal from './components/ListaMpFormModal.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

interface RecordMP {
  iddatos?: number; nombre: string; tipo_identificacion?: string; registro?: string; cui?: string; pasaporte?: string; lugar_origen?: string; fecha_respuesta: string; nit?: string; fecha_of?: string; oficio?: string; tipo_p?: string; fiscalia?: string; fecha_cooperativa?: string; fecha_cumplimiento?: string; estado: string; observacion_baja?: string;
}

const list = ref<RecordMP[]>([])
const loading = ref(true)
const submitting = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const pagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 10 })
const stats = ref({ total: 0, inactive: 0 })
const showModal = ref(false)
const isEditing = ref(false)
const form = ref<RecordMP>({ nombre: '', fecha_respuesta: '', estado: '1' })
const showDeactivateModal = ref(false)
const selectedItem = ref<RecordMP | null>(null)
const deactivateReason = ref('')

let searchTimeout: any = null
const handleSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => fetchData(1), 500)
}

const fetchData = async (page = 1) => {
  if (page < 1 || (pagination.value.last_page > 0 && page > pagination.value.last_page)) return
  loading.value = true
  try {
    const response = await api.get('/listas-mp', { params: { page, search: searchQuery.value, estado: statusFilter.value } })
    list.value = response.data.pagination.data
    pagination.value = { current_page: response.data.pagination.current_page, last_page: response.data.pagination.last_page, total: response.data.pagination.total, per_page: response.data.pagination.per_page }
    stats.value = response.data.stats
  } catch (error) { console.error('Error fetching data:', error) } finally { loading.value = false }
}

const paginationPages = computed(() => {
    const pages = []
    const total = pagination.value.last_page
    const current = pagination.value.current_page
    let start = Math.max(1, current - 2)
    let end = Math.min(total, start + 4)
    if (end - start < 4) start = Math.max(1, end - 4)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

const openCreateModal = () => { isEditing.value = false; form.value = { nombre: '', tipo_identificacion: '', tipo_p: '', fecha_respuesta: new Date().toISOString().split('T')[0], estado: '1' }; showModal.value = true }
const openEditModal = (item: RecordMP) => { isEditing.value = true; form.value = { ...item }; showModal.value = true }
const saveRecord = async (formData: RecordMP) => {
  submitting.value = true
  try {
    if (isEditing.value) await api.put(`/listas-mp/${formData.iddatos}`, formData)
    else await api.post('/listas-mp', formData)
    Swal.fire({ icon: 'success', title: 'Operación Exitosa', timer: 1500, showConfirmButton: false })
    await fetchData(pagination.value.current_page)
    showModal.value = false
  } catch (error) { console.error('Error saving record:', error) } finally { submitting.value = false }
}

const openDeactivateModal = (item: RecordMP) => { selectedItem.value = item; deactivateReason.value = ''; showDeactivateModal.value = true }
const closeDeactivateModal = () => { showDeactivateModal.value = false; selectedItem.value = null }
const deactivateRecord = async () => {
  if (!selectedItem.value || !deactivateReason.value) return
  submitting.value = true
  try {
    await api.delete(`/listas-mp/${selectedItem.value.iddatos}`, { data: { observacion_baja: deactivateReason.value } })
    await fetchData(pagination.value.current_page)
    closeDeactivateModal()
  } catch (error) { console.error('Error deactivating record:', error) } finally { submitting.value = false }
}

const exportToCSV = async () => {
    try {
        loading.value = true
        const response = await api.get('/listas-mp/export', { responseType: 'blob' })
        
        // Crear un link temporal para la descarga
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        
        // Generar nombre de archivo con fecha
        const date = new Date().toISOString().split('T')[0]
        link.setAttribute('download', `reporte_lista_mp_${date}.csv`)
        
        document.body.appendChild(link)
        link.click()
        
        // Limpiar
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Error al exportar CSV:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error de exportación',
            text: 'No se pudo generar el reporte. Verifique su sesión.'
        })
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString?: string) => { if (!dateString) return '---'; const date = new Date(dateString); return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) }
onMounted(() => fetchData())
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

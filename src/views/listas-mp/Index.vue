<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
      <div>
        <nav class="flex text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1 items-center gap-2">
          <span>Inicio</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2"/></svg>
          <span class="text-azul-cope dark:text-verde-cope">Lista MP</span>
        </nav>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Control de Registros MP
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Administración de expedientes y registros históricos.</p>
      </div>
      
      <button 
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-azul-cope hover:bg-azul-cope/90 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-95 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Registrar Nuevo
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-azul-cope/5 dark:bg-azul-cope/20 rounded-lg flex items-center justify-center text-azul-cope dark:text-azul-cope">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </div>
        <div>
          <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Total de Registros</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total || 0 }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </div>
        <div>
          <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Registros Inactivos</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.inactive || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1 relative">
        <input 
          v-model="searchQuery"
          @input="handleSearch"
          type="text" 
          placeholder="Buscar por nombre, CUI o NIT..."
          class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-azul-cope/20 transition-all"
        />
        <svg class="w-4 h-4 absolute left-3.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
      
      <select 
        v-model="statusFilter"
        @change="fetchData(1)"
        class="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-azul-cope/20"
      >
        <option value="all">Todos los estados</option>
        <option value="1">Activos</option>
        <option value="0">Inactivos (Bajas)</option>
      </select>

      <button 
        @click="exportToCSV"
        class="px-4 py-2 bg-verde-cope hover:bg-verde-cope/90 text-white rounded-lg transition-colors text-sm font-semibold flex items-center gap-2 border border-verde-cope shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exportar CSV
      </button>

      <button 
        @click="fetchData(1)"
        class="px-4 py-2 text-azul-cope dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-semibold flex items-center gap-2 border border-gray-200 dark:border-gray-700"
      >
        <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2"/></svg>
        Actualizar
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Identificación</th>
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Documentación</th>
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Fechas</th>
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-center">Estado</th>
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="5" class="px-6 py-12 text-center text-gray-400 font-medium italic">
                Cargando información...
              </td>
            </tr>
            <tr v-else-if="list.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-400 font-medium italic">
                No se encontraron registros.
              </td>
            </tr>
            <tr v-for="item in list" :key="item.iddatos" class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <td class="px-6 py-4">
                <div class="font-bold text-gray-900 dark:text-white">{{ item.nombre }}</div>
                <div class="text-[11px] text-gray-500 uppercase mt-0.5">{{ item.tipo_p }} | {{ item.tipo_identificacion }}</div>
              </td>
              <td class="px-6 py-4">
                <div v-if="item.cui" class="text-xs text-gray-600 dark:text-gray-400"><span class="font-bold">CUI:</span> {{ item.cui }}</div>
                <div v-if="item.nit" class="text-xs text-gray-600 dark:text-gray-400"><span class="font-bold">NIT:</span> {{ item.nit }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ formatDate(item.fecha_respuesta) }}</div>
                <div v-if="item.oficio" class="text-[10px] text-gray-500 uppercase mt-0.5">Oficio: {{ item.oficio }}</div>
              </td>
              <td class="px-6 py-4 text-center">
                <span 
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block border"
                  :class="item.estado === '1' 
                    ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/10 dark:text-green-500 dark:border-green-900/30' 
                    : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/10 dark:text-red-500 dark:border-red-900/30'"
                >
                  {{ item.estado === '1' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEditModal(item)" class="p-2 text-gray-400 hover:text-azul-cope transition-colors" title="Editar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2"/></svg>
                  </button>
                  <button v-if="item.estado === '1' && authStore.hasRole('Super Admin')" @click="openDeactivateModal(item)" class="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Desactivar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636" stroke-width="2"/></svg>
                  </button>
                  <button v-else @click="showReason(item)" class="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Ver Motivo">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
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

const showReason = (item: RecordMP) => { Swal.fire({ title: 'Motivo de Baja', text: item.observacion_baja || 'N/A', icon: 'info' }) }
const formatDate = (dateString?: string) => { if (!dateString) return '---'; const date = new Date(dateString); return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) }
onMounted(() => fetchData())
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

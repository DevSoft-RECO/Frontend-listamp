<template>
  <div class="space-y-6">
    <!-- Ultra-Efficient Command Strip (All-in-One) -->
    <div class="flex flex-wrap lg:flex-nowrap items-center gap-4 bg-white/40 dark:bg-slate-900/40 p-3 rounded-2xl border border-gray-200/50 dark:border-white/5 backdrop-blur-md shadow-xl mb-6">
      <!-- 1. Brand/Title (Left) -->
      <div class="flex items-center gap-3 shrink-0">
        <div class="w-10 h-10 bg-azul-cope rounded-xl flex items-center justify-center text-white shadow-lg shadow-azul-cope/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div class="hidden xl:block">
          <h1 class="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-none">Control de Créditos</h1>
          <p class="text-[9px] font-bold text-azul-cope uppercase tracking-widest mt-1 opacity-70">Lista Negra</p>
        </div>
      </div>

      <!-- 2. Integrated Search Bar (Center/Auto-grow) -->
      <div class="flex-1 min-w-[200px] relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-azul-cope/40 group-focus-within:text-azul-cope transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input 
          v-model="searchQuery"
          @input="handleSearch"
          type="text" 
          placeholder="Buscar por nombre, identificación o motivo..."
          class="w-full pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-slate-950 border border-transparent focus:border-azul-cope/30 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-azul-cope/5 transition-all shadow-inner"
        />
      </div>

      <!-- 3. Stats & Actions (Right) -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Stats Pill (Now Verde-Cope) -->
        <div class="flex items-center gap-3 px-3 py-1.5 bg-verde-cope rounded-xl shadow-lg shadow-verde-cope/20 border border-white/5 group hover:scale-105 transition-transform">
          <div class="p-1 bg-white/10 rounded-lg text-white">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-white/60 uppercase tracking-widest leading-none">Total</span>
            <span class="text-xs font-black text-white tabular-nums leading-none mt-1">{{ stats.total || 0 }}</span>
          </div>
        </div>

        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-azul-cope hover:bg-azul-cope/90 text-white font-black rounded-xl transition-all shadow-lg shadow-azul-cope/20 active:scale-95 text-[10px] uppercase tracking-wider group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
          </svg>
          Registrar
        </button>

        <button 
          @click="exportToCSV"
          class="p-2 text-verde-cope bg-verde-cope/5 hover:bg-verde-cope/10 border border-verde-cope/10 rounded-xl transition-all shadow-sm active:scale-95"
          title="Descargar CSV"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        <button 
          @click="fetchData(1)"
          class="p-2 text-azul-cope dark:text-blue-400 bg-azul-cope/5 hover:bg-azul-cope/10 border border-azul-cope/10 rounded-xl transition-all active:rotate-180"
          title="Refrescar"
        >
          <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>

    <!-- High-Density Table Container -->
    <div class="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-xl shadow-xl overflow-hidden mb-12">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-azul-cope text-white border-b border-azul-cope">
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80">Información del Cliente</th>
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80">Identificación</th>
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80">Motivo de Bloqueo</th>
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80">Fecha Registro</th>
              <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-white/80 text-right">Gestión</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/50">
            <tr v-if="loading && list.length === 0">
              <td colspan="5" class="px-8 py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-10 h-10 border-4 border-azul-cope/20 border-t-azul-cope rounded-full animate-spin"></div>
                  <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Sincronizando Datos...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="list.length === 0" class="group">
              <td colspan="5" class="px-8 py-20 text-center">
                <div class="flex flex-col items-center gap-4 opacity-30 group-hover:opacity-100 transition-opacity">
                  <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 8-8-8" /></svg>
                  <p class="text-sm font-black text-gray-500 uppercase tracking-tighter">Sin registros en la base de datos</p>
                </div>
              </td>
            </tr>
            <tr v-for="item in list" :key="item.id" class="group hover:bg-azul-cope/[0.02] transition-all duration-300">
              <td class="px-8 py-3">
                <div class="font-black text-gray-900 dark:text-white text-sm mb-0.5 group-hover:text-azul-cope transition-colors">{{ item.nombre }}</div>
                <div class="text-[9px] font-bold text-gray-400 uppercase tracking-tight">CÓDIGO: {{ item.id_usuario }}</div>
              </td>
              <td class="px-8 py-3">
                <div v-if="item.dpi" class="flex items-center gap-2">
                  <span class="text-[9px] font-black text-azul-cope/40 uppercase w-7">DPI</span>
                  <span class="text-xs font-bold text-gray-700 dark:text-slate-300 tabular-nums">{{ item.dpi }}</span>
                </div>
                <div v-else class="text-xs text-gray-400 italic">N/A</div>
              </td>
              <td class="px-8 py-3">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="px-1.5 py-0.5 bg-red-500/10 text-red-600 rounded text-[9px] font-black uppercase tracking-wider">{{ item.motivo }}</span>
                </div>
                <div v-if="item.descripcion" class="text-[9px] font-bold text-gray-400 uppercase truncate max-w-xs pl-0.5" :title="item.descripcion">{{ item.descripcion }}</div>
              </td>
              <td class="px-8 py-3">
                <div class="flex items-center gap-2">
                  <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span class="text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-tight">{{ formatDate(item.created_at) }}</span>
                </div>
              </td>
              <td class="px-8 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button @click="openEditModal(item)" class="p-1.5 text-gray-400 hover:text-azul-cope hover:bg-azul-cope/10 rounded-lg transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2.5"/></svg>
                  </button>
                  <button @click="confirmDelete(item)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-600/10 rounded-lg transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0016.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2.5"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Advanced Pagination -->
      <div class="px-8 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-[10px] font-black text-gray-500 uppercase tracking-widest">
          Mostrando <span class="text-azul-cope">{{ list.length }}</span> de <span class="text-azul-cope">{{ pagination.total }}</span> registros
        </div>

        <div class="flex items-center gap-1">
          <button @click="fetchData(1)" :disabled="pagination.current_page === 1 || loading" class="p-2 text-gray-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg disabled:opacity-20 transition-all shadow-sm border border-transparent hover:border-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" stroke-width="2.5"/></svg>
          </button>
          
          <div class="flex items-center gap-1 mx-2">
            <button 
              v-for="p in paginationPages" :key="p" @click="fetchData(p)"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all"
              :class="p === pagination.current_page ? 'bg-azul-cope text-white shadow-lg shadow-azul-cope/30' : 'text-gray-500 hover:bg-white dark:hover:bg-slate-800'"
            >
              {{ p }}
            </button>
          </div>

          <button @click="fetchData(pagination.last_page)" :disabled="pagination.current_page === pagination.last_page || loading" class="p-2 text-gray-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg disabled:opacity-20 transition-all shadow-sm border border-transparent hover:border-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7M5 5l7 7-7 7" stroke-width="2.5"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <ListaCreditoFormModal :show="showModal" :is-editing="isEditing" :initial-data="form" :submitting="submitting" @close="showModal = false" @save="saveRecord" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import ListaCreditoFormModal from './components/ListaCreditoFormModal.vue'

interface RecordCredito {
  id?: number; id_usuario: string; dpi?: string; nombre: string; motivo: string; descripcion?: string; created_at?: string;
}

const list = ref<RecordCredito[]>([])
const loading = ref(true)
const submitting = ref(false)
const searchQuery = ref('')
const pagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 10 })
const stats = ref({ total: 0 })
const showModal = ref(false)
const isEditing = ref(false)
const form = ref<RecordCredito>({ id_usuario: '', nombre: '', motivo: '' })

let searchTimeout: any = null
const handleSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => fetchData(1), 500)
}

const fetchData = async (page = 1) => {
  if (page < 1 || (pagination.value.last_page > 0 && page > pagination.value.last_page)) return
  loading.value = true
  try {
    const response = await api.get('/lista-credito', { params: { page, search: searchQuery.value } })
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

const openCreateModal = () => { isEditing.value = false; form.value = { id_usuario: '', nombre: '', motivo: '', dpi: '', descripcion: '' }; showModal.value = true }
const openEditModal = (item: RecordCredito) => { isEditing.value = true; form.value = { ...item }; showModal.value = true }
const saveRecord = async (formData: RecordCredito) => {
  submitting.value = true
  try {
    if (isEditing.value) await api.put(`/lista-credito/${formData.id}`, formData)
    else await api.post('/lista-credito', formData)
    Swal.fire({ icon: 'success', title: 'Operación Exitosa', timer: 1500, showConfirmButton: false })
    await fetchData(pagination.value.current_page)
    showModal.value = false
  } catch (error) { console.error('Error saving record:', error) } finally { submitting.value = false }
}

const confirmDelete = async (item: RecordCredito) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `Se eliminará de la lista negra a: ${item.nombre}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/lista-credito/${item.id}`)
      Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success')
      await fetchData(pagination.value.current_page)
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el registro.', 'error')
    }
  }
}

const exportToCSV = async () => {
    loading.value = true
    try {
        const response = await api.get('/lista-credito/export', {
            params: { search: searchQuery.value },
            responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        const date = new Date().toISOString().split('T')[0]
        link.setAttribute('download', `lista_creditos_${date}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Error al exportar CSV:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo generar el reporte.' })
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString?: string) => { if (!dateString) return '---'; const date = new Date(dateString); return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) }
onMounted(() => fetchData())
</script>

<style scoped>
/* Scoped styles */
</style>

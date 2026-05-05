<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
      <div>
        <nav class="flex text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1 items-center gap-2">
          <span>Inicio</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2"/></svg>
          <span class="text-azul-cope dark:text-verde-cope">Lista Negra Créditos</span>
        </nav>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Control de Créditos
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Administración de clientes en lista negra de créditos.</p>
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

    <!-- Stats & Filters Bar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex items-center gap-4 col-span-1">
        <div class="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div>
          <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Total Registrados</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total || 0 }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-sm col-span-2 flex flex-col md:flex-row items-center gap-4">
        <div class="flex-1 relative w-full">
          <input 
            v-model="searchQuery"
            @input="handleSearch"
            type="text" 
            placeholder="Buscar por nombre, DPI, motivo..."
            class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-azul-cope/20 transition-all"
          />
          <svg class="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        
        <button 
          @click="fetchData(1)"
          class="px-4 py-2.5 text-azul-cope dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-semibold flex items-center gap-2 border border-gray-200 dark:border-gray-700 whitespace-nowrap w-full md:w-auto justify-center"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2"/></svg>
          Actualizar
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Cliente</th>
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Identificación</th>
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Motivo</th>
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Fecha Registro</th>
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
                No se encontraron registros en lista de créditos.
              </td>
            </tr>
            <tr v-for="item in list" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <td class="px-6 py-4">
                <div class="font-bold text-gray-900 dark:text-white">{{ item.nombre }}</div>
                <div class="text-[11px] text-gray-500 uppercase mt-0.5">Código: {{ item.id_usuario }}</div>
              </td>
              <td class="px-6 py-4">
                <div v-if="item.dpi" class="text-xs text-gray-600 dark:text-gray-400"><span class="font-bold">DPI:</span> {{ item.dpi }}</div>
                <div v-else class="text-xs text-gray-400 italic">N/A</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-xs font-semibold text-red-600 dark:text-red-400">{{ item.motivo }}</div>
                <div v-if="item.descripcion" class="text-[10px] text-gray-500 truncate max-w-xs mt-0.5" :title="item.descripcion">{{ item.descripcion }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-xs text-gray-600 dark:text-gray-400">{{ formatDate(item.created_at) }}</div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEditModal(item)" class="p-2 text-gray-400 hover:text-azul-cope transition-colors" title="Editar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2"/></svg>
                  </button>
                  <button @click="confirmDelete(item)" class="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
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

const formatDate = (dateString?: string) => { if (!dateString) return '---'; const date = new Date(dateString); return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) }
onMounted(() => fetchData())
</script>

<style scoped>
/* Scoped styles */
</style>

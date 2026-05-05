<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
      <div>
        <nav class="flex text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1 items-center gap-2">
          <router-link to="/admin/listas-mp" class="hover:text-azul-cope">Lista MP</router-link>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2"/></svg>
          <span class="text-azul-cope dark:text-verde-cope">Fiscalías</span>
        </nav>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Administración de Fiscalías
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Gestiona las dependencias y fiscalías disponibles en el sistema.</p>
      </div>
      
      <button 
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-azul-cope hover:bg-azul-cope/90 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-95 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Nueva Fiscalía
      </button>
    </div>

    <!-- Main Content -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden max-w-4xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">ID</th>
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Nombre de la Dependencia / Fiscalía</th>
              <th class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="3" class="px-6 py-12 text-center text-gray-400 font-medium italic">
                Cargando fiscalías...
              </td>
            </tr>
            <tr v-else-if="fiscalias.length === 0">
              <td colspan="3" class="px-6 py-12 text-center text-gray-400 font-medium italic">
                No hay fiscalías registradas.
              </td>
            </tr>
            <tr v-for="f in fiscalias" :key="f.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <td class="px-6 py-4 text-gray-500 font-medium">#{{ f.id }}</td>
              <td class="px-6 py-4">
                <div class="font-bold text-gray-900 dark:text-white uppercase">{{ f.nombre }}</div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEditModal(f)" class="p-2 text-gray-400 hover:text-azul-cope transition-colors" title="Editar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2"/></svg>
                  </button>
                  <button @click="confirmDelete(f)" class="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-950/60 backdrop-blur-sm" @click="showModal = false"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
            <h2 class="text-lg font-bold text-azul-cope dark:text-white tracking-tight">
              {{ isEditing ? 'Editar Fiscalía' : 'Nueva Fiscalía' }}
            </h2>
            <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="p-6">
            <form @submit.prevent="saveFiscalia">
              <div class="mb-6">
                <label class="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-0.5">Nombre de la Fiscalía *</label>
                <input 
                  v-model="form.nombre" 
                  required 
                  type="text" 
                  class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-cope/10 focus:border-azul-cope transition-all"
                  placeholder="Ej: Fiscalía Distrital de Guatemala"
                >
              </div>

              <div class="flex gap-3">
                <button 
                  type="submit" 
                  :disabled="submitting"
                  class="flex-1 py-2.5 bg-azul-cope text-white font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-azul-cope/90 disabled:opacity-30 transition-all shadow-sm"
                >
                  {{ submitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') }}
                </button>
                <button 
                  type="button"
                  @click="showModal = false"
                  class="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

interface Fiscalia {
  id?: number;
  nombre: string;
}

const fiscalias = ref<Fiscalia[]>([])
const loading = ref(true)
const submitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const form = ref<Fiscalia>({ nombre: '' })

const fetchFiscalias = async () => {
  loading.value = true
  try {
    const response = await api.get('/fiscalias')
    fiscalias.value = response.data
  } catch (error) {
    console.error('Error fetching fiscalias:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = { nombre: '' }
  showModal.value = true
}

const openEditModal = (f: Fiscalia) => {
  isEditing.value = true
  form.value = { ...f }
  showModal.value = true
}

const saveFiscalia = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await api.put(`/fiscalias/${form.value.id}`, form.value)
    } else {
      await api.post('/fiscalias', form.value)
    }
    Swal.fire({ icon: 'success', title: 'Operación Exitosa', timer: 1500, showConfirmButton: false })
    await fetchFiscalias()
    showModal.value = false
  } catch (error: any) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: error.response?.data?.message || 'Ocurrió un error al guardar'
    })
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async (f: Fiscalia) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `Se eliminará la fiscalía: ${f.nombre}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/fiscalias/${f.id}`)
      Swal.fire('Eliminado', 'La fiscalía ha sido eliminada.', 'success')
      await fetchFiscalias()
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la fiscalía.', 'error')
    }
  }
}

onMounted(() => fetchFiscalias())
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>

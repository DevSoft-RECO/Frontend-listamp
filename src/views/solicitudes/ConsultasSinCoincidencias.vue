<template>
  <div class="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Encabezado -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-[#013d7b] dark:text-[#5aba03] flex items-center gap-3">
          <span class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#013d7b] dark:text-[#5aba03]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Consultas sin Coincidencias
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Historial de validaciones limpias realizadas en el sistema.</p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Tipo de Reporte</label>
            <select v-model="filters.tipo_reporte" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:ring-[#013d7b] transition-all">
              <option value="todas">Todas las listas</option>
              <option value="Lista MP">Lista MP</option>
              <option value="Lista Mixta">Lista Mixta</option>
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

      <!-- Tabla -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div v-if="loading" class="p-12 flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#013d7b] mb-4"></div>
          <p class="text-gray-500">Cargando registros...</p>
        </div>

        <div v-else-if="consultas.length === 0" class="p-12 text-center text-gray-500 font-bold">
          No se encontraron registros que coincidan con los filtros.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider">Nombre Consultado</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider">Identificación</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider">Tipo Reporte</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider">Usuario / Agencia</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider">Verificación</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="c in consultas" :key="c.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                <td class="px-6 py-4">
                  <span class="font-bold text-gray-900 dark:text-white uppercase">{{ c.nombre_buscado }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-blue-600">{{ c.tipo_documento }}</span>
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ c.numero_documento }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-bold uppercase tracking-tighter">
                    {{ c.tipo_reporte }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs">
                  <div class="flex flex-col">
                    <span class="font-bold">{{ c.usuario?.name }}</span>
                    <span class="text-gray-400">{{ c.agencia?.nombre }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span v-if="c.verificacion === 'verificado'" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    Listo
                  </span>
                  <button v-else @click="verificarConsulta(c.id)" class="px-3 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-full text-xs font-bold transition-all flex items-center gap-1 w-max">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verificar
                  </button>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <!-- Menú de Descarga -->
                    <div class="relative group/menu">
                      <button class="p-2 text-[#013d7b] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all flex items-center gap-1" title="Opciones de Reporte">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <!-- Dropdown -->
                      <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200">
                        <button @click="viewPDF(c.id)" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Ver PDF Original
                        </button>
                        <button @click="downloadAsImage(c.id, c.nombre_buscado)" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Descargar Imagen (JPG)
                        </button>
                      </div>
                    </div>

                    <button v-if="isAdmin" @click="deleteRecord(c.id)" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all" title="Eliminar">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span class="text-sm text-gray-500">Página {{ pagination.current_page }} de {{ totalPages }}</span>
          <div class="flex gap-2">
            <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium disabled:opacity-50"> Anterior </button>
            <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === totalPages" class="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium disabled:opacity-50"> Siguiente </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.user?.roles_list?.includes('Super Admin'));

const consultas = ref([]);
const loading = ref(false);
const totalPages = ref(1);

const filters = ref({
  tipo_reporte: 'todas',
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
      ...filters.value,
      page: pagination.value.current_page,
      per_page: pagination.value.per_page
    };
    const response = await api.get('/consultas-sin-resultado', { params });
    consultas.value = response.data.data;
    totalPages.value = response.data.last_page;
  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar los registros', 'error');
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filters.value = { tipo_reporte: 'todas', fecha_inicio: '', fecha_fin: '' };
  pagination.value.current_page = 1;
  fetchData();
};

const changePage = (page) => {
  pagination.value.current_page = page;
  fetchData();
};

const verificarConsulta = async (id) => {
  const result = await Swal.fire({
    title: '¿Confirmar Verificación?',
    text: "Por favor, revise que la consulta sea válida. Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#013d7b',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, verificar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    await api.post(`/consultas-sin-resultado/${id}/verificar`);
    Swal.fire({ 
      title: 'Verificado', 
      text: 'La consulta ha sido marcada como válida.',
      icon: 'success', 
      toast: true, 
      position: 'top-end', 
      showConfirmButton: false, 
      timer: 3000 
    });
    fetchData();
  } catch (error) {
    Swal.fire('Error', 'No se pudo completar la verificación', 'error');
  }
};

const viewPDF = async (id) => {
  Swal.fire({
    title: 'Generando Reporte...',
    text: 'Por favor espere un momento.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const response = await api.get(`/consultas-sin-resultado/${id}/regenerar-pdf`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    Swal.close();
    window.open(url, '_blank');
  } catch (error) {
    Swal.fire('Error', 'No se pudo generar el PDF', 'error');
  }
};

// --- LÓGICA DE DESCARGA COMO IMAGEN ---

const loadPdfJs = () => {
  return new Promise((resolve) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const script = document.createElement('script');
    script.src = '/libs/pdfjs/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/libs/pdfjs/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    document.head.appendChild(script);
  });
};

const downloadAsImage = async (id, nombre) => {
  Swal.fire({
    title: 'Procesando Imagen...',
    text: 'Convirtiendo reporte a formato JPG.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const response = await api.get(`/consultas-sin-resultado/${id}/regenerar-pdf`, { responseType: 'blob' });
    const pdfjs = await loadPdfJs();
    const arrayBuffer = await response.data.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    
    const viewport = page.getViewport({ scale: 2.0 }); // Alta calidad
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `Reporte_${nombre.replace(/\s+/g, '_')}.jpg`;
    link.click();

    Swal.close();
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo convertir el reporte a imagen.', 'error');
  }
};

const deleteRecord = async (id) => {
  const result = await Swal.fire({
    title: '¿Eliminar registro?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Sí, eliminar'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/consultas-sin-resultado/${id}`);
      Swal.fire('Eliminado', 'El registro ha sido borrado.', 'success');
      fetchData();
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar.', 'error');
    }
  }
};

onMounted(fetchData);
</script>

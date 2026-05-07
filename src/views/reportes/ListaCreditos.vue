<template>
  <div>

    <div class="max-w-[1600px] mx-auto px-6 pt-2 pb-8">
      <!-- 5x5 Grid Layout System -->
      <div class="grid grid-cols-1 lg:grid-cols-5 lg:grid-rows-[auto_1fr] gap-4 items-start">
        
        <!-- DIV 1: Full-Width Header (grid-area: 1 / 1 / 2 / 6) -->
        <header class="lg:col-span-5 bg-white/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-verde-cope/10 rounded-2xl flex items-center justify-center text-verde-cope shadow-inner">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">Validación Consolidada</h1>
              <div class="flex items-center gap-2 mt-2">
                <p class="text-[10px] uppercase font-black text-verde-cope tracking-[0.2em]">Lista MP + Créditos</p>
                <span class="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">v2.0 - Riesgos</p>
              </div>
            </div>
          </div>
          <div class="hidden md:flex items-center gap-4 bg-verde-cope/5 border border-verde-cope/10 px-4 py-2 rounded-xl">
            <span class="text-[9px] font-black text-verde-cope uppercase tracking-widest">Estado: Operativo</span>
            <div class="w-2 h-2 bg-verde-cope rounded-full animate-pulse"></div>
          </div>
        </header>

        <!-- DIV 2: Sidebar Timeline (grid-area: 2 / 1 / 6 / 2) -->
        <aside class="lg:col-span-1 bg-white/30 dark:bg-slate-900/30 rounded-3xl border border-slate-200/50 dark:border-white/5 backdrop-blur-sm p-8 h-full">
          <div class="relative space-y-24">
            <!-- Vertical Line Path -->
            <div class="absolute left-[18px] top-[20px] h-[calc(100%-40px)] w-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0 overflow-hidden">
              <div class="w-full bg-verde-cope transition-all duration-700 ease-in-out" :style="{ height: ((currentStep - 1) * 50) + '%' }"></div>
            </div>

            <div v-for="(step, idx) in ['Búsqueda', 'Análisis', 'Verificación']" :key="idx" class="relative z-10 flex items-center gap-6 group">
              <!-- Step Circle -->
              <div 
                :class="[
                  'w-10 h-10 rounded-2xl border-2 flex items-center justify-center text-xs font-black transition-all duration-500 shadow-lg shrink-0',
                  currentStep === idx + 1 ? 'border-verde-cope bg-verde-cope text-white shadow-verde-cope/30' : 
                  currentStep > idx + 1 ? 'border-verde-cope bg-white dark:bg-slate-900 text-verde-cope shadow-verde-cope/10' : 
                  'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'
                ]"
              >
                <svg v-if="currentStep > idx + 1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <!-- Step Info -->
              <div class="flex flex-col">
                <span :class="['text-[10px] font-black uppercase tracking-widest transition-colors', currentStep === idx + 1 ? 'text-verde-cope' : 'text-slate-400']">{{ step }}</span>
                <span v-if="currentStep === idx + 1" class="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-1 animate-pulse">En proceso...</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- DIV 3: Main Operations Area (grid-area: 2 / 2 / 6 / 6) -->
        <main class="lg:col-span-4 min-w-0">
          <div class="relative">
            <!-- STEP 1: BUSQUEDA -->
            <transition name="fade-slide">
              <div v-if="currentStep === 1" class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/5 p-12 backdrop-blur-xl bg-opacity-80">
                <!-- ... step content ... -->
                <!-- ... existing content for step 1 ... -->
            <div class="max-w-xl mx-auto text-center">
              <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-3">Filtro 1. Consulta Centralizada</h2>
              <p class="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                Ingrese el nombre completo del asociado. El sistema buscará simultáneamente en la Lista del Ministerio Público y en la Lista Negra de Créditos.
              </p>

              <div class="space-y-4">
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <i class="pi pi-search"></i>
                  </div>
                  <input 
                    v-model="searchName"
                    type="text" 
                    placeholder="Nombre completo (mín. 10 caracteres)..."
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-12 pr-4 py-4 focus:ring-2 focus:ring-azul-cope focus:border-azul-cope outline-none transition-all text-slate-800 dark:text-white font-medium"
                    @keyup.enter="handleInitialSearch"
                  />
                </div>
                <button 
                  @click="handleInitialSearch"
                  :disabled="isSearching || !searchName"
                  class="w-full py-4 bg-azul-cope hover:bg-azul-cope/90 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-azul-cope/20"
                >
                  <i v-if="isSearching" class="pi pi-spin pi-spinner"></i>
                  <span>Siguiente: Analizar Resultados</span>
                  <i v-if="!isSearching" class="pi pi-chevron-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- STEP 2: RESULTADOS -->
        <transition name="fade-slide">
          <div v-if="currentStep === 2" class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 class="text-lg font-bold">Hallazgos Consolidados por Nombre</h2>
                <p class="text-xs text-slate-500">Resultados encontrados para: <span class="font-bold text-slate-700 dark:text-slate-300">{{ searchName }}</span></p>
              </div>
              <div class="flex gap-2">
                <button @click="currentStep = 1" class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  Regresar
                </button>
                <button @click="currentStep = 3" class="px-6 py-2 bg-azul-cope text-white rounded-lg text-xs font-bold hover:bg-azul-cope/90 transition-all shadow-lg shadow-azul-cope/20">
                  Confirmar y Continuar
                </button>
              </div>
            </div>

            <div class="min-h-[350px]">
              <div v-if="groupedResults.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th class="px-6 py-3 text-left font-black text-slate-400 text-[10px] uppercase tracking-wider">Nombre Completo</th>
                      <th class="px-6 py-3 text-left font-black text-slate-400 text-[10px] uppercase tracking-wider">Identificación</th>
                      <th class="px-6 py-3 text-left font-black text-slate-400 text-[10px] uppercase tracking-wider">Origen</th>
                      <th class="px-6 py-3 text-left font-black text-slate-400 text-[10px] uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr v-for="(item, index) in groupedResults" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{{ item.nombre }}</td>
                      <td class="px-6 py-4">
                        <div class="flex flex-wrap gap-2 font-mono text-[11px]">
                          <span v-if="item.cui" class="text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">CUI: {{ item.cui }}</span>
                          <span v-if="item.dpi" class="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800">DPI: {{ item.dpi }}</span>
                          <span v-if="item.nit" class="text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-800">NIT: {{ item.nit }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex gap-2">
                          <span v-if="item.hasMP" class="text-[10px] font-black px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">LISTA MP</span>
                          <span v-if="item.hasCreditos" class="text-[10px] font-black px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded border border-red-100 dark:border-red-800">CRÉDITOS</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-xs">
                        <span class="text-amber-600 font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">Requiere Análisis</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-20 text-center">
                <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800">
                  <i class="pi pi-check text-2xl text-emerald-600"></i>
                </div>
                <h3 class="font-bold text-slate-800 dark:text-white">Sin Coincidencias</h3>
                <p class="text-xs text-slate-500 max-w-xs mt-2">No se encontraron registros en ninguna lista negra. Puede proceder con la validación de identidad.</p>
              </div>
            </div>
          </div>
        </transition>

        <!-- STEP 3: VERIFICACIÓN -->
        <transition name="fade-slide">
          <div v-if="currentStep === 3" class="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-10">
            <div class="text-center mb-8">
              <h2 class="text-xl font-bold mb-2">Validación Estricta Consolidada</h2>
              <p class="text-xs text-slate-500 uppercase tracking-widest font-black">Asociado: {{ searchName }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div class="md:col-span-1 space-y-2">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Método</label>
                <div class="flex flex-col gap-2">
                  <button 
                    v-for="type in ['CUI']" 
                    :key="type"
                    @click="idType = type"
                    :class="[
                      'px-4 py-3 rounded-lg text-sm font-bold text-left transition-all border',
                      idType === type 
                        ? 'bg-azul-cope border-azul-cope text-white shadow-lg shadow-azul-cope/20' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    ]"
                  >
                    {{ type === 'CUI' ? 'CUI / DPI' : type }}
                  </button>
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">Número de Documento de Identidad</label>
                <div class="relative mb-8">
                  <input 
                    v-model="idNumber"
                    type="text" 
                    :placeholder="'Ingrese número de ' + idType + '...'"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-6 py-5 outline-none focus:ring-2 focus:ring-azul-cope text-xl font-mono"
                    @keyup.enter="handleFinalVerify"
                  />
                </div>

                <div class="flex gap-4">
                  <button @click="currentStep = 2" class="flex-1 py-4 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-500 hover:bg-slate-50 transition-all">
                    Atrás
                  </button>
                  
                  <button 
                    @click="handleFinalVerify"
                    :disabled="isGenerating || !idNumber"
                    class="flex-[2] py-4 bg-azul-cope hover:bg-azul-cope/90 text-white rounded-lg font-bold shadow-lg shadow-azul-cope/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <i v-if="isGenerating" class="pi pi-spin pi-spinner"></i>
                    <i v-else class="pi pi-verified"></i>
                    <span>Verificar y Descargar</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-10 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-[10px] text-slate-400 text-center leading-relaxed italic">
              Este proceso verificará simultáneamente ambas bases de datos. Al presionar el botón de verificación, se registrará el intento en la bitácora del oficial de cumplimiento.
            </div>
          </div>
        </transition>
          </div>
        </main>
      </div>
    </div>

    <!-- Modals -->
    <ModalAutorizacionConsolidada 
      :is-open="showAuthModal" 
      :data="authData"
      :is-submitting="isSubmittingAuth"
      @close="showAuthModal = false"
      @success="handleAuthSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import ModalAutorizacionConsolidada from '@/components/reportes/ModalAutorizacionConsolidada.vue';

// State
const currentStep = ref(1);
const searchName = ref('');
const isSearching = ref(false);
const results = ref<any[]>([]);

const groupedResults = computed(() => {
  const map = new Map();
  results.value.forEach(item => {
    if (!map.has(item.nombre)) {
      map.set(item.nombre, {
        nombre: item.nombre,
        cui: null,
        dpi: null,
        nit: null,
        hasMP: false,
        hasCreditos: false
      });
    }
    const group = map.get(item.nombre);
    if (item.source === 'MP') {
      group.hasMP = true;
      if (item.cui) group.cui = item.cui;
      if (item.nit) group.nit = item.nit;
    }
    if (item.source === 'CREDITOS') {
      group.hasCreditos = true;
      if (item.documento || item.dpi) group.dpi = item.documento || item.dpi;
    }
  });
  return Array.from(map.values());
});

const idType = ref('CUI');
const idNumber = ref('');
const isGenerating = ref(false);

const showAuthModal = ref(false);
const authData = ref<any>(null);
const isSubmittingAuth = ref(false);

const API_BASE = '/reportes/lista-consolidada';

// Actions
const resetFlow = () => {
  currentStep.value = 1;
  idNumber.value = '';
  searchName.value = '';
  results.value = [];
};

const handleInitialSearch = async () => {
  if (!searchName.value || searchName.value.length < 10) {
    Swal.fire({
      icon: 'warning',
      title: 'Validación',
      text: 'Ingrese al menos 10 caracteres para buscar.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    return;
  }
  
  isSearching.value = true;
  try {
    const response = await api.get(`${API_BASE}/data-filtrada`, {
      params: { search: searchName.value }
    });
    results.value = response.data.registros;
    currentStep.value = 2;
  } catch (error) {
    console.error(error);
    Swal.fire('Error de Conexión', 'No se pudo obtener datos del servidor', 'error');
  } finally {
    isSearching.value = false;
  }
};

const loadPdfJs = (): Promise<any> => {
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

const handleFinalVerify = async () => {
  if (!idNumber.value) {
    Swal.fire('Aviso', 'Ingrese el número de documento', 'info');
    return;
  }

  // SI NO HAY COINCIDENCIAS, PREGUNTAMOS EL FORMATO
  let format = 'pdf';
  if (results.value.length === 0) {
    const { value: selectedFormat } = await Swal.fire({
      title: 'Seleccione Formato de Descarga',
      text: '¿En qué formato desea obtener el reporte limpio consolidado?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: '<i class="pi pi-file-pdf"></i> PDF',
      denyButtonText: '<i class="pi pi-image"></i> Imagen (JPG)',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#013d7b',
      denyButtonColor: '#059669',
    });

    if (selectedFormat === undefined) return; // Cancelado
    format = selectedFormat ? 'pdf' : 'image';
  }

  isGenerating.value = true;

  if (format === 'image') {
    Swal.fire({
      title: 'Procesando...',
      text: 'Generando reporte en formato imagen.',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
  }

  try {
    const formData = new FormData();
    formData.append('nombre_buscado', searchName.value);
    formData.append('documento', idNumber.value);
    formData.append('tipo_identificacion', idType.value);
    formData.append('registros', JSON.stringify(results.value));

    const response = await api.post(`${API_BASE}/generar-pdf`, formData, {
      responseType: 'blob',
      headers: { 'Accept': 'application/json, application/pdf' }
    });

    if (response.headers['content-type'] && (response.headers['content-type'] as string).includes('application/json')) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = JSON.parse(reader.result as string);
        if (data.status === 'autorizacion_requerida') {
          authData.value = data;
          showAuthModal.value = true;
          Swal.close();
        }
      };
      reader.readAsText(response.data);
    } else {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      if (format === 'image') {
        const pdfjs = await loadPdfJs();
        const arrayBuffer = await blob.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.download = `Reporte_Consolidado_${idNumber.value}.jpg`;
        link.click();
        Swal.close();
      } else {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Reporte_Consolidado_${idNumber.value}.pdf`);
        document.body.appendChild(link);
        link.click();
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Verificación Completada',
        text: 'Sujeto validado como APTO. Reporte generado.',
        confirmButtonColor: '#013d7b'
      });
      resetFlow();
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Fallo del Sistema', 'Ocurrió un problema técnico durante la validación', 'error');
  } finally {
    isGenerating.value = false;
  }
};

const handleAuthSubmit = async (payload: { observacion_cumplimiento: string, observacion_jefatura: string }) => {
  isSubmittingAuth.value = true;
  try {
    const response = await api.post(`${API_BASE}/registrar-solicitud`, {
      nombre_consultado: authData.value.nombre_consultado,
      documento: authData.value.documento,
      tipo_identificacion: authData.value.tipo_identificacion,
      destinatario: authData.value.destinatario,
      observacion_cumplimiento: payload.observacion_cumplimiento,
      observacion_jefatura: payload.observacion_jefatura,
      coincidencias_mp: authData.value.coincidencias_mp,
      coincidencias_creditos: authData.value.coincidencias_creditos,
      mensaje_validacion: authData.value.mensaje_validacion
    });

    if (response.data.status === 'success') {
      showAuthModal.value = false;
      Swal.fire({
        icon: 'info',
        title: 'Solicitud Registrada',
        text: 'Se requiere autorización excepcional para este registro.',
        confirmButtonColor: '#013d7b'
      });
      resetFlow();
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo procesar la solicitud', 'error');
  } finally {
    isSubmittingAuth.value = false;
  }
};
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.4s ease-out;
}
.fade-slide-leave-active {
  transition: all 0.3s ease-in;
  position: absolute;
  width: 100%;
}
.fade-slide-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.fade-slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

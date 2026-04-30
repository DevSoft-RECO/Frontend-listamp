<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
    <!-- Top Bar / Navigation -->
    <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 mb-8">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#013d7b] rounded-lg flex items-center justify-center text-white">
            <i class="pi pi-shield text-xl"></i>
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight">Sistema de Validación</h1>
            <p class="text-[10px] uppercase font-black text-slate-400 tracking-widest">Lista Negra MP</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs font-medium text-slate-500">Módulo de Cumplimiento v2.0</span>
        </div>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-6 pb-12">
      
      <!-- Corporate Stepper -->
      <div class="mb-10 max-w-4xl mx-auto">
        <div class="flex items-center justify-between">
          <div v-for="(step, idx) in ['Búsqueda', 'Resultados', 'Verificación']" :key="idx" class="flex flex-col items-center flex-1">
            <div class="flex items-center w-full">
              <div class="flex-1 h-[2px]" :class="idx === 0 ? 'bg-transparent' : (currentStep > idx ? 'bg-[#013d7b]' : 'bg-slate-200 dark:bg-slate-800')"></div>
              <div 
                :class="[
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300',
                  currentStep === idx + 1 ? 'border-[#013d7b] bg-[#013d7b] text-white' : 
                  currentStep > idx + 1 ? 'border-[#013d7b] bg-white dark:bg-slate-900 text-[#013d7b]' : 
                  'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-400'
                ]"
              >
                <i v-if="currentStep > idx + 1" class="pi pi-check text-xs"></i>
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <div class="flex-1 h-[2px]" :class="idx === 2 ? 'bg-transparent' : (currentStep > idx + 1 ? 'bg-[#013d7b]' : 'bg-slate-200 dark:bg-slate-800')"></div>
            </div>
            <span :class="['mt-3 text-[10px] font-black uppercase tracking-wider', currentStep === idx + 1 ? 'text-[#013d7b] dark:text-blue-400' : 'text-slate-400']">{{ step }}</span>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="relative max-w-5xl mx-auto">
        
        <!-- STEP 1: BUSQUEDA -->
        <transition name="fade-slide">
          <div v-if="currentStep === 1" class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-10">
            <div class="max-w-xl mx-auto text-center">
              <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-3">Filtro 1. Consulta por Nombre</h2>
              <p class="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                Ingrese el nombre completo del asociado tal como aparece en su documento de identidad para iniciar la búsqueda en el repositorio central.
              </p>

              <div class="space-y-4">
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <i class="pi pi-user"></i>
                  </div>
                  <input 
                    v-model="searchName"
                    type="text" 
                    placeholder="Nombre completo del asociado..."
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#013d7b] focus:border-[#013d7b] outline-none transition-all text-slate-800 dark:text-white font-medium"
                    @keyup.enter="handleInitialSearch"
                  />
                </div>
                <button 
                  @click="handleInitialSearch"
                  :disabled="isSearching || !searchName"
                  class="w-full py-4 bg-[#013d7b] hover:bg-[#002d5a] text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
                <h2 class="text-lg font-bold">Hallazgos por Nombre</h2>
                <p class="text-xs text-slate-500">Resultados encontrados para: <span class="font-bold text-slate-700 dark:text-slate-300">{{ searchName }}</span></p>
              </div>
              <div class="flex gap-2">
                <button @click="currentStep = 1" class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  Regresar
                </button>
                <button @click="currentStep = 3" class="px-6 py-2 bg-[#013d7b] text-white rounded-lg text-xs font-bold hover:bg-[#002d5a] transition-all">
                  Confirmar y Continuar
                </button>
              </div>
            </div>

            <div class="min-h-[350px]">
              <div v-if="results.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th class="px-6 py-3 text-left font-black text-slate-400 text-[10px] uppercase tracking-wider">Nombre Completo</th>
                      <th class="px-6 py-3 text-left font-black text-slate-400 text-[10px] uppercase tracking-wider">Identificación</th>
                      <th class="px-6 py-3 text-left font-black text-slate-400 text-[10px] uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr v-for="(item, index) in results" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{{ item.nombre }}</td>
                      <td class="px-6 py-4">
                        <div class="flex gap-2 font-mono text-[11px]">
                          <span v-if="item.cui" class="text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">DPI: {{ item.cui }}</span>
                          <span v-if="item.nit" class="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800">NIT: {{ item.nit }}</span>
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
                <p class="text-xs text-slate-500 max-w-xs mt-2">No se encontraron registros de este nombre en la lista negra. Puede proceder con la validación de identidad.</p>
              </div>
            </div>
          </div>
        </transition>

        <!-- STEP 3: VERIFICACIÓN -->
        <transition name="fade-slide">
          <div v-if="currentStep === 3" class="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-10">
            <div class="text-center mb-8">
              <h2 class="text-xl font-bold mb-2">Validación Estricta de Identidad</h2>
              <p class="text-xs text-slate-500 uppercase tracking-widest font-black">Asociado: {{ searchName }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div class="md:col-span-1 space-y-2">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Método</label>
                <div class="flex flex-col gap-2">
                  <button 
                    v-for="type in ['CUI', 'Pasaporte', 'Nit']" 
                    :key="type"
                    @click="idType = type"
                    :class="[
                      'px-4 py-3 rounded-lg text-sm font-bold text-left transition-all border',
                      idType === type 
                        ? 'bg-[#013d7b] border-[#013d7b] text-white' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    ]"
                  >
                    {{ type }}
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
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-6 py-5 outline-none focus:ring-2 focus:ring-[#013d7b] text-xl font-mono"
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
                    class="flex-[2] py-4 bg-[#013d7b] hover:bg-[#002d5a] text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <i v-if="isGenerating" class="pi pi-spin pi-spinner"></i>
                    <i v-else class="pi pi-verified"></i>
                    <span>Ejecutar Verificación Final</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-10 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-[10px] text-slate-400 text-center leading-relaxed italic">
              Este proceso es auditable. Al presionar el botón de verificación, se registrará el intento en la bitácora del oficial de cumplimiento junto con su firma digital de usuario.
            </div>
          </div>
        </transition>

      </div>
    </div>

    <!-- Modals -->
    <ModalAutorizacionListaMP 
      :is-open="showAuthModal" 
      :data="authData"
      :is-submitting="isSubmittingAuth"
      @close="showAuthModal = false"
      @success="handleAuthSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import ModalAutorizacionListaMP from '@/components/reportes/ModalAutorizacionListaMP.vue';

// State
const currentStep = ref(1);
const searchName = ref('');
const isSearching = ref(false);
const results = ref<any[]>([]);

const idType = ref('CUI');
const idNumber = ref('');
const isGenerating = ref(false);

const showAuthModal = ref(false);
const authData = ref<any>(null);
const isSubmittingAuth = ref(false);

const API_BASE = '/reportes/lista-mp';

// Actions
const resetFlow = () => {
  currentStep.value = 1;
  idNumber.value = '';
  searchName.value = '';
  results.value = [];
};

const handleInitialSearch = async () => {
  if (!searchName.value || searchName.value.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Validación',
      text: 'Ingrese al menos 6 caracteres para buscar.',
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

const handleFinalVerify = async () => {
  if (!idNumber.value) {
    Swal.fire('Aviso', 'Ingrese el número de documento', 'info');
    return;
  }

  isGenerating.value = true;
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
        }
      };
      reader.readAsText(response.data);
    } else {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reporte_ListaMP_${idNumber.value}.pdf`);
      document.body.appendChild(link);
      link.click();
      
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

const handleAuthSubmit = async (observacion: string) => {
  isSubmittingAuth.value = true;
  try {
    const response = await api.post(`${API_BASE}/registrar-solicitud`, {
      nombre_consultado: authData.value.nombre_consultado,
      documento: authData.value.documento,
      pdf_path: authData.value.pdf_path,
      tipo_identificacion: authData.value.tipo_identificacion,
      observacion_cumplimiento: observacion
    });

    if (response.data.status === 'success_solicitud') {
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

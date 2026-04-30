<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <div class="p-2 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
          </div>
          Validación Lista MP
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Módulo de verificación estricta de cumplimiento.</p>
      </div>
      
      <button @click="resetFlow" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-medium flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Nueva Consulta
      </button>
    </div>

    <!-- Step 1: Search -->
    <div v-if="currentStep === 1" class="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div class="max-w-2xl mx-auto space-y-6">
          <div class="text-center">
            <h2 class="text-xl font-semibold text-slate-800 dark:text-white">Paso 1: Búsqueda por Nombre</h2>
            <p class="text-slate-500 dark:text-slate-400">Ingrese el nombre completo de la persona a consultar.</p>
          </div>

          <div class="relative group">
            <div class="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-search"><circle cx="10" cy="7" r="4"/><path d="M10.3 15H7a4 4 0 0 0-4 4v2"/><circle cx="17" cy="17" r="3"/><path d="m21 21-1.9-1.9"/></svg>
            </div>
            <input 
              v-model="searchName"
              type="text" 
              placeholder="Ej: Juan Perez Garcia..."
              @keyup.enter="handleSearch"
              class="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg text-slate-800 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <button 
            @click="handleSearch"
            :disabled="searchName.length < 6 || isSearching"
            class="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
          >
            <svg v-if="isSearching" class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSearching ? 'Buscando Coincidencias...' : 'Iniciar Búsqueda' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Step 2: Results & Validation -->
    <div v-if="currentStep === 2" class="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <!-- Results Table -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div class="p-6 border-b border-white/20 dark:border-slate-800/50 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Coincidencias Parciales Encontradas</h2>
          <span class="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full">
            {{ results.length }} Registro(s)
          </span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">Nombre</th>
                <th class="px-6 py-4">CUI/DPI</th>
                <th class="px-6 py-4">Pasaporte</th>
                <th class="px-6 py-4">NIT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="res in results" :key="res.iddatos" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm text-slate-700 dark:text-slate-300">
                <td class="px-6 py-4 font-mono text-xs">{{ res.iddatos }}</td>
                <td class="px-6 py-4 font-semibold text-slate-800 dark:text-white">{{ res.nombre }}</td>
                <td class="px-6 py-4">{{ res.cui || '-' }}</td>
                <td class="px-6 py-4">{{ res.pasaporte || '-' }}</td>
                <td class="px-6 py-4">{{ res.nit || '-' }}</td>
              </tr>
              <tr v-if="results.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-slate-500">No se encontraron coincidencias parciales por nombre.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Validation Form -->
      <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 space-y-6">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <h2 class="text-xl font-bold text-slate-800 dark:text-white">Paso 2: Validación Estricta</h2>
          <p class="text-sm text-slate-500">Ingrese el documento de identidad para descartar o confirmar riesgos.</p>
        </div>

        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Documento</label>
            <select v-model="idType" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-800 dark:text-white">
              <option value="CUI">CUI / DPI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Nit">NIT</option>
              <option value="Sin Documento">Verificación sin Documento</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Número de Identificación</label>
            <input 
              v-model="idNumber"
              :disabled="idType === 'Sin Documento'"
              type="text" 
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900/50"
              placeholder="Ingrese el número de documento..."
            />
          </div>
        </div>

        <div class="flex justify-center pt-4">
          <button 
            @click="handleGenerateReport"
            :disabled="isGenerating || (idType !== 'Sin Documento' && !idNumber)"
            class="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-3"
          >
            <svg v-if="isGenerating" class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            {{ isGenerating ? 'Procesando Validación...' : 'Generar Reporte PDF' }}
          </button>
        </div>
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

// Base de la API relativa a la instancia configurada
const API_BASE = '/reportes/lista-mp';

// Actions
const resetFlow = () => {
  currentStep.value = 1;
  searchName.value = '';
  results.value = [];
  idNumber.value = '';
  idType.value = 'CUI';
};

const handleSearch = async () => {
  if (searchName.value.length < 6) return;
  
  isSearching.value = true;
  try {
    const response = await api.get(`${API_BASE}/data-filtrada`, {
      params: { search: searchName.value }
    });
    results.value = response.data.registros;
    currentStep.value = 2;
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo realizar la búsqueda.', 'error');
  } finally {
    isSearching.value = false;
  }
};

const handleGenerateReport = async () => {
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

    const contentType = response.headers['content-type'];

    if (typeof contentType === 'string' && contentType.includes('application/json')) {
      const text = await response.data.text();
      const result = JSON.parse(text);
      
      if (result.status === 'autorizacion_requerida') {
        authData.value = result;
        showAuthModal.value = true;
      }
    } else {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_lista_mp_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      Swal.fire({
        icon: 'success',
        title: '¡Reporte Generado!',
        text: 'La validación se completó sin riesgos y el PDF ha sido descargado.',
        confirmButtonColor: '#10b981'
      });
      
      resetFlow();
    }
  } catch (error: any) {
    console.error(error);
    Swal.fire('Error', 'Ocurrió un problema al validar el documento.', 'error');
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
        title: 'Solicitud Enviada',
        text: response.data.mensaje,
        confirmButtonColor: '#1B365D'
      });
      resetFlow();
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo registrar la solicitud de autorización.', 'error');
  } finally {
    isSubmittingAuth.value = false;
  }
};
</script>

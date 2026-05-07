<template>
  <div class="w-full px-6 lg:px-10 py-8 bg-slate-50 dark:bg-[#020617] min-h-screen transition-colors duration-300">
    
    <!-- Loader Corporativo -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[60vh]">
      <div class="w-12 h-12 border-4 border-slate-200 border-t-azul-cope rounded-full animate-spin"></div>
      <p class="mt-4 text-slate-500 font-semibold text-sm">Cargando expediente...</p>
    </div>

    <div v-else-if="solicitud" class="max-w-[1600px] mx-auto space-y-6">
      
      <!-- 🟦 Encabezado Institucional -->
      <header class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="flex flex-col md:flex-row justify-between items-center p-6 gap-6">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-azul-cope border border-slate-200 dark:border-slate-700">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Expediente #{{ solicitud.id }}</h1>
                <span class="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border" :class="getStatusHeaderClass">
                  {{ getGeneralStatusText }}
                </span>
              </div>
              <p class="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">
                Generado el {{ formatDate(solicitud.created_at) }} <span class="mx-2">|</span> ID de Seguimiento: {{ solicitud.id }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <button @click="$router.push('/admin/solicitudes')"
              class="flex-1 md:flex-none px-5 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-all text-sm font-semibold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Regresar
            </button>
            <button v-if="solicitud.autorizacion_completa && canDownload" @click="triggerDownload"
              class="flex-1 md:flex-none px-5 py-2.5 bg-azul-cope text-white rounded-lg hover:bg-azul-cope/90 transition-all text-sm font-semibold shadow-sm flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Descargar PDF
            </button>
          </div>
        </div>
      </header>

      <!-- Layout de Trabajo -->
      <div class="grid lg:grid-cols-12 gap-6 items-start">
        
        <!-- Columna de Información (4/12) -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Resumen del Caso -->
          <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Información del Solicitante</h2>
            </div>
            <div class="p-6 space-y-5">
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre Completo</p>
                <p class="text-sm font-semibold text-slate-900 dark:text-white uppercase">{{ solicitud.usuario?.name || '---' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Puesto / Cargo</p>
                <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ solicitud.usuario?.puesto || '---' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Agencia de Origen</p>
                <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ solicitud.agencia?.nombre || '---' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo de Validación</p>
                <p class="text-sm font-semibold text-azul-cope capitalize">{{ solicitud.destinatario || '---' }}</p>
              </div>
            </div>
          </div>

          <!-- Historial de Auditoría -->
          <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Flujo de Autorización</h2>
            </div>
            <div class="p-6 space-y-6">
              <!-- Cumplimiento -->
              <div class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" :class="getTimelineDotClass(solicitud.estado_cumplimiento)">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTimelineIconPath(solicitud.estado_cumplimiento)" /></svg>
                  </div>
                  <div class="w-px h-full bg-slate-100 dark:bg-slate-800 my-2"></div>
                </div>
                <div class="flex-1 pb-6">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-bold text-slate-900 dark:text-white uppercase">Cumplimiento</p>
                    <span class="text-[10px] font-bold uppercase" :class="getStatusTextColor(solicitud.estado_cumplimiento)">{{ solicitud.estado_cumplimiento || 'Pendiente' }}</span>
                  </div>
                  <div class="space-y-3">
                    <div v-if="solicitud.observacion_cumplimiento" class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                      <p class="text-[9px] font-bold text-slate-400 uppercase mb-1">Justificación del Solicitante:</p>
                      <p class="text-xs text-slate-700 dark:text-slate-300 italic">"{{ solicitud.observacion_cumplimiento }}"</p>
                    </div>
                    
                    <div v-if="solicitud.mensaje_autorizacionC || solicitud.mensaje_rechazadoC" class="p-3 bg-azul-cope/5 dark:bg-azul-cope/10 rounded-lg text-xs text-azul-cope dark:text-blue-400 border border-azul-cope/10 font-medium">
                      <p class="text-[9px] font-bold uppercase mb-1 opacity-70">Dictamen del Auditor:</p>
                      "{{ solicitud.mensaje_autorizacionC || solicitud.mensaje_rechazadoC }}"
                    </div>
                    <p v-else-if="!solicitud.observacion_cumplimiento" class="text-[10px] text-slate-400">Sin información registrada.</p>
                  </div>
                </div>
              </div>

              <!-- Jefatura -->
              <div class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" :class="getTimelineDotClass(solicitud.estado_jefatura)">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTimelineIconPath(solicitud.estado_jefatura)" /></svg>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-bold text-slate-900 dark:text-white uppercase">Jefe de Agencia</p>
                    <span class="text-[10px] font-bold uppercase" :class="getStatusTextColor(solicitud.estado_jefatura)">{{ solicitud.estado_jefatura || 'Pendiente' }}</span>
                  </div>
                  <div class="space-y-3">
                    <div v-if="solicitud.observacion_jefatura" class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                      <p class="text-[9px] font-bold text-slate-400 uppercase mb-1">Justificación del Solicitante:</p>
                      <p class="text-xs text-slate-700 dark:text-slate-300 italic">"{{ solicitud.observacion_jefatura }}"</p>
                    </div>

                    <div v-if="solicitud.mensaje_autorizacionJ || solicitud.mensaje_rechazadoJ" class="p-3 bg-azul-cope/5 dark:bg-azul-cope/10 rounded-lg text-xs text-azul-cope dark:text-blue-400 border border-azul-cope/10 font-medium">
                      <p class="text-[9px] font-bold uppercase mb-1 opacity-70">Dictamen del Auditor:</p>
                      "{{ solicitud.mensaje_autorizacionJ || solicitud.mensaje_rechazadoJ }}"
                    </div>
                    <p v-else-if="!solicitud.observacion_jefatura" class="text-[10px] text-slate-400">Sin información registrada.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna de Gestión y Documentación (8/12) -->
        <div class="lg:col-span-8 space-y-6">
          
          <div class="grid md:grid-cols-2 gap-6 items-stretch">
            
            <!-- Panel de Dictamen -->
            <div v-if="canDecide" class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <h2 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Resolución de Auditoría</h2>
              </div>
              <div class="p-6 flex-1 flex flex-col gap-5">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase mb-3">Emitir dictamen como</label>
                  <div class="flex gap-2">
                    <button v-if="userCanCumplimiento" @click="selectedRole = 'cumplimiento'"
                      :class="[selectedRole === 'cumplimiento' ? 'bg-azul-cope text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 hover:bg-slate-200']"
                      class="flex-1 px-4 py-2.5 rounded text-xs font-bold transition-all border border-transparent"> 
                      CUMPLIMIENTO 
                    </button>
                    <button v-if="userCanJefatura" @click="selectedRole = 'jefatura'"
                      :class="[selectedRole === 'jefatura' ? 'bg-azul-cope text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 hover:bg-slate-200']"
                      class="flex-1 px-4 py-2.5 rounded text-xs font-bold transition-all border border-transparent"> 
                      JEFE AGENCIA 
                    </button>
                  </div>
                </div>

                <div class="flex-1 flex flex-col">
                  <label class="block text-[10px] font-bold text-slate-400 uppercase mb-2">Comentarios Técnicos</label>
                  <textarea v-model="decisionComment" rows="6" 
                    placeholder="Ingrese el fundamento legal o administrativo de su decisión..."
                    class="w-full flex-1 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs p-4 outline-none focus:ring-2 focus:ring-azul-cope transition-all resize-none"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button v-if="canAuthorize" @click="submitDecision('autorizado')" :disabled="isSubmitting"
                    class="px-6 py-3 bg-verde-cope hover:bg-verde-cope/90 text-white rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50 uppercase">
                    {{ isSubmitting ? 'Procesando...' : 'Autorizar' }}
                  </button>
                  <button @click="submitDecision('rechazado')" :disabled="isSubmitting"
                    class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50 uppercase">
                    Rechazar
                  </button>
                </div>
              </div>
            </div>

            <!-- Miniatura de Documentación -->
            <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col items-center justify-center p-8 text-center group">
              <div class="relative w-full max-w-[240px]">
                <div 
                  @click="openProtectedViewer"
                  class="relative aspect-[3/4] bg-white rounded shadow-lg border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 group-hover:shadow-2xl"
                >
                  <div v-if="pdfBlobUrl" class="w-full h-full flex justify-center p-1 pointer-events-none">
                    <canvas ref="previewCanvas" class="w-full h-auto rounded-sm"></canvas>
                  </div>
                  <div v-else class="w-full h-full flex items-center justify-center bg-slate-50">
                    <p class="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Cargando PDF...</p>
                  </div>
                  <!-- Hover Overlay -->
                  <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button class="bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-bold uppercase shadow-xl">Ver Documento</button>
                  </div>
                </div>
                <div class="mt-6">
                  <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase">Expediente Oficial</h3>
                  <p class="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wide">Documento de Soporte Firmado</p>
                  <button @click="openProtectedViewer" class="mt-4 text-xs font-bold text-azul-cope hover:underline uppercase">Pantalla Completa</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Notificaciones de Estado Final -->
          <div v-if="solicitud.autorizacion_completa || solicitud.estado_cumplimiento === 'rechazado' || solicitud.estado_jefatura === 'rechazado'">
            <div v-if="solicitud.autorizacion_completa" class="p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase">Solicitud Aprobada</h3>
                  <p class="text-xs text-emerald-600 dark:text-emerald-500 font-medium">El proceso ha concluido satisfactoriamente.</p>
                </div>
              </div>
              <button v-if="canDownload" @click="triggerDownload" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm uppercase">Descargar</button>
            </div>

            <div v-else class="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-sm">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-red-800 dark:text-red-400 uppercase">Solicitud Rechazada</h3>
                <p class="text-xs text-red-600 dark:text-red-500 font-medium">No se han otorgado las autorizaciones correspondientes.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- 🚀 Visor PDF Seguro -->
    <div v-if="showModalViewer" class="fixed inset-0 bg-slate-900/95 z-[200] flex flex-col p-4 md:p-8" @contextmenu.prevent>
      <div class="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h2 class="text-lg font-bold text-white uppercase tracking-tight">Visor de Auditoría Protegido</h2>
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Documento Intransferible y Confidencial</p>
        </div>
        <button @click="showModalViewer = false" class="text-white hover:text-red-500 p-2 transition-colors">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="flex-1 overflow-auto flex justify-center py-10 select-none custom-scrollbar" id="modal-container">
        <div class="space-y-6 relative">
          <canvas v-for="page in totalPages" :key="page" :ref="el => canvasRefs[page] = el" class="bg-white shadow-2xl rounded-sm"></canvas>
          <div class="absolute inset-0 bg-transparent z-10"></div>
          <div class="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] rotate-[-45deg] select-none">
            <span class="text-[8vw] font-bold uppercase tracking-[1em]">PROPIEDAD_DE_COPE</span>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-white/10 flex justify-between items-center text-slate-500 text-[10px] font-bold uppercase">
        <p>Páginas Detectadas: {{ totalPages }}</p>
        <p class="text-red-500">Impresión y Descarga Deshabilitadas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const solicitud = ref(null);
const loading = ref(true);
const isSubmitting = ref(false);
const selectedRole = ref('');
const decisionComment = ref('');
const pdfBlobUrl = ref(null);

// Modal Viewer
const showModalViewer = ref(false);
const previewCanvas = ref(null);
const canvasRefs = ref({});
const totalPages = ref(0);
let pdfDoc = null;

// Lógica de estados
const getGeneralStatusText = computed(() => {
  if (!solicitud.value) return '...';
  return solicitud.value.autorizacion_completa ? 'Autorizada' : (
    (solicitud.value.estado_cumplimiento === 'rechazado' || solicitud.value.estado_jefatura === 'rechazado') ? 'Rechazada' : 'En Revisión'
  );
});

const getStatusHeaderClass = computed(() => {
  if (!solicitud.value) return 'bg-slate-100 border-slate-200 text-slate-400';
  if (solicitud.value.autorizacion_completa) return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  if (solicitud.value.estado_cumplimiento === 'rechazado' || solicitud.value.estado_jefatura === 'rechazado') return 'bg-red-50 border-red-200 text-red-700';
  return 'bg-amber-50 border-amber-200 text-amber-700';
});

const userCanCumplimiento = computed(() => {
  const roles = authStore.user?.roles_list || [];
  return (roles.includes('Super Admin') || authStore.hasPermission('solicitudes_autorizar_cumplimiento')) && 
         (!solicitud.value?.estado_cumplimiento || solicitud.value?.estado_cumplimiento === 'pendiente');
});

const userCanJefatura = computed(() => {
  const roles = authStore.user?.roles_list || [];
  return (roles.includes('Super Admin') || authStore.hasPermission('solicitudes_autorizar_jefatura')) && 
         (!solicitud.value?.estado_jefatura || solicitud.value?.estado_jefatura === 'pendiente');
});

const canDownload = computed(() => {
  const roles = authStore.user?.roles_list || [];
  return roles.includes('Super Admin') || authStore.hasPermission('solicitudes_descargar_pdf');
});

const canDecide = computed(() => userCanCumplimiento.value || userCanJefatura.value);

const canAuthorize = computed(() => {
  if (!solicitud.value) return false;
  if (solicitud.value.destinatario !== 'ambos') return true;
  if (selectedRole.value === 'cumplimiento') return solicitud.value.estado_jefatura !== 'rechazado';
  if (selectedRole.value === 'jefatura') return solicitud.value.estado_cumplimiento !== 'rechazado';
  return true;
});

// Cargar PDF.js dinámicamente si no existe
const loadPdfJs = () => {
  return new Promise((resolve) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    document.head.appendChild(script);
  });
};

const renderPage = async (pdf, pageNum, canvas, scale = 1) => {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvasContext: context, viewport }).promise;
};

const loadPdfPreview = async () => {
  if (!solicitud.value?.pdf_path) return;
  try {
    const response = await api.get(`/solicitudes/${solicitud.value.id}/descargar-pdf`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    pdfBlobUrl.value = window.URL.createObjectURL(blob);
    
    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument(pdfBlobUrl.value);
    pdfDoc = await loadingTask.promise;
    totalPages.value = pdfDoc.numPages;

    if (previewCanvas.value) {
      await renderPage(pdfDoc, 1, previewCanvas.value, 0.45);
    }
  } catch (error) {
    console.error("Error al cargar PDF", error);
  }
};

const openProtectedViewer = async () => {
  showModalViewer.value = true;
  await nextTick();
  for (let i = 1; i <= totalPages.value; i++) {
    const canvas = canvasRefs.value[i];
    if (canvas) await renderPage(pdfDoc, i, canvas, 1.4);
  }
};

const fetchSolicitud = async () => {
  try {
    const response = await api.get(`/solicitudes/${route.params.id}`);
    solicitud.value = response.data;
    loadPdfPreview();
    if (userCanCumplimiento.value) selectedRole.value = 'cumplimiento';
    else if (userCanJefatura.value) selectedRole.value = 'jefatura';
  } catch (error) {
    router.push('/admin/solicitudes');
  } finally {
    loading.value = false;
  }
};

const submitDecision = async (estado) => {
  if (!decisionComment.value || decisionComment.value.length < 10) {
    Swal.fire('Atención', 'Debe ingresar un comentario de al menos 10 caracteres.', 'warning');
    return;
  }
  const result = await Swal.fire({
    title: `¿Confirmar resolución?`,
    text: `Usted está por emitir un dictamen de ${estado.toUpperCase()}.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: estado === 'autorizado' ? '#10b981' : '#dc2626'
  });
  if (!result.isConfirmed) return;
  isSubmitting.value = true;
  try {
    await api.post(`/solicitudes/${solicitud.value.id}/actualizar-estado`, {
      estado, comentario: decisionComment.value, perfil: selectedRole.value
    });
    Swal.fire('Completado', 'El dictamen ha sido registrado.', 'success');
    router.push('/admin/solicitudes');
  } catch (error) {
    Swal.fire('Error', 'No se pudo procesar la solicitud.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const triggerDownload = async () => {
  if (!solicitud.value.autorizacion_completa) return;
  const link = document.createElement('a');
  link.href = pdfBlobUrl.value;
  link.download = `SOLICITUD_${solicitud.value.id}.pdf`;
  link.click();
};

const formatDate = (dateString) => {
  if (!dateString) return '---';
  return new Date(dateString).toLocaleString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getFlowCardClass = (s) => {
  if (s === 'autorizado') return 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10';
  if (s === 'rechazado') return 'border-red-200 bg-red-50 dark:bg-red-900/10';
  return 'border-slate-100 bg-slate-50 dark:bg-slate-800/50';
};

const getStatusTextColor = (s) => {
  if (s === 'autorizado') return 'text-emerald-600';
  if (s === 'rechazado') return 'text-red-600';
  return 'text-slate-400';
};

const getTimelineDotClass = (s) => {
  if (s === 'autorizado') return 'bg-emerald-500 text-white';
  if (s === 'rechazado') return 'bg-red-500 text-white';
  return 'bg-slate-100 text-slate-400 dark:bg-slate-800';
};

const getTimelineIconPath = (s) => {
  if (s === 'autorizado') return 'M5 13l4 4L19 7';
  if (s === 'rechazado') return 'M6 18L18 6M6 6l12 12';
  return 'M12 8v4l3 3';
};

const handleKeydown = (e) => {
  if (showModalViewer.value) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'u' || e.key === 'c')) {
      e.preventDefault();
      Swal.fire({ text: 'Acción restringida.', icon: 'warning', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    }
  }
};

onMounted(() => {
  fetchSolicitud();
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  if (pdfBlobUrl.value) window.URL.revokeObjectURL(pdfBlobUrl.value);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
</style>

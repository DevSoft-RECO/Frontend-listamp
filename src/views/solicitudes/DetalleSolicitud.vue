<template>
  <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
    
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-3xl p-20 shadow-xl flex flex-col items-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[#013d7b] mb-4"></div>
      <p class="text-gray-500 font-bold">Cargando detalle de la solicitud...</p>
    </div>

    <div v-else-if="solicitud" class="bg-white dark:bg-[#0f172a] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      
      <!-- 🟦 Encabezado Dinámico -->
      <div class="relative p-6 sm:p-8 border-b dark:border-gray-700 bg-gradient-to-r from-[#013d7b] to-[#015f9b] dark:from-[#1a202c] dark:to-[#2d3748] text-white">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
          <!-- Título -->
          <div class="flex-1">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Solicitud #{{ solicitud.id }}
            </h1>
            <p class="text-gray-200 dark:text-gray-400 text-sm sm:text-base mt-1">
              Detalle de Gestión MP o MP + Créditos
            </p>
          </div>

          <!-- Estado General y Botón Regresar -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <span class="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-full uppercase tracking-wider shadow-lg"
              :class="getStatusHeaderClass">
              {{ getGeneralStatusText }}
            </span>
            <button @click="$router.push('/admin/solicitudes')"
              class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Regresar
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="p-4 sm:p-6 lg:p-8">
        <div class="grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          <!-- Columna 1 & 2: Información General, Flujo y Acciones -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- 1. Información General -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h2 class="text-lg sm:text-xl font-bold mb-4 text-[#013d7b] dark:text-[#5aba03] flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Datos de la Solicitud
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm leading-relaxed">
                <div>
                  <p class="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wide">Generada por</p>
                  <p class="text-gray-900 dark:text-gray-100 font-black mt-1 uppercase">{{ solicitud.usuario?.name || '---' }}</p>
                  <p class="text-[10px] text-amber-600 font-bold uppercase">{{ solicitud.usuario?.puesto || 'Colaborador' }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wide">Agencia Solicitante</p>
                  <p class="text-gray-900 dark:text-gray-100 font-semibold mt-1">{{ solicitud.agencia?.nombre || '---' }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wide">Áreas de Autorización</p>
                  <p class="text-gray-900 dark:text-gray-100 font-semibold mt-1 capitalize">{{ solicitud.destinatario || '---' }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wide">Fecha de Creación</p>
                  <p class="text-gray-900 dark:text-gray-100 mt-1">{{ formatDate(solicitud.created_at) }}</p>
                </div>
                <div class="sm:col-span-2 lg:col-span-1">
                  <p class="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wide">Última Actualización</p>
                  <p class="text-gray-900 dark:text-gray-100 mt-1">{{ formatDate(solicitud.updated_at) }}</p>
                </div>
              </div>
            </div>

            <!-- 2. Flujo de Aprobación -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h2 class="text-lg sm:text-xl font-bold mb-4 text-[#013d7b] dark:text-[#5aba03] flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Fases de Aprobación y Comentarios
              </h2>
              <div class="grid md:grid-cols-2 gap-4">
                <!-- Tarjeta de Estado Cumplimiento -->
                <div class="p-4 rounded-lg border-l-4 shadow-sm" :class="getFlowCardClass(solicitud.estado_cumplimiento)">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100">Área de Cumplimiento</h3>
                    <span class="px-2 py-1 text-[10px] font-bold rounded-full uppercase" :class="getStatusBadgeClass(solicitud.estado_cumplimiento)">
                      {{ solicitud.estado_cumplimiento || 'Pendiente' }}
                    </span>
                  </div>
                  <div v-if="solicitud.observacion_cumplimiento" class="mt-2">
                    <p class="text-[11px] text-gray-500 font-bold uppercase mb-1">Justificación del Solicitante:</p>
                    <p class="text-xs text-gray-700 dark:text-gray-300 italic">"{{ solicitud.observacion_cumplimiento }}"</p>
                  </div>
                  <div v-if="solicitud.mensaje_autorizacionC || solicitud.mensaje_rechazadoC" class="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-[11px] text-gray-500 font-bold uppercase mb-1">Comentario de Auditoría:</p>
                    <p class="text-xs italic text-[#013d7b] dark:text-[#5aba03] font-medium">
                      "{{ solicitud.mensaje_autorizacionC || solicitud.mensaje_rechazadoC }}"
                    </p>
                  </div>
                </div>

                <!-- Tarjeta de Estado Jefe de Agencia -->
                <div class="p-4 rounded-lg border-l-4 shadow-sm" :class="getFlowCardClass(solicitud.estado_jefatura)">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100">Jefe de Agencia</h3>
                    <span class="px-2 py-1 text-[10px] font-bold rounded-full uppercase" :class="getStatusBadgeClass(solicitud.estado_jefatura)">
                      {{ solicitud.estado_jefatura || 'Pendiente' }}
                    </span>
                  </div>
                  <div v-if="solicitud.observacion_jefatura" class="mt-2">
                    <p class="text-[11px] text-gray-500 font-bold uppercase mb-1">Justificación del Solicitante:</p>
                    <p class="text-xs text-gray-700 dark:text-gray-300 italic">"{{ solicitud.observacion_jefatura }}"</p>
                  </div>
                  <div v-if="solicitud.mensaje_autorizacionJ || solicitud.mensaje_rechazadoJ" class="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-[11px] text-gray-500 font-bold uppercase mb-1">Comentario de Auditoría:</p>
                    <p class="text-xs italic text-[#013d7b] dark:text-[#5aba03] font-medium">
                      "{{ solicitud.mensaje_autorizacionJ || solicitud.mensaje_rechazadoJ }}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Acciones de Aprobación/Rechazo (Solo si tiene permisos) -->
            <div v-if="canDecide" class="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-[#013d7b]/20 dark:border-[#5aba03]/20 shadow-lg">
              <h2 class="text-lg sm:text-xl font-bold mb-4 text-[#013d7b] dark:text-[#5aba03] flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Gestión de la Solicitud
              </h2>
              
              <div class="mb-4">
                <label class="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Actuar como:</label>
                <div class="flex gap-2">
                  <button v-if="userCanCumplimiento" @click="selectedRole = 'cumplimiento'"
                    :class="[selectedRole === 'cumplimiento' ? 'bg-[#5aba03] text-white shadow-md' : 'bg-gray-100 text-gray-500 dark:bg-gray-700']"
                    class="px-4 py-2 rounded-lg text-xs font-black uppercase transition-all"> Cumplimiento </button>
                  <button v-if="userCanJefatura" @click="selectedRole = 'jefatura'"
                    :class="[selectedRole === 'jefatura' ? 'bg-[#013d7b] text-white shadow-md' : 'bg-gray-100 text-gray-500 dark:bg-gray-700']"
                    class="px-4 py-2 rounded-lg text-xs font-black uppercase transition-all"> Jefe Agencia </button>
                </div>
              </div>

              <div class="space-y-4">
                <textarea v-model="decisionComment" rows="3" placeholder="Escribe tu comentario de auditoría aquí..."
                  class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:ring-[#013d7b] dark:focus:ring-[#5aba03] transition-all"></textarea>
                
                <div class="flex flex-wrap gap-3">
                  <button v-if="canAuthorize" @click="submitDecision('autorizado')" :disabled="isSubmitting"
                    class="flex items-center px-6 py-2.5 bg-[#5aba03] hover:bg-[#4aa002] text-white rounded-lg text-sm font-bold shadow-md transition-all disabled:opacity-50 uppercase tracking-wide">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Autorizar
                  </button>
                  <button @click="submitDecision('rechazado')" :disabled="isSubmitting"
                    class="flex items-center px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-md transition-all disabled:opacity-50 uppercase tracking-wide">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rechazar
                  </button>
                </div>
              </div>
            </div>

            <!-- 4. Alertas de Estado Final -->
            <div class="space-y-4">
              <div v-if="solicitud.autorizacion_completa" class="p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg border border-green-300 dark:border-green-700 flex items-center justify-between shadow-sm">
                <p class="font-bold flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Solicitud autorizada. Descargue el documento final.
                </p>
                <button @click="downloadPDF" class="px-4 py-2 bg-[#013d7b] hover:bg-[#012a52] text-white rounded-md text-xs font-bold shadow-md transition whitespace-nowrap uppercase">
                  Descargar PDF
                </button>
              </div>
              <div v-else-if="solicitud.estado_cumplimiento === 'rechazado' || solicitud.estado_jefatura === 'rechazado'" 
                class="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg border border-red-300 dark:border-red-700 shadow-sm flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="font-bold text-sm">Solicitud rechazada por una de las áreas.</p>
              </div>
            </div>
          </div>

          <!-- Columna 3: Visor PDF -->
          <div class="lg:col-span-1">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 sticky top-4 border border-gray-100 dark:border-gray-700 shadow-xl">
              <h2 class="text-lg sm:text-xl font-bold mb-4 text-[#013d7b] dark:text-[#5aba03] flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Documento adjunto
              </h2>
              
              <div class="border border-gray-300 dark:border-gray-700 rounded-lg shadow-inner bg-gray-200 dark:bg-gray-900 overflow-hidden min-h-[400px] flex items-center justify-center relative group">
                <iframe v-if="pdfBlobUrl" :src="pdfBlobUrl" class="w-full h-[450px]" frameborder="0"></iframe>
                <div v-else class="flex flex-col items-center justify-center p-8 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p class="text-xs font-bold uppercase tracking-widest">Vista previa no disponible</p>
                </div>
              </div>

              <button @click="downloadPDF" class="mt-4 w-full flex items-center justify-center px-4 py-3 bg-[#013d7b] hover:bg-[#012a52] text-white rounded-lg text-sm font-bold shadow-md transition-all uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Ver Pantalla Completa
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
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

// Lógica de estados generales (Header)
const getGeneralStatusText = computed(() => {
  if (!solicitud.value) return '...';
  if (solicitud.value.autorizacion_completa) return 'Autorizada';
  if (solicitud.value.estado_cumplimiento === 'rechazado' || solicitud.value.estado_jefatura === 'rechazado') return 'Rechazada';
  return 'Pendiente';
});

const getStatusHeaderClass = computed(() => {
  if (!solicitud.value) return 'bg-gray-500';
  if (solicitud.value.autorizacion_completa) return 'bg-[#5aba03] text-white';
  if (solicitud.value.estado_cumplimiento === 'rechazado' || solicitud.value.estado_jefatura === 'rechazado') return 'bg-red-600 text-white';
  return 'bg-yellow-500 text-gray-900';
});

// Lógica de permisos reactiva
const userCanCumplimiento = computed(() => {
  const roles = authStore.user?.roles_list || [];
  return (roles.includes('Super Admin') || roles.includes('Cumplimiento')) && 
         (!solicitud.value?.estado_cumplimiento || solicitud.value?.estado_cumplimiento === 'pendiente');
});

const userCanJefatura = computed(() => {
  const roles = authStore.user?.roles_list || [];
  return (roles.includes('Super Admin') || roles.includes('Jefe de Agencia')) && 
         (!solicitud.value?.estado_jefatura || solicitud.value?.estado_jefatura === 'pendiente');
});

const canDecide = computed(() => userCanCumplimiento.value || userCanJefatura.value);

// Lógica para ocultar botón de autorizar si ya hay un rechazo en flujo "Ambos"
const canAuthorize = computed(() => {
  if (!solicitud.value) return false;
  if (solicitud.value.destinatario !== 'ambos') return true;
  
  if (selectedRole.value === 'cumplimiento') {
    return solicitud.value.estado_jefatura !== 'rechazado';
  } else if (selectedRole.value === 'jefatura') {
    return solicitud.value.estado_cumplimiento !== 'rechazado';
  }
  return true;
});

const fetchSolicitud = async () => {
  try {
    const response = await api.get(`/solicitudes/${route.params.id}`);
    solicitud.value = response.data;
    
    // Cargar previsualización del PDF
    loadPdfPreview();

    // Auto-seleccionar rol disponible
    if (userCanCumplimiento.value) selectedRole.value = 'cumplimiento';
    else if (userCanJefatura.value) selectedRole.value = 'jefatura';
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar la solicitud', 'error');
    router.push('/admin/solicitudes');
  } finally {
    loading.value = false;
  }
};

const loadPdfPreview = async () => {
  if (!solicitud.value?.pdf_path) return;
  try {
    const response = await api.get(`/solicitudes/${solicitud.value.id}/descargar-pdf`, { responseType: 'blob' });
    pdfBlobUrl.value = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  } catch (error) {
    console.error("Error al cargar previa del PDF", error);
  }
};

const submitDecision = async (estado) => {
  if (!decisionComment.value || decisionComment.value.length < 10) {
    Swal.fire('Atención', 'Debes ingresar un comentario detallado (min. 10 caracteres).', 'warning');
    return;
  }

  const result = await Swal.fire({
    title: `¿Estás seguro de ${estado === 'autorizado' ? 'AUTORIZAR' : 'RECHAZAR'}?`,
    text: "Esta acción quedará registrada en la bitácora de auditoría del sistema.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: estado === 'autorizado' ? '#16a34a' : '#dc2626',
    confirmButtonText: `Sí, ${estado === 'autorizado' ? 'Autorizar' : 'Rechazar'}`,
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  isSubmitting.value = true;
  try {
    await api.post(`/solicitudes/${solicitud.value.id}/actualizar-estado`, {
      estado,
      comentario: decisionComment.value,
      perfil: selectedRole.value
    });

    Swal.fire('¡Éxito!', 'La solicitud ha sido procesada correctamente.', 'success');
    router.push('/admin/solicitudes');
  } catch (error) {
    Swal.fire('Error', 'No se pudo procesar la solicitud.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const downloadPDF = async () => {
  if (pdfBlobUrl.value) {
    window.open(pdfBlobUrl.value, '_blank');
  } else {
    try {
      const response = await api.get(`/solicitudes/${solicitud.value.id}/descargar-pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
    } catch (error) {
      Swal.fire('Error', 'No se pudo abrir el archivo', 'error');
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '---';
  return new Date(dateString).toLocaleString('es-GT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const getFlowCardClass = (status) => {
  if (status === 'autorizado') return 'border-green-500 bg-green-50 dark:bg-green-900/10';
  if (status === 'rechazado') return 'border-red-500 bg-red-50 dark:bg-red-900/10';
  return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
};

const getStatusBadgeClass = (status) => {
  if (status === 'autorizado') return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100';
  if (status === 'rechazado') return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100';
  return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
};

onMounted(fetchSolicitud);

onUnmounted(() => {
  if (pdfBlobUrl.value) {
    window.URL.revokeObjectURL(pdfBlobUrl.value);
  }
});
</script>

<style scoped>
/* Estilos corporativos específicos */
.shadow-inner {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
</style>

<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <!-- Header -->
        <div class="bg-amber-600 px-6 py-4 flex items-center justify-between text-white relative overflow-hidden shrink-0">
          <!-- Background Glow para el header del modal -->
          <div class="absolute -top-10 -right-10 w-24 h-24 bg-white/10 blur-2xl rounded-full"></div>
          
          <div class="flex items-center gap-3 relative z-10">
            <div class="p-2 bg-white/20 rounded-lg">
              <ShieldAlert class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-black uppercase tracking-wider text-sm leading-tight">Alerta de Coincidencia Crítica</h3>
              <p class="text-[10px] opacity-90 font-bold uppercase tracking-widest mt-0.5">Nivel de Riesgo: Alto</p>
            </div>
          </div>

          <button 
            @click="handleClose" 
            class="relative z-10 p-2 hover:bg-white/20 rounded-xl transition-all duration-300 active:scale-90 flex items-center justify-center border border-transparent hover:border-white/30"
            title="Cerrar ventana"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-8 overflow-y-auto custom-scrollbar flex-1">
          <!-- Datos del Asociado -->
          <div class="grid grid-cols-2 gap-4 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase block mb-1">Asociado Consultado</label>
              <p class="font-bold text-slate-700 dark:text-white truncate">{{ data?.nombre_consultado }}</p>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase block mb-1">Documento Validado</label>
              <p class="font-bold text-slate-700 dark:text-white">{{ data?.tipo_identificacion }}: {{ data?.documento }}</p>
            </div>
          </div>

          <!-- Destinatario de la Autorización -->
          <div class="mb-6">
            <span class="text-xs font-black text-slate-500 uppercase block mb-2">Requiere Autorización de:</span>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold text-sm rounded-lg border border-blue-100 dark:border-blue-800">
              <i class="pi pi-users"></i>
              {{ getDestinatarioLabel() }}
            </div>
          </div>

          <!-- Hallazgos MP -->
          <div v-if="data?.coincidencias_mp?.length > 0" class="mb-6">
            <h4 class="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
              <i class="pi pi-list text-amber-500"></i>
              Hallazgos en Lista MP
            </h4>
            <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th class="px-4 py-2 font-black text-slate-400 uppercase">Nombre</th>
                    <th class="px-4 py-2 font-black text-slate-400 uppercase">CUI/DPI</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="(item, idx) in data?.coincidencias_mp" :key="'mp-'+idx" class="bg-white dark:bg-slate-900">
                    <td class="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{{ item.nombre }}</td>
                    <td class="px-4 py-3 font-mono text-slate-500">{{ item.documento || item.cui || 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Hallazgos Créditos -->
          <div v-if="data?.coincidencias_creditos?.length > 0" class="mb-6">
            <h4 class="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
              <i class="pi pi-list text-red-500"></i>
              Hallazgos en Lista de Créditos
            </h4>
            <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th class="px-4 py-2 font-black text-slate-400 uppercase">Nombre</th>
                    <th class="px-4 py-2 font-black text-slate-400 uppercase">Motivo</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="(item, idx) in data?.coincidencias_creditos" :key="'cred-'+idx" class="bg-white dark:bg-slate-900">
                    <td class="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{{ item.nombre }}</td>
                    <td class="px-4 py-3 font-mono text-slate-500">{{ item.motivo || 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Exception Logic -->
          <div class="space-y-6">
            <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl cursor-pointer border border-transparent hover:border-slate-200 transition-all select-none">
              <input 
                type="checkbox" 
                v-model="forceException"
                class="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              >
              <div class="flex-1">
                <span class="block font-bold text-slate-700 dark:text-white text-sm">Forzar Excepción</span>
                <span class="text-[10px] text-slate-500">Marque esta casilla solo si confirma que es un falso positivo o error de identidad. Es un proceso auditable.</span>
              </div>
            </label>

            <div v-if="forceException" class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              
              <!-- Justificación Cumplimiento -->
              <div v-if="['cumplimiento', 'ambos'].includes(data?.destinatario)">
                <label class="block text-xs font-black text-slate-400 uppercase mb-2 text-[#013d7b]">Justificación para Cumplimiento (Lista MP)</label>
                <textarea 
                  v-model="observacion_cumplimiento"
                  placeholder="Explique por qué se autoriza a pesar del hallazgo en MP..."
                  class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#013d7b] transition-all min-h-[100px]"
                ></textarea>
              </div>

              <!-- Justificación Jefatura -->
              <div v-if="['jefatura', 'ambos'].includes(data?.destinatario)">
                <label class="block text-xs font-black text-slate-400 uppercase mb-2 text-emerald-600">Justificación para Jefe de Agencia (Créditos)</label>
                <textarea 
                  v-model="observacion_jefatura"
                  placeholder="Explique por qué se autoriza a pesar del hallazgo en Créditos..."
                  class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[100px]"
                ></textarea>
              </div>

            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <button 
            @click="handleClose"
            class="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Terminar Proceso
          </button>
          
          <button 
            @click="handleSubmit"
            :disabled="!isValidToSubmit || isSubmitting"
            class="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-black shadow-lg shadow-amber-600/20 transition-all disabled:opacity-30 disabled:grayscale flex items-center gap-2"
          >
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-send"></i>
            <span>Enviar Solicitud de Autorización</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { X, ShieldAlert } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  data: Object,
  isSubmitting: Boolean
});

const emit = defineEmits(['close', 'success']);

const forceException = ref(false);
const observacion_cumplimiento = ref('');
const observacion_jefatura = ref('');

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    forceException.value = false;
    observacion_cumplimiento.value = '';
    observacion_jefatura.value = '';
  }
});

const getDestinatarioLabel = () => {
  if (props.data?.destinatario === 'ambos') return 'Cumplimiento y Jefe de Agencia';
  if (props.data?.destinatario === 'cumplimiento') return 'Cumplimiento (Por Lista MP)';
  if (props.data?.destinatario === 'jefatura') return 'Jefe de Agencia (Por Lista Créditos)';
  return 'Desconocido';
};

const isValidToSubmit = computed(() => {
  if (!forceException.value) return false;
  
  if (props.data?.destinatario === 'ambos') {
    return observacion_cumplimiento.value.length > 0 && observacion_jefatura.value.length > 0;
  }
  if (props.data?.destinatario === 'cumplimiento') {
    return observacion_cumplimiento.value.length > 0;
  }
  if (props.data?.destinatario === 'jefatura') {
    return observacion_jefatura.value.length > 0;
  }
  return false;
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (isValidToSubmit.value) {
    emit('success', {
      observacion_cumplimiento: observacion_cumplimiento.value,
      observacion_jefatura: observacion_jefatura.value
    });
  }
};
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>

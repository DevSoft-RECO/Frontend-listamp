<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <!-- Header -->
        <div class="bg-amber-600 px-6 py-4 flex items-center gap-3 text-white">
          <i class="pi pi-exclamation-triangle text-2xl"></i>
          <div>
            <h3 class="font-black uppercase tracking-wider text-sm">Alerta de Coincidencia Crítica</h3>
            <p class="text-[10px] opacity-80">Se requiere revisión de cumplimiento para continuar</p>
          </div>
        </div>

        <div class="p-8 overflow-y-auto custom-scrollbar flex-1">
          <!-- Datos del Asociado -->
          <div class="grid grid-cols-2 gap-4 mb-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase block mb-1">Asociado Consultado</label>
              <p class="font-bold text-slate-700 dark:text-white truncate">{{ data?.nombre_consultado }}</p>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase block mb-1">Documento Validado</label>
              <p class="font-bold text-slate-700 dark:text-white">{{ data?.tipo_identificacion }}: {{ data?.documento }}</p>
            </div>
          </div>

          <!-- Hallazgos (Registros que activaron la alerta) -->
          <div class="mb-8">
            <h4 class="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
              <i class="pi pi-list text-amber-500"></i>
              Hallazgos Críticos en la Lista Negra
            </h4>
            <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th class="px-4 py-2 font-black text-slate-400 uppercase">Nombre en Lista</th>
                    <th class="px-4 py-2 font-black text-slate-400 uppercase">Identificación</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="(item, idx) in data?.coincidencias" :key="idx" class="bg-white dark:bg-slate-900">
                    <td class="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{{ item.nombre }}</td>
                    <td class="px-4 py-3 font-mono text-slate-500">
                      {{ item.cui || item.nit || item.pasaporte || 'Sin Doc.' }}
                    </td>
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
                <span class="text-[10px] text-slate-500">Marque esta casilla solo si confirma que es un falso positivo o error de identidad.</span>
              </div>
            </label>

            <div v-if="forceException" class="animate-in fade-in slide-in-from-top-2 duration-300">
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Justificación de la Excepción</label>
              <textarea 
                v-model="justificacion"
                placeholder="Explique detalladamente por qué se está autorizando este registro..."
                class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all min-h-[100px]"
              ></textarea>
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
            :disabled="!forceException || !justificacion || isSubmitting"
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
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  data: Object,
  isSubmitting: Boolean
});

const emit = defineEmits(['close', 'success']);

const forceException = ref(false);
const justificacion = ref('');

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    forceException.value = false;
    justificacion.value = '';
  }
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (forceException.value && justificacion.value) {
    emit('success', justificacion.value);
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

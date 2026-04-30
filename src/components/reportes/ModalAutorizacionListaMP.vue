<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
    <div class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
      <!-- Header -->
      <div class="p-6 border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-red-600/10 to-orange-600/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-800 dark:text-white">Autorización Requerida</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Se han detectado coincidencias críticas en la Lista MP.</p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl">
          <h3 class="text-xs font-semibold text-red-800 dark:text-red-300 mb-2 uppercase tracking-wider">Resumen del Consultado</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Nombre</p>
              <p class="font-medium text-slate-800 dark:text-white">{{ data.nombre_consultado }}</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Documento ({{ data.tipo_identificacion || 'N/A' }})</p>
              <p class="font-medium text-slate-800 dark:text-white">{{ data.documento || 'No proporcionado' }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <label class="block">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Justificación para Área de Cumplimiento</span>
            <textarea 
              v-model="observacion"
              rows="4" 
              class="mt-1 block w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none resize-none"
              placeholder="Describa la razón por la cual se solicita la autorización excepcional..."
            ></textarea>
          </label>

          <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <p class="text-xs">Esta justificación quedará registrada permanentemente en el reporte PDF y en la base de datos.</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-white/20 dark:border-slate-700/50 flex justify-end gap-3">
        <button 
          @click="$emit('close')"
          class="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all"
        >
          Cancelar
        </button>
        <button 
          @click="submit"
          :disabled="isSubmitting || !observacion.trim()"
          class="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20 transition-all flex items-center gap-2"
        >
          <svg v-if="isSubmitting" class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isSubmitting ? 'Enviando...' : 'Enviar Solicitud' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  isOpen: boolean;
  data: any;
  isSubmitting: boolean;
}>();

const emit = defineEmits(['close', 'success']);

const observacion = ref('');

const submit = () => {
  emit('success', observacion.value);
};
</script>

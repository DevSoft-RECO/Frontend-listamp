<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-950/60 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        <!-- Modal Header -->
        <div class="px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-azul-cope dark:text-white tracking-tight">
              {{ isEditing ? 'Editar Registro de Crédito' : 'Nuevo Registro de Crédito' }}
            </h2>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] mt-0.5">
              Lista Negra de Créditos
            </p>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <form @submit.prevent="handleSubmit" id="creditForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-2">
                <label class="form-label-custom">Nombre Completo *</label>
                <input v-model="form.nombre" required type="text" class="form-input-custom" placeholder="Ej: Juan Pérez">
              </div>

              <div>
                <label class="form-label-custom">Código / ID Usuario *</label>
                <input v-model="form.id_usuario" required type="text" class="form-input-custom" placeholder="Código de cliente">
              </div>

              <div>
                <label class="form-label-custom">DPI</label>
                <input v-model="form.dpi" type="text" class="form-input-custom" placeholder="0000 00000 0000">
              </div>

              <div class="col-span-2">
                <label class="form-label-custom">Motivo *</label>
                <div class="relative">
                  <input 
                    v-model="form.motivo" 
                    required 
                    list="motivos-list"
                    class="form-input-custom" 
                    placeholder="Seleccione o escriba un motivo"
                  >
                  <datalist id="motivos-list">
                    <option v-for="motivo in opcionesMotivo" :key="motivo" :value="motivo">{{ motivo }}</option>
                  </datalist>
                </div>
              </div>

              <div class="col-span-2">
                <label class="form-label-custom">Descripción / Observaciones</label>
                <textarea v-model="form.descripcion" rows="3" class="form-input-custom resize-none" placeholder="Detalles adicionales..."></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="px-8 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-end gap-3">
          <button 
            @click="$emit('close')"
            class="px-5 py-2.5 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="creditForm"
            :disabled="submitting"
            class="px-10 py-2.5 bg-verde-cope text-azul-cope font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-verde-cope/90 disabled:opacity-30 transition-all shadow-sm"
          >
            {{ submitting ? 'Guardando...' : (isEditing ? 'Actualizar Registro' : 'Finalizar Registro') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean;
  isEditing: boolean;
  initialData: any;
  submitting: boolean;
}>()

const emit = defineEmits(['close', 'save'])

const form = ref({ ...props.initialData })

const opcionesMotivo = [
  'DEPURADO',
  'MOROSO',
  'MALA REFERENCIA PERSONAL',
  'MALA REFERENCIA FAMILIAR',
  'MALA REFERENCIA CRÉDITICIA',
  'SOBRE ENDEUDAMIENTO',
  'PRESTA NOMBRE',
  'FRAUDE CON GARANTIAS',
  'FALSIFICACION DE DOCUMENTOS',
  'FIADOR DE UN CREDITO DEMANDADO',
  'RESIDE EN UNA ZONA ROJA',
  'DEMANDADO'
]

watch(() => props.show, (newVal) => {
  if (newVal) {
    form.value = { ...props.initialData }
  }
})

const handleSubmit = () => {
  emit('save', form.value)
}
</script>

<style scoped>
@reference "@/assets/main.css";

.form-label-custom {
  @apply block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-0.5;
}

.form-input-custom {
  @apply w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azul-cope/10 focus:border-azul-cope dark:focus:border-verde-cope transition-all;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-700 rounded-full;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease-out;
}

.modal-enter-from .relative {
  transform: translateY(10px) scale(0.98);
}
</style>

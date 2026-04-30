<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-950/60 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors duration-300">
        <!-- Modal Header -->
        <div class="px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-azul-cope dark:text-white tracking-tight">
              {{ isEditing ? 'Editar Registro' : 'Nuevo Registro' }}
            </h2>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] mt-0.5 flex items-center gap-2">
              Paso {{ currentStep }} de 2: {{ currentStep === 1 ? 'Identificación' : 'Administración' }}
            </p>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-100 dark:bg-gray-800 h-1 flex">
          <div 
            class="bg-verde-cope h-full transition-all duration-700 shadow-[0_0_10px_rgba(90,186,3,0.3)]"
            :style="{ width: currentStep === 1 ? '50%' : '100%' }"
          ></div>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <form @submit.prevent="handleSubmit">
            <!-- Step 1: Datos Personales -->
            <div v-show="currentStep === 1" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div class="col-span-2">
                <label class="form-label-custom">Nombre Completo del Sujeto *</label>
                <input v-model="form.nombre" required type="text" class="form-input-custom" placeholder="Ej: Juan Pérez">
              </div>

              <div>
                <label class="form-label-custom">Tipo de Identificación *</label>
                <select v-model="form.tipo_identificacion" required class="form-input-custom">
                  <option value="" disabled class="dark:bg-gray-900">Seleccione tipo</option>
                  <option value="CUI" class="dark:bg-gray-900">CUI</option>
                  <option value="NIT" class="dark:bg-gray-900">NIT</option>
                  <option value="PASAPORTE" class="dark:bg-gray-900">PASAPORTE</option>
                </select>
              </div>

              <div>
                <label class="form-label-custom">N° Registro Interno</label>
                <input v-model="form.registro" type="text" class="form-input-custom" placeholder="Número de registro">
              </div>

              <div>
                <label class="form-label-custom">CUI (Código Único)</label>
                <input v-model="form.cui" type="text" class="form-input-custom" placeholder="0000 00000 0000">
              </div>

              <div>
                <label class="form-label-custom">Número de Pasaporte</label>
                <input v-model="form.pasaporte" type="text" class="form-input-custom" placeholder="Ingrese pasaporte">
              </div>

              <div>
                <label class="form-label-custom">NIT</label>
                <input v-model="form.nit" type="text" class="form-input-custom" placeholder="0000000-0">
              </div>

              <div>
                <label class="form-label-custom">Lugar de Origen / Residencia</label>
                <input v-model="form.lugar_origen" type="text" class="form-input-custom" placeholder="Ciudad / Departamento">
              </div>
            </div>

            <!-- Step 2: Datos Administrativos -->
            <div v-show="currentStep === 2" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div>
                <label class="form-label-custom">Fecha de Respuesta *</label>
                <input v-model="form.fecha_respuesta" required type="date" class="form-input-custom">
              </div>

              <div>
                <label class="form-label-custom">Fecha de Oficio</label>
                <input v-model="form.fecha_of" type="date" class="form-input-custom">
              </div>

              <div>
                <label class="form-label-custom">Dependencia / Fiscalía</label>
                <div class="relative">
                  <input 
                    v-model="form.fiscalia" 
                    list="fiscalias-list"
                    class="form-input-custom" 
                    placeholder="Seleccione o escriba fiscalía"
                  >
                  <datalist id="fiscalias-list">
                    <option v-for="f in fiscalias" :key="f.id" :value="f.nombre">{{ f.nombre }}</option>
                  </datalist>
                </div>
              </div>

              <div>
                <label class="form-label-custom">Referencia de Oficio</label>
                <input v-model="form.oficio" type="text" class="form-input-custom" placeholder="Ej: MP-000-2025">
              </div>

              <div>
                <label class="form-label-custom">Tipo de Persona *</label>
                <select v-model="form.tipo_p" required class="form-input-custom">
                  <option value="" disabled class="dark:bg-gray-900">Seleccione tipo</option>
                  <option value="INDIVIDUAL" class="dark:bg-gray-900">INDIVIDUAL</option>
                  <option value="JURIDICO" class="dark:bg-gray-900">JURIDICO</option>
                </select>
              </div>

              <div>
                <label class="form-label-custom">Fecha Recepción Cooperativa</label>
                <input v-model="form.fecha_cooperativa" type="date" class="form-input-custom">
              </div>

              <div>
                <label class="form-label-custom">Fecha Recepción Cumplimiento</label>
                <input v-model="form.fecha_cumplimiento" type="date" class="form-input-custom">
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="px-8 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button 
              v-if="currentStep === 2"
              @click="currentStep = 1"
              class="px-5 py-2 text-gray-600 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            <button 
              v-else
              @click="$emit('close')"
              class="px-5 py-2 text-gray-500 dark:text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            >
              Cancelar
            </button>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              v-if="currentStep === 1"
              @click="currentStep = 2"
              :disabled="!isStep1Valid"
              class="px-8 py-2.5 bg-azul-cope text-white font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-azul-cope/90 disabled:opacity-30 transition-all flex items-center gap-2 shadow-sm"
            >
              Continuar
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              v-else
              @click="handleSubmit"
              :disabled="submitting || !isStep2Valid"
              class="px-10 py-2.5 bg-verde-cope text-azul-cope font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-verde-cope/90 disabled:opacity-30 transition-all shadow-sm"
            >
              {{ submitting ? 'Guardando...' : (isEditing ? 'Actualizar Registro' : 'Finalizar Registro') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import api from '@/api/axios'

const props = defineProps<{
  show: boolean;
  isEditing: boolean;
  initialData: any;
  submitting: boolean;
}>()

const emit = defineEmits(['close', 'save'])

const currentStep = ref(1)
const form = ref({ ...props.initialData })

const fiscalias = ref<any[]>([])

const fetchFiscalias = async () => {
  try {
    const response = await api.get('/fiscalias')
    fiscalias.value = response.data
  } catch (error) {
    console.error('Error fetching fiscalias:', error)
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    currentStep.value = 1
    form.value = { ...props.initialData }
    const dateFields = ['fecha_respuesta', 'fecha_of', 'fecha_cooperativa', 'fecha_cumplimiento']
    dateFields.forEach(field => {
      if (form.value[field]) {
        form.value[field] = form.value[field].split('T')[0]
      }
    })
    fetchFiscalias()
  }
})

const isStep1Valid = computed(() => {
  return form.value.nombre && form.value.tipo_identificacion
})

const isStep2Valid = computed(() => {
  return form.value.fecha_respuesta && form.value.tipo_p
})

const handleSubmit = () => {
  if (isStep1Valid.value && isStep2Valid.value) {
    emit('save', form.value)
  }
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
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

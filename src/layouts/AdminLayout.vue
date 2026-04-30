<template>
  <div class="flex h-screen bg-gray-50 dark:bg-[#020617] text-gray-800 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300 relative">
    
    <!-- Background Decorations -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-verde-cope/5 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-azul-cope/10 blur-[100px] rounded-full pointer-events-none"></div>

    <AdminSidebar />

    <div
      class="flex flex-col flex-1 h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative"
      :class="[layoutStore.isCollapsed ? 'md:ml-20' : 'md:ml-64']"
    >

      <AdminHeader />

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 relative custom-scrollbar">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue' // Agregamos onUnmounted
import AdminSidebar from "../components/layout/AdminSidebar.vue"
import AdminHeader from "../components/layout/AdminHeader.vue"
import { useLayoutStore } from "@/stores/layout"

const layoutStore = useLayoutStore()

onMounted(() => {
  layoutStore.initTheme()

  // Agregamos el "Listener" para detectar cuando el usuario divide la pantalla
  window.addEventListener('resize', layoutStore.handleResize)
})

// Buena práctica: Limpiar el listener cuando sales del componente
onUnmounted(() => {
  window.removeEventListener('resize', layoutStore.handleResize)
})
</script>

<style>
/* SCROLLBAR OPTIMIZADO PARA TAILWIND 4
   Usamos variables CSS nativas que TW4 expone automáticamente.
*/
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-300);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-gray-400);
}

/* Soporte Dark Mode */
:root.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-700);
}
:root.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-gray-600);
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>

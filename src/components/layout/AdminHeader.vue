<template>
  <header
    class="sticky top-0 z-50 w-full bg-azul-cope dark:bg-slate-950 border-b border-white/10 dark:border-white/5 shadow-lg transition-all duration-300"
  >
    <div class="w-full px-6 h-16 flex items-center justify-between">
      
      <!-- Left: Mobile Menu Toggle (Ahora al extremo izquierdo en móviles) -->
      <div class="flex items-center xl:hidden w-12">
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="flex items-center justify-center p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Center (Mobile) / Left (Desktop): Logo & Branding -->
      <div class="flex items-center gap-3 absolute left-1/2 -translate-x-1/2 xl:relative xl:left-0 xl:translate-x-0 shrink-0 transition-all duration-300">
        <img src="@/assets/logoyk1.svg" alt="YK" class="h-9 xl:h-10 w-auto" />
        <div class="h-8 w-[1px] bg-white/20 hidden lg:block"></div>
        <div class="hidden lg:flex flex-col">
          <span class="text-sm font-black text-white uppercase tracking-tighter leading-none">Búro Interno</span>
          <span class="text-[10px] font-bold text-verde-cope uppercase tracking-widest">Mp y Créditos</span>
        </div>
      </div>

      <!-- Center: Empty (Navigation moved to Dock) -->
      <div class="flex-1"></div>

      <!-- Right: Actions & User (Compacto en móviles) -->
      <div class="flex items-center gap-1 sm:gap-2 shrink-0">
        
        <!-- Theme Toggle -->
        <button
          @click="layoutStore.toggleTheme"
          class="p-2 rounded-xl text-gris-cope hover:bg-white/10 transition-all focus:outline-none"
          title="Cambiar Tema"
        >
          <svg v-if="layoutStore.isDark" class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-5 h-5 sm:w-6 sm:h-6 text-gris-cope" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- User Info -->
        <div class="flex items-center gap-2">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-sm font-black text-white leading-none">{{ userName }}</span>
            <span class="text-[10px] font-bold text-verde-cope uppercase tracking-widest mt-1">{{ userAgencia }}</span>
          </div>
          
          <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-xl overflow-hidden border-2 border-white/20 shadow-sm shrink-0">
            <img v-if="userPhoto" :src="userPhoto" class="h-full w-full object-cover" alt="Avatar">
            <div v-else class="h-full w-full bg-white/10 text-white flex items-center justify-center font-black text-sm">
                {{ userInitials }}
            </div>
          </div>
        </div>

        <!-- Botón Salir Directo (Modernizado y Compacto) -->
        <button
          @click="handleReturnToMother"
          class="group relative flex items-center justify-center h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all duration-300 shadow-lg hover:shadow-red-500/40 ml-1"
          title="Regresar al Portal"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMobileMenuOpen" class="xl:hidden bg-azul-cope dark:bg-slate-950 border-b border-white/10 dark:border-white/5 max-h-[calc(100vh-80px)] overflow-y-auto shadow-2xl">
        <div class="p-4 space-y-2">
          <template v-for="item in menuItems" :key="item.id">
            <RouterLink
              v-if="!item.children"
              :to="item.route"
              @click="isMobileMenuOpen = false"
              class="flex items-center gap-3 p-4 rounded-xl font-bold"
              :class="isActive(item.route) ? 'bg-verde-cope text-white' : 'text-gris-cope hover:bg-white/10'"
            >
              <svg v-html="item.iconSvg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"></svg>
              {{ item.label }}
            </RouterLink>

            <div v-else class="space-y-1">
              <div class="px-4 py-2 text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                <svg v-html="item.iconSvg" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"></svg>
                {{ item.label }}
              </div>
              <RouterLink
                v-for="child in item.children"
                :key="child.route"
                :to="child.route"
                @click="isMobileMenuOpen = false"
                class="flex items-center gap-3 p-4 ml-4 rounded-xl font-bold"
                :class="isActive(child.route) ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'"
              >
                {{ child.label }}
              </RouterLink>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useLayoutStore } from "@/stores/layout"
import { useAuthStore } from "@/stores/auth"
import { getAvatarUrl } from "@/utils/imageUtils"

const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const route = useRoute()

const isMobileMenuOpen = ref(false)

// Navigation Items (Fused from Sidebar)
const menuItems = [
  {
    id: 'home',
    label: 'Dashboard',
    route: '/admin/dashboard',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2v10a1 1 0 01-1 1h-3m-4 0h4" />',
  },
  {
    id: 'modulo-listas-mp',
    label: 'Lista Mp',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />',
    children: [
      { label: 'Control de Registros', route: '/admin/listas-mp' },
      { label: 'Gestionar Fiscalías', route: '/admin/fiscalias' }
    ]
  },
  {
    id: 'modulo-lista-creditos',
    label: 'Lista Negra',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
    children: [
      { label: 'Control de Créditos', route: '/admin/lista-creditos' }
    ]
  },
  {
    id: 'modulo-reportes',
    label: 'Validaciones',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
    children: [
      { label: 'Validar Lista MP', route: '/admin/reportes/lista-mp' },
      { label: 'Validar Consolidado', route: '/admin/reportes/lista-consolidada' },
      { label: 'Consultas Limpias', route: '/admin/consultas-sin-resultado' }
    ]
  },
  {
    id: 'modulo-solicitudes',
    label: 'Autorizaciones',
    route: '/admin/solicitudes',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />',
  },
]

const userName = computed(() => authStore.user?.name || "Usuario")
const userAgencia = computed(() => authStore.user?.agencia?.nombre || "Sin Agencia")
const userPhoto = computed(() => getAvatarUrl(authStore.user?.avatar) || null)
const userInitials = computed(() => (userName.value || "U").substring(0, 2).toUpperCase())

const isActive = (path: string) => route.path === path
const isGroupActive = (item: any) => item.children?.some((child: any) => route.path === child.route)

const handleReturnToMother = () => {
    authStore.logoutLocal() 
    window.location.href = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
}

onMounted(async () => {
    if (!authStore.user) {
        await authStore.checkAuth()
    }
})
</script>

<style scoped>
.router-link-active {
  transition: all 0.3s ease;
}
</style>

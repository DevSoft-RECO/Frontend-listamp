<template>
  <header
    class="sticky top-0 z-50 w-full bg-[#013d7b] dark:bg-[#05070a] border-b border-white/10 dark:border-gray-800 transition-all duration-500 font-mono shadow-2xl"
  >
    <!-- Scanner Line Animation -->
    <div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 dark:opacity-50 animate-[scan_3s_linear_infinite]"></div>

    <div class="w-full px-6 h-16 flex items-center justify-between relative overflow-hidden">
      
      <!-- Decoración de Terminal de Seguridad -->
      <div class="absolute left-0 top-0 h-full w-1 bg-verde-cope"></div>
      <!-- Background Glow -->
      <div class="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none"></div>

      <!-- Left: Mobile Menu Toggle -->
      <div class="flex items-center xl:hidden">
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="flex items-center justify-center p-2 rounded-xl bg-white/10 dark:bg-gray-900 text-white dark:text-gray-400 border border-white/10 dark:border-gray-800 hover:bg-white/20 dark:hover:bg-gray-800 transition-all active:scale-90"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Center (Mobile) / Left (Desktop): Logo & Branding -->
      <div class="flex items-center gap-4 absolute left-1/2 -translate-x-1/2 xl:relative xl:left-0 xl:translate-x-0 shrink-0 transition-all duration-300">
        <div class="relative group cursor-pointer" @click="$router.push('/admin/dashboard')">
          <div class="absolute -inset-1 bg-cyan-400 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          <img src="@/assets/logoyk1.svg" alt="YK" class="relative h-8 xl:h-9 w-auto brightness-0 invert" />
        </div>
        
        <div class="hidden lg:flex flex-col border-l border-white/20 dark:border-gray-800 pl-4">
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-3 h-3 text-cyan-400" />
            <span class="text-[11px] font-black text-white uppercase tracking-tighter leading-none">Búro de Seguridad Interna</span>
          </div>
          <span class="text-[9px] font-bold text-emerald-400 dark:text-verde-cope uppercase tracking-[0.2em] mt-1">Protocolo de Listas V.3</span>
        </div>
      </div>

      <!-- Right: Actions & User -->
      <div class="flex items-center gap-3 shrink-0">
        
        <!-- Theme Toggle -->
        <button
          @click="layoutStore.toggleTheme"
          class="p-2.5 rounded-xl text-white/70 dark:text-gray-400 bg-white/10 dark:bg-gray-900 border border-white/10 dark:border-gray-800 hover:bg-white/20 dark:hover:bg-gray-800 transition-all focus:outline-none"
        >
          <Sun v-if="layoutStore.isDark" class="w-5 h-5 text-amber-400" />
          <Moon v-else class="w-5 h-5" />
        </button>

        <!-- User Info Badge -->
        <div class="group relative flex items-center gap-3 pl-3 py-1 pr-1 bg-white/5 dark:bg-gray-900 border border-white/10 dark:border-gray-800 rounded-2xl transition-all hover:border-cyan-400/50">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-[11px] font-black text-white leading-none uppercase tracking-tight">{{ userName }}</span>
            <div class="flex items-center gap-1 mt-1">
              <div class="w-1 h-1 rounded-full bg-emerald-400"></div>
              <span class="text-[8px] font-bold text-white/50 dark:text-gray-500 uppercase tracking-widest">{{ userAgencia }}</span>
            </div>
          </div>
          
          <div class="h-9 w-9 rounded-xl overflow-hidden border-2 border-white/20 dark:border-gray-800 shadow-sm shrink-0 relative">
            <img v-if="userPhoto" :src="userPhoto" class="h-full w-full object-cover" alt="Avatar">
            <div v-else class="h-full w-full bg-cyan-500 text-white flex items-center justify-center font-black text-xs uppercase">
                {{ userInitials }}
            </div>
            <!-- Overlay Scanner -->
            <div class="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <!-- Logout / Return (Terminal Style) -->
        <button
          @click="handleReturnToMother"
          class="group flex items-center justify-center h-10 w-10 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition-all duration-300 shadow-lg hover:shadow-rose-500/40"
          title="Finalizar Sesión_Segura"
        >
          <LogOut class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
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
      <div v-if="isMobileMenuOpen" class="xl:hidden bg-[#013d7b] dark:bg-[#05070a] border-b border-white/10 dark:border-gray-800 max-h-[calc(100vh-80px)] overflow-y-auto shadow-2xl">
        <div class="p-4 space-y-2">
          <template v-for="item in menuItems" :key="item.id">
            <RouterLink
              v-if="!item.children"
              :to="item.route"
              @click="isMobileMenuOpen = false"
              class="flex items-center gap-3 p-4 rounded-xl font-black text-xs uppercase tracking-widest"
              :class="isActive(item.route) ? 'bg-cyan-500 text-white' : 'text-white/60 hover:bg-white/10'"
            >
              <div v-html="item.iconSvg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"></div>
              {{ item.label }}
            </RouterLink>

            <div v-else class="space-y-1">
              <div class="px-4 py-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 mt-2">
                <div v-html="item.iconSvg" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"></div>
                {{ item.label }}
              </div>
              <RouterLink
                v-for="child in item.children"
                :key="child.route"
                :to="child.route"
                @click="isMobileMenuOpen = false"
                class="flex items-center gap-3 p-4 ml-4 rounded-xl font-bold text-xs"
                :class="isActive(child.route) ? 'bg-white/10 text-cyan-400' : 'text-white/50 hover:text-white hover:bg-white/5'"
              >
                <div class="w-1.5 h-1.5 rounded-full" :class="isActive(child.route) ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'"></div>
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
import { 
  ShieldCheck, 
  Lock, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  LogOut 
} from 'lucide-vue-next'

const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const route = useRoute()

const isMobileMenuOpen = ref(false)

// Navegación
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
@reference "../../assets/main.css";

@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.router-link-active {
  transition: all 0.3s ease;
}
</style>

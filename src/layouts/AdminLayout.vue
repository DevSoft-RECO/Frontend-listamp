<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-[#020617] text-gray-800 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300 relative">
    
    <!-- Background Decorations -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-azul-cope/15 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-verde-cope/20 blur-[100px] rounded-full pointer-events-none"></div>

    <AdminHeader />

    <main class="flex-1 overflow-x-hidden overflow-y-auto relative custom-scrollbar">
      <div class="w-full px-[5%] py-8 pb-32">
        <div class="max-w-[1800px] mx-auto">
          <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </div>
    </main>

    <!-- Apple-Style Navigation Dock (Solo Desktop XL) -->
    <div class="fixed bottom-7 left-1/2 -translate-x-1/2 z-[100] hidden xl:block">
      <nav class="flex items-center gap-6 px-5 py-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-[1.02]">
        
        <template v-for="item in filteredMenuItems" :key="item.id">
          <!-- Item del Dock -->
          <div class="relative group">
            
            <!-- Tooltip Style Apple (Más cerca y visible) -->
            <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap -translate-y-1 group-hover:translate-y-0">
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900/90 rotate-45 -mb-[3px]"></div>
              {{ item.label }}
            </div>

            <!-- Botón / Icono (Estilo Apple Sólido Premium) -->
            <div 
              @click="handleDockClick(item)"
              class="relative flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-500 cursor-pointer group-hover:scale-110 group-hover:-translate-y-4 active:scale-90 origin-bottom shadow-lg"
              :class="[
                (item.route && isActive(item.route)) || isGroupActive(item) 
                  ? 'ring-4 ring-white dark:ring-azul-cope/50 ring-offset-4 dark:ring-offset-slate-900' 
                  : 'hover:shadow-2xl',
                item.colorClass
              ]"
            >
              <div class="text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110">
                <svg v-html="item.iconSvg" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"></svg>
              </div>
              
              <!-- Punto Indicador Activo -->
              <div v-if="(item.route && isActive(item.route)) || isGroupActive(item)" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-verde-cope rounded-full shadow-[0_0_8px_rgba(90,186,3,0.8)]"></div>
            </div>

            <!-- Submenú Flotante (Estilo Brand Azul/Verde) -->
            <div 
              v-if="item.children && activeGroup === item.id" 
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-64 bg-[#013d7b] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-2 space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              <div class="px-4 py-2 text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/10 mb-1">
                {{ item.label }}
              </div>
              <RouterLink
                v-for="child in item.children"
                :key="child.route"
                :to="child.route"
                @click="activeGroup = null"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all"
                :class="isActive(child.route)
                  ? 'bg-verde-cope text-white shadow-lg'
                  : 'text-white/80 hover:bg-verde-cope hover:text-white'"
              >
                <div class="w-2 h-2 rounded-full" :class="isActive(child.route) ? 'bg-white' : 'bg-white/20 group-hover:bg-white/50'"></div>
                {{ child.label }}
              </RouterLink>
              <div class="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-[#013d7b] rotate-45 -mt-2 border-r border-b border-white/10"></div>
            </div>
          </div>
        </template>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminHeader from "../components/layout/AdminHeader.vue"
import { useLayoutStore } from "@/stores/layout"
import { useAuthStore } from '@/stores/auth'

interface MenuItem {
  id: string;
  label: string;
  route?: string;
  iconSvg: string;
  colorClass: string;
  permission?: string | string[];
  children?: {
    label: string;
    route: string;
    permission?: string | string[];
  }[];
}

const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const activeGroup = ref<string | null>(null)

const isActive = (path: string) => route.path === path
const isGroupActive = (item: MenuItem) => item.children?.some((child) => route.path === child.route)

const handleDockClick = (item: MenuItem) => {
  if (item.children) {
    if (activeGroup.value === item.id) {
      activeGroup.value = null
    } else {
      activeGroup.value = item.id
    }
  } else if (item.route) {
    activeGroup.value = null
    router.push(item.route)
  }
}



const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    route: '/admin/dashboard',
    colorClass: 'bg-gradient-to-tr from-blue-600 to-cyan-400',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2v10a1 1 0 01-1 1h-3m-4 0h4" />',
  },
  {
    id: 'modulo-listas-mp',
    label: 'Lista Mp',
    permission: 'lista_mp',
    colorClass: 'bg-gradient-to-tr from-emerald-600 to-green-400',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />',
    children: [
      { label: 'Control de Registros', route: '/admin/listas-mp' },
      { label: 'Gestionar Fiscalías', route: '/admin/fiscalias' }
    ]
  },
  {
    id: 'modulo-lista-creditos',
    label: 'Lista Negra',
    permission: 'lista_credito',
    colorClass: 'bg-gradient-to-tr from-rose-600 to-pink-500',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
    children: [
      { label: 'Control de Créditos', route: '/admin/lista-creditos' }
    ]
  },
  {
    id: 'modulo-reportes',
    label: 'Validaciones',
    colorClass: 'bg-gradient-to-tr from-indigo-600 to-purple-500',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
    children: [
      { label: 'Validar Lista MP', route: '/admin/reportes/lista-mp', permission: 'validacion_mp' },
      { label: 'Validar Consolidado', route: '/admin/reportes/lista-consolidada', permission: 'validacion_mp_credito' },
      { label: 'Consultas Limpias', route: '/admin/consultas-sin-resultado', permission: ['consultas_ver_todo', 'consultas_ver_agencia', 'consultas_ver_propias'] }
    ]
  },
  {
    id: 'modulo-solicitudes',
    label: 'Autorizaciones',
    route: '/admin/solicitudes',
    colorClass: 'bg-gradient-to-tr from-amber-500 to-orange-400',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />',
  },
]

const hasMenuPermission = (permission?: string | string[]) => {
  if (!permission) return true
  const isAdmin = authStore.user?.roles_list?.includes('Super Admin')
  if (isAdmin) return true

  if (Array.isArray(permission)) {
    return permission.some(p => authStore.hasPermission(p))
  }
  return authStore.hasPermission(permission)
}

const filteredMenuItems = computed(() => {
  return menuItems
    .map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => hasMenuPermission(child.permission))
        return { ...item, children: filteredChildren }
      }
      return { ...item }
    })
    .filter(item => {
      if (!hasMenuPermission(item.permission)) return false
      if (item.children && item.children.length === 0 && !item.route) return false
      return true
    })
})

onMounted(() => {
  layoutStore.initTheme()
  window.addEventListener('resize', layoutStore.handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', layoutStore.handleResize)
})
</script>

<style>
/* SCROLLBAR OPTIMIZADO */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.1);
  border-radius: 9999px;
}
:root.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255,255,255,0.1);
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

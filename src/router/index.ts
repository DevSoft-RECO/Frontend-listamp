import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        permission?: string | string[]
        requiresAuth?: boolean
    }
}

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue'

// Vistas
import CallbackView from '@/views/CallbackView.vue'
import DashboardView from '@/views/DashboardView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'

const routes: RouteRecordRaw[] = [
    // 1. RUTAS PÚBLICAS
    {
        path: '/',
        redirect: '/admin/dashboard'
    },
    {
        path: '/callback',
        name: 'callback',
        component: CallbackView
    },
    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: UnauthorizedView
    },

    // 2. RUTAS PROTEGIDAS
    {
        path: '/admin',
        component: AdminLayout,
        meta: {
            requiresAuth: true,
            permission: 'app_buro_interno'
        },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardView,
                meta: {
                    title: 'Gestiones'
                }
            },
            {
                path: 'listas-mp',
                name: 'listas-mp',
                component: () => import('@/views/listas-mp/Index.vue'),
                meta: {
                    title: 'Lista Mp',
                    permission: 'lista_mp'
                }
            },
            {
                path: 'fiscalias',
                name: 'fiscalias',
                component: () => import('@/views/listas-mp/FiscaliasListView.vue'),
                meta: {
                    title: 'Administrar Fiscalías',
                    permission: 'lista_mp'
                }
            },
            {
                path: 'lista-creditos',
                name: 'lista-creditos',
                component: () => import('@/views/lista-creditos/ListaCreditoView.vue'),
                meta: {
                    title: 'Lista Negra Créditos',
                    permission: 'lista_credito'
                }
            },
            {
                path: 'reportes/lista-mp',
                name: 'reportes-lista-mp',
                component: () => import('@/views/reportes/ListaMP.vue'),
                meta: {
                    title: 'Validación Lista MP',
                    permission: 'validacion_mp'
                }
            },
            {
                path: 'reportes/lista-consolidada',
                name: 'reportes-lista-consolidada',
                component: () => import('@/views/reportes/ListaCreditos.vue'),
                meta: {
                    title: 'Validación MP y Créditos',
                    permission: 'validacion_mp_credito'
                }
            },
            {
                path: 'solicitudes',
                name: 'solicitudes',
                component: () => import('@/views/solicitudes/BandejaSolicitudes.vue'),
                meta: {
                    title: 'Bandeja de Autorizaciones'
                }
            },
            {
                path: 'solicitudes/:id',
                name: 'detalle-solicitud',
                component: () => import('@/views/solicitudes/DetalleSolicitud.vue'),
                meta: {
                    title: 'Detalle de Solicitud'
                }
            },
            {
                path: 'consultas-sin-resultado',
                name: 'consultas-sin-resultado',
                component: () => import('@/views/solicitudes/ConsultasSinCoincidencias.vue'),
                meta: {
                    title: 'Historial de Consultas Limpias',
                    permission: ['consultas_ver_todo', 'consultas_ver_agencia', 'consultas_ver_propias']
                }
            }
        ]
    },

    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// --- GUARDIA DE NAVEGACIÓN ---
router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    // 0. Callback o Unauthorized → siempre pasar
    if (to.name === 'callback' || to.name === 'unauthorized') {
        return next()
    }

    const isAuthenticated = !!authStore.token

    // Caso 1: Ruta requiere Auth y no tenemos token
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            console.log('🔒 Acceso Hija: Usuario sin sesión. Iniciando flujo SSO...')
            authStore.login(to.fullPath); // Guardar URL original
            return next(false);
        }
    }

    // Caso 2: Estamos autenticados, verificar identidad
    if (isAuthenticated) {
        if (!authStore.isReady || !authStore.user) {
            try {
                await authStore.fetchUser();
            } catch {
                // RE-AUTENTICACIÓN FLUIDA: 
                // Si el token falló, intentamos PKCE de nuevo
                authStore.login(to.fullPath);
                return next(false);
            }
        }

        // Verificar permiso (Soporta String, Array de Strings y Bypass de Super Admin)
        const permission = to.meta.permission;
        if (permission) {
            const isAdmin = authStore.user?.roles_list?.includes('Super Admin');
            
            if (!isAdmin) {
                let hasAccess = false;
                if (Array.isArray(permission)) {
                    hasAccess = permission.some(p => authStore.hasPermission(p));
                } else {
                    hasAccess = authStore.hasPermission(permission as string);
                }

                if (!hasAccess) {
                    console.warn(`⛔ Acceso denegado: Falta permiso(s) para la ruta ${to.path}.`);
                    return next(false);
                }
            }
        }
    }

    next()
})


export default router

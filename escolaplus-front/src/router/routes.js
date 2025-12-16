import { createRouter, createWebHistory } from 'vue-router'
import {h, resolveComponent} from "vue";

import Admin from '../views/admin/Admin.vue'
import Login from '../views/usuario/Login.vue'
import NotFound from '../components/NotFound.vue'

//ALUNO
import AlunoPrincipal from '@/views/aluno/Principal.vue'
import AlunoCadastro from '@/views/aluno/Cadastro.vue'
import AlunoFicha from '@/views/aluno/Ficha.vue'
import AlunoFoto from '@/views/aluno/Foto.vue'
import AlunoEditar from '@/views/aluno/Editar.vue'
import AlunoImprimir  from '@/views/aluno/Imprimir.vue'
//TURMA
import TurmaPrincipal from '@/views/turma/Principal.vue'
import TurmaFicha from '@/views/turma/Ficha.vue'
//FUNCIONÁRIO
import FuncionarioPrincipal from '@/views/funcionario/Principal.vue'
import FuncionarioFicha from '@/views/funcionario/Ficha.vue'
import FuncionarioFoto from '@/views/funcionario/Foto.vue'
import FuncionarioCadastro from '@/views/funcionario/Cadastro.vue'
import FuncionarioEditar from '@/views/funcionario/Editar.vue'
//USUÁRIO
import UsuarioSenha from '@/views/usuario/Senha.vue'

import Foto from "@/views/admin/Foto.vue";
import Editar from "@/views/funcionario/Editar.vue";
import Imprimir from "@/views/aluno/Imprimir.vue";
//CALENDÁRIO
import CalendarioPrincipal from "@/views/calendario/Principal.vue"

const RouterViewOnly = {
    render(){
        return h(resolveComponent('router-view'))
    }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin',
      component: Admin,
      meta: {requiresAuth: true},
    },
      {
          path: '/foto',
          name: 'foto',
          component: Foto,
      },
      {
          path: '/login',
          name: 'login',
          component: Login,
      },
      //Grupos de Rotas
      {
          path: '/aluno',
          component: RouterViewOnly,
          meta: {group:'aluno', requiresAuth: true},
          children: [
              {
                  path: 'principal',
                  name: 'aluno.principal',
                  component: AlunoPrincipal,
              },
              {
                  path: 'cadastrar',
                  name: 'aluno.cadastrar',
                  component: AlunoCadastro,
              },
              {
                  path: 'editar/:id',
                  name: 'aluno.editar',
                  component: AlunoEditar,
              },
              {
                  path: 'ficha/:id',
                  name: 'aluno.ficha',
                  component: AlunoFicha,
              },
              {
                  path: 'foto/:id',
                  name: 'aluno.foto',
                  component: AlunoFoto,
              },
              {
                  path: "imprimir/:id",
                  name: "imprimir",
                  component: AlunoImprimir,
              }
          ]
      },
      {
          path: '/calendario',
          component: RouterViewOnly,
          meta: {group:'calendario', requiresAuth: true},
          children: [
              {
                  path: 'principal',
                  name: 'calendario.principal',
                  component: CalendarioPrincipal
              }
          ]
      },
      {
          path: '/usuario',
          component:RouterViewOnly,
          meta: {group:'usuario', requiresAuth: true},
          children: [
              {
                  path: 'senha',
                  name: 'usuario.senha',
                  component: UsuarioSenha,
              }
          ]
      },
      {
          path: '/turma',
          component: RouterViewOnly,
          meta: {group:'turma', requiresAuth: true},
          children: [
              {
                  path:'principal',
                  name: 'turma.principal',
                  component: TurmaPrincipal,
              },
              {
                  path: 'ficha/:id',
                  name: 'ficha',
                  component: TurmaFicha,
              }
          ]
      },
      {
          path: '/funcionario',
          component: RouterViewOnly,
          meta: {group:'funcionario', requiresAuth: true},
          children: [
              {
                  path:'principal',
                  name: 'funcionario.principal',
                  component: FuncionarioPrincipal,
              },
              {
                  path: 'ficha/:id',
                  name: 'funcionario.ficha',
                  component: FuncionarioFicha,
              },
              {
                  path: 'foto/:id',
                  name: 'funcionario.foto',
                  component: FuncionarioFoto,
              },
              {
                  path: 'cadastrar',
                  name: 'funcionario.cadastrar',
                  component: FuncionarioCadastro,
              },
              {
                  path: 'editar/:id',
                  name: 'funcionario.editar',
                  component: FuncionarioEditar,
              }
          ]
      },

      {
          path: '/logout',
          name: 'logout',
          beforeEnter: (to, from, next) => {
              localStorage.removeItem('escola_token');
              next('/login')
          }
      },
      // ⚠️ esta rota precisa ser a última
      {
          path: '/:pathMatch(.*)*',
          name: 'notfound',
          component: NotFound
      }
  ],
})

function isTokenExpired(token) {
    if (!token || token === 'null' || token === 'undefined') return true

    try {
        // JWT tem formato: header.payload.signature
        const [, payloadBase64] = token.split('.')
        if (!payloadBase64) return true

        // Converte Base64URL → JSON
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )
        const payload = JSON.parse(jsonPayload)

        // Verifica expiração (exp em segundos)
        if (!payload.exp) return true
        const now = Math.floor(Date.now() / 1000)
        return now >= payload.exp
    } catch (e) {
        console.error('Erro ao validar token:', e)
        return true // se deu erro, trata como expirado
    }
}

function isLoggedIn () {
    const token = localStorage.getItem('escola_token')

    if(!token) return false

    if(isTokenExpired(token)) {
        localStorage.removeItem('escola_token')
        return false
    }
    return true
    //  if (!token || token === 'null' || token === 'undefined') return false
    //  // opcional: validar formato de JWT
    //  const parts = token.split('.')
    //  return parts.length === 3 // se seu token não for JWT, troque por `return !!token`
}

router.beforeEach((to) => {
    const logged = isLoggedIn()

    // bloquear páginas só para visitantes se já logado
    if (to.meta?.guestOnly && logged) {
        return { path: '/' }
    }

    // checar meta.requiresAuth inclusive em rotas filhas/pais
    const needsAuth = to.matched.some(r => r.meta?.requiresAuth)
    if (needsAuth && !logged) {
        //return { name: 'login', query: { redirect: to.fullPath } }
        return {path: '/login'}
    }

    return true
})

export default router

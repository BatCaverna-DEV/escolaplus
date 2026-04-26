<script setup>
defineProps({
  msg:  { type: String, default: '' },
  tipo: { type: String, default: 'info' }
  // tipos: danger | warning | success | info
})

const config = {
  danger:  { icon: 'fa-circle-exclamation',   prefix: 'Erro',    cls: 'alert-danger'  },
  warning: { icon: 'fa-triangle-exclamation', prefix: 'Atenção', cls: 'alert-warning' },
  success: { icon: 'fa-circle-check',         prefix: 'Sucesso', cls: 'alert-success' },
  info:    { icon: 'fa-circle-info',           prefix: 'Info',    cls: 'alert-info'    },
}
</script>

<template>
  <div
    v-if="msg"
    :class="['alert alert-dismissible fade show d-flex align-items-start gap-2', config[tipo]?.cls ?? 'alert-info']"
    role="alert"
  >
    <font-awesome-icon :icon="'fa-solid ' + (config[tipo]?.icon ?? 'fa-circle-info')" class="mt-1 flex-shrink-0" />
    <div class="flex-grow-1">
      <strong>{{ config[tipo]?.prefix }}: </strong>{{ msg }}
    </div>
    <button type="button" class="btn-close flex-shrink-0" data-bs-dismiss="alert" aria-label="Fechar"></button>
  </div>
</template>

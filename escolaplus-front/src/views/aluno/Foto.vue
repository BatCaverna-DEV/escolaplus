<script setup>
import { ref, onBeforeUnmount, nextTick, onMounted } from "vue";
import { apiFetch } from "@/services/http.js";
import { useRoute, useRouter } from "vue-router";

const route  = useRoute();
const router = useRouter();
const video  = ref(null);
const stream = ref(null);
const cameraAtiva        = ref(false);
const fotoRecortadaBase64 = ref("");
const aluno   = ref({})
const salvando = ref(false)

onMounted(async () => {
  const resposta = await apiFetch('/aluno/get/' + route.params.id)
  aluno.value    = await resposta.json()
})

async function salvar() {
  salvando.value = true
  try {
    const resposta = await apiFetch('/aluno/editar', {
      method: 'PUT',                               // corrigido: era 'POST'
      body: { id: aluno.value.id, foto: aluno.value.foto },
    })
    if (resposta.ok) {
      alert('Foto alterada com sucesso!')
      router.push('/aluno/ficha/' + aluno.value.id)
    } else {
      const msg = await resposta.json()
      alert(resposta.status + ' - ' + msg.message)
    }
  } finally {
    salvando.value = false
  }
}

const abrirCamera = async () => {
  try {
    stream.value       = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraAtiva.value  = true;
    await nextTick();
    if (video.value) video.value.srcObject = stream.value;
  } catch (err) {
    alert('Não foi possível acessar a câmera: ' + err.message);
  }
};

const fecharCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(t => t.stop());
    stream.value = null;
  }
  cameraAtiva.value = false;
};

function recortarProporcao(img, propW = 3, propH = 4, qualidade = 0.65, alturaFinal = 600) {
  const canvas = document.createElement("canvas");
  const ctx    = canvas.getContext("2d");
  const ratio  = propW / propH;
  let cropW, cropH;
  if (img.width / img.height > ratio) {
    cropH = img.height; cropW = cropH * ratio;
  } else {
    cropW = img.width;  cropH = cropW / ratio;
  }
  const startX = (img.width  - cropW) / 2;
  const startY = (img.height - cropH) / 2;
  canvas.width = cropW; canvas.height = cropH;
  ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, cropW, cropH);

  const out  = document.createElement("canvas");
  const outCtx = out.getContext("2d");
  out.height = alturaFinal;
  out.width  = alturaFinal * (cropW / cropH);
  outCtx.drawImage(canvas, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", qualidade);
}

const capturar = () => {
  if (!cameraAtiva.value || !video.value) return;
  const canvas = document.createElement("canvas");
  canvas.width  = video.value.videoWidth  || 320;
  canvas.height = video.value.videoHeight || 240;
  canvas.getContext("2d").drawImage(video.value, 0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.src = canvas.toDataURL("image/jpeg");
  img.onload = () => {
    aluno.value.foto = recortarProporcao(img);
    fotoRecortadaBase64.value = aluno.value.foto;
  };
};

const onFileChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      aluno.value.foto = recortarProporcao(img);
      fotoRecortadaBase64.value = aluno.value.foto;
    };
  };
  reader.readAsDataURL(file);
  event.target.value = "";
};

onBeforeUnmount(() => { fecharCamera(); });
</script>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <h4 class="page-title">
        <font-awesome-icon icon="fa-solid fa-camera" class="me-2 text-success" />
        Alterar Foto — {{ aluno.nome }}
      </h4>
      <div class="page-actions">
        <RouterLink :to="'/aluno/ficha/' + aluno.id" class="btn btn-outline-secondary btn-sm">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <div class="row g-3 justify-content-center">

      <!-- Câmera / Upload -->
      <div class="col-sm-5 col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header">
            <font-awesome-icon icon="fa-solid fa-video" class="me-2 text-success" />Câmera
          </div>
          <div class="card-body d-flex flex-column align-items-center gap-3">

            <!-- Área do vídeo -->
            <div class="ep-camera-box bg-body-secondary rounded-3 overflow-hidden">
              <video
                v-if="cameraAtiva"
                ref="video"
                autoplay
                playsinline
                class="w-100 h-100"
                style="object-fit:cover;"
              ></video>
              <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                <div class="text-center">
                  <font-awesome-icon icon="fa-solid fa-camera" class="fs-1 mb-2 opacity-25" />
                  <p class="small mb-0">Câmera inativa</p>
                </div>
              </div>
            </div>

            <!-- Botões -->
            <div class="d-grid gap-2 w-100">
              <button v-if="!cameraAtiva" @click="abrirCamera" class="btn btn-success">
                <font-awesome-icon icon="fa-solid fa-video" class="me-2" />Abrir Câmera
              </button>
              <button v-if="cameraAtiva" @click="fecharCamera" class="btn btn-outline-danger">
                <font-awesome-icon icon="fa-solid fa-video-slash" class="me-2" />Fechar Câmera
              </button>
              <button @click="capturar" :disabled="!cameraAtiva" class="btn btn-primary">
                <font-awesome-icon icon="fa-solid fa-circle" class="me-2" />Capturar Foto
              </button>
              <label class="btn btn-outline-secondary mb-0">
                <font-awesome-icon icon="fa-solid fa-upload" class="me-2" />Carregar Imagem
                <input type="file" accept="image/*" @change="onFileChange" class="d-none" />
              </label>
            </div>

          </div>
        </div>
      </div>

      <!-- Preview + Salvar -->
      <div class="col-sm-5 col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header">
            <font-awesome-icon icon="fa-solid fa-image" class="me-2 text-success" />Foto Atual
          </div>
          <div class="card-body d-flex flex-column align-items-center gap-3">

            <img
              :src="aluno.foto"
              class="rounded-3 shadow-sm"
              style="width:180px; height:240px; object-fit:cover; border:3px solid #e2e8f0;"
              alt="Foto do aluno"
            />

            <button @click="salvar" :disabled="salvando" class="btn btn-success w-100">
              <span v-if="salvando">
                <span class="spinner-border spinner-border-sm me-2"></span>Salvando…
              </span>
              <span v-else>
                <font-awesome-icon icon="fa-solid fa-floppy-disk" class="me-2" />Salvar Foto
              </span>
            </button>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.ep-camera-box {
  width: 100%;
  aspect-ratio: 4/3;
}
</style>

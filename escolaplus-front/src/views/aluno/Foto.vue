<script setup>
import {ref, onBeforeUnmount, nextTick, onMounted} from "vue"; // 👈 acrescentei o nextTick aqui
import {apiFetch} from "@/services/http.js";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const video = ref(null);
const stream = ref(null);
const cameraAtiva = ref(false);
const fotoRecortadaBase64 = ref("");
const aluno = ref({})

onMounted(async () => {
  let id = route.params.id;
  const resposta = await apiFetch('/aluno/get/'+id)
  aluno.value = await resposta.json()
})

async function salvar(){
  const dados = {
    id: aluno.value.id,
    foto: aluno.value.foto,
  }
  const resposta = await apiFetch('/aluno/editar',{
    method: 'POST',
    body: dados,
  })
  if(resposta.ok){
    if(resposta.status === 200){
      alert('Foto alterada com sucesso!')
      router.push('/aluno/ficha/'+aluno.value.id)
    }
  }else{
    const msg = await resposta.json()
    alert(resposta.status + ' - '+msg.message);
  }
}

// ABRIR CÂMERA
const abrirCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraAtiva.value = true;

    // 👇 espera o Vue renderizar o <video v-if="cameraAtiva">
    await nextTick();

    if (video.value) {
      video.value.srcObject = stream.value;
    }
  } catch (err) {
    console.error("Erro ao abrir câmera:", err);
  }
};

// FECHAR CÂMERA
const fecharCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  cameraAtiva.value = false;
};

// RECORTAR EM 3:4
function recortarProporcao(img, proporcaoLargura = 3, proporcaoAltura = 4) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const imgW = img.width;
  const imgH = img.height;

  const targetRatio = proporcaoLargura / proporcaoAltura;
  const imgRatio = imgW / imgH;

  let cropW, cropH;

  if (imgRatio > targetRatio) {
    cropH = imgH;
    cropW = cropH * targetRatio;
  } else {
    cropW = imgW;
    cropH = cropW / targetRatio;
  }

  const startX = (imgW - cropW) / 2;
  const startY = (imgH - cropH) / 2;

  canvas.width = cropW;
  canvas.height = cropH;

  ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, cropW, cropH);

  return canvas.toDataURL("image/jpeg");
}

// CAPTURAR DA CÂMERA
const capturar = () => {
  if (!cameraAtiva.value || !video.value) return;

  const canvas = document.createElement("canvas");
  canvas.width = video.value.videoWidth || 320;
  canvas.height = video.value.videoHeight || 240;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);

  const base64Original = canvas.toDataURL("image/jpeg");

  const img = new Image();
  img.src = base64Original;
  img.onload = () => {
    fotoRecortadaBase64.value = recortarProporcao(img, 3, 4);
    aluno.value.foto = fotoRecortadaBase64.value
  };
};

// CARREGAR IMAGEM
const onFileChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      fotoRecortadaBase64.value = recortarProporcao(img, 3, 4);
      aluno.value.foto = fotoRecortadaBase64.value
    };
  };
  reader.readAsDataURL(file);
  event.target.value = "";
};

onBeforeUnmount(() => {
  fecharCamera();
});

</script>

<template>
  <div class="container-fluid p-2 shadow">

    <nav class="navbar navbar-light bg-light">
      <h3><i class="fas fa-user-graduate"></i>Alterar Foto: {{aluno.nome}}</h3>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <RouterLink :to="'/aluno/ficha/'+aluno.id" class="btn btn-outline-secondary">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>Voltar
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="row d-flex justify-content-center">

      <!-- CÂMERA -->
      <div class="col-sm-3 border border-1">
        <h5 class="text-center">Câmera</h5>

        <!-- agora usando v-if em vez de v-show -->
        <div style="width: 320px; height: 240px" class="border border-1 mx-auto bg-body-secondary">
          <video
              class="border border-1"
              ref="video"
              autoplay
              playsinline
              v-if="cameraAtiva"
              style="width: 320px; height: 240px; border: 1px solid #ddd; border-radius: 8px;"
          ></video>
        </div>

        <div class="d-flex flex-column w-50 mx-auto gap-1 mt-2">
          <button
              class="btn btn-success"
              v-if="!cameraAtiva"
              @click="abrirCamera"
          >
            Abrir câmera
          </button>

          <button
              class="btn btn-danger"
              v-if="cameraAtiva"
              @click="fecharCamera"
          >
            Fechar câmera
          </button>

          <button
              class="btn btn-primary"
              @click="capturar"
              :disabled="!cameraAtiva"
          >
            Capturar da câmera
          </button>

          <label class="btn btn-secondary mb-0">
            Carregar imagem
            <input type="file" accept="image/*" @change="onFileChange" style="display: none;">
          </label>
        </div>
      </div>

      <!-- IMAGEM RECORTADA AUTOMÁTICA -->
      <div class="col-sm-3 border border-1">
        <h5 class="text-center">Foto Atual</h5>
        <img
            :src="aluno.foto"
            class="img-thumbnail d-block mx-auto"
            style="max-width: 220px; max-height: 320px;"
        />
        <div class="d-flex justify-content-center mt-3">
          <button @click="salvar" class="btn btn-success">Salvar Foto</button>
        </div>

      </div>

    </div>


  </div>
</template>

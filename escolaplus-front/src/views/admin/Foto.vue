<template>
  <div class="d-flex flex-column align-items-center gap-3 p-3">

    <!-- CÂMERA -->
    <div class="text-center">
      <h5>Câmera</h5>

      <!-- usamos v-show no lugar de v-if -->
      <video
          ref="video"
          autoplay
          playsinline
          v-show="cameraAtiva"
          style="width: 320px; height: 240px; border: 1px solid #ddd; border-radius: 8px;"
      ></video>

      <div class="mt-2 d-flex flex-column align-items-center gap-2">

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
    <div v-if="fotoRecortadaBase64" class="mt-3 text-center">
      <h5>Imagem recortada (3:4)</h5>
      <img
          :src="fotoRecortadaBase64"
          class="img-thumbnail"
          style="max-width: 320px; max-height: 420px;"
      />
    </div>

    <!-- BASE64 -->
    <div v-if="fotoRecortadaBase64" class="mt-3 w-100" style="max-width: 600px;">
      <h6>Código Base64 (fotoRecortadaBase64):</h6>
      <textarea class="form-control" rows="4" :value="fotoRecortadaBase64" readonly></textarea>
    </div>

  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";

const video = ref(null);
const stream = ref(null);
const cameraAtiva = ref(false);
const fotoRecortadaBase64 = ref("");

// ABRIR CÂMERA
const abrirCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraAtiva.value = true;

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
    };
  };
  reader.readAsDataURL(file);
  event.target.value = "";
};

onBeforeUnmount(() => {
  fecharCamera();
});
</script>

// =============================
// CONFIGURAÇÃO DO SUPABASE
// =============================
const SUPABASE_URL = "https://fvlxorqqdfetueshlgld.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bHhvcnFxZGZldHVlc2hsZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTc5MzcsImV4cCI6MjA4MjA5MzkzN30.pQuI9u0ql-85lYWxoSyMsEN5m1EUIfAA_tBWO4LKvco";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =============================
// ELEMENTOS DO HTML
// =============================
const uploadInput = document.getElementById("upload");
const galeria = document.getElementById("galeriaFotos");

// =============================
// BOTÃO "ADICIONAR FOTO"
// =============================
function adicionarFoto() {
  uploadInput.click();
}

// =============================
// QUANDO ESCOLHER UMA IMAGEM
// =============================
uploadInput.addEventListener("change", async () => {
  const file = uploadInput.files[0];
  if (!file) return;

  const nomeArquivo = `${Date.now()}-${file.name}`;

  const { error } = await supabaseClient.storage
    .from("galeria")
    .upload(nomeArquivo, file);

  if (error) {
    alert("Erro ao enviar imagem 😢");
    console.error(error);
    return;
  }

  carregarGaleria();
});

// =============================
// CARREGAR GALERIA
// =============================
async function carregarGaleria() {
  galeria.innerHTML = "";

  const { data, error } = await supabaseClient.storage
    .from("galeria")
    .list("", { limit: 100 });

  if (error) {
    console.error("Erro ao carregar galeria", error);
    return;
  }

  data.forEach((arquivo) => {
    const { data: url } = supabaseClient.storage
      .from("galeria")
      .getPublicUrl(arquivo.name);

    const img = document.createElement("img");
    img.src = url.publicUrl;
    galeria.appendChild(img);
  });
}

// =============================
// CARREGAR AO ABRIR O SITE
// =============================
carregarGaleria();
const $ = (sel) => document.querySelector(sel);
const show = (el) => el && el.classList.remove('hidden');
const hide = (el) => el && el.classList.add('hidden');

const modeCepBtn = $('#modeCep');
const modeEndBtn = $('#modeEndereco');
const cepForm = $('#cepForm');
const endForm = $('#enderecoForm');

// Alternância de modo (CEP <-> Endereço)
if (modeCepBtn && modeEndBtn && cepForm && endForm) {
  modeCepBtn.addEventListener('click', () => {
    modeCepBtn.classList.add('active');
    modeEndBtn.classList.remove('active');
    show(cepForm);
    hide(endForm);
  });

  modeEndBtn.addEventListener('click', () => {
    modeEndBtn.classList.add('active');
    modeCepBtn.classList.remove('active');
    hide(cepForm);
    show(endForm);
  });
}

// Ação: Buscar por CEP
$('#cepBtn')?.addEventListener('click', async () => {
  const cep = $('#cepInput')?.value.trim();
  if (!cep || !/^\d{8}$/.test(cep)) {
    alert('CEP inválido! Use 8 dígitos.');
    return;
  }

  await fetchCep(cep);
});

// Ação: Buscar por Endereço
$('#enderecoBtn')?.addEventListener('click', async () => {
  const uf = $('#ufInput')?.value.trim().toUpperCase();
  const cidade = $('#cidadeInput')?.value.trim();
  const logradouro = $('#logradouroInput')?.value.trim();

  if (!uf || !cidade || !logradouro) {
    alert('Preencha UF, cidade e logradouro.');
    return;
  }

  try {
    const url = `https://viacep.com.br/ws/${uf}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`;
    const res = await fetch(url);
    const list = await res.json();

    if (!Array.isArray(list) || list.length === 0) {
      alert('Nenhum CEP encontrado.');
      return;
    }

    await showEditableCard(list[0]);
  } catch (error) {
    alert('Erro ao buscar endereço. Verifique sua conexão.');
    console.error(error);
  }
});

// Função para buscar dados do CEP
async function fetchCep(cep) {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    if (data.erro) {
      alert('CEP não encontrado.');
      return;
    }

    await showEditableCard(data);
  } catch (error) {
    alert('Erro ao buscar o CEP. Verifique sua conexão.');
    console.error(error);
  }
}

// Exibir os dados na tela
async function showEditableCard(data) {
  const result = $('#result');
  if (!result) return;

  result.innerHTML = `
    <strong>CEP:</strong> ${data.cep}<br>
    <strong>Logradouro:</strong> ${data.logradouro}<br>
    <strong>Bairro:</strong> ${data.bairro}<br>
    <strong>Cidade:</strong> ${data.localidade} - ${data.uf}<br>
    <div id="freteResultado" style="margin-top: 10px;"></div>
  `;
  show(result);
}

// Ação: Calcular Frete
$('#freteBtn')?.addEventListener('click', () => {
  const peso = parseFloat($('#pesoInput')?.value.trim());
  const cep = $('#cepInput')?.value.trim();

  if (!cep || !/^\d{8}$/.test(cep)) {
    alert('Digite um CEP válido antes de calcular o frete.');
    return;
  }

  if (!peso || peso <= 0) {
    alert('Informe um peso válido.');
    return;
  }

  const freteBase = 15.0;
  const taxaPorKg = 2.5;
  const total = freteBase + peso * taxaPorKg;

  const freteResultado = $('#freteResultado');
  if (freteResultado) {
    freteResultado.innerHTML = `<strong>Frete estimado:</strong> R$ ${total.toFixed(2)}`;
  }
});

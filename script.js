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

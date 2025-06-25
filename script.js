
const $ = (sel) => document.querySelector(sel);
const show = (el) => el.classList.remove('hidden');
const hide = (el) => el.classList.add('hidden');

const modeCepBtn = $('#modeCep');
const modeEndBtn = $('#modeEndereco');
const cepForm = $('#cepForm');
const endForm = $('#enderecoForm');

modeCepBtn.onclick = () => {
  modeCepBtn.classList.add('active');
  modeEndBtn.classList.remove('active');
  show(cepForm);
  hide(endForm);
};
modeEndBtn.onclick = () => {
  modeEndBtn.classList.add('active');
  modeCepBtn.classList.remove('active');
  hide(cepForm);
  show(endForm);
};

$('#cepBtn').onclick = async () => {
  const cep = $('#cepInput').value.trim();
  if (!/^{8}$/.test(cep)) {
    alert('CEP inválido! Use 8 dígitos.');
    return;
  }
  await fetchCep(cep);
};

$('#enderecoBtn').onclick = async () => {
  const uf = $('#ufInput').value.trim().toUpperCase();
  const cidade = $('#cidadeInput').value.trim();
  const logradouro = $('#logradouroInput').value.trim();
  if (!uf,!cidade,!logradouro); {
    alert('Preencha UF, cidade e logradouro.');
    return;
  }
  const url = https;//viacep.com.br/ws/${uf}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/;
  const res = await fetch(url);
  const list = await res.json();
  if (!Array.isArray(list) || list.length === 0) {
    alert('Nenhum CEP encontrado.');
    return;
  }
  
  await showEditableCard(list[0]);
};

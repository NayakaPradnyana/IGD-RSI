// =========================================================================
// MAPPING FILE HTML PER HALAMAN & PENYIMPANAN STATE ANTAR HALAMAN
// =========================================================================
const PAGE_FILES = {
  'login': 'login.html',
  'dashboard': 'index.html',
  'pasien-igd': 'pasien-igd.html',
  'reg-biasa': 'registrasi-biasa.html',
  'reg-darurat': 'registrasi-darurat.html',
  'detail': 'detail-pasien.html',
  'penanganan': 'penanganan.html',
  'pemesanan': 'pemesanan.html',
  'lab-lis': 'lab-lis.html',
  'admin-selesai': 'administrasi.html'
};

const STORAGE_KEY = 'care_igd_session_state_v1';

function saveState() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(S));
  } catch (e) {
    // Ignore storage quota / file:// errors
  }
}

function loadState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(S, parsed);
    }
  } catch (e) {
    // Ignore parse errors
  }
}

// =========================================================================
// HELPERS & NAVIGATION
// =========================================================================
function getNowTimeWIB() {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' WIB';
}

function getPatient(id) {
  return S.patients.find(p => p.id === (id || S.selectedPatientId)) || S.patients[0];
}

function getLabOrderForPatient(pid) {
  return S.labOrders.find(o => o.patientId === pid);
}

function sortPatientsByPriority() {
  const weight = { merah: 1, kuning: 2, hijau: 3 };
  S.patients.sort((a, b) => (weight[a.triase] || 9) - (weight[b.triase] || 9));
}

function showToast(msg, variant = 'success') {
  const root = document.getElementById('toastRoot');
  if (!root) return;
  const el = document.createElement('div');
  const bg = variant === 'danger' ? 'bg-rose-600' : 'bg-slate-900';
  el.className = `${bg} text-white px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 pointer-events-auto border border-white/10`;
  el.innerHTML = `<span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">✓</span><span>${msg}</span>`;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 250);
  }, 3200);
}

function prepareAdminFormForPatient(p) {
  if (!p) return;
  S.adminForm.searchNik = p.nik || '3578012304720001';
  S.adminForm.newPermanentId = p.id.startsWith('EMG-')
    ? p.id.replace('EMG-', 'IGD-')
    : p.id;
  S.adminForm.nama = p.nama;
  S.adminForm.nik = p.nik || '3578012304720001';
  S.adminForm.tglLahir = p.usia === 52 ? '14 Mei 1972 (52 th)' : `${p.usia} Tahun`;
  S.adminForm.kelamin = p.kelamin || 'Laki-laki';
  S.adminForm.kontak = p.kontak || '081238421610';
  S.adminForm.alamat = p.alamat || 'Jl. Ijen No. 45, Klojen, Malang';
  S.adminForm.statusAkhir = p.statusKunjunganAkhir || 'rawat_inap';
  S.adminForm.konfirmasiDokter = true;
}

function isPageAllowedForRole(page, role) {
  if (page === 'login' || page === 'dashboard' || page === 'pasien-igd' || page === 'detail' || page === 'reg-biasa' || page === 'reg-darurat') {
    return true;
  }
  if ((page === 'penanganan' || page === 'pemesanan') && role !== 'dokter') {
    return false;
  }
  if (page === 'admin-selesai' && role !== 'administrasi') {
    return false;
  }
  if (page === 'lab-lis' && role !== 'lab') {
    return false;
  }
  return true;
}

function navigate(page, opts = {}) {
  if (opts.patientId) S.selectedPatientId = opts.patientId;
  if (opts.role) S.role = opts.role;
  if (opts.modal !== undefined) S.modal = opts.modal;
  else S.modal = null;

  if (!isPageAllowedForRole(page, S.role)) {
    showToast('Akses Ditolak: Halaman tersebut tidak tersedia untuk role Anda saat ini.', 'danger');
    return;
  }

  if (page === 'pemesanan') {
    S.pemesananStep = opts.pemesananStep || 'list';
    S.pemesananFrom = opts.from || 'list';
  }
  if (page === 'admin-selesai') {
    prepareAdminFormForPatient(getPatient(S.selectedPatientId));
  }
  if (page === 'lab-lis') {
    if (!S.selectedLabPatientId && S.labOrders.length > 0) {
      S.selectedLabPatientId = S.labOrders[0].patientId;
    }
  }

  S.page = page;
  saveState();

  const targetFile = PAGE_FILES[page];
  const currentPath = window.location.pathname;
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  if (targetFile && currentFile !== targetFile && !(currentFile === '' && targetFile === 'index.html')) {
    window.location.href = `./${targetFile}`;
    return;
  }

  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(name) {
  S.modal = name;
  saveState();
  renderModal();
}

function closeModal() {
  S.modal = null;
  saveState();
  renderModal();
}

function doLogout() {
  S.loginForm.selectedRole = S.role;
  S.loginForm.nip = ROLES[S.role]?.nip || '19890412';
  showToast(`Anda telah keluar dari sesi ${ROLES[S.role].title}`);
  navigate('login');
}

// =========================================================================
// MAIN ROUTER & RENDERER
// =========================================================================
function render() {
  saveState();
  const appRoot = document.getElementById('appRoot');
  if (!appRoot) return;

  if (S.page === 'login') {
    appRoot.innerHTML = renderLogin();
    renderModal();
    return;
  }

  let mainContent = '';
  switch (S.page) {
    case 'dashboard':
      mainContent = renderDashboardOrPasienList(false);
      break;
    case 'pasien-igd':
      mainContent = renderDashboardOrPasienList(true);
      break;
    case 'reg-biasa':
      mainContent = renderRegBiasa();
      break;
    case 'reg-darurat':
      mainContent = renderRegDarurat();
      break;
    case 'detail':
      mainContent = renderDetailPasien();
      break;
    case 'penanganan':
      mainContent = renderPenanganan();
      break;
    case 'pemesanan':
      mainContent = renderPemesanan();
      break;
    case 'lab-lis':
      mainContent = renderLabLis();
      break;
    case 'admin-selesai':
      mainContent = renderAdminSelesai();
      break;
    default:
      mainContent = renderDashboardOrPasienList(false);
  }

  appRoot.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <main class="main-area">
        ${mainContent}
      </main>
    </div>
  `;

  renderModal();
}

// Inisialisasi aplikasi saat halaman HTML dimuat
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  const pageFromBody = document.body.getAttribute('data-page');
  if (pageFromBody) {
    if (!isPageAllowedForRole(pageFromBody, S.role)) {
      S.page = 'dashboard';
      saveState();
      window.location.href = './index.html';
      return;
    }
    S.page = pageFromBody;
    if (pageFromBody === 'admin-selesai') {
      prepareAdminFormForPatient(getPatient(S.selectedPatientId));
    }
  }
  render();
});

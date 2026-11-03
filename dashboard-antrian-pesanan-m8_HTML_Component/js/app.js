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

function navigate(page, opts = {}) {
  if (opts.patientId) S.selectedPatientId = opts.patientId;
  if (opts.role) S.role = opts.role;
  if (opts.modal !== undefined) S.modal = opts.modal;
  else S.modal = null;

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
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(name) {
  S.modal = name;
  renderModal();
}

function closeModal() {
  S.modal = null;
  renderModal();
}

function doLogout() {
  S.loginForm.selectedRole = S.role;
  S.loginForm.nip = ROLES[S.role]?.nip || '19890412';
  showToast(`Anda telah keluar dari sesi ${ROLES[S.role].title}`);
  navigate('login');
}


// =========================================================================
// 12. MAIN ROUTER & RENDERER
// =========================================================================
function render() {
  const appRoot = document.getElementById('appRoot');

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

// Inisialisasi aplikasi saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
  render();
});

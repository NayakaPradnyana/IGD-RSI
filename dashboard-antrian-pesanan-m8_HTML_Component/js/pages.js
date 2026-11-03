// =========================================================================
// 1. SCREEN: LOGIN (Sesuai Desain Gambar Login Care IGD)
// =========================================================================
function selectLoginRole(roleId) {
  S.loginForm.selectedRole = roleId;
  S.loginForm.nip = ROLES[roleId]?.nip || '19890412';
  render();
}

function renderLogin() {
  const f = S.loginForm;
  const roles = [
    { id: 'administrasi', label: 'Administrasi', icon: ICONS.roleAdmin },
    { id: 'perawat', label: 'Perawat', icon: ICONS.rolePerawat },
    { id: 'dokter', label: 'Dokter', icon: ICONS.roleDokter },
    { id: 'lab', label: 'Petugas Lab', icon: ICONS.roleLab }
  ];
  return `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-100 w-full max-w-[420px] p-9">
        <div class="flex flex-col items-center mb-7">
          <div class="w-14 h-14 rounded-2xl bg-[#006a4e] flex items-center justify-center shadow-md shadow-emerald-900/20 mb-3">
            <div class="w-7 h-7 rounded-md bg-white flex items-center justify-center text-[#006a4e] font-extrabold text-xl leading-none">+</div>
          </div>
          <h1 class="text-[22px] font-extrabold tracking-tight text-slate-900">
            <span class="text-[#006a4e]">Care</span> IGD
          </h1>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">ID Petugas / NIP</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${ICONS.idCard}</span>
              <input type="text" value="${f.nip}" oninput="S.loginForm.nip=this.value" placeholder="Masukkan NIP Petugas"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-[#eef2fb] border border-transparent focus:border-[#006a4e] focus:bg-white text-sm font-semibold text-slate-800 outline-none transition" />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-bold text-slate-700">PIN / Sandi Klinis</label>
              <button type="button" onclick="S.loginForm.showPin=!S.loginForm.showPin;render()" class="text-[11px] font-semibold text-slate-400 hover:text-slate-600">
                Tampilkan
              </button>
            </div>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${ICONS.lock}</span>
              <input type="text" value="${f.showPin ? f.pin : '******'}" oninput="if(S.loginForm.showPin) S.loginForm.pin=this.value" placeholder="******"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-[#eef2fb] border border-transparent focus:border-[#006a4e] focus:bg-white text-sm font-semibold text-slate-800 tracking-[0.16em] outline-none transition" />
            </div>
          </div>

          <div class="pt-1">
            <label class="block text-xs font-bold text-slate-700 mb-2">Pilih Peran / Role Akses</label>
            <div class="grid grid-cols-2 gap-2.5">
              ${roles.map(r => {
                const active = f.selectedRole === r.id;
                return `
                  <button type="button" onclick="selectLoginRole('${r.id}')"
                    class="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                      active
                        ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-sm'
                        : 'bg-[#f1f5fd] text-slate-600 border-slate-200/80 hover:bg-slate-100'
                    }">
                    ${r.icon}
                    <span>${r.label}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="pt-3">
            <button type="button" onclick="doLogin()"
              class="w-full py-3.5 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/15 transition">
              <span>Masuk ke Sistem IGD</span>
              ${ICONS.arrowRight}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function doLogin() {
  S.role = S.loginForm.selectedRole || 'dokter';
  navigate('dashboard');
  showToast(`Login berhasil sebagai ${ROLES[S.role].name} (${ROLES[S.role].title})`);
}

// =========================================================================
// APP SHELL (Sidebar Sesuai Hak Akses Role + Akses Logout di Kiri Bawah)
// =========================================================================
const ROLE_ALLOWED_NAV = {
  dokter: ['dashboard', 'pasien-igd', 'pemesanan', 'lab-lis'],
  administrasi: ['dashboard', 'pasien-igd', 'pemesanan', 'lab-lis'],
  lab: ['dashboard', 'pasien-igd', 'pemesanan', 'lab-lis'],
  perawat: ['dashboard', 'pasien-igd', 'pemesanan', 'lab-lis']
};

function renderSidebar() {
  const activeNav =
    S.page === 'dashboard' ? 'dashboard' :
    S.page === 'pemesanan' ? 'pemesanan' :
    S.page === 'lab-lis' ? 'lab-lis' : 'pasien-igd';

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard, target: 'dashboard', badge: '' },
    { id: 'pasien-igd', label: 'Pasien IGD', icon: ICONS.pasien, target: 'pasien-igd', badge: '' },
    { id: 'pemesanan', label: 'Pemesanan', icon: ICONS.pemesanan, target: 'pemesanan', badge: '' },
    { id: 'lab-lis', label: 'Lab LIS', icon: ICONS.lab, target: 'lab-lis', badge: '' }
  ];

  const allowedIds = ROLE_ALLOWED_NAV[S.role] || ROLE_ALLOWED_NAV.dokter;
  const navItems = allNavItems.filter(item => allowedIds.includes(item.id));

  return `
    <aside class="sidebar">
      <div>
        <!-- Brand Header -->
        <div class="flex items-center gap-3.5 px-2 mb-9 cursor-pointer" onclick="navigate('dashboard')">
          <div class="w-11 h-11 rounded-2xl bg-[#006a4e] flex items-center justify-center shadow-sm">
            ${ICONS.plusLogo}
          </div>
          <div>
            <div class="text-[18px] font-bold text-slate-900 leading-none tracking-tight">Care IGD</div>
            <div class="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase mt-1">CLINICAL SUITE</div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col gap-2 nav-list-mobile">
          ${navItems.map(item => `
            <button class="nav-btn ${activeNav === item.id ? 'active' : ''}" onclick="navigate('${item.target}')">
              <span class="flex items-center gap-3.5">
                ${item.icon}
                <span>${item.label}</span>
              </span>
            </button>
          `).join('')}
        </nav>
      </div>

      <!-- Bottom-Left Logout Access (Sesuai Desain Baru) -->
      <div class="pt-4 border-t border-slate-100">
        <button onclick="doLogout()"
          class="w-full py-2.5 px-3.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 text-xs font-semibold flex items-center gap-3 transition cursor-pointer">
          ${ICONS.logout}
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `;
}

function renderTopbar(options = {}) {
  const isDetailExtended = S.page === 'detail' && getPatient()?.hasLabAndNotes;
  const effectiveRoleKey =
    S.page === 'reg-darurat'
      ? 'perawat'
      : (S.page === 'admin-selesai' || S.page === 'reg-biasa' || isDetailExtended)
        ? 'administrasi'
        : S.page === 'lab-lis'
          ? 'lab'
          : S.role;
  const r = ROLES[effectiveRoleKey] || ROLES.dokter;
  const displayName = S.page === 'reg-biasa' ? r.altName : r.name;

  let leftContent = `<div></div>`;
  if (options.showZoneBadge) {
    const isAlertStyle = options.alertZoneBadge;
    leftContent = `
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
        isAlertStyle
          ? 'bg-amber-50/90 border-amber-200 text-amber-800'
          : 'bg-white border-slate-200/90 text-slate-700'
      }">
        <span class="w-2 h-2 rounded-full ${isAlertStyle ? 'bg-rose-500' : 'bg-[#047857]'}"></span>
        <span>IGD Zona Merah &amp; Kuning Aktif</span>
      </div>
    `;
  } else if (options.backText) {
    leftContent = `
      <button onclick="${options.backAction || "navigate('pasien-igd')"}"
        class="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
        ${ICONS.arrowLeft}
        <span>${options.backText}</span>
      </button>
    `;
  }

  const isGreenSolidAvatar =
    (effectiveRoleKey === 'dokter' || effectiveRoleKey === 'perawat' || effectiveRoleKey === 'lab' || S.page === 'reg-biasa') &&
    S.page !== 'admin-selesai';
  const showInitials = effectiveRoleKey === 'perawat' || effectiveRoleKey === 'lab';
  return `
    <header class="topbar">
      <div>${leftContent}</div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <div class="text-sm font-bold text-slate-900 leading-tight">${displayName}</div>
          <div class="text-xs font-medium text-slate-400">${r.title}</div>
        </div>
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
          isGreenSolidAvatar
            ? 'bg-[#0b5340] text-white'
            : 'bg-emerald-50/60 text-[#006a4e] border border-emerald-300'
        }">
          ${showInitials ? r.initials : `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          `}
        </div>
      </div>
    </header>
  `;
}
// =========================================================================
// 2 & 3. SCREEN: DASHBOARD & PASIEN IGD (Terupdate otomatis di semua Role)
// =========================================================================
function openNewRegBiasa() {
  const nextId = `IGD-2410-${String(S.nextRegNumber).padStart(3, '0')}`;
  S.regBiasaStep = 'empty';
  S.regBiasaFoundInDb = false;
  S.regBiasaForm = {
    searchKey: '',
    idPasien: nextId,
    nama: '',
    nik: '',
    alamat: '',
    kelamin: '',
    usia: '',
    triase: 'hijau',
    bed: '',
    keluhan: '',
    dokter: ''
  };
  navigate('reg-biasa');
}

function openNewRegDarurat() {
  S.regDaruratStep = 'empty';
  S.regDaruratForm = {
    idPasien: 'EMG-2410-001',
    nama: '',
    kelamin: '',
    usia: '',
    triase: 'merah',
    bed: '',
    keluhan: '',
    dokter: ''
  };
  navigate('reg-darurat');
}

function renderPatientQueueCard(p, index, isPasienIgdPage) {
  const numStr = String(index + 1).padStart(2, '0');
  const isMerah = p.triase === 'merah';
  const isKuning = p.triase === 'kuning';

  const numBadgeCls = isMerah
    ? 'bg-rose-50 text-rose-600'
    : 'bg-blue-50/80 text-blue-600';

  const triaseBadge = isMerah
    ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600">P1 - Merah</span>`
    : isKuning
    ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100/80 text-amber-800">P2 - Kuning</span>`
    : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100/80 text-[#047857]">P3 - Hijau</span>`;

  const anyAlarm = S.patients.some(p => p.activeInQueue && p.alarmKritis);

  // Show "Layani Pasien ->" sesuai desain di tiap layar & state:
  // - Di halaman Pasien IGD: tampil di semua baris
  // - Di halaman Dashboard saat role Administrasi: hanya "Lihat Data"
  // - Di halaman Dashboard saat Alarm Kritis aktif: tampil di semua baris
  // - Di halaman Dashboard awal (Dokter): tampil pada pasien prioritas pertama (P1 - Merah)
  const showLayaniBtn = isPasienIgdPage
    ? true
    : S.role === 'administrasi'
      ? false
      : anyAlarm
        ? true
        : (p.triase === 'merah' || index === 0);

  const cardBorder = p.alarmKritis
    ? 'border-rose-200 border-l-[5px] border-l-[#dc2626] bg-white shadow-sm'
    : 'border-slate-100 bg-white';

  const statusAkhirLabel =
    p.statusKunjunganAkhir === 'rawat_inap' ? 'Selesai • Transfer ICCU' :
    p.statusKunjunganAkhir === 'pulang' ? 'Selesai • Rawat Jalan' :
    p.statusKunjunganAkhir === 'rujuk' ? 'Selesai • Dirujuk' : '';

  return `
    <div class="rounded-2xl border ${cardBorder} p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl ${numBadgeCls} flex items-center justify-center font-bold text-base shrink-0">
          ${numStr}
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h4 class="text-sm font-bold text-slate-900">${p.nama} (${p.usia} th)</h4>
            ${p.statusDitangani && !p.alarmKritis ? `
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#047857] border border-emerald-200">
                Sedang Ditangani Dokter
              </span>
            ` : ''}
            ${statusAkhirLabel ? `
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                ✓ ${statusAkhirLabel}
              </span>
            ` : ''}
            ${p.alarmKritis ? `
              <button onclick="S.selectedPatientId='${p.id}';openModal('panic-alert')"
                class="pulse-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#dc2626] text-white shadow-sm cursor-pointer">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/></svg>
                <span>ALARM KRITIS: LIHAT HASIL LAB</span>
              </button>
            ` : ''}
          </div>
          <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            ${triaseBadge}
            <span class="font-medium text-slate-600">${p.bed}</span>
            <span class="text-slate-300">•</span>
            <span><span class="text-slate-400">ID Pasien:</span> <strong class="text-slate-700 font-semibold">${p.id}</strong></span>
            <span class="text-slate-300">•</span>
            <span><span class="text-slate-400">No. RM:</span> <strong class="text-slate-700 font-semibold">${p.rm}</strong></span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2.5 self-end sm:self-center shrink-0">
        <button onclick="navigate('detail', { patientId: '${p.id}' })"
          class="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 transition">
          Lihat Data
        </button>
        ${showLayaniBtn ? `
          <button onclick="startPenanganan('${p.id}')"
            class="px-4 py-2 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition">
            <span>Layani Pasien</span>
            ${ICONS.arrowRight}
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

function startPenanganan(pid) {
  const p = getPatient(pid);
  p.statusDitangani = true;
  navigate('penanganan', { patientId: pid });
}

function renderDashboardOrPasienList(isPasienIgdPage = false) {
  const visiblePatients = S.patients.filter(p => p.activeInQueue).filter(p => {
    if (!S.searchQuery.trim()) return true;
    const q = S.searchQuery.toLowerCase();
    return (
      p.nama.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.rm.toLowerCase().includes(q)
    );
  });

  const countMerah = S.patients.filter(p => p.activeInQueue && p.triase === 'merah').length;
  const countKuning = S.patients.filter(p => p.activeInQueue && p.triase === 'kuning').length;
  const countHijau = S.patients.filter(p => p.activeInQueue && p.triase === 'hijau').length;
  const anyAlarm = S.patients.some(p => p.activeInQueue && p.alarmKritis);

  return `
    ${renderTopbar()}
    <div class="page-body">
      ${!isPasienIgdPage ? `
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
          <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-600">MERAH (P1)</span>
              <span class="w-3.5 h-3.5 rounded-full bg-rose-400 ring-4 ring-rose-50"></span>
            </div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold text-rose-500 tracking-tight">${countMerah}</span>
              <span class="text-sm font-semibold text-slate-600">Pasien</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-600">KUNING (P2)</span>
              <span class="w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-amber-50"></span>
            </div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold text-slate-800 tracking-tight">${countKuning}</span>
              <span class="text-sm font-semibold text-slate-600">Pasien</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-600">HIJAU (P3)</span>
              <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></span>
            </div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold text-slate-800 tracking-tight">${countHijau}</span>
              <span class="text-sm font-semibold text-slate-600">Pasien</span>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Daftar Antrean Pasien</h2>
          <p class="text-xs font-medium text-slate-400">Status triase dan alokasi bed saat ini</p>
        </div>
        <div class="flex items-center gap-2.5">
          <button onclick="openNewRegBiasa()"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-700/30 text-[#047857] text-xs font-semibold inline-flex items-center gap-1.5 transition">
            ${ICONS.userAdd}
            <span>Registrasi Biasa</span>
          </button>
          <button onclick="openNewRegDarurat()"
            class="px-3.5 py-2 rounded-xl bg-[#e11d48] hover:bg-rose-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition">
            ${ICONS.bolt}
            <span>Registrasi Darurat</span>
          </button>
        </div>
      </div>

      ${(isPasienIgdPage || (!anyAlarm && S.role !== 'administrasi')) ? `
        <div class="relative mb-4">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${ICONS.search}</span>
          <input type="text" value="${S.searchQuery}" oninput="S.searchQuery=this.value;render()"
            placeholder="Cari berdasarkan No. RM, Nama Pasien, atau ID Pasien..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-[#006a4e]" />
        </div>
      ` : ''}

      <div class="space-y-3">
        ${visiblePatients.map((p, idx) => renderPatientQueueCard(p, idx, isPasienIgdPage)).join('')}
      </div>
    </div>
  `;
}

// =========================================================================
// 4. SCREEN: REGISTRASI PASIEN BIASA (REGULER) — Interaktif Penuh
// =========================================================================
function cekDataMasterBiasa() {
  const f = S.regBiasaForm;
  const key = (f.searchKey || '').trim().toUpperCase();
  if (S.regBiasaStep === 'filled' && S.regBiasaFoundInDb) {
    // Reset back to empty search
    openNewRegBiasa();
    return;
  }

  const match = MASTER_PATIENT_DB[key] || {
    idPasien: 'IGD-2410-002',
    nama: 'Ny. Siti Rahma',
    nik: '3507123456780001',
    alamat: 'Jl. Merbabu No. 14, Lowokwaru, Malang',
    kelamin: 'Perempuan',
    usia: '34 Tahun',
    triase: 'hijau',
    bed: 'Bed 08'
  };

  f.searchKey = f.searchKey.trim() || 'IGD-2410-002';
  f.idPasien = match.idPasien;
  f.nama = match.nama;
  f.nik = match.nik;
  f.alamat = match.alamat;
  f.kelamin = match.kelamin;
  f.usia = match.usia;
  f.triase = match.triase;
  f.bed = match.bed;
  f.dokter = 'dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)';

  S.regBiasaFoundInDb = true;
  S.regBiasaStep = 'filled';
  showToast(`Data pasien "${f.nama}" ditemukan dari database!`);
  render();
}

function lanjutRegBiasa() {
  const f = S.regBiasaForm;
  if (!f.nama.trim()) {
    f.nama = 'Ny. Siti Rahma';
    f.nik = f.nik || '3507123456780001';
    f.alamat = f.alamat || 'Jl. Merbabu No. 14, Lowokwaru, Malang';
    f.usia = f.usia || '34 Tahun';
    f.kelamin = f.kelamin || 'Perempuan';
    f.bed = f.bed || 'Bed 08';
    f.dokter = f.dokter || 'dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)';
  }
  f.idPasien = 'IGD-2410-002';
  S.regBiasaStep = 'filled';
  showToast('Data pendaftaran terkonfirmasi, silakan klik Simpan & Daftarkan ke Dashboard.');
  render();
}

function changeTriaseBiasa(triase) {
  S.regBiasaForm.triase = triase;
  if (S.regBiasaStep === 'filled') {
    if (triase === 'merah') S.regBiasaForm.bed = 'Bed 01';
    else if (triase === 'kuning') S.regBiasaForm.bed = 'Bed 04';
    else S.regBiasaForm.bed = 'Bed 08';
  }
  render();
}

function renderRegBiasa() {
  const isFilled = S.regBiasaStep === 'filled';
  const f = S.regBiasaForm;

  return `
    ${renderTopbar()}
    <div class="page-body">
      <div class="mb-6">
        <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Registrasi Pasien Biasa (Reguler)</h2>
        <p class="text-xs text-slate-400 mt-0.5">
          ${isFilled
            ? 'Pencatatan data administrasi pasien reguler IGD &amp; penerbitan gelang identitas'
            : 'Pencarian data master atau input pasien baru reguler IGD'}
        </p>
      </div>

      <div class="max-w-[580px] bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <!-- Search Box -->
        <div class="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2.5">
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600">CARI ID PASIEN / NIK TERSIMPAN</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              ${isFilled ? `
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">✓</span>
                <input type="text" value="${f.searchKey || f.idPasien}" oninput="S.regBiasaForm.searchKey=this.value"
                  class="w-full pl-8 pr-24 py-2.5 rounded-xl bg-white border border-emerald-400 text-xs font-bold text-slate-800 outline-none" />
                <span class="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-emerald-50 text-[#047857] text-[10px] font-bold">Ditemukan</span>
              ` : `
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${ICONS.search}</span>
                <input type="text" value="${f.searchKey}" oninput="S.regBiasaForm.searchKey=this.value"
                  placeholder="Masukkan ID Pasien atau NIK (misal: IGD-2410-002)"
                  class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 outline-none focus:border-[#006a4e]" />
              `}
            </div>
            <button type="button" onclick="cekDataMasterBiasa()"
              class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shrink-0 transition">
              ${isFilled ? 'Cek Ulang' : 'Cek Data'}
            </button>
          </div>
          ${isFilled ? `
            <div class="px-3.5 py-2 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[#047857] text-[11px] font-semibold flex items-center gap-2">
              <span>◎</span>
              <span>✓ Data Pasien Ditemukan</span>
            </div>
          ` : `
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Ketik ID / NIK lalu klik Cek Data. Jika pasien baru (belum ada data), langsung isi formulir di bawah.
            </p>
          `}
        </div>

        <!-- Row: ID Pasien & No RM -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              ${isFilled ? 'ID PASIEN (TERSIMPAN)' : 'ID PASIEN (AUTO)'}
            </label>
            ${isFilled ? `
              <div class="px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800">${f.idPasien}</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100/80 text-[#047857] text-[10px] font-bold">Pasien Terdaftar</span>
              </div>
            ` : `
              <div class="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[11px] text-slate-400">
                <span>(Otomatis di-generate sistem saat disimpan)</span>
                <span class="px-2 py-0.5 rounded bg-slate-200/70 text-slate-600 text-[10px] font-bold">Otomatis</span>
              </div>
            `}
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              ${isFilled ? 'NO. REKAM MEDIS' : 'NO. REKAM MEDIS (AUTO)'}
            </label>
            <div class="px-3.5 py-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-[#047857] text-[11px] font-semibold flex items-center gap-2">
              <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${isFilled ? 'Otomatis di-generate saat masuk dashboard untuk cegah duplikasi' : '(Otomatis di-generate saat masuk dashboard)'}</span>
            </div>
          </div>
        </div>

        <!-- Nama Pasien -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">NAMA PASIEN / ESTIMASI</label>
          <input type="text" value="${f.nama}" oninput="S.regBiasaForm.nama=this.value"
            placeholder="Masukkan nama lengkap pasien..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
        </div>

        <!-- NIK & Alamat -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 leading-snug">NIK (NOMOR INDUK<br/>KEPENDUDUKAN)</label>
            <input type="text" value="${f.nik}" oninput="S.regBiasaForm.nik=this.value"
              placeholder="16 digit NIK..."
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ALAMAT DOMISILI</label>
            <input type="text" value="${f.alamat}" oninput="S.regBiasaForm.alamat=this.value"
              placeholder="Alamat domisili lengkap..."
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
          </div>
        </div>

        <!-- Jenis Kelamin & Usia -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">JENIS KELAMIN</label>
            <select onchange="S.regBiasaForm.kelamin=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]">
              ${!isFilled ? `<option value="" ${!f.kelamin ? 'selected' : ''}>Pilih Jenis Kelamin</option>` : ''}
              <option value="Perempuan" ${f.kelamin === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
              <option value="Laki-laki" ${f.kelamin === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">USIA / ESTIMASI</label>
            <input type="text" value="${f.usia}" oninput="S.regBiasaForm.usia=this.value"
              placeholder="Contoh: 34 Tahun"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
          </div>
        </div>

        <!-- Pilih Zona Triase -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">PILIH ZONA TRIASE</label>
          <div class="grid grid-cols-3 gap-3">
            <button type="button" onclick="changeTriaseBiasa('merah')"
              class="p-3 rounded-xl border text-center transition ${
                f.triase === 'merah' ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500' : 'border-slate-200 hover:bg-slate-50'
              }">
              <div class="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span><span>P1 - Merah</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">Kritis &amp; Gawat</div>
            </button>

            <button type="button" onclick="changeTriaseBiasa('kuning')"
              class="p-3 rounded-xl border text-center transition ${
                f.triase === 'kuning' ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500' : 'border-slate-200 hover:bg-slate-50'
              }">
              <div class="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span><span>P2 - Kuning</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">Mendesak</div>
            </button>

            <button type="button" onclick="changeTriaseBiasa('hijau')"
              class="p-3 rounded-xl border text-center transition ${
                f.triase === 'hijau' ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50'
              }">
              <div class="text-xs font-bold text-[#047857] flex items-center justify-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span><span>P3 - Hijau</span>
              </div>
              <div class="text-[10px] text-emerald-600 mt-0.5">Tidak Gawat</div>
            </button>
          </div>
        </div>

        <!-- Alokasi Tempat Tidur -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ALOKASI TEMPAT TIDUR</label>
          <select onchange="S.regBiasaForm.bed=this.value"
            class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none">
            ${!isFilled ? `<option value="" ${!f.bed ? 'selected' : ''}>Pilih Bed</option>` : ''}
            <option value="Bed 08" ${f.bed.includes('Bed 08') ? 'selected' : ''}>Bed 08</option>
            <option value="Bed 07" ${f.bed.includes('Bed 07') ? 'selected' : ''}>Bed 07</option>
            <option value="Bed 04" ${f.bed.includes('Bed 04') ? 'selected' : ''}>Bed 04</option>
            <option value="Bed 01" ${f.bed.includes('Bed 01') ? 'selected' : ''}>Bed 01</option>
          </select>
        </div>

        <!-- Dokter Yang Menangani -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            ${isFilled ? 'DOKTER YANG MENANGANI (DPJP IGD)' : 'DOKTER YANG MENANGANI'}
          </label>
          ${isFilled ? `
            <div class="relative flex items-center">
              <span class="absolute left-3.5 w-6 h-6 rounded-lg bg-emerald-50 text-[#006a4e] flex items-center justify-center pointer-events-none">
                ${ICONS.pasien}
              </span>
              <select onchange="S.regBiasaForm.dokter=this.value"
                class="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 outline-none">
                <option value="dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)">dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)</option>
                <option value="dr. Nadia Putri, Sp.EM (Dokter Spesialis Emergensi)">dr. Nadia Putri, Sp.EM (Dokter Spesialis Emergensi)</option>
              </select>
            </div>
          ` : `
            <select onchange="S.regBiasaForm.dokter=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none">
              <option value="">Pilih Dokter Yang Menangani</option>
              <option value="dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)">dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)</option>
              <option value="dr. Nadia Putri, Sp.EM (Dokter Spesialis Emergensi)">dr. Nadia Putri, Sp.EM (Dokter Spesialis Emergensi)</option>
            </select>
          `}
        </div>

        <!-- Keluhan Pasien -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">KELUHAN PASIEN</label>
          <input type="text" value="${f.keluhan}" oninput="S.regBiasaForm.keluhan=this.value"
            placeholder="${isFilled ? 'Muntah muntah' : 'Tuliskan Keluhan Pasien'}"
            class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold ${isFilled ? 'text-slate-600' : 'text-slate-800 placeholder-slate-700'} outline-none focus:border-[#006a4e]" />
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="mt-6 pt-5 border-t border-slate-200/70 flex items-center justify-between">
        <button type="button" onclick="navigate('dashboard')"
          class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
          Batal
        </button>
        ${isFilled ? `
          <button type="button" onclick="saveRegBiasa()"
            class="px-6 py-3 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition">
            <span>Simpan &amp; Daftarkan ke Dashboard</span>
            ${ICONS.arrowRight}
          </button>
        ` : `
          <button type="button" onclick="lanjutRegBiasa()"
            class="px-6 py-3 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition">
            <span>Lanjut</span>
            ${ICONS.arrowRight}
          </button>
        `}
      </div>
    </div>
  `;
}

function saveRegBiasa() {
  const f = S.regBiasaForm;
  const existingIdx = S.patients.findIndex(p => p.id === f.idPasien);
  const newId = existingIdx >= 0 ? f.idPasien : (f.idPasien || `IGD-2410-${String(S.nextRegNumber).padStart(3, '0')}`);
  const newRm = existingIdx >= 0 ? S.patients[existingIdx].rm : `RM-2024-${S.nextRmNumber}`;
  if (existingIdx < 0) {
    S.nextRegNumber++;
    S.nextRmNumber++;
  }

  const newPatient = {
    id: newId,
    rm: newRm,
    nama: (f.nama || 'Ny. Siti Rahma').trim(),
    usia: parseInt(f.usia) || (existingIdx >= 0 ? S.patients[existingIdx].usia : 34),
    kelamin: f.kelamin || 'Perempuan',
    nik: f.nik || '3507123456780001',
    kontak: existingIdx >= 0 ? S.patients[existingIdx].kontak : '0812-9988-7766 - Keluarga Pasien',
    alamat: f.alamat || 'Jl. Merbabu No. 14, Lowokwaru, Malang',
    triase: f.triase || 'hijau',
    bed: (f.bed || 'Bed 08').split('—')[0].trim(),
    bedFull: f.bed || 'Bed 08',
    keluhan: f.keluhan || 'Muntah muntah',
    keluhanSingkat: f.keluhan || 'Muntah muntah',
    waktu: existingIdx >= 0 ? S.patients[existingIdx].waktu : getNowTimeWIB(),
    dokter: (f.dokter || 'dr. Farhan Malik, Sp.EM').split('(')[0].trim(),
    tipe: 'biasa',
    statusDitangani: existingIdx >= 0 ? S.patients[existingIdx].statusDitangani : false,
    alarmKritis: existingIdx >= 0 ? S.patients[existingIdx].alarmKritis : false,
    hasLabAndNotes: existingIdx >= 0 ? S.patients[existingIdx].hasLabAndNotes : false,
    labFileName: `Hasil_Lab_IGD_${(f.nama || 'Pasien').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
    catatanPelayanan: existingIdx >= 0 ? S.patients[existingIdx].catatanPelayanan : 'Pasien baru terdaftar melalui registrasi reguler IGD.',
    catatanAnalis: existingIdx >= 0 ? S.patients[existingIdx].catatanAnalis : 'Sampel pemeriksaan laboratorium telah diverifikasi.',
    statusKunjunganAkhir: null,
    activeInQueue: true
  };

  if (existingIdx >= 0) {
    S.patients[existingIdx] = newPatient;
  } else {
    S.patients.push(newPatient);
  }
  sortPatientsByPriority();
  S.selectedPatientId = newPatient.id;

  showToast(`Pasien "${newPatient.nama}" (${newPatient.id}) berhasil disimpan ke Dashboard!`);
  navigate('dashboard');
}

// =========================================================================
// 5. SCREEN: REGISTRASI PASIEN DARURAT — Interaktif Penuh (Tanpa Cetak Gelang)
// =========================================================================
function changeTriaseDarurat(triase) {
  S.regDaruratForm.triase = triase;
  if (S.regDaruratStep === 'filled') {
    if (triase === 'merah') S.regDaruratForm.bed = 'Bed 01';
    else if (triase === 'kuning') S.regDaruratForm.bed = 'Bed 04';
    else S.regDaruratForm.bed = 'Bed 08';
  }
  render();
}

function lanjutRegDarurat() {
  const f = S.regDaruratForm;
  if (!f.nama.trim()) {
    f.nama = 'Tn. Budi Santoso (Gawat Darurat)';
    f.kelamin = f.kelamin || 'Laki-laki';
    f.usia = f.usia || '52 Tahun';
    f.bed = f.bed || 'Bed 01';
    f.dokter = f.dokter || 'dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)';
    f.keluhan = f.keluhan || 'Nyeri dada hebat tembus punggung sejak 2 jam lalu, keringat dingin, sesak napas akut.';
  }
  f.idPasien = 'EMG-2410-001';
  S.regDaruratStep = 'filled';
  showToast('ID Darurat diterbitkan, silakan klik Simpan & Daftarkan ke Dashboard!');
  render();
}

function renderRegDarurat() {
  const isFilled = S.regDaruratStep === 'filled';
  const f = S.regDaruratForm;

  return `
    ${renderTopbar()}
    <div class="page-body">
      <div class="mb-6">
        <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Registrasi Pasien Darurat</h2>
        <p class="text-xs text-slate-400 mt-0.5">Pencatatan data darurat cepat &amp; alokasi gelang barcode IGD</p>
      </div>

      <div class="max-w-[580px] bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ID PASIEN DARURAT (AUTO)</label>
            <div class="px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200/70">
              ${isFilled ? `
                <div class="text-xs font-extrabold text-slate-900 leading-snug">EMG-2410-<br/>001</div>
              ` : `
                <div class="text-xs font-semibold text-slate-400 leading-snug">(Otomatis: EMG-<br/>XXXX-XXX)</div>
              `}
            </div>
            <div class="text-[10px] text-slate-400 mt-1">Auto-generate CITO / IGD Prioritas</div>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">NO. REKAM MEDIS (AUTO)</label>
            <div class="px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] font-semibold text-slate-500 leading-snug">
              (Otomatis di-<br/>generate saat<br/>masuk dashboard)
            </div>
            <div class="text-[10px] text-slate-400 mt-1">Diterbitkan otomatis sistem terpusat</div>
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">NAMA PASIEN / ESTIMASI</label>
          <input type="text" value="${f.nama}" oninput="S.regDaruratForm.nama=this.value"
            placeholder="Masukkan nama pasien atau identitas sementara (misal: Mr. X)"
            class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-rose-500" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">JENIS KELAMIN</label>
            <select onchange="S.regDaruratForm.kelamin=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none">
              ${!isFilled ? `<option value="" ${!f.kelamin ? 'selected' : ''}>Pilih Jenis Kelamin</option>` : ''}
              <option value="Laki-laki" ${f.kelamin === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
              <option value="Perempuan" ${f.kelamin === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">USIA / ESTIMASI</label>
            <input type="text" value="${f.usia}" oninput="S.regDaruratForm.usia=this.value"
              placeholder="Contoh: 45 Tahun (Estimasi)"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">PILIH ZONA TRIASE</label>
          <div class="grid grid-cols-3 gap-3">
            <button type="button" onclick="changeTriaseDarurat('merah')"
              class="p-3 rounded-xl border text-center transition ${
                f.triase === 'merah' ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500' : 'border-slate-200 hover:bg-slate-50'
              }">
              <div class="text-xs font-bold text-rose-600 flex items-center justify-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span><span>P1 - Merah</span>
              </div>
              <div class="text-[10px] text-rose-500 mt-0.5">Kritis &amp; Gawat</div>
            </button>
            <button type="button" onclick="changeTriaseDarurat('kuning')"
              class="p-3 rounded-xl border text-center transition ${
                f.triase === 'kuning' ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500' : 'border-slate-200 hover:bg-slate-50'
              }">
              <div class="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span><span>P2 - Kuning</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">Mendesak</div>
            </button>
            <button type="button" onclick="changeTriaseDarurat('hijau')"
              class="p-3 rounded-xl border text-center transition ${
                f.triase === 'hijau' ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50'
              }">
              <div class="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span><span>P3 - Hijau</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">Tidak Gawat</div>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ALOKASI TEMPAT TIDUR</label>
          <select onchange="S.regDaruratForm.bed=this.value"
            class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none">
            ${!isFilled ? `<option value="" ${!f.bed ? 'selected' : ''}>Pilih Bed Resusitasi / Observasi...</option>` : ''}
            <option value="Bed 01" ${f.bed.includes('Bed 01') ? 'selected' : ''}>Bed 01</option>
            <option value="Bed 02" ${f.bed.includes('Bed 02') ? 'selected' : ''}>Bed 02</option>
            <option value="Bed 04" ${f.bed.includes('Bed 04') ? 'selected' : ''}>Bed 04</option>
            <option value="Bed 08" ${f.bed.includes('Bed 08') ? 'selected' : ''}>Bed 08</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            ${isFilled ? 'DOKTER YANG MENANGANI (DPJP IGD)' : 'DOKTER YANG MENANGANI'}
          </label>
          ${isFilled ? `
            <div class="relative flex items-center">
              <span class="w-7 h-7 rounded-lg bg-emerald-50 text-[#006a4e] flex items-center justify-center absolute left-3 pointer-events-none">
                ${ICONS.pasien}
              </span>
              <select onchange="S.regDaruratForm.dokter=this.value"
                class="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 outline-none">
                <option value="dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)">dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)</option>
                <option value="dr. Nadia Putri, Sp.EM (Dokter Spesialis Emergensi)">dr. Nadia Putri, Sp.EM (Dokter Spesialis Emergensi)</option>
              </select>
            </div>
          ` : `
            <select onchange="S.regDaruratForm.dokter=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none">
              <option value="">Pilih Dokter Yang Menangani</option>
              <option value="dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)">dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)</option>
              <option value="dr. Nadia Putri, Sp.EM (Dokter Spesialis Emergensi)">dr. Nadia Putri, Sp.EM (Dokter Spesialis Emergensi)</option>
            </select>
          `}
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">KELUHAN PASIEN</label>
          ${isFilled ? `
            <textarea rows="2" oninput="S.regDaruratForm.keluhan=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-rose-500 resize-none">${f.keluhan || 'Nyeri dada hebat tembus punggung sejak 2 jam lalu, keringat dingin, sesak napas akut.'}</textarea>
          ` : `
            <input type="text" value="${f.keluhan}" oninput="S.regDaruratForm.keluhan=this.value"
              placeholder="Tuliskan Keluhan Pasien"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-700 outline-none focus:border-rose-500" />
          `}
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 pt-5 border-t border-slate-200/70 flex items-center justify-between">
        <button type="button" onclick="navigate('dashboard')"
          class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
          Batal
        </button>
        ${isFilled ? `
          <button type="button" onclick="saveRegDarurat()"
            class="px-6 py-3 rounded-xl bg-[#dc2626] hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition">
            <span>Simpan &amp; Daftarkan ke Dashboard</span>
            ${ICONS.arrowRight}
          </button>
        ` : `
          <button type="button" onclick="lanjutRegDarurat()"
            class="px-6 py-3 rounded-xl bg-[#dc2626] hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition">
            <span>Lanjut</span>
            ${ICONS.arrowRight}
          </button>
        `}
      </div>
    </div>
  `;
}

function saveRegDarurat() {
  const f = S.regDaruratForm;
  const cleanName = (f.nama || 'Tn. Budi Santoso').replace('(Gawat Darurat)', '').trim();
  const existingIdx = S.patients.findIndex(p => p.id === f.idPasien);
  const newId = existingIdx >= 0 ? f.idPasien : (f.idPasien || `EMG-2410-${String(S.nextEmgNumber).padStart(3, '0')}`);
  const newRm = existingIdx >= 0 ? S.patients[existingIdx].rm : `RM-2024-${S.nextRmNumber}`;
  if (existingIdx < 0) {
    S.nextEmgNumber++;
    S.nextRmNumber++;
  }

  const newPatient = {
    id: newId,
    rm: newRm,
    nama: cleanName,
    usia: parseInt(f.usia) || 52,
    kelamin: f.kelamin || 'Laki-laki',
    nik: '3578012304720001',
    kontak: '081238421610',
    alamat: 'Jl. Ijen No. 45, Klojen, Malang',
    triase: f.triase || 'merah',
    bed: (f.bed || 'Bed 01').split('—')[0].trim(),
    bedFull: `${(f.bed || 'Bed 01').split('—')[0].trim()} (Resusitasi)`,
    keluhan: f.keluhan || 'Nyeri dada hebat tembus punggung sejak 2 jam lalu, keringat dingin, sesak napas akut.',
    keluhanSingkat: f.keluhan || 'Nyeri dada hebat tembus punggung sejak 2 jam lalu, keringat dingin, sesak napas akut.',
    waktu: existingIdx >= 0 ? S.patients[existingIdx].waktu : getNowTimeWIB(),
    dokter: (f.dokter || 'dr. Farhan Malik, Sp.EM').split('(')[0].trim(),
    tipe: 'darurat',
    statusDitangani: existingIdx >= 0 ? S.patients[existingIdx].statusDitangani : false,
    alarmKritis: existingIdx >= 0 ? S.patients[existingIdx].alarmKritis : false,
    hasLabAndNotes: existingIdx >= 0 ? S.patients[existingIdx].hasLabAndNotes : false,
    labFileName: `Hasil_Lab_CITO_${cleanName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
    catatanPelayanan: existingIdx >= 0 ? S.patients[existingIdx].catatanPelayanan : 'Nyeri dada substernal menjalar ke\nlengan kiri, skala nyeri 8/10',
    catatanAnalis: existingIdx >= 0 ? S.patients[existingIdx].catatanAnalis : 'Hasil CITO Troponin I terdeteksi tinggi (Panic Value). Sampel telah diverifikasi ulang metode hs-CLIA. Harap segera konfirmasi tindakan medis.',
    statusKunjunganAkhir: null,
    activeInQueue: true
  };

  if (existingIdx >= 0) {
    S.patients[existingIdx] = newPatient;
  } else {
    S.patients.unshift(newPatient);
  }
  sortPatientsByPriority();
  S.selectedPatientId = newPatient.id;

  showToast(`Pasien Darurat "${newPatient.nama}" (${newPatient.id}) berhasil disimpan ke Dashboard!`);
  navigate('dashboard');
}


// =========================================================================
// 6. SCREEN: DETAIL DATA PASIEN (Sesuai Desain Gambar Detail Data Pasien)
// =========================================================================
function renderDetailPasien() {
  const p = getPatient();
  const showExtended = p.hasLabAndNotes;

  const triaseBadgeClass = p.triase === 'merah'
    ? 'bg-rose-50 text-rose-600'
    : p.triase === 'kuning'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-emerald-50 text-emerald-700';

  const triaseDotClass = p.triase === 'merah'
    ? 'bg-rose-500'
    : p.triase === 'kuning'
      ? 'bg-amber-400'
      : 'bg-emerald-500';

  const triaseLabel = p.triase === 'merah'
    ? 'P1 - Merah'
    : p.triase === 'kuning'
      ? 'P2 - Kuning'
      : 'P3 - Hijau';

  const displayNik = showExtended
    ? (p.nik || '3578012304720001')
    : (p.tipe === 'darurat' ? '-' : (p.nik || '-'));

  const displayAlamat = showExtended
    ? (p.alamat || 'Jl. Ijen No. 45, Klojen, Malang')
    : (p.tipe === 'darurat' ? '-' : (p.alamat || '-'));

  return `
    ${renderTopbar()}
    <div class="page-body space-y-5">
      <!-- Header Row: Kembali ke Antrean | Data Pasien: ... | Layani Pasien -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div class="flex flex-wrap items-center gap-3.5">
          <button onclick="navigate('pasien-igd')"
            class="px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-700 inline-flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition">
            ${ICONS.arrowLeft}
            <span>Kembali ke Antrean</span>
          </button>
          <span class="h-5 w-[1px] bg-slate-200 hidden sm:inline-block"></span>
          <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">Data Pasien: ${p.nama}</h2>
        </div>

        <div class="flex items-center gap-2.5">
          ${!showExtended ? `
            <button onclick="startPenanganan('${p.id}')"
              class="px-4 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition">
              <span>Layani Pasien</span>
              ${ICONS.arrowRight}
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Top 2 Cards: Identitas Pasien & Status Saat Ini -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Left Card: Identitas Pasien -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-xl bg-emerald-50 text-[#006a4e] flex items-center justify-center">
                  ${ICONS.pasien}
                </span>
                <span class="text-xs font-extrabold text-slate-900">Identitas Pasien</span>
              </div>
              <span onclick="togglePatientLabState('${p.id}')" title="Klik untuk beralih tampilan awal / hasil lab"
                class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold cursor-pointer select-none">
                ID: ${p.id}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-y-5 gap-x-6">
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">NO. REKAM MEDIS</div>
                <div class="text-sm font-extrabold text-slate-900 mt-1">${p.rm}</div>
              </div>
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">USIA</div>
                <div class="text-sm font-extrabold text-slate-900 mt-1">${p.usia} Tahun</div>
              </div>
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">JENIS KELAMIN</div>
                <div class="text-xs font-bold text-slate-800 mt-1">${p.kelamin}</div>
              </div>
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">NIK</div>
                <div class="text-xs font-extrabold text-slate-900 mt-1">${displayNik}</div>
              </div>
              <div class="col-span-2">
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">ALAMAT</div>
                <div class="text-xs font-semibold text-slate-800 mt-1">${displayAlamat}</div>
              </div>
            </div>
          </div>

          <div class="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Waktu Masuk: 01 - 01 - 2026 (${p.waktu})</span>
          </div>
        </div>

        <!-- Right Card: Status Saat Ini -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                  ${ICONS.pulse}
                </span>
                <span class="text-xs font-extrabold text-slate-900">Status Saat Ini</span>
              </div>
              <span class="px-3 py-1 rounded-full ${triaseBadgeClass} text-[10px] font-bold inline-flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full ${triaseDotClass}"></span>
                <span>${triaseLabel}</span>
              </span>
            </div>

            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">LOKASI BED</div>
              <div class="text-sm font-extrabold text-slate-900 mt-1">${p.bed}</div>
            </div>

            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">KELUHAN UTAMA</div>
              <div class="p-3.5 rounded-xl bg-slate-50/90 border border-slate-100 text-xs font-semibold text-slate-800 leading-relaxed">
                ${p.keluhan}
              </div>
            </div>
          </div>

          <div class="pt-4 mt-5 border-t border-slate-100 flex items-center justify-end pr-2">
            <button onclick="showToast('Mencetak Gelang Identitas Pasien (${p.id})...')"
              class="px-5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition">
              Cetak Gelang
            </button>
          </div>
        </div>
      </div>

      ${showExtended ? `
        <!-- Bottom 2 Cards: Hasil Pemeriksaan Laboratorium (LIS) & Catatan Pelayanan -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Hasil Lab Card -->
          <div class="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between space-y-4">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-9 h-9 rounded-xl bg-emerald-50"></span>
                  <span class="text-xs font-extrabold text-slate-900 leading-snug">Hasil Pemeriksaan<br/>Laboratorium (LIS)</span>
                </div>
                <span class="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-extrabold leading-tight">
                  Panic Value<br/>Terdeteksi
                </span>
              </div>

              <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">CATATAN ANALIS LAB</div>
                <div class="text-xs text-slate-600 leading-relaxed">
                  ${p.catatanAnalis}
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200/70 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    ${ICONS.idCard}
                  </div>
                  <div class="min-w-0">
                    <div class="text-xs font-extrabold text-slate-900 truncate">Hasil_Lab_CITO_Tn_Budi_Sa</div>
                    <div class="text-[10px] text-slate-400 leading-tight mt-0.5">245 KB • Terverifikasi Digital<br/>LIS</div>
                  </div>
                </div>
                <button onclick="showToast('Mengunduh ${p.labFileName}...')"
                  class="px-3.5 py-2 rounded-xl bg-[#047857] hover:bg-[#006a4e] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0 transition">
                  ${ICONS.download}
                  <span>Unduh PDF</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Catatan Pelayanan Card (Sesuai Desain Gambar) -->
          <div class="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between space-y-4">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-9 h-9 rounded-xl bg-emerald-50 text-[#006a4e] flex items-center justify-center">
                    ${ICONS.pemesanan}
                  </span>
                  <span class="text-xs font-extrabold text-slate-900">Catatan Pelayanan</span>
                </div>
                <span class="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[10px] font-bold text-slate-700 inline-flex items-center gap-1.5">
                  <span class="text-[#006a4e]">${ICONS.roleDokter}</span>
                  <span class="leading-tight">dr. Farhan Malik,<br/>Sp.EM</span>
                </span>
              </div>

              <div class="p-4 rounded-xl bg-slate-50/50 border border-slate-200/70 min-h-[175px] text-xs text-slate-600 leading-relaxed whitespace-pre-line">${p.catatanPelayanan}</div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Bottom Right Action Button: Penyelesaian Administrasi -->
      <div class="flex justify-end pt-3 pr-8">
        <button onclick="openAdminSelesai('${p.id}')"
          class="px-6 py-3 rounded-2xl bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200 text-[#047857] text-xs font-extrabold inline-flex items-center gap-3 shadow-sm transition">
          ${ICONS.checkSquare}
          <span class="text-center leading-tight">Penyelesaian<br/>Administrasi</span>
        </button>
      </div>
    </div>
  `;
}

function togglePatientLabState(pid) {
  const p = getPatient(pid);
  p.hasLabAndNotes = !p.hasLabAndNotes;
  render();
}

function openAdminSelesai(pid) {
  const p = getPatient(pid);
  S.selectedPatientId = p.id;
  S.adminForm.nama = p.nama;
  S.adminForm.nik = p.nik;
  S.adminForm.kelamin = p.kelamin;
  S.adminForm.kontak = p.kontak || '0812-3456-7890 - Keluarga Pasien';
  S.adminForm.alamat = p.alamat;
  S.adminForm.tglLahir = `14 Mei 1972 (${p.usia} th)`;
  S.adminForm.newPermanentId = p.id.startsWith('EMG-')
    ? p.id.replace('EMG-', 'IGD-')
    : p.id;
  navigate('admin-selesai', { patientId: p.id });
}

// =========================================================================
// 7. SCREEN: PENANGANAN PASIEN (1 Kotak Catatan Pelayanan + Order Lab)
// =========================================================================
function renderPenanganan() {
  const p = getPatient();
  const qNum = String(Math.max(1, S.patients.findIndex(x => x.id === p.id) + 1)).padStart(2, '0');

  const triaseLabel = p.triase === 'merah'
    ? 'P1 - Merah'
    : p.triase === 'kuning'
      ? 'P2 - Kuning'
      : 'P3 - Hijau';

  return `
    ${renderTopbar({
      backText: 'Kembali ke Antrean Pasien',
      backAction: "navigate('pasien-igd')"
    })}
    <div class="page-body space-y-5">
      <div>
        <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Penanganan Pasien</h2>
        <p class="text-xs text-slate-400 mt-0.5">Penanganan langsung pasien IGD &amp; distribusi order medis</p>
      </div>

      <!-- Patient Header Banner -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-extrabold text-base flex items-center justify-center">
            ${qNum}
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-base font-extrabold text-slate-900">${p.nama} (${p.usia} th)</h3>
              <span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold inline-flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>${triaseLabel}</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#047857] text-[10px] font-bold border border-emerald-200/80">
                Sedang Ditangani Dokter
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span>ID Pasien: <strong class="text-slate-600">${p.id}</strong></span>
              <span>•</span>
              <span>No. RM: <strong class="text-slate-800">${p.rm}</strong></span>
              <span>•</span>
              <span>Bed: <strong class="text-[#047857]">${p.bed}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div class="lg:col-span-8 space-y-5">
          <!-- Keluhan Pasien -->
          <div class="bg-white rounded-2xl border border-slate-100 p-5">
            <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              <span class="text-amber-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6"/></svg>
              </span>
              <span>KELUHAN PASIEN</span>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs font-medium text-slate-700 leading-relaxed">
              ${p.keluhan}
            </div>
          </div>

          <!-- Catatan Pelayanan (Single Large Textarea Sesuai Desain Baru) -->
          <div class="bg-white rounded-2xl border border-slate-100 p-5">
            <div class="flex items-center gap-2 text-xs font-bold text-slate-800 pb-3 mb-4 border-b border-slate-100">
              <span class="text-[#047857]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h6"/><path d="M18.5 12.5l2 2-5.5 5.5H13v-2l5.5-5.5z"/></svg>
              </span>
              <span>Catatan Pelayanan</span>
            </div>
            <textarea rows="8" oninput="getPatient('${p.id}').catatanPelayanan=this.value"
              placeholder="Tuliskan catatan pemeriksaan fisik, subjektif, objektif, asesmen, dan instruksi pelayanan medis..."
              class="w-full p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs text-slate-700 leading-relaxed outline-none focus:bg-white focus:border-[#006a4e]">${p.catatanPelayanan}</textarea>
          </div>
        </div>

        <!-- Right Column: Pemesanan Cepat -->
        <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <div>
            <h3 class="text-sm font-bold text-slate-900">Pemesanan Cepat</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Akses langsung instruksi penanganan darurat</p>
          </div>
          <button onclick="navigate('pemesanan', { patientId: '${p.id}', pemesananStep: 'form', from: 'penanganan' })"
            class="w-full py-3.5 px-4 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition">
            ${ICONS.roleLab}
            <span>Order Lab + Obat</span>
          </button>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="mt-6 pt-5 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button onclick="saveDraftPenanganan('${p.id}')"
          class="px-5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
          Simpan Draft Rekam Medis
        </button>
        <button onclick="selesaiPenangananKeAdmin('${p.id}')"
          class="px-6 py-3 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm transition">
          <span>Selesai Penanganan &amp; Teruskan ke Administrasi</span>
          ${ICONS.arrowRight}
        </button>
      </div>
    </div>
  `;
}

function saveDraftPenanganan(pid) {
  const p = getPatient(pid);
  p.hasLabAndNotes = true;
  showToast(`Draft Catatan Pelayanan untuk ${p.nama} berhasil disimpan!`);
}

function selesaiPenangananKeAdmin(pid) {
  const p = getPatient(pid);
  p.hasLabAndNotes = true;
  p.statusDitangani = true;
  showToast(`Penanganan medis ${p.nama} selesai. Membuka Penyelesaian Administrasi.`);
  openAdminSelesai(pid);
}

// =========================================================================
// 8. SCREEN: PEMESANAN LAB CEPAT & OBAT DARURAT (Daftar Pasien -> Quick Order Set)
// =========================================================================
function selectProtocolPackage(pkgId) {
  S.selectedPackage = pkgId;
  S.orderItems = [...PACKAGES[pkgId].items];
  render();
}

function removeOrderItem(itemId) {
  S.orderItems = S.orderItems.filter(id => id !== itemId);
  render();
}

function submitMedicalOrder() {
  const p = getPatient();
  const selectedObjects = S.orderItems.map(id => CATALOG_ITEMS.find(x => x.id === id)).filter(Boolean);
  const labItems = selectedObjects.filter(x => x.type === 'lab');
  const obatItems = selectedObjects.filter(x => x.type === 'obat');

  // Buat atau update entri antrean di Lab LIS untuk pasien ini!
  const labTags = labItems.length >= 4
    ? labItems.map(x => x.name)
    : [
        'Troponin I Kuantitatif',
        'Darah Lengkap & Trombosit',
        'Elektrolit & GDS Cepat',
        'Analisis Gas Darah (BGA / AGD)'
      ];

  const existingLabIdx = S.labOrders.findIndex(o => o.patientId === p.id);
  const cleanName = p.nama.replace(/[^a-zA-Z0-9]/g, '_');
  const labOrderPayload = {
    patientId: p.id,
    waktuOrder: '10:30 WIB',
    noRegLab: `LAB-241001-${String(Math.floor(100 + Math.random() * 899))}`,
    items: labTags,
    uploaded: false,
    fileName: `Hasil_Pemeriksaan_Lab_CITO_${cleanName}.pdf`,
    fileSize: '245 KB',
    panicChecked: p.triase === 'merah',
    status: 'menunggu',
    catatanAnalis: 'Hasil CITO Troponin I terdeteksi tinggi (Panic Value). Sampel telah diverifikasi ulang metode hs-CLIA. Harap segera konfirmasi tindakan medis.'
  };

  if (existingLabIdx >= 0) {
    S.labOrders[existingLabIdx] = labOrderPayload;
  } else {
    S.labOrders.unshift(labOrderPayload);
  }

  S.selectedLabPatientId = p.id;
  S.lastSentOrderSummary = {
    patientId: p.id,
    waktuOrder: labOrderPayload.waktuOrder,
    labItems,
    obatItems
  };

  openModal('order-sent');
}

function renderPemesananPatientCard(p, index) {
  const numStr = String(index + 1).padStart(2, '0');
  const isMerah = p.triase === 'merah';
  const isKuning = p.triase === 'kuning';

  const numBadgeCls = isMerah
    ? 'bg-rose-50 text-rose-600'
    : 'bg-blue-50/80 text-blue-600';

  const triaseBadge = isMerah
    ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600">P1 - Merah</span>`
    : isKuning
    ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100/80 text-amber-800">P2 - Kuning</span>`
    : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100/80 text-[#047857]">P3 - Hijau</span>`;

  return `
    <div class="rounded-2xl border border-slate-100 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl ${numBadgeCls} flex items-center justify-center font-bold text-base shrink-0">
          ${numStr}
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h4 class="text-sm font-bold text-slate-900">${p.nama} (${p.usia} th)</h4>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            ${triaseBadge}
            <span class="font-medium text-slate-600">${p.bed}</span>
            <span class="text-slate-300">•</span>
            <span><span class="text-slate-400">ID Pasien:</span> <strong class="text-slate-700 font-semibold">${p.id}</strong></span>
            <span class="text-slate-300">•</span>
            <span><span class="text-slate-400">No. RM:</span> <strong class="text-slate-700 font-semibold">${p.rm}</strong></span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2.5 self-end sm:self-center shrink-0">
        <button onclick="navigate('pemesanan', { patientId: '${p.id}', pemesananStep: 'form', from: 'list' })"
          class="px-5 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition">
          <span>Pesan</span>
          ${ICONS.arrowRight}
        </button>
      </div>
    </div>
  `;
}

function renderPemesanan() {
  // STEP 1: Daftar Pasien di Pemesanan Lab (Sebelum masuk ke fitur pemesanan lab & obat)
  if (S.pemesananStep !== 'form') {
    const visiblePatients = S.patients.filter(p => p.activeInQueue).filter(p => {
      if (!S.searchQuery.trim()) return true;
      const q = S.searchQuery.toLowerCase();
      return (
        p.nama.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.rm.toLowerCase().includes(q)
      );
    });

    return `
      ${renderTopbar()}
      <div class="page-body">
        <div class="mb-5">
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Pemesanan Lab &amp; Obat</h2>
          <p class="text-xs font-medium text-slate-400 mt-0.5">Pilih pasien untuk pembuatan order laboratorium</p>
        </div>

        <div class="relative mb-5">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${ICONS.search}</span>
          <input type="text" value="${S.searchQuery}" oninput="S.searchQuery=this.value;render()"
            placeholder="Cari berdasarkan No. RM, Nama Pasien, atau ID Pasien..."
            class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-[#006a4e]" />
        </div>

        <div class="space-y-3">
          ${visiblePatients.map((p, idx) => renderPemesananPatientCard(p, idx)).join('')}
        </div>
      </div>
    `;
  }

  // STEP 2: Form Quick Order Set & Item Order CITO (Sesuai Desain Gambar)
  const p = getPatient();
  const activeItems = S.orderItems
    .map(id => CATALOG_ITEMS.find(i => i.id === id))
    .filter(Boolean);

  const backAction = S.pemesananFrom === 'penanganan'
    ? "navigate('penanganan')"
    : "navigate('pemesanan', { pemesananStep: 'list' })";

  const triaseBadge = p.triase === 'merah'
    ? `<span class="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span><span>P1 - Merah</span></span>`
    : p.triase === 'kuning'
    ? `<span class="px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 text-[10px] font-bold inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>P2 - Kuning</span></span>`
    : `<span class="px-2 py-0.5 rounded-full bg-emerald-100/80 text-[#047857] text-[10px] font-bold inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>P3 - Hijau</span></span>`;

  return `
    ${renderTopbar()}
    <div class="page-body space-y-5">
      <!-- Back Link + Header + Top-Right Submit Button (Sesuai Gambar) -->
      <div class="space-y-2">
        <button onclick="${backAction}"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-[#006a4e] hover:underline transition">
          ${ICONS.arrowLeft}
          <span>Kembali ke Antrean</span>
        </button>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Pemesanan Lab &amp; Obat</h2>
            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
              <span class="font-medium text-slate-600">${p.nama} (${p.usia} th)</span>
              <span class="text-slate-300">•</span>
              <span class="text-slate-500">${p.bed}</span>
              <span class="text-slate-300">•</span>
              ${triaseBadge}
            </div>
          </div>

          <button onclick="submitMedicalOrder()"
            class="px-5 py-3 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center gap-2.5 shadow-sm transition self-start sm:self-center">
            <span class="w-5 h-5 rounded-md bg-white/20 text-white text-[11px] font-extrabold flex items-center justify-center">${activeItems.length}</span>
            <span>Kirim ${activeItems.length} Order Medis</span>
            ${ICONS.arrowRight}
          </button>
        </div>
      </div>

      <!-- Two Columns: PILIH PROTOKOL / PAKET CEPAT & Item Order CITO -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-1">
        <!-- Left Column: PILIH PROTOKOL / PAKET CEPAT -->
        <div class="lg:col-span-5 space-y-3">
          <div class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
            PILIH PROTOKOL / PAKET CEPAT
          </div>

          ${Object.values(PACKAGES).map(pkg => {
            const isSelected = S.selectedPackage === pkg.id;
            return `
              <div onclick="selectProtocolPackage('${pkg.id}')"
                class="p-4 rounded-2xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-emerald-50/15 border-2 border-[#006a4e]'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-start gap-2">
                    <span class="w-2 h-2 rounded-full mt-1.5 shrink-0 ${isSelected ? 'bg-[#006a4e]' : 'bg-slate-300'}"></span>
                    <h4 class="text-xs font-extrabold text-slate-900 leading-snug">${pkg.name}</h4>
                  </div>
                  ${isSelected ? `
                    <span class="w-5 h-5 rounded-full bg-[#006a4e] text-white flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  ` : `
                    <span class="w-5 h-5 rounded-full border border-slate-300 shrink-0"></span>
                  `}
                </div>
                <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">${pkg.desc}</p>
                <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                  ${isSelected ? `
                    <span class="px-2.5 py-1 rounded-md bg-emerald-50 text-[#006a4e] inline-flex items-center gap-1">
                      <span>✓ ${pkg.items.length} Item Otomatis Terpilih</span>
                    </span>
                    <span class="text-[#006a4e]">Terpilih</span>
                  ` : `
                    <span class="text-slate-500">${pkg.badgeCount}</span>
                    <span class="text-slate-700">Pilih Paket</span>
                  `}
                </div>
              </div>
            `;
          }).join('')}

          <!-- 4th Card: Pesanan Manual Tanpa Paket (Dashed) -->
          <div onclick="openModal('tambah-item')"
            class="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#006a4e] cursor-pointer transition">
            <h4 class="text-xs font-extrabold text-slate-800">Pesanan Manual Tanpa Paket</h4>
            <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">Buat rincian pemeriksaan &amp; obat secara kustom</p>
            <div class="mt-3 flex justify-end">
              <button type="button" onclick="event.stopPropagation(); openModal('tambah-item')"
                class="px-3.5 py-1.5 rounded-xl bg-white text-[#006a4e] border border-slate-200 text-[11px] font-bold inline-flex items-center gap-1 hover:bg-emerald-50 transition">
                <span>+ Tambah Manual</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Item Order -->
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="space-y-3 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <span class="text-[#006a4e]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </span>
              <h3 class="text-sm font-extrabold text-slate-900">Item Order</h3>
              <span class="px-2.5 py-0.5 rounded-full bg-[#006a4e] text-white text-[10px] font-bold">
                ${activeItems.length} Item Terpilih
              </span>
            </div>
            <div>
              <button onclick="openModal('tambah-item')"
                class="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-bold inline-flex items-center gap-1.5 transition">
                <span class="text-[#006a4e]">${ICONS.plusCircle}</span>
                <span>Tambah Item Pemeriksaan</span>
              </button>
            </div>
          </div>

          <div class="divide-y divide-slate-100">
            ${activeItems.map(item => {
              const displayName = item.name === 'ISDN 5mg Sublingual'
                ? 'ISDN Sublingual'
                : item.name === 'Aspirin Kunyah 160mg'
                  ? 'Aspirin Kunyah'
                  : item.name;
              const doseLines = item.id === 'itm-4'
                ? '1 Tablet<br/>(5mg)'
                : item.id === 'itm-5'
                  ? '1 Dosis<br/>(160mg)'
                  : (item.dose || '');
              return `
                <div class="py-3.5 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3.5 min-w-0">
                    ${item.type === 'lab' ? `
                      <div class="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        ${ICONS.flask}
                      </div>
                    ` : `
                      <div class="w-9 h-9 rounded-xl bg-emerald-50 text-[#006a4e] flex items-center justify-center shrink-0">
                        ${ICONS.pillBox}
                      </div>
                    `}
                    <div class="text-xs font-extrabold text-slate-800">${displayName}</div>
                  </div>
                  <div class="flex items-center gap-2.5 shrink-0">
                    ${item.type === 'obat' ? `
                      <span class="px-3 py-1 rounded-lg bg-slate-50/70 border border-slate-200/90 text-[10px] font-bold text-slate-700 inline-flex items-center gap-2 text-center leading-tight">
                        <span>${doseLines}</span>
                        <span class="text-slate-400 text-[10px]">✎</span>
                      </span>
                    ` : ''}
                    <button onclick="removeOrderItem('${item.id}')" title="Hapus item"
                      class="w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center text-xs font-bold transition">
                      ✕
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 9. SCREEN: LABORATORIUM (LIS) — Daftar Tindakan & Input Hasil (Dinamis)
// =========================================================================
function getActiveLabOrder() {
  let ord = S.labOrders.find(o => o.patientId === S.selectedLabPatientId);
  if (!ord && S.labOrders.length > 0) {
    ord = S.labOrders[0];
    S.selectedLabPatientId = ord.patientId;
  }
  return ord;
}

function selectLabSample(patientId) {
  S.selectedLabPatientId = patientId;
  render();
}

function simulateLabFileUpload() {
  const ord = getActiveLabOrder();
  if (!ord) return;
  ord.uploaded = true;
  if (!ord.catatanAnalis || ord.catatanAnalis.trim() === '') {
    ord.catatanAnalis = 'Hasil CITO Troponin I terdeteksi tinggi (Panic Value). Sampel telah diverifikasi ulang metode hs-CLIA. Harap segera konfirmasi tindakan medis.';
  }
  showToast(`Berkas PDF "${ord.fileName}" berhasil diunggah & diverifikasi!`);
  render();
}

function togglePanicCheck() {
  const ord = getActiveLabOrder();
  if (!ord) return;
  ord.panicChecked = !ord.panicChecked;
  render();
}

function sendLabResult() {
  const ord = getActiveLabOrder();
  if (!ord) return;
  ord.uploaded = true;
  ord.status = 'selesai';
  const p = getPatient(ord.patientId);
  if (p) {
    p.hasLabAndNotes = true;
    p.labFileName = 'Hasil_Lab_CITO_Tn_Budi_Santoso.pdf';
    p.catatanAnalis = ord.catatanAnalis || 'Hasil CITO Troponin I terdeteksi tinggi (Panic Value). Sampel telah diverifikasi ulang metode hs-CLIA. Harap segera konfirmasi tindakan medis.';
    if (ord.panicChecked) {
      p.alarmKritis = true;
    }
  }
  openModal('lab-sent');
}

function renderLabLis() {
  const ord = getActiveLabOrder();
  const p = ord ? getPatient(ord.patientId) : getPatient();
  const uploaded = ord ? ord.uploaded : false;

  return `
    ${renderTopbar()}
    <div class="page-body space-y-5">
      <div>
        <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Laboratorium (LIS) — Daftar Tindakan &amp; Input Hasil</h2>
        <p class="text-xs text-slate-400 mt-0.5">Daftar sampel masuk dari IGD yang memerlukan pemeriksaan dan verifikasi</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left: Antrean Sampel Pasien (Sesuai Desain Gambar) -->
        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-extrabold text-slate-900">Antrean Sampel Pasien</h3>
          </div>

          <!-- Daftar Kartu Sampel Pasien -->
          <div class="space-y-3">
            ${S.labOrders.map(itemOrd => {
              const pt = getPatient(itemOrd.patientId);
              if (!pt) return '';
              const isSelected = itemOrd.patientId === S.selectedLabPatientId;
              const borderCls = isSelected
                ? 'border-2 border-[#006a4e] border-l-[5px] border-l-rose-600'
                : 'border border-slate-200 border-l-[4px] border-l-slate-300';

              return `
                <div onclick="selectLabSample('${pt.id}')"
                  class="p-4 rounded-2xl bg-white ${borderCls} space-y-3 cursor-pointer transition hover:shadow-sm">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h4 class="text-xs font-extrabold text-slate-900">${pt.nama} (${pt.usia} th)</h4>
                      <div class="text-[10px] text-slate-400 mt-0.5">ID: <strong class="text-slate-700">${pt.id}</strong> • ${pt.bed}</div>
                    </div>
                    <span class="px-2 py-0.5 rounded-lg ${
                      pt.triase === 'merah' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                      pt.triase === 'kuning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    } text-[9px] font-bold shrink-0">
                      ● ${pt.triase === 'merah' ? 'P1 - Merah' : pt.triase === 'kuning' ? 'P2 - Kuning' : 'P3 - Hijau'}
                    </span>
                  </div>

                  <div class="text-[10px] text-slate-600">
                    Order dari: <strong class="text-slate-800">${pt.dokter}</strong>
                  </div>

                  <div class="flex flex-wrap gap-1.5">
                    ${itemOrd.items.map(tag => `
                      <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/70">${tag}</span>
                    `).join('')}
                  </div>

                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                    ${itemOrd.status === 'selesai' ? `
                      <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-[#047857] border border-emerald-200 text-[10px] font-bold inline-flex items-center gap-1.5">
                        <span>✓</span>
                        <span>Hasil Terkirim ke IGD</span>
                      </span>
                    ` : `
                      <span class="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold inline-flex items-center gap-1.5">
                        ${ICONS.spinner}
                        <span>Sedang Diuji / Menunggu Hasil</span>
                      </span>
                    `}
                    <span class="text-[10px] font-extrabold text-[#006a4e]">${isSelected ? 'Dipilih →' : 'Pilih →'}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Selected Patient Lab Result Form -->
        <div class="lg:col-span-7 space-y-4">
          <!-- Patient Header Card -->
          <div class="bg-white rounded-2xl border border-slate-100 p-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-full ${p.triase === 'merah' ? 'bg-rose-50 border-2 border-rose-400 text-rose-600' : 'bg-emerald-50 border-2 border-emerald-400 text-[#047857]'} font-extrabold text-xs flex items-center justify-center shrink-0">
                ${p.triase === 'merah' ? 'P1' : p.triase === 'kuning' ? 'P2' : 'P3'}
              </div>
              <div>
                <h3 class="text-sm font-extrabold text-slate-900">${p.nama} (${p.usia} th)</h3>
                <div class="text-[10px] text-slate-500 mt-1">
                  <span class="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">ID: ${p.id}</span>
                  <div class="mt-1">Lokasi Pasien: <strong class="text-slate-800">${p.bed}</strong> • Dokter PJ: ${p.dokter}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lampiran Berkas PDF Hasil Pemeriksaan Lab -->
          <div class="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h4 class="text-xs font-extrabold text-slate-900">Lampiran Berkas PDF Hasil Pemeriksaan Lab</h4>
                <p class="text-[10px] text-slate-400 mt-0.5">Unggah atau lampirkan laporan resmi LIS format PDF bertanda tangan digital untuk dokter IGD.</p>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-200/60 inline-flex items-center gap-1">
                ${ICONS.pemesanan}
                <span>Format Dokumen Resmi (PDF)</span>
              </span>
            </div>

            <!-- Hidden File Input for real file picking -->
            <input id="labPdfInput" type="file" accept=".pdf,application/pdf" class="hidden"
              onchange="if(this.files[0]){ getActiveLabOrder().fileName = this.files[0].name; getActiveLabOrder().uploaded = true; render(); }" />

            ${!uploaded ? `
              <!-- Dropzone State (Sesuai Gambar) -->
              <div onclick="document.getElementById('labPdfInput').click()"
                class="border-2 border-dashed border-slate-200 hover:border-[#006a4e] rounded-2xl p-8 text-center space-y-3 cursor-pointer transition bg-slate-50/40">
                <div class="w-11 h-11 rounded-full bg-emerald-50 text-[#006a4e] mx-auto flex items-center justify-center">
                  ${ICONS.cloudUpload}
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-800">
                    Tarik &amp; lepas file PDF hasil lab di sini, atau <span class="text-[#006a4e] underline">Klik tombol di bawah</span>
                  </div>
                  <div class="text-[10px] text-slate-400 mt-1">Menelusuri dokumen dari komputer instrumen LIS (Maks. 15 MB)</div>
                </div>
                <div class="pt-1">
                  <button type="button" onclick="event.stopPropagation(); simulateLabFileUpload()"
                    class="px-4 py-2 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm transition">
                    <span>+ Pilih File PDF</span>
                  </button>
                </div>
                <div class="text-[10px] text-slate-400">Format didukung: PDF resmi bersertifikat LIS</div>
              </div>
            ` : `
              <!-- Uploaded & Verified PDF Preview Card (Sesuai Gambar) -->
              <div class="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/20 space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                      PDF
                    </div>
                    <div class="min-w-0">
                      <div class="text-xs font-extrabold text-slate-900 truncate">${ord.fileName}</div>
                      <div class="text-[10px] text-slate-400">Ukuran: <strong class="text-slate-600">${ord.fileSize}</strong></div>
                    </div>
                  </div>
                  <button type="button" onclick="ord.uploaded=false;render()" title="Klik untuk ganti file"
                    class="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shrink-0">
                    PDF Terverifikasi
                  </button>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-2">
                  <div class="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-100">
                    <span class="font-bold text-slate-600 inline-flex items-center gap-1.5">${ICONS.pemesanan} <span>Pratinjau Lembar Hasil Laboratorium</span></span>
                  </div>
                  <div class="flex items-start justify-between text-[10px]">
                    <div class="font-extrabold text-[#047857]">INSTALASI LABORATORIUM KLINIK &amp;<br/>PATOLOGI RS</div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-[10px] text-slate-600 pt-1">
                    <div>Pasien: <strong class="text-slate-800">${p.nama} (${p.usia} th)</strong></div>
                    <div>No RM: <strong class="text-slate-800">${p.rm}</strong></div>
                    <div>Ruang/Bed: <strong class="text-slate-800">${p.bed}</strong></div>
                    <div>Dokter Perujuk: <strong class="text-slate-800">${p.dokter}</strong></div>
                  </div>
                </div>
              </div>
            `}

            <!-- CATATAN ANALIS LAB Box (Sesuai Gambar) -->
            <div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
              <div class="text-[9px] font-bold uppercase tracking-wider text-slate-400">CATATAN ANALIS LAB</div>
              ${!uploaded ? `
                <input type="text" value="" oninput="if(getActiveLabOrder()) getActiveLabOrder().catatanAnalis=this.value"
                  placeholder="Tuliskan Catatan Analis"
                  class="w-full bg-transparent text-[11px] text-slate-600 placeholder-slate-500 outline-none" />
              ` : `
                <textarea rows="2" oninput="if(getActiveLabOrder()) getActiveLabOrder().catatanAnalis=this.value"
                  class="w-full bg-transparent text-[11px] text-slate-600 leading-relaxed outline-none resize-none">${ord.catatanAnalis || 'Hasil CITO Troponin I terdeteksi tinggi (Panic Value). Sampel telah diverifikasi ulang metode hs-CLIA. Harap segera konfirmasi tindakan medis.'}</textarea>
              `}
            </div>

            <!-- Panic Value Checkbox -->
            <div onclick="togglePanicCheck()"
              class="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex items-start gap-3 cursor-pointer select-none">
              <input type="checkbox" ${ord && ord.panicChecked ? 'checked' : ''} onclick="event.stopPropagation(); togglePanicCheck()"
                class="mt-0.5 w-4 h-4 accent-rose-600 rounded cursor-pointer" />
              <div class="text-xs">
                <div class="font-extrabold text-slate-900 flex flex-wrap items-center gap-2">
                  <span>Tandai Sebagai Nilai Kritis (Panic Value)</span>
                  <span class="px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-extrabold uppercase inline-flex items-center gap-1">
                    <span>⚠️ ALERT IGD</span>
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 mt-1">
                  ${uploaded
                    ? 'Notifikasi darurat dan lampiran berkas PDF ini akan langsung dikirim ke Dashboard Dokter IGD serta membunyikan alarm visual CITO.'
                    : 'Centang ini untuk mengirimkan notifikasi darurat ke dashboard Dokter IGD'}
                </p>
              </div>
            </div>
          </div>

          <!-- Footer Buttons -->
          <div class="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <button onclick="showToast('Draft pemeriksaan laboratorium disimpan sementara.')"
              class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
              Simpan Sementara
            </button>
            <button onclick="sendLabResult()"
              class="px-5 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition">
              <span>Kirim Dokumen Hasil (PDF) &amp; Picu Alert Dokter IGD</span>
              ${ICONS.arrowRight}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 10. SCREEN: PENYELESAIAN ADMINISTRASI PASIEN IGD (Update Data ke Semua Role)
// =========================================================================
function generateNewPermanentId() {
  const num = String(S.nextRegNumber++).padStart(3, '0');
  S.adminForm.newPermanentId = `IGD-2410-${num}`;
  showToast(`ID Permanen baru (${S.adminForm.newPermanentId}) berhasil di-generate!`);
  render();
}

function saveAdminPatientEdits() {
  const p = getPatient();
  const f = S.adminForm;
  p.nama = f.nama.trim() || p.nama;
  p.nik = f.nik.trim() || p.nik;
  p.kelamin = f.kelamin;
  p.kontak = f.kontak;
  p.alamat = f.alamat;
  showToast(`Perubahan identitas pasien "${p.nama}" berhasil diperbarui di seluruh Role!`);
  render();
}

function finalizeAdminPatient() {
  const p = getPatient();
  const f = S.adminForm;
  const oldId = p.id;
  const newId = f.newPermanentId.trim() || p.id;

  p.id = newId;
  p.nama = f.nama.trim() || p.nama;
  p.nik = f.nik.trim() || p.nik;
  p.kelamin = f.kelamin;
  p.kontak = f.kontak;
  p.alamat = f.alamat;
  p.alarmKritis = false;
  p.statusKunjunganAkhir = f.statusAkhir === 'rawat_inap'
    ? 'Transfer Ruang Rawat Inap / ICCU'
    : f.statusAkhir === 'pulang'
      ? 'Pulang / Rawat Jalan'
      : 'Rujuk ke RS Lain';

  // Hapus dari antrean aktif setelah diselesaikan (seperti gambar terakhir dimana Budi Santoso selesai & tersisa 2 pasien)
  p.activeInQueue = false;
  S.role = 'administrasi';

  // Update referensi di Lab LIS bila ada
  S.labOrders.forEach(o => {
    if (o.patientId === oldId) o.patientId = newId;
  });
  S.selectedPatientId = newId;

  openModal('admin-done');
}

function renderAdminSelesai() {
  const p = getPatient();
  const f = S.adminForm;
  const orderedObat = S.orderItems
    .map(id => CATALOG_ITEMS.find(x => x.id === id))
    .filter(x => x && x.type === 'obat');
  const obatList = orderedObat.length > 0
    ? orderedObat.map(o => o.name === 'ISDN 5mg Sublingual' ? 'ISDN Sublingual 5mg' : o.name)
    : ['ISDN Sublingual 5mg', 'Aspirin Kunyah 160mg'];

  return `
    ${renderTopbar()}
    <div class="page-body space-y-5">
      <!-- Back Link + Title (Sesuai Gambar Penyelesaian Administrasi Pasien IGD) -->
      <div class="space-y-2">
        <button onclick="navigate('pasien-igd')"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-[#006a4e] hover:underline transition">
          ${ICONS.arrowLeft}
          <span>Kembali ke Antrean Pasien</span>
        </button>
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Penyelesaian Administrasi Pasien IGD</h2>
          <p class="text-xs text-slate-400 mt-0.5">Pembaruan kelengkapan data identitas &amp; finalisasi tindakan medis selesai penanganan dokter.</p>
        </div>
      </div>

      <!-- Top Patient Card -->
      <div class="bg-white rounded-2xl border-l-4 border-l-[#006a4e] border border-slate-100 p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-base font-extrabold text-slate-900">${p.nama} (${p.usia} th)</h3>
              <span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold">
                ● Pasien ${p.tipe === 'darurat' ? 'Darurat' : 'Reguler'} Masuk IGD (${p.triase === 'merah' ? 'P1 - Merah' : p.triase === 'kuning' ? 'P2 - Kuning' : 'P3 - Hijau'})
              </span>
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-600 text-[10px]">${p.bed}</span>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-2">
              <span class="text-rose-600 font-extrabold uppercase">ID DARURAT (SEMENTARA):</span>
              <strong class="text-slate-800 font-bold">${p.id}</strong>
              <span class="text-slate-300">•</span>
              <span class="text-slate-400">No. RM:</span>
              <strong class="text-slate-700 font-bold">${p.rm}</strong>
            </div>
          </div>

          <div class="px-3.5 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[#006a4e] text-xs font-bold flex items-center gap-2">
            ${ICONS.checkCircle}
            <div>
              <div>Selesai Penanganan Medis</div>
              <div class="text-[10px] font-normal">oleh ${p.dokter}</div>
            </div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-700 flex items-center gap-2">
          <span class="text-[#006a4e]">${ICONS.pemesanan}</span>
          <span><strong class="text-slate-800">Catatan Pelayanan:</strong> "${p.catatanPelayanan.replace(/\n/g, ' ')}"</span>
        </div>
      </div>

      <!-- Hasil Laboratorium & Daftar Obat (Quick Order Set) -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="flex items-center gap-2 text-xs font-extrabold text-slate-900">
          <span class="text-[#006a4e]">${ICONS.flask}</span>
          <span>Hasil Laboratorium &amp; Daftar Obat (Quick Order Set)</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <!-- Left: Hasil Pemeriksaan Laboratorium (LIS) -->
          <div class="lg:col-span-7 rounded-2xl border border-slate-100 p-5 space-y-4 flex flex-col justify-between">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-50"></div>
                <div class="text-xs font-extrabold text-slate-900 leading-snug">
                  Hasil Pemeriksaan<br/>Laboratorium (LIS)
                </div>
              </div>
              <span class="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-bold leading-tight">
                Panic Value<br/>Terdeteksi
              </span>
            </div>

            <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
              <div class="text-[9px] font-bold uppercase tracking-wider text-slate-400">CATATAN ANALIS LAB</div>
              <p class="text-[11px] text-slate-600 leading-relaxed">
                ${p.catatanAnalis || 'Hasil CITO Troponin I terdeteksi tinggi (Panic Value). Sampel telah diverifikasi ulang metode hs-CLIA. Harap segera konfirmasi tindakan medis.'}
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-white border border-slate-100 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  ${ICONS.idCard}
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-extrabold text-slate-900 truncate">${p.labFileName || 'Hasil_Lab_CITO_Tn_Budi_Sa.pdf'}</div>
                  <div class="text-[10px] text-slate-400 leading-tight mt-0.5">245 KB • Terverifikasi Digital<br/>LIS</div>
                </div>
              </div>
              <button type="button" onclick="showToast('Mengunduh berkas ${p.labFileName}...')"
                class="px-3.5 py-2 rounded-xl bg-[#047857] hover:bg-[#006a4e] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0 transition">
                ${ICONS.download}
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>

          <!-- Right: DAFTAR OBAT -->
          <div class="lg:col-span-5 rounded-2xl bg-slate-50/60 border border-slate-100 p-5 space-y-3">
            <div class="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
              <span class="w-2 h-2 rounded-full bg-[#047857]"></span>
              <span>DAFTAR OBAT</span>
            </div>
            <div class="space-y-2.5">
              ${obatList.map(medName => `
                <div class="p-3.5 rounded-xl bg-white border border-slate-100 text-xs font-extrabold text-slate-800">
                  ${medName}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Konversi & Validasi ID Pasien IGD -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-extrabold text-slate-900">
            <span class="text-[#006a4e]">⇄</span>
            <span>Konversi &amp; Validasi ID Pasien IGD</span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006a4e] border border-emerald-200 text-[10px] font-bold">
            ✓ Validasi Administrasi
          </span>
        </div>

        <!-- Single Full-Width Box Sesuai Gambar -->
        <div class="p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 space-y-2.5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-800">
            <span class="inline-flex items-center gap-1.5">
              <span class="text-slate-500">${ICONS.pasien}</span>
              <span>Cek / Cari ID Pasien Tetap yang Sudah Ada</span>
            </span>
            <span class="text-[10px] text-slate-400">Pasien Lama</span>
          </div>
          <p class="text-[11px] text-slate-400">Cari berdasarkan ID Pasien atau NIK</p>
          <div class="flex gap-2">
            <input type="text" value="${f.searchNik}" oninput="S.adminForm.searchNik=this.value"
              class="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
            <button type="button" onclick="generateNewPermanentId()"
              class="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition">
              ${ICONS.search}
              <span>Cek Data Pasien</span>
            </button>
          </div>
          <div class="text-[10px] font-semibold text-[#006a4e]">✓ Data riwayat pasien ditemukan</div>
        </div>
      </div>

      <!-- Kelengkapan & Edit Data Pasien (2-Column Grid Sesuai Gambar) -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-extrabold text-slate-900">
            <span class="text-[#006a4e]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h6"/><path d="M18.5 12.5l2 2-5.5 5.5H13v-2l5.5-5.5z"/></svg>
            </span>
            <span>Kelengkapan &amp; Edit Data Pasien</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-600 mb-1.5">Nama Lengkap</label>
            <input type="text" value="${f.nama}" oninput="S.adminForm.nama=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-600 mb-1.5">NIK / No. KTP</label>
            <input type="text" value="${f.nik}" oninput="S.adminForm.nik=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-600 mb-1.5">Jenis Kelamin</label>
            <select onchange="S.adminForm.kelamin=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none">
              <option value="Laki-laki" ${f.kelamin === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
              <option value="Perempuan" ${f.kelamin === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-600 mb-1.5">Tanggal Lahir / Usia</label>
            <input type="text" value="${f.tglLahir}" oninput="S.adminForm.tglLahir=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-600 mb-1.5">Kontak</label>
            <input type="text" value="${f.kontak}" oninput="S.adminForm.kontak=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-600 mb-1.5">Alamat Lengkap</label>
            <input type="text" value="${f.alamat}" oninput="S.adminForm.alamat=this.value"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-600 mb-1.5">ID Pasien</label>
            <input type="text" value="${f.newPermanentId || 'IGD-2410-001'}" oninput="S.adminForm.newPermanentId=this.value"
              placeholder="IGD-2410-001"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#006a4e]" />
            <div class="text-[10px] text-slate-400 mt-1">Otomatis digenerate jika tidak ditemukan</div>
          </div>
        </div>

        <div class="flex justify-end pt-1">
          <button type="button" onclick="saveAdminPatientEdits()"
            class="px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-[#006a4e] border border-[#006a4e]/40 text-xs font-bold inline-flex items-center gap-1.5 transition">
            ${ICONS.pemesanan}
            <span>Simpan Perubahan Data</span>
          </button>
        </div>
      </div>

      <!-- Finalisasi Status & Penyelesaian Kunjungan -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="flex items-center gap-2 text-xs font-extrabold text-slate-900">
          <span class="text-[#006a4e]">${ICONS.checkCircle}</span>
          <span>Finalisasi Status &amp; Penyelesaian Kunjungan</span>
        </div>

        <div>
          <div class="text-[10px] font-bold text-slate-600 mb-2">Status Akhir Pasien:</div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button type="button" onclick="S.adminForm.statusAkhir='rawat_inap';render()"
              class="p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                f.statusAkhir === 'rawat_inap' ? 'border-2 border-[#006a4e] bg-emerald-50/10' : 'border-slate-200 hover:bg-slate-50'
              }">
              <span class="w-4 h-4 rounded-full border-2 ${f.statusAkhir === 'rawat_inap' ? 'border-[#006a4e] bg-[#006a4e]' : 'border-slate-300'} flex items-center justify-center shrink-0">
                ${f.statusAkhir === 'rawat_inap' ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : ''}
              </span>
              <span class="text-[#006a4e] shrink-0">${ICONS.pillBox}</span>
              <span class="text-xs font-bold text-slate-800">Transfer Ruang Rawat Inap / ICCU</span>
            </button>

            <button type="button" onclick="S.adminForm.statusAkhir='pulang';render()"
              class="p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                f.statusAkhir === 'pulang' ? 'border-2 border-[#006a4e] bg-emerald-50/10' : 'border-slate-200 hover:bg-slate-50'
              }">
              <span class="w-4 h-4 rounded-full border-2 ${f.statusAkhir === 'pulang' ? 'border-[#006a4e] bg-[#006a4e]' : 'border-slate-300'} flex items-center justify-center shrink-0">
                ${f.statusAkhir === 'pulang' ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : ''}
              </span>
              <span class="text-slate-400 shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700">Pulang / Rawat Jalan</span>
            </button>

            <button type="button" onclick="S.adminForm.statusAkhir='rujuk';render()"
              class="p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                f.statusAkhir === 'rujuk' ? 'border-2 border-[#006a4e] bg-emerald-50/10' : 'border-slate-200 hover:bg-slate-50'
              }">
              <span class="w-4 h-4 rounded-full border-2 ${f.statusAkhir === 'rujuk' ? 'border-[#006a4e] bg-[#006a4e]' : 'border-slate-300'} flex items-center justify-center shrink-0">
                ${f.statusAkhir === 'rujuk' ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : ''}
              </span>
              <span class="text-slate-400 shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700">Rujuk ke RS Lain</span>
            </button>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-[#f4f7fe] border border-slate-100 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
          <input type="checkbox" checked class="w-4 h-4 accent-[#006a4e] rounded" />
          <span>Dokter telah menyelesaikan seluruh tindakan medis, berkas RME &amp; hasil lab lengkap.</span>
        </div>

        <div class="pt-2 flex items-center justify-between">
          <button type="button" onclick="navigate('pasien-igd')"
            class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
            Batal
          </button>
          <button type="button" onclick="finalizeAdminPatient()"
            class="px-6 py-3 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition">
            <span>Selesaikan Tindakan &amp; Tutup Administrasi</span>
            ${ICONS.arrowRight}
          </button>
        </div>
      </div>
    </div>
  `;
}


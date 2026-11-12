// =========================================================================
// 11. MODALS (5 Modal Interaktif yang Terhubung Penuh dengan Data Pasien)
// =========================================================================
function toggleModalAddItem(itemId) {
  if (S.modalSelectedNewItems.includes(itemId)) {
    S.modalSelectedNewItems = S.modalSelectedNewItems.filter(id => id !== itemId);
  } else {
    S.modalSelectedNewItems.push(itemId);
  }
  renderModal();
}

function confirmModalAddItem() {
  S.modalSelectedNewItems.forEach(id => {
    if (!S.orderItems.includes(id)) {
      S.orderItems.push(id);
    }
  });
  showToast(`${S.modalSelectedNewItems.length} item berhasil ditambahkan ke Rincian Order!`);
  closeModal();
}

function renderModal() {
  const modalRoot = document.getElementById('modalRoot');
  if (!S.modal) {
    modalRoot.innerHTML = '';
    return;
  }

  const p = getPatient();

  // MODAL 1: Tambah Item Pemeriksaan / Obat (Sesuai Gambar media_1793667280477_9b310d8a.png)
  if (S.modal === 'tambah-item') {
    const extraCatalog = CATALOG_ITEMS.filter(item => {
      // Tampilkan item tambahan di luar 5 item paket dasar ACS kecuali sedang dicari
      if (!S.modalAddSearch.trim() && ['itm-1', 'itm-2', 'itm-3', 'itm-4', 'itm-5'].includes(item.id)) return false;
      if (S.modalAddFilter === 'lab' && item.type !== 'lab') return false;
      if (S.modalAddFilter === 'obat' && item.type !== 'obat') return false;
      if (S.modalAddSearch.trim()) {
        const q = S.modalAddSearch.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      }
      return true;
    });

    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
        <div class="modal-card max-w-lg p-6 space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-50 text-[#006a4e] flex items-center justify-center shrink-0">
                ${ICONS.plusCircle}
              </div>
              <div>
                <h3 class="text-base font-extrabold text-slate-900">Tambah Item Pemeriksaan / Obat</h3>
                <p class="text-[11px] text-slate-400">Pilih pemeriksaan penunjang atau obat darurat tambahan</p>
              </div>
            </div>
            <button onclick="closeModal()" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center">✕</button>
          </div>

          <!-- Search -->
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${ICONS.search}</span>
            <input type="text" value="${S.modalAddSearch}" oninput="S.modalAddSearch=this.value;renderModal()"
              placeholder="Cari nama pemeriksaan lab atau obat..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs text-slate-700 outline-none focus:bg-white focus:border-[#006a4e]" />
          </div>

          <!-- Category Tabs -->
          <div class="flex flex-wrap gap-2">
            ${[
              { id: 'semua', label: 'Semua' },
              { id: 'lab', label: 'Laboratorium' },
              { id: 'obat', label: 'Obat Darurat' }
            ].map(tab => `
              <button onclick="S.modalAddFilter='${tab.id}';renderModal()"
                class="px-3.5 py-1.5 rounded-full text-[11px] font-bold transition ${
                  S.modalAddFilter === tab.id ? 'bg-[#006a4e] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }">
                ${tab.label}
              </button>
            `).join('')}
          </div>

          <!-- Item List -->
          <div class="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            ${extraCatalog.map(item => {
              const alreadyInOrder = S.orderItems.includes(item.id);
              const isChecked = S.modalSelectedNewItems.includes(item.id);
              const isSelectedRow = alreadyInOrder || isChecked;
              return `
                <div onclick="${alreadyInOrder ? '' : `toggleModalAddItem('${item.id}')`}"
                  class="py-3.5 flex items-center justify-between gap-3 cursor-pointer transition hover:bg-slate-50/50">
                  <div class="flex items-center gap-3 min-w-0">
                    ${isSelectedRow ? `
                      <div class="w-8 h-8 rounded-lg bg-[#006a4e] text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                    ` : item.type === 'lab' ? `
                      <div class="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">${ICONS.flask}</div>
                    ` : `
                      <div class="w-8 h-8 rounded-lg bg-emerald-50 text-[#006a4e] flex items-center justify-center shrink-0">${ICONS.pillBox}</div>
                    `}
                    <div class="text-xs font-extrabold text-slate-800">${item.name}</div>
                  </div>
                  <div class="shrink-0">
                    ${isSelectedRow ? `
                      <span class="px-2 py-1 text-[#006a4e] text-[11px] font-bold">Terpilih</span>
                    ` : `
                      <span class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold">+ Pilih</span>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Footer -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-500"><strong class="text-[#006a4e]">${S.modalSelectedNewItems.length} item baru</strong> dipilih</span>
            <div class="flex items-center gap-2">
              <button onclick="closeModal()" class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">Batal</button>
              <button onclick="confirmModalAddItem()" class="px-4 py-2 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center gap-1.5">
                <span>+ Tambahkan (+${S.modalSelectedNewItems.length}) ke Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // MODAL 2: Order Medis Berhasil Dikirim (Sesuai Gambar)
  if (S.modal === 'order-sent') {
    const defaultLab4 = CATALOG_ITEMS.filter(x => ['itm-1', 'itm-2', 'itm-3', 'itm-6'].includes(x.id));
    const defaultObat2 = CATALOG_ITEMS.filter(x => ['itm-4', 'itm-5'].includes(x.id));
    const summary = S.lastSentOrderSummary || {
      patientId: p.id,
      waktuOrder: '10:30 WIB',
      labItems: defaultLab4,
      obatItems: defaultObat2
    };
    const pt = getPatient(summary.patientId);
    const labList = summary.labItems.length >= 4 ? summary.labItems : defaultLab4;
    const obatList = summary.obatItems.length > 0 ? summary.obatItems : defaultObat2;

    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
        <div class="modal-card max-w-xl overflow-hidden border-t-4 border-t-[#006a4e] p-6 space-y-5">
          <div class="text-center space-y-2.5">
            <div class="w-16 h-16 rounded-full bg-emerald-50/70 border border-emerald-300 mx-auto flex items-center justify-center">
              <div class="w-9 h-9 rounded-full bg-[#006a4e] text-white flex items-center justify-center text-base font-bold">✓</div>
            </div>
            <h3 class="text-lg font-extrabold text-slate-900">Order Medis Berhasil Dikirim</h3>
          </div>

          <div class="px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span class="font-bold text-[#006a4e] flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-100"></span>
              <span>Data Tersimpan</span>
            </span>
            <span class="text-slate-600 font-medium inline-flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Waktu Order: 01 - 01 - 2026 <strong class="text-slate-800">(10:30 WIB)</strong></span>
            </span>
          </div>

          <!-- Patient & Item Breakdown -->
          <div class="rounded-2xl border border-slate-200/80 overflow-hidden">
            <div class="p-4 space-y-4">
              <div class="pb-3 border-b border-slate-100">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="text-sm font-extrabold text-slate-900">${pt.nama}</h4>
                  <span class="text-xs text-slate-500">(${pt.usia} th)</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-white text-rose-600 border border-rose-300 text-[10px] font-bold">
                    ● ${pt.triase === 'merah' ? 'P1 - Merah' : pt.triase === 'kuning' ? 'P2 - Kuning' : 'P3 - Hijau'}
                  </span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">
                  No. RM: <strong class="text-slate-800">${pt.rm}</strong> &nbsp;•&nbsp; ID Pasien: <strong class="text-slate-800">${pt.id}</strong>
                </div>
              </div>

              <!-- Pemeriksaan Lab CITO -->
              <div class="space-y-2.5">
                <div class="flex items-center justify-between text-[11px] font-extrabold">
                  <span class="text-slate-800 inline-flex items-center gap-1.5">
                    <span class="text-[#006a4e]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    </span>
                    <span>${labList.length} Pemeriksaan Lab CITO</span>
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  ${labList.map(li => {
                    const displayName = li.name === 'Darah Lengkap & Trombosit'
                      ? 'Darah Lengkap dan Trombosit'
                      : li.name === 'Elektrolit & GDS Cepat'
                        ? 'Elektrolit & GDS CEPAT'
                        : li.name;
                    return `
                      <div class="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                          <span class="w-2.5 h-2.5 rounded-full ${li.dot || 'bg-rose-500'}"></span>
                          <div class="text-[11px] font-bold text-slate-800">${displayName}</div>
                        </div>
                        <span class="text-[#006a4e] text-xs font-bold">✓</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Obat Darurat Farmasi -->
              ${obatList.length > 0 ? `
                <div class="space-y-2.5 pt-2 border-t border-slate-100">
                  <div class="flex items-center justify-between text-[11px] font-extrabold">
                    <span class="text-slate-800 inline-flex items-center gap-1.5">
                      <span class="text-[#006a4e]">${ICONS.pillBox}</span>
                      <span>${obatList.length} Obat Darurat Farmasi IGD</span>
                    </span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    ${obatList.map(oi => {
                      const medTitle = oi.name === 'ISDN 5mg Sublingual'
                        ? 'ISDN Sublingual 5 mg'
                        : oi.name === 'Aspirin Kunyah 160mg'
                          ? 'Aspirin Kunyah 160 mg'
                          : oi.name;
                      return `
                        <div class="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <span class="text-[#006a4e]">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5 10 21a4.95 4.95 0 1 1-7-7l11-11a4.95 4.95 0 1 1 7 7l-10.5 10.5Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>
                            </span>
                            <div class="text-[11px] font-bold text-slate-800">${medTitle}</div>
                          </div>
                          <span class="text-[#006a4e] text-xs font-bold">✓</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
            <div class="h-3.5 bg-[#f4f7fb] border-t border-slate-100"></div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            <button onclick="closeModal(); navigate('dashboard')"
              class="px-5 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm">
              <span>← Kembali ke Antrean Pasien IGD</span>
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // MODAL 3: Hasil Lab Berhasil Dikirim (Sesuai Gambar)
  if (S.modal === 'lab-sent') {
    const ord = getActiveLabOrder();
    const pt = ord ? getPatient(ord.patientId) : p;

    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
        <div class="modal-card max-w-md p-6 text-center space-y-4 relative">
          <button onclick="closeModal()" class="absolute right-4 top-4 w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center text-xs">✕</button>
          <div class="w-14 h-14 rounded-full bg-[#006a4e] border-4 border-emerald-100 text-white mx-auto flex items-center justify-center text-xl font-bold">
            ✓
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-extrabold text-slate-900">Hasil Lab Berhasil Dikirim</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Dokumen PDF hasil uji lab <strong class="text-slate-800">${pt.nama}</strong> telah terkirim
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-left space-y-3 text-xs">
            <div class="flex items-center justify-between text-[11px] pb-2.5 border-b border-slate-200/60">
              <span class="text-slate-500 inline-flex items-center gap-1.5">${ICONS.idCard} <span>No. Rekam Medis</span></span>
              <span><strong class="text-slate-900">${pt.rm}</strong> <span class="text-slate-400">(ID: <strong class="text-slate-800">${pt.id}</strong>)</span></span>
            </div>
            <div class="flex items-center justify-between text-[11px] pb-2.5 border-b border-slate-200/60">
              <span class="text-slate-500 inline-flex items-center gap-1.5">${ICONS.pemesanan} <span>File Terkirim</span></span>
              <div class="text-right">
                <div class="font-bold text-slate-800 truncate max-w-[210px]">${pt.labFileName || (ord && ord.fileName)}</div>
                <div class="text-[10px] text-slate-400">(245 KB)</div>
              </div>
            </div>
            <div class="flex items-center justify-between gap-2 text-[11px] pb-2.5 border-b border-slate-200/60">
              <span class="text-slate-500 inline-flex items-center gap-1.5 shrink-0">
                <span class="text-rose-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </span>
                <span>Status Alert<br/>Kritis</span>
              </span>
              <div class="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold min-w-[200px]">
                ● Peringatan Panic Value Terkirim
              </div>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500 inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Waktu Pengiriman</span>
              </span>
              <strong class="text-slate-800">01 - 01 - 2026 (10:42 WIB)</strong>
            </div>
          </div>

          <button onclick="closeModal(); navigate('dashboard')"
            class="w-full py-3 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm transition">
            <span>Selesai &amp; Lanjut Antrean Berikutnya</span>
            ${ICONS.arrowRight}
          </button>
        </div>
      </div>
    `;
    return;
  }

  // MODAL 4: Peringatan Nilai Kritis (Panic Value) - Sesuai Gambar media_1793541406175_c4d76f42.png
  if (S.modal === 'panic-alert') {
    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
        <div class="modal-card max-w-lg overflow-hidden">
          <!-- Red Header -->
          <div class="bg-[#c81e1e] text-white px-5 py-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-white text-[#c81e1e] flex items-center justify-center shrink-0">
                ${ICONS.alertTriangle}
              </div>
              <h3 class="text-sm font-extrabold leading-snug">Peringatan Nilai Kritis</h3>
            </div>
            <button onclick="closeModal()" class="w-7 h-7 rounded-full hover:bg-white/20 text-white/90 flex items-center justify-center text-xs">✕</button>
          </div>

          <div class="p-5 space-y-3.5">
            <!-- Patient Box -->
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-emerald-50 text-[#006a4e] flex items-center justify-center shrink-0">
                  ${ICONS.pasien}
                </div>
                <div>
                  <div class="text-sm font-extrabold text-slate-900">${p.nama} (${p.usia} th)</div>
                  <div class="text-[11px] text-slate-500">No. RM: <strong class="text-slate-800">${p.rm}</strong></div>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full bg-white border border-rose-300 text-rose-600 text-[10px] font-bold inline-flex items-center gap-1.5 shrink-0">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                <span>${p.bed} (P1 Merah)</span>
              </span>
            </div>

            <!-- Lampiran Hasil Lab (PDF) -->
            <div class="p-3.5 rounded-xl bg-white border border-rose-200/80 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <span class="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-[10px] flex items-center justify-center shrink-0">PDF</span>
                <div class="min-w-0">
                  <div class="text-xs font-extrabold text-slate-900 truncate">${p.labFileName}</div>
                  <div class="text-[10px] text-slate-400">Ukuran: 245 KB</div>
                </div>
              </div>
              <button onclick="showToast('Membuka dokumen ${p.labFileName}...')"
                class="px-3.5 py-2 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0 transition">
                ${ICONS.eye}
                <span>Buka File PDF</span>
              </button>
            </div>

            <!-- Catatan Analis Laboratorium -->
            <div class="p-3.5 rounded-xl border border-rose-200/80 bg-rose-50/40 space-y-1">
              <div class="text-[11px] font-extrabold text-rose-700 inline-flex items-center gap-1.5">
                <span>📋</span>
                <span>Catatan Analis Laboratorium</span>
              </div>
              <p class="text-[11px] text-slate-700 leading-relaxed">
                Hasil CITO Troponin I terdeteksi tinggi (Panic Value). Sampel telah diverifikasi ulang dengan metode hs-CLIA. Harap segera konfirmasi tindakan medis.
              </p>
            </div>

            <!-- Footer Buttons -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button onclick="closeModal()"
                class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">
                Tutup
              </button>
              <button onclick="p.alarmKritis=false; p.hasLabAndNotes=true; closeModal(); navigate('detail', { patientId: '${p.id}' })"
                class="px-5 py-2.5 rounded-xl bg-[#c81e1e] hover:bg-rose-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition">
                ${ICONS.checkCircle}
                <span>Konfirmasi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // MODAL 5: Penyelesaian Tindakan & Administrasi Berhasil! (Sesuai Gambar)
  if (S.modal === 'admin-done') {
    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
        <div class="modal-card max-w-md p-6 text-center space-y-4">
          <div class="w-14 h-14 rounded-full bg-[#006a4e] border-4 border-emerald-100 text-white mx-auto flex items-center justify-center text-xl font-bold">
            ✓
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-extrabold text-slate-900 leading-snug">Penyelesaian Tindakan &amp; Administrasi<br/>Berhasil!</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Data identitas ${p.nama} telah diperbarui dan tindakan medis IGD telah difinalisasi secara tuntas.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-left space-y-3 text-xs">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
                <span class="text-[#006a4e]">${ICONS.pasien}</span>
                <span>${p.nama}<br/>(${p.usia} th)</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-2 py-1 rounded bg-[#e0e7ff]/70 text-slate-800 text-[10px] font-extrabold leading-tight">ID: IGD-<br/>2410-001</span>
                <span class="px-2 py-1 rounded bg-[#e0e7ff]/70 text-slate-800 text-[10px] font-extrabold leading-tight">RM: RM-2024-<br/>8841</span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-white border border-slate-200/70 flex items-start gap-2.5">
              <span class="text-[#006a4e] mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
              </span>
              <div>
                <div class="text-[10px] text-slate-400">Status Akhir:</div>
                <div class="text-xs font-extrabold text-slate-900 mt-0.5">${p.statusKunjunganAkhir || 'Transfer Ruang Rawat Inap / ICCU'}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-[11px] pt-1">
              <div class="flex items-start gap-1.5">
                <span class="text-slate-400 mt-0.5">${ICONS.roleDokter}</span>
                <div>
                  <div class="text-slate-400">Dokter DPJP:</div>
                  <div class="font-bold text-slate-800 mt-0.5">${p.dokter}</div>
                  <span class="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100/80 text-[#006a4e] text-[9px] font-bold">Tindakan Selesai</span>
                </div>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-slate-400 mt-0.5">${ICONS.idCard}</span>
                <div>
                  <div class="text-slate-400">Petugas Administrasi:</div>
                  <div class="font-bold text-slate-800 mt-0.5">Siti Rahma, S.Sos</div>
                </div>
              </div>
            </div>

            <div class="pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
              <span class="text-slate-400 inline-flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Waktu Selesai:</span>
              </span>
              <strong class="text-slate-800">01 - 01 - 2026 , 18:30 WIB</strong>
            </div>
          </div>

          <button onclick="closeModal(); navigate('dashboard')"
            class="w-full py-3 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm transition">
            <span>Kembali ke Antrean Pasien</span>
            ${ICONS.arrowRight}
          </button>
        </div>
      </div>
    `;
    return;
  }
}

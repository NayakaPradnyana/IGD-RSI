// =========================================================================
// STATE & DATA MASTER DINAMIS (Terhubung penuh antar Role)
// =========================================================================
const ROLES = {
  administrasi: {
    id: 'administrasi',
    name: 'Siti Rahma, S.Sos',
    altName: 'Budi Santoso, S.Kom',
    title: 'Petugas Administrasi',
    initials: 'SR',
    nip: '19910314'
  },
  perawat: {
    id: 'perawat',
    name: 'Ns. Siti Rahma, S.Kep',
    title: 'Perawat Triage',
    initials: 'SR',
    nip: '19930821'
  },
  dokter: {
    id: 'dokter',
    name: 'dr. Farhan Malik, Sp.EM',
    title: 'Dokter',
    initials: 'FM',
    nip: '19890412'
  },
  lab: {
    id: 'lab',
    name: 'Analis Siti Rahmah, A.Md.AK',
    title: 'Petugas Lab Jaga Sentral',
    initials: 'SR',
    nip: '19941102'
  }
};

const CATALOG_ITEMS = [
  { id: 'itm-1', name: 'Troponin I Kuantitatif', shortTag: 'Troponin I (Darah)', category: 'darah', desc: 'Serum Darah (Tutup Merah) • Analyzer Serologi', sampleShort: 'Serum • CITO', type: 'lab', dot: 'bg-rose-500' },
  { id: 'itm-2', name: 'Darah Lengkap & Trombosit', shortTag: 'Hb & Darah Lengkap', category: 'darah', desc: 'Darah EDTA (Tutup Ungu) • Hematologi Otomatis', sampleShort: 'EDTA Whole Blood • CITO', type: 'lab', dot: 'bg-purple-500' },
  { id: 'itm-3', name: 'Elektrolit & GDS Cepat', shortTag: 'Elektrolit & GDS', category: 'darah', desc: 'Serum Kimia (Na, K, Cl, Glukosa Sewaktu)', sampleShort: 'Na, K, Cl & Glukosa Sewaktu', type: 'lab', dot: 'bg-blue-500' },
  { id: 'itm-4', name: 'ISDN 5mg Sublingual', shortTag: 'ISDN 5mg', category: 'obat', desc: 'Rute: Sublingual di bawah lidah • Vasodilat', dose: '1 Tablet (5mg)', statDose: '1 Tab Segera (STAT)', type: 'obat' },
  { id: 'itm-5', name: 'Aspirin Kunyah 160mg', shortTag: 'Aspirin 160mg', category: 'obat', desc: 'Rute: Oral Kunyah (Loading Dose) • Ant', dose: '1 Dosis (160mg)', statDose: '2 Tab Dosis Awal (STAT)', type: 'obat' },
  { id: 'itm-6', name: 'Analisis Gas Darah (BGA / AGD)', shortTag: 'Analisis Gas Darah (BGA / AGD)', category: 'darah', desc: 'Sampel: Darah Arteri Spuit Heparin (Cito)', sampleShort: 'Darah Arteri • Suhu 37°C', type: 'lab', dot: 'bg-emerald-500' },
  { id: 'itm-7', name: 'Profil Lipid Lengkap', shortTag: 'Profil Lipid Lengkap', category: 'darah', desc: 'Kolesterol Total, HDL, LDL, Trigliserida', sampleShort: 'Serum Kimia', type: 'lab', dot: 'bg-amber-500' },
  { id: 'itm-8', name: 'PT / APTT (Koagulasi Darah)', shortTag: 'PT / APTT (Koagulasi Darah)', category: 'darah', desc: 'Sampel: Darah Citrat (Tutup Biru Terang)', sampleShort: 'Plasma Citrat', type: 'lab', dot: 'bg-cyan-500' },
  { id: 'itm-9', name: 'Furosemide', shortTag: 'Furosemide', category: 'obat', desc: 'Rute: IV Bolus Perlahan', dose: '1 Ampul<br/>(20mg)', statDose: '1 Ampul IV (STAT)', type: 'obat' },
  { id: 'itm-10', name: 'Clopidogrel', shortTag: 'Clopidogrel', category: 'obat', desc: 'Rute: Oral (Antiplatelet Sekunder)', dose: '4 Tablet<br/>(300mg)', statDose: '4 Tab Loading (STAT)', type: 'obat' }
];

const PACKAGES = {
  acs: {
    id: 'acs',
    name: 'Paket Sindrom Koroner Akut (ACS / STEMI)',
    desc: 'Protokol nyeri dada darurat: Serial marker jantung, hematologi lengkap, dan medikasi vasodilator awal.',
    badgeCount: '5 Item Otomatis Terpilih',
    items: ['itm-1', 'itm-2', 'itm-3', 'itm-4', 'itm-5']
  },
  stroke: {
    id: 'stroke',
    name: 'Paket Stroke Akut & Defisit Neurologis',
    desc: 'Skrining koagulasi mendesak, profil hemostasis lengkap, dan osmoterapi terukur.',
    badgeCount: '4 Pemeriksaan Lab',
    items: ['itm-2', 'itm-3', 'itm-6', 'itm-8']
  },
  sepsis: {
    id: 'sepsis',
    name: 'Paket Syok & Sepsis Resusitasi',
    desc: 'Laktat serial, analisis gas darah (BGA), kultur mikrobiologi, dan kristaloid resusitasi.',
    badgeCount: '6 Pemeriksaan Lab',
    items: ['itm-1', 'itm-2', 'itm-3', 'itm-6', 'itm-8', 'itm-9']
  }
};

// Master Database Pasien untuk fitur "Cek Data" di Registrasi Biasa
const MASTER_PATIENT_DB = {
  'IGD-2410-002': {
    idPasien: 'IGD-2410-002',
    nama: 'Ny. Siti Rahma',
    nik: '3507123456780001',
    alamat: 'Jl. Merbabu No. 14, Lowokwaru, Malang',
    kelamin: 'Perempuan',
    usia: '34 Tahun',
    triase: 'hijau',
    bed: 'Bed 08'
  },
  '3507123456780001': {
    idPasien: 'IGD-2410-002',
    nama: 'Ny. Siti Rahma',
    nik: '3507123456780001',
    alamat: 'Jl. Merbabu No. 14, Lowokwaru, Malang',
    kelamin: 'Perempuan',
    usia: '34 Tahun',
    triase: 'hijau',
    bed: 'Bed 08'
  }
};

const S = {
  page: 'dashboard', // login, dashboard, pasien-igd, reg-biasa, reg-darurat, detail, penanganan, pemesanan, lab-lis, admin-selesai
  role: 'dokter',
  loginForm: {
    nip: '19890412',
    pin: '948201',
    showPin: true,
    selectedRole: 'dokter'
  },
  searchQuery: '',
  selectedPatientId: 'EMG-2410-001',
  // Counter penomoran otomatis
  nextRegNumber: 4,
  nextEmgNumber: 2,
  nextRmNumber: 8842,

  // Registrasi Biasa state
  regBiasaStep: 'empty', // 'empty' or 'filled'
  regBiasaFoundInDb: false,
  regBiasaForm: {
    searchKey: '',
    idPasien: 'IGD-2410-004',
    nama: '',
    nik: '',
    alamat: '',
    kelamin: 'Perempuan',
    usia: '',
    triase: 'hijau',
    bed: 'Bed 08 — Observasi Hijau',
    keluhan: '',
    dokter: 'dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)'
  },

  // Registrasi Darurat state
  regDaruratStep: 'empty', // 'empty' or 'filled'
  regDaruratForm: {
    idPasien: 'EMG-2410-001',
    nama: '',
    kelamin: 'Laki-laki',
    usia: '',
    triase: 'merah',
    bed: 'Bed 01 — Resusitasi',
    keluhan: '',
    dokter: 'dr. Farhan Malik, Sp.EM (Dokter Spesialis Emergensi / Jaga Utama)'
  },

  // Pemesanan state
  selectedPackage: 'acs',
  orderItems: ['itm-1', 'itm-2', 'itm-3', 'itm-4', 'itm-5'],
  modalAddFilter: 'semua',
  modalAddSearch: '',
  modalSelectedNewItems: ['itm-6'],
  lastSentOrderSummary: null,

  // Lab LIS state (Daftar antrean sampel yang masuk dari order dokter)
  labFilter: 'semua',
  selectedLabPatientId: 'EMG-2410-001',
  labOrders: [
    {
      patientId: 'EMG-2410-001',
      waktuOrder: '10:30 WIB',
      noRegLab: 'LAB-241001-089',
      items: [
        'Troponin I Kuantitatif',
        'Darah Lengkap & Trombosit',
        'Elektrolit & GDS Cepat',
        'Analisis Gas Darah (BGA / AGD)'
      ],
      uploaded: false,
      fileName: 'Hasil_Pemeriksaan_Lab_CITO_Tn_Budi_Santoso.pdf',
      fileSize: '245 KB',
      panicChecked: true,
      status: 'menunggu', // 'menunggu' | 'selesai'
      catatanAnalis: 'Hasil CITO Troponin I terdeteksi tinggi (Panic Value). Sampel telah diverifikasi ulang metode hs-CLIA. Harap segera konfirmasi tindakan medis.'
    }
  ],

  // Admin penyelesaian state
  adminForm: {
    searchNik: '3578012304720001',
    newPermanentId: 'IGD-2410-001',
    nama: 'Tn. Budi Santoso',
    nik: '3578012304720001',
    tglLahir: '14 Mei 1972 (52 th)',
    kelamin: 'Laki-laki',
    kontak: '081238421610',
    alamat: 'Jl. Ijen No. 45, Klojen, Malang',
    statusAkhir: 'rawat_inap', // rawat_inap, pulang, rujuk
    konfirmasiDokter: true
  },

  modal: null,

  // Daftar Pasien Aktif (Shared across all roles)
  patients: [
    {
      id: 'EMG-2410-001',
      rm: 'RM-2024-8841',
      nama: 'Tn. Budi Santoso',
      usia: 52,
      kelamin: 'Laki-laki',
      nik: '3578012304720001',
      kontak: '081238421610',
      alamat: 'Jl. Ijen No. 45, Klojen, Malang',
      triase: 'merah',
      bed: 'Bed 01',
      bedFull: 'Bed 01 (Resusitasi)',
      keluhan: 'Nyeri dada hebat tembus punggung sejak 2 jam lalu, keringat dingin, sesak napas akut.',
      keluhanSingkat: 'Nyeri dada kiri tembus ke punggung & sesak napas akut',
      waktu: '07:15 WIB',
      dokter: 'dr. Farhan Malik, Sp.EM',
      tipe: 'darurat',
      statusDitangani: false,
      alarmKritis: false,
      hasLabAndNotes: false,
      labFileName: 'Hasil_Lab_CITO_Tn_Budi_Santoso.pdf',
      catatanPelayanan: 'Nyeri dada substernal menjalar ke\nlengan kiri, skala nyeri 8/10',
      catatanAnalis: 'Hasil CITO Troponin I terdeteksi tinggi (Panic Value). Sampel telah diverifikasi ulang metode hs-CLIA. Harap segera konfirmasi tindakan medis.',
      statusKunjunganAkhir: null,
      activeInQueue: true
    },
    {
      id: 'IGD-2410-002',
      rm: 'RM-2024-8840',
      nama: 'Ny. Siti Rahma',
      usia: 45,
      kelamin: 'Perempuan',
      nik: '3507123456780044',
      kontak: '0813-2211-9988 - Tn. Hendra (Suami)',
      alamat: 'Jl. Soekarno Hatta No. 10, Malang',
      triase: 'kuning',
      bed: 'Bed 04',
      bedFull: 'Bed 04 (Observasi Kuning)',
      keluhan: 'Sesak napas sedang dan nyeri ulu hati sejak pagi.',
      keluhanSingkat: 'Sesak napas sedang & nyeri epigastrium',
      waktu: '08:15 WIB',
      dokter: 'dr. Farhan Malik, Sp.EM',
      tipe: 'biasa',
      statusDitangani: false,
      alarmKritis: false,
      hasLabAndNotes: false,
      labFileName: 'Hasil_Lab_IGD_Ny_Siti_Rahma.pdf',
      catatanPelayanan: 'Pasien mengeluhkan mual dan sesak napas ringan-sedang, tanda vital stabil.',
      catatanAnalis: 'Hasil pemeriksaan darah rutin dan elektrolit dalam batas normal.',
      statusKunjunganAkhir: null,
      activeInQueue: true
    },
    {
      id: 'IGD-2410-003',
      rm: 'RM-2024-8839',
      nama: 'Tn. Ahmad Fauzi',
      usia: 28,
      kelamin: 'Laki-laki',
      nik: '3507123456780088',
      kontak: '0857-9090-1122 - Ny. Rina',
      alamat: 'Jl. Veteran No. 8, Malang',
      triase: 'hijau',
      bed: 'Bed 07',
      bedFull: 'Bed 07 (Observasi Hijau)',
      keluhan: 'Demam hari ke-3 disertai nyeri kepala ringan.',
      keluhanSingkat: 'Demam tinggi & sefalgia ringan',
      waktu: '08:32 WIB',
      dokter: 'dr. Farhan Malik, Sp.EM',
      tipe: 'biasa',
      statusDitangani: false,
      alarmKritis: false,
      hasLabAndNotes: false,
      labFileName: 'Hasil_Lab_IGD_Tn_Ahmad_Fauzi.pdf',
      catatanPelayanan: 'Observasi febris hari ke-3, diberikan antipiretik oral.',
      catatanAnalis: 'Trombosit dan hematokrit dalam batas aman.',
      statusKunjunganAkhir: null,
      activeInQueue: true
    }
  ]
};


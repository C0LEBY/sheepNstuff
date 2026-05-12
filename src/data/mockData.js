// ─── Areas ───────────────────────────────────────────────────────────────────
export const areas = [
  { id: 'area-1', name: 'North Paddock',   type: 'pasture', capacity: 80, description: 'Main grazing paddock, fenced north boundary' },
  { id: 'area-2', name: 'South Paddock',   type: 'pasture', capacity: 60, description: 'Kikuyu grass, good for ewes and lambs' },
  { id: 'area-3', name: 'East Paddock',    type: 'pasture', capacity: 70, description: 'Newly planted ryegrass, rotational grazing' },
  { id: 'area-4', name: 'Lambing Pen',     type: 'pen',     capacity: 20, description: 'Protected pen for ewes close to lambing' },
  { id: 'area-5', name: 'Ram Camp',        type: 'camp',    capacity: 10, description: 'Separate camp for rams when not breeding' },
  { id: 'area-6', name: 'Treatment Pen',   type: 'pen',     capacity: 8,  description: 'Isolation pen for sick or injured sheep' },
]

// ─── Sheep ────────────────────────────────────────────────────────────────────
export const sheep = [
  // RAMS
  { id: 'SH001', tagNumber: 'R-001', name: 'Big Boy',   sex: 'ram',    breed: 'Merino',  dateOfBirth: '2021-04-10', areaId: 'area-5', status: 'healthy',  weight: 92.0,  motherId: null,    fatherId: null,    notes: 'Top sire, calm temperament' },
  { id: 'SH002', tagNumber: 'R-002', name: 'Duke',      sex: 'ram',    breed: 'Dorper',  dateOfBirth: '2020-07-22', areaId: 'area-5', status: 'healthy',  weight: 105.5, motherId: null,    fatherId: null,    notes: 'High-fertility ram' },
  { id: 'SH003', tagNumber: 'R-003', name: 'Granite',   sex: 'ram',    breed: 'Dohne',   dateOfBirth: '2022-01-15', areaId: 'area-5', status: 'healthy',  weight: 88.0,  motherId: null,    fatherId: null,    notes: '' },
  // EWES
  { id: 'SH004', tagNumber: 'E-001', name: 'Daisy',     sex: 'ewe',    breed: 'Merino',  dateOfBirth: '2021-08-03', areaId: 'area-1', status: 'pregnant', weight: 68.5,  motherId: null,    fatherId: 'SH001', notes: 'Due early May 2026' },
  { id: 'SH005', tagNumber: 'E-002', name: 'Rosie',     sex: 'ewe',    breed: 'Merino',  dateOfBirth: '2020-11-14', areaId: 'area-4', status: 'pregnant', weight: 72.0,  motherId: null,    fatherId: 'SH001', notes: 'Twins expected, due May 2026' },
  { id: 'SH006', tagNumber: 'E-003', name: 'Bella',     sex: 'ewe',    breed: 'Dorper',  dateOfBirth: '2021-03-27', areaId: 'area-2', status: 'healthy',  weight: 65.0,  motherId: null,    fatherId: 'SH002', notes: '' },
  { id: 'SH007', tagNumber: 'E-004', name: 'Molly',     sex: 'ewe',    breed: 'Dorper',  dateOfBirth: '2022-05-09', areaId: 'area-2', status: 'healthy',  weight: 61.5,  motherId: null,    fatherId: 'SH002', notes: '' },
  { id: 'SH008', tagNumber: 'E-005', name: 'Pearl',     sex: 'ewe',    breed: 'Merino',  dateOfBirth: '2020-09-18', areaId: 'area-1', status: 'healthy',  weight: 70.0,  motherId: null,    fatherId: 'SH001', notes: 'Good milker' },
  { id: 'SH009', tagNumber: 'E-006', name: 'Honey',     sex: 'ewe',    breed: 'Dohne',   dateOfBirth: '2021-12-01', areaId: 'area-1', status: 'pregnant', weight: 67.0,  motherId: null,    fatherId: 'SH003', notes: '' },
  { id: 'SH010', tagNumber: 'E-007', name: 'Clover',    sex: 'ewe',    breed: 'Merino',  dateOfBirth: '2022-02-14', areaId: 'area-2', status: 'healthy',  weight: 63.0,  motherId: null,    fatherId: 'SH001', notes: '' },
  { id: 'SH011', tagNumber: 'E-008', name: 'Fern',      sex: 'ewe',    breed: 'Dohne',   dateOfBirth: '2020-06-30', areaId: 'area-1', status: 'sick',     weight: 58.5,  motherId: null,    fatherId: 'SH003', notes: 'Being treated for footrot' },
  { id: 'SH012', tagNumber: 'E-009', name: 'Juniper',   sex: 'ewe',    breed: 'Merino',  dateOfBirth: '2021-10-22', areaId: 'area-6', status: 'sick',     weight: 60.0,  motherId: null,    fatherId: 'SH001', notes: 'Eye infection, isolating' },
  { id: 'SH013', tagNumber: 'E-010', name: 'Misty',     sex: 'ewe',    breed: 'Dorper',  dateOfBirth: '2022-04-11', areaId: 'area-2', status: 'healthy',  weight: 64.5,  motherId: null,    fatherId: 'SH002', notes: '' },
  { id: 'SH014', tagNumber: 'E-011', name: 'Sage',      sex: 'ewe',    breed: 'Merino',  dateOfBirth: '2020-08-07', areaId: 'area-3', status: 'healthy',  weight: 69.0,  motherId: null,    fatherId: 'SH001', notes: '' },
  { id: 'SH015', tagNumber: 'E-012', name: 'Willow',    sex: 'ewe',    breed: 'Dohne',   dateOfBirth: '2021-07-19', areaId: 'area-3', status: 'healthy',  weight: 66.5,  motherId: null,    fatherId: 'SH003', notes: '' },
  { id: 'SH016', tagNumber: 'E-013', name: 'Hazel',     sex: 'ewe',    breed: 'Merino',  dateOfBirth: '2022-01-29', areaId: 'area-3', status: 'pregnant', weight: 71.0,  motherId: null,    fatherId: 'SH001', notes: 'First pregnancy' },
  { id: 'SH017', tagNumber: 'E-014', name: 'Ivy',       sex: 'ewe',    breed: 'Suffolk', dateOfBirth: '2021-05-03', areaId: 'area-1', status: 'healthy',  weight: 74.0,  motherId: null,    fatherId: null,    notes: '' },
  { id: 'SH018', tagNumber: 'E-015', name: 'Poppy',     sex: 'ewe',    breed: 'Suffolk', dateOfBirth: '2020-10-15', areaId: 'area-1', status: 'healthy',  weight: 76.5,  motherId: null,    fatherId: null,    notes: '' },
  { id: 'SH019', tagNumber: 'E-016', name: 'Iris',      sex: 'ewe',    breed: 'Merino',  dateOfBirth: '2022-03-08', areaId: 'area-2', status: 'healthy',  weight: 62.0,  motherId: null,    fatherId: 'SH001', notes: '' },
  { id: 'SH020', tagNumber: 'E-017', name: 'Flora',     sex: 'ewe',    breed: 'Dohne',   dateOfBirth: '2021-09-25', areaId: 'area-3', status: 'healthy',  weight: 65.5,  motherId: null,    fatherId: 'SH003', notes: '' },
  { id: 'SH021', tagNumber: 'E-018', name: 'Luna',      sex: 'ewe',    breed: 'Dorper',  dateOfBirth: '2022-06-12', areaId: 'area-2', status: 'healthy',  weight: 60.0,  motherId: null,    fatherId: 'SH002', notes: '' },
  // WETHERS
  { id: 'SH022', tagNumber: 'W-001', name: '',          sex: 'wether', breed: 'Merino',  dateOfBirth: '2023-09-14', areaId: 'area-3', status: 'healthy',  weight: 52.0,  motherId: 'SH008', fatherId: 'SH001', notes: 'Market ready' },
  { id: 'SH023', tagNumber: 'W-002', name: '',          sex: 'wether', breed: 'Merino',  dateOfBirth: '2023-09-14', areaId: 'area-3', status: 'healthy',  weight: 50.5,  motherId: 'SH008', fatherId: 'SH001', notes: 'Market ready' },
  { id: 'SH024', tagNumber: 'W-003', name: '',          sex: 'wether', breed: 'Dorper',  dateOfBirth: '2023-10-02', areaId: 'area-1', status: 'healthy',  weight: 55.0,  motherId: 'SH006', fatherId: 'SH002', notes: '' },
  { id: 'SH025', tagNumber: 'W-004', name: '',          sex: 'wether', breed: 'Dohne',   dateOfBirth: '2023-11-18', areaId: 'area-1', status: 'healthy',  weight: 48.0,  motherId: 'SH015', fatherId: 'SH003', notes: '' },
  // LAMBS
  { id: 'SH026', tagNumber: 'L-001', name: 'Peanut',    sex: 'lamb',   breed: 'Merino',  dateOfBirth: '2025-08-03', areaId: 'area-4', status: 'healthy',  weight: 12.5,  motherId: 'SH005', fatherId: 'SH001', notes: 'Twin A' },
  { id: 'SH027', tagNumber: 'L-002', name: 'Button',    sex: 'lamb',   breed: 'Merino',  dateOfBirth: '2025-08-03', areaId: 'area-4', status: 'healthy',  weight: 11.8,  motherId: 'SH005', fatherId: 'SH001', notes: 'Twin B' },
  { id: 'SH028', tagNumber: 'L-003', name: '',          sex: 'lamb',   breed: 'Dorper',  dateOfBirth: '2025-09-15', areaId: 'area-2', status: 'healthy',  weight: 15.2,  motherId: 'SH006', fatherId: 'SH002', notes: '' },
  { id: 'SH029', tagNumber: 'L-004', name: '',          sex: 'lamb',   breed: 'Dohne',   dateOfBirth: '2025-09-22', areaId: 'area-2', status: 'healthy',  weight: 14.0,  motherId: 'SH015', fatherId: 'SH003', notes: '' },
  { id: 'SH030', tagNumber: 'L-005', name: 'Sprout',    sex: 'lamb',   breed: 'Merino',  dateOfBirth: '2025-10-01', areaId: 'area-4', status: 'healthy',  weight: 9.5,   motherId: 'SH009', fatherId: 'SH003', notes: 'Newborn, doing well' },
  // SOLD / DEAD (for history)
  { id: 'SH031', tagNumber: 'W-005', name: '',          sex: 'wether', breed: 'Merino',  dateOfBirth: '2023-08-10', areaId: null,     status: 'sold',     weight: 58.0,  motherId: null,    fatherId: 'SH001', notes: 'Sold to Van Wyk farm' },
  { id: 'SH032', tagNumber: 'E-019', name: 'Heather',   sex: 'ewe',    breed: 'Dorper',  dateOfBirth: '2019-04-22', areaId: null,     status: 'dead',     weight: 0,     motherId: null,    fatherId: null,    notes: 'Old age' },
]

// Weight history per sheep
export const weightHistory = {
  SH001: [
    { date: '2024-01-10', weight: 88.0 },
    { date: '2024-04-15', weight: 90.0 },
    { date: '2024-07-20', weight: 91.5 },
    { date: '2024-10-18', weight: 92.0 },
  ],
  SH004: [
    { date: '2024-03-01', weight: 62.0 },
    { date: '2024-06-15', weight: 64.5 },
    { date: '2024-09-20', weight: 67.0 },
    { date: '2024-10-25', weight: 68.5 },
  ],
  SH026: [
    { date: '2025-08-03', weight: 4.8 },
    { date: '2025-08-20', weight: 7.2 },
    { date: '2025-09-05', weight: 9.5 },
    { date: '2025-09-20', weight: 11.0 },
    { date: '2025-10-05', weight: 12.5 },
  ],
  SH027: [
    { date: '2025-08-03', weight: 4.5 },
    { date: '2025-08-20', weight: 6.8 },
    { date: '2025-09-05', weight: 9.0 },
    { date: '2025-09-20', weight: 10.5 },
    { date: '2025-10-05', weight: 11.8 },
  ],
}

// ─── Birth Records ────────────────────────────────────────────────────────────
export const births = [
  { id: 'birth-1',  date: '2025-10-01', motherId: 'SH009', fatherId: 'SH003', lambCount: 1, lambIds: ['SH030'], type: 'single',   stillborns: 0, notes: 'Easy birth, lamb healthy' },
  { id: 'birth-2',  date: '2025-09-22', motherId: 'SH015', fatherId: 'SH003', lambCount: 1, lambIds: ['SH029'], type: 'single',   stillborns: 0, notes: '' },
  { id: 'birth-3',  date: '2025-09-15', motherId: 'SH006', fatherId: 'SH002', lambCount: 1, lambIds: ['SH028'], type: 'single',   stillborns: 0, notes: '' },
  { id: 'birth-4',  date: '2025-08-03', motherId: 'SH005', fatherId: 'SH001', lambCount: 2, lambIds: ['SH026','SH027'], type: 'twins', stillborns: 0, notes: 'Both lambs strong' },
  { id: 'birth-5',  date: '2025-07-18', motherId: 'SH008', fatherId: 'SH001', lambCount: 2, lambIds: ['SH022','SH023'], type: 'twins', stillborns: 0, notes: 'Twin wethers, weaned' },
  { id: 'birth-6',  date: '2025-06-12', motherId: 'SH006', fatherId: 'SH002', lambCount: 1, lambIds: ['SH024'], type: 'single',   stillborns: 0, notes: '' },
  { id: 'birth-7',  date: '2025-05-29', motherId: 'SH015', fatherId: 'SH003', lambCount: 1, lambIds: ['SH025'], type: 'single',   stillborns: 0, notes: '' },
  { id: 'birth-8',  date: '2025-03-14', motherId: 'SH017', fatherId: 'SH001', lambCount: 2, lambIds: [],        type: 'twins',    stillborns: 2, notes: 'Both stillborn, ewe recovered well' },
  { id: 'birth-9',  date: '2025-02-07', motherId: 'SH014', fatherId: 'SH001', lambCount: 1, lambIds: [],        type: 'single',   stillborns: 0, notes: 'Lamb sold at weaning' },
  { id: 'birth-10', date: '2024-11-20', motherId: 'SH018', fatherId: 'SH002', lambCount: 3, lambIds: [],        type: 'triplets', stillborns: 1, notes: 'One stillborn, two lambs sold' },
]

// ─── Health Records ───────────────────────────────────────────────────────────
export const healthRecords = [
  { id: 'hr-1',  sheepId: 'SH011', date: '2026-04-20', type: 'treatment',   treatment: 'Footrot spray – Zinc Sulphate', notes: 'Mild footrot, hooves trimmed',       followUpDate: '2026-05-02', vet: '' },
  { id: 'hr-2',  sheepId: 'SH012', date: '2026-04-18', type: 'treatment',   treatment: 'Oxytetracycline injection',      notes: 'Eye infection, pinkeye suspected',   followUpDate: '2026-05-01', vet: 'Dr. Coetzee' },
  { id: 'hr-3',  sheepId: 'SH030', date: '2025-10-01', type: 'checkup',     treatment: 'Newborn check',                  notes: 'Healthy lamb, good suckle reflex',   followUpDate: null,          vet: '' },
  { id: 'hr-4',  sheepId: 'SH005', date: '2025-09-28', type: 'checkup',     treatment: 'Pregnancy scan',                 notes: 'Confirmed twins, on schedule',       followUpDate: null,          vet: 'Dr. Coetzee' },
  { id: 'hr-5',  sheepId: 'SH004', date: '2025-09-28', type: 'checkup',     treatment: 'Pregnancy scan',                 notes: 'Single lamb, due ~Nov 5',            followUpDate: null,          vet: 'Dr. Coetzee' },
  { id: 'hr-6',  sheepId: 'SH001', date: '2025-09-10', type: 'vaccination', treatment: 'Pulpy Kidney & Tetanus booster', notes: 'Annual vaccination done',            followUpDate: '2026-09-10',  vet: '' },
  { id: 'hr-7',  sheepId: 'SH002', date: '2025-09-10', type: 'vaccination', treatment: 'Pulpy Kidney & Tetanus booster', notes: 'Annual vaccination done',            followUpDate: '2026-09-10',  vet: '' },
  { id: 'hr-8',  sheepId: 'SH003', date: '2025-09-10', type: 'vaccination', treatment: 'Pulpy Kidney & Tetanus booster', notes: 'Annual vaccination done',            followUpDate: '2026-09-10',  vet: '' },
  { id: 'hr-9',  sheepId: 'SH026', date: '2025-09-01', type: 'vaccination', treatment: 'Lamb vaccination – Enterotoxemia', notes: 'First dose at 4 weeks',           followUpDate: '2025-09-29',  vet: '' },
  { id: 'hr-10', sheepId: 'SH027', date: '2025-09-01', type: 'vaccination', treatment: 'Lamb vaccination – Enterotoxemia', notes: 'First dose at 4 weeks',           followUpDate: '2025-09-29',  vet: '' },
  { id: 'hr-11', sheepId: 'SH008', date: '2025-08-15', type: 'deworming',   treatment: 'Levamisole drench',              notes: 'Routine deworming, whole flock',    followUpDate: '2025-11-15',  vet: '' },
  { id: 'hr-12', sheepId: 'SH014', date: '2025-08-15', type: 'deworming',   treatment: 'Levamisole drench',              notes: 'Routine deworming, whole flock',    followUpDate: '2025-11-15',  vet: '' },
  { id: 'hr-13', sheepId: 'SH011', date: '2025-07-02', type: 'injury',      treatment: 'Wound cleaned, iodine applied',  notes: 'Wire cut on rear leg',              followUpDate: '2025-07-09',  vet: '' },
  { id: 'hr-14', sheepId: 'SH032', date: '2025-04-10', type: 'vet_visit',   treatment: 'Palliative care',                notes: 'Old age decline, euthanised',       followUpDate: null,          vet: 'Dr. Coetzee' },
  { id: 'hr-15', sheepId: 'SH009', date: '2025-09-20', type: 'vaccination', treatment: 'Pulpy Kidney booster',           notes: 'Pre-lambing vaccination',           followUpDate: null,          vet: '' },
]

// ─── Breeding Records ─────────────────────────────────────────────────────────
export const breedingRecords = [
  { id: 'br-1', ewedId: 'SH004', ramId: 'SH001', matingDate: '2025-12-09', expectedLambingDate: '2026-05-08', status: 'pregnant',  lambsProduced: 0, notes: 'Single confirmed by scan' },
  { id: 'br-2', ewedId: 'SH005', ramId: 'SH001', matingDate: '2025-12-09', expectedLambingDate: '2026-05-08', status: 'pregnant',  lambsProduced: 0, notes: 'Twins confirmed by scan' },
  { id: 'br-3', ewedId: 'SH009', ramId: 'SH003', matingDate: '2025-06-02', expectedLambingDate: '2025-10-28', status: 'lambed',    lambsProduced: 1, notes: 'Single lamb, healthy' },
  { id: 'br-4', ewedId: 'SH016', ramId: 'SH001', matingDate: '2026-01-15', expectedLambingDate: '2026-06-14', status: 'pregnant',  lambsProduced: 0, notes: 'First pregnancy, monitoring closely' },
  { id: 'br-5', ewedId: 'SH015', ramId: 'SH003', matingDate: '2025-04-20', expectedLambingDate: '2025-09-17', status: 'lambed',    lambsProduced: 1, notes: '' },
  { id: 'br-6', ewedId: 'SH006', ramId: 'SH002', matingDate: '2025-04-18', expectedLambingDate: '2025-09-14', status: 'lambed',    lambsProduced: 1, notes: '' },
  { id: 'br-7', ewedId: 'SH017', ramId: 'SH001', matingDate: '2024-11-15', expectedLambingDate: '2025-04-12', status: 'failed',    lambsProduced: 0, notes: 'Stillborns – see birth record' },
  { id: 'br-8', ewedId: 'SH008', ramId: 'SH001', matingDate: '2025-02-20', expectedLambingDate: '2025-07-19', status: 'lambed',    lambsProduced: 2, notes: 'Twin wethers, weaned' },
]

// ─── Deaths ───────────────────────────────────────────────────────────────────
export const deaths = [
  { id: 'death-1', sheepId: 'SH032', date: '2025-04-10', cause: 'Old age',          notes: 'Heather, 6 years old. Natural death.' },
  { id: 'death-2', sheepId: null,    date: '2025-03-14', cause: 'Stillborn',         notes: 'Two stillborn lambs from SH017 (Ivy)' },
  { id: 'death-3', sheepId: null,    date: '2024-11-20', cause: 'Stillborn',         notes: 'One stillborn lamb from SH018 (Poppy)' },
]

// ─── Sales & Purchases ────────────────────────────────────────────────────────
export const transactions = [
  { id: 'tx-1',  type: 'purchase', date: '2024-03-05', sheepIds: ['SH017'],          count: 1,  pricePerHead: 1800, totalAmount: 1800,  party: 'Rooiwal Stud Farm',   notes: 'Registered Suffolk ewe' },
  { id: 'tx-2',  type: 'purchase', date: '2024-03-05', sheepIds: ['SH018'],          count: 1,  pricePerHead: 1750, totalAmount: 1750,  party: 'Rooiwal Stud Farm',   notes: 'Registered Suffolk ewe' },
  { id: 'tx-3',  type: 'sale',     date: '2025-01-18', sheepIds: ['SH031'],          count: 1,  pricePerHead: 950,  totalAmount: 950,   party: 'Van Wyk Boerdery',    notes: 'Mature wether, good weight' },
  { id: 'tx-4',  type: 'sale',     date: '2025-02-28', sheepIds: [],                 count: 2,  pricePerHead: 820,  totalAmount: 1640,  party: 'Spar Butchery',       notes: 'Two wethers from Nov lambing' },
  { id: 'tx-5',  type: 'purchase', date: '2025-03-10', sheepIds: ['SH003'],          count: 1,  pricePerHead: 3200, totalAmount: 3200,  party: 'Dohne Merino Society', notes: 'Registered Dohne ram' },
  { id: 'tx-6',  type: 'sale',     date: '2025-04-15', sheepIds: [],                 count: 5,  pricePerHead: 780,  totalAmount: 3900,  party: 'Weekly Livestock Auction', notes: 'Spring wethers' },
  { id: 'tx-7',  type: 'sale',     date: '2025-06-20', sheepIds: [],                 count: 3,  pricePerHead: 850,  totalAmount: 2550,  party: 'Piet Marais',          notes: '' },
  { id: 'tx-8',  type: 'sale',     date: '2025-08-12', sheepIds: [],                 count: 2,  pricePerHead: 900,  totalAmount: 1800,  party: 'Weekly Livestock Auction', notes: 'Weaned lambs' },
]

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasks = [
  { id: 'task-1',  title: 'Vaccinate North & South Paddock flocks',    category: 'vaccination', dueDate: '2026-05-10', completed: false, priority: 'high',   areaId: 'area-1', notes: 'Annual Pulpy Kidney + Tetanus booster' },
  { id: 'task-2',  title: 'Move pregnant ewes to Lambing Pen',         category: 'movement',    dueDate: '2026-05-05', completed: false, priority: 'high',   areaId: 'area-4', notes: 'E-001, E-002, E-013 due in May' },
  { id: 'task-3',  title: 'Deworming – whole flock',                   category: 'health',      dueDate: '2026-05-20', completed: false, priority: 'medium', areaId: null,     notes: 'Levamisole drench, 3-month cycle' },
  { id: 'task-4',  title: 'Follow-up on E-008 footrot treatment',      category: 'health',      dueDate: '2026-05-02', completed: false, priority: 'high',   areaId: 'area-6', notes: 'Check hoof, re-spray if needed' },
  { id: 'task-5',  title: 'Follow-up E-009 eye infection',             category: 'health',      dueDate: '2026-05-01', completed: false, priority: 'high',   areaId: 'area-6', notes: 'Check with Dr. Coetzee' },
  { id: 'task-6',  title: 'Weigh lambs in Lambing Pen',                category: 'general',     dueDate: '2026-05-08', completed: false, priority: 'medium', areaId: 'area-4', notes: 'L-001 through L-005' },
  { id: 'task-7',  title: 'Fix water trough in East Paddock',          category: 'maintenance', dueDate: '2026-04-30', completed: false, priority: 'medium', areaId: 'area-3', notes: 'Leak on the side joint' },
  { id: 'task-8',  title: 'Rotational graze – move flock to East Paddock', category: 'general', dueDate: '2026-05-15', completed: false, priority: 'low',    areaId: 'area-3', notes: 'Grass ready after 3-week rest' },
  { id: 'task-9',  title: 'Pregnancy check – E-013 Hazel',             category: 'health',      dueDate: '2026-05-06', completed: false, priority: 'medium', areaId: null,     notes: 'Confirm pregnancy status' },
  { id: 'task-10', title: 'Sort and tag new lambs',                    category: 'general',     dueDate: '2026-04-10', completed: true,  priority: 'high',   areaId: null,     notes: 'Done – all tagged' },
  { id: 'task-11', title: 'Ram camp fence repair',                     category: 'maintenance', dueDate: '2026-03-20', completed: true,  priority: 'high',   areaId: 'area-5', notes: 'Fixed north-east corner post' },
  { id: 'task-12', title: 'Order feed supplements for lambing',        category: 'general',     dueDate: '2026-05-03', completed: false, priority: 'medium', areaId: null,     notes: 'Lick blocks + creep feed for lambs' },
]

// ─── Monthly stats for charts ─────────────────────────────────────────────────
export const monthlyStats = [
  { month: 'Jul',  births: 2, deaths: 0, sales: 2, purchases: 0 },
  { month: 'Aug',  births: 3, deaths: 0, sales: 2, purchases: 0 },
  { month: 'Sep',  births: 2, deaths: 0, sales: 0, purchases: 0 },
  { month: 'Oct',  births: 1, deaths: 0, sales: 0, purchases: 0 },
  { month: 'Nov',  births: 0, deaths: 0, sales: 2, purchases: 1 },
  { month: 'Dec',  births: 0, deaths: 0, sales: 0, purchases: 0 },
  { month: 'Jan',  births: 2, deaths: 0, sales: 2, purchases: 0 },
  { month: 'Feb',  births: 1, deaths: 0, sales: 2, purchases: 0 },
  { month: 'Mar',  births: 2, deaths: 1, sales: 3, purchases: 0 },
  { month: 'Apr',  births: 0, deaths: 0, sales: 1, purchases: 0 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getSheepById(id) {
  return sheep.find(s => s.id === id) || null
}

export function getAreaById(id) {
  return areas.find(a => a.id === id) || null
}

export function getSheepInArea(areaId) {
  return sheep.filter(s => s.areaId === areaId && s.status !== 'sold' && s.status !== 'dead')
}

export function getAge(dateOfBirth) {
  if (!dateOfBirth) return '—'
  const dob = new Date(dateOfBirth)
  const now = new Date()
  const months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth())
  if (months < 3) return `${Math.floor((now - dob) / (1000 * 60 * 60 * 24))} days`
  if (months < 24) return `${months} months`
  return `${Math.floor(months / 12)} yrs ${months % 12}m`
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

-- ══════════════════════════════════════════════════════
--  SheepTrack — Test Account Seed Data
--
--  STEP 1: Create the test user in Supabase Dashboard
--    → Authentication → Users → "Add user"
--    Email:    test@sheeptrack.co.za
--    Password: Groenplaas2025
--    (tick "Auto Confirm User")
--
--  STEP 2: Copy the user's UUID from the users list
--    and replace every occurrence of
--    '00000000-0000-0000-0000-000000000001'
--    below with the real UUID.
--
--  STEP 3: Run this script in SQL Editor.
-- ══════════════════════════════════════════════════════

do $$
declare
  -- ── Replace this with the real test user UUID ───────
  v_user_id uuid := 'a5bc149c-95f9-407f-8de1-75db50008591';

  -- farm
  v_farm_id uuid := gen_random_uuid();

  -- areas
  v_area1 uuid := gen_random_uuid();
  v_area2 uuid := gen_random_uuid();
  v_area3 uuid := gen_random_uuid();
  v_area4 uuid := gen_random_uuid();
  v_area5 uuid := gen_random_uuid();
  v_area6 uuid := gen_random_uuid();

  -- rams
  v_sh001 uuid := gen_random_uuid();
  v_sh002 uuid := gen_random_uuid();
  v_sh003 uuid := gen_random_uuid();

  -- ewes
  v_sh004 uuid := gen_random_uuid();
  v_sh005 uuid := gen_random_uuid();
  v_sh006 uuid := gen_random_uuid();
  v_sh007 uuid := gen_random_uuid();
  v_sh008 uuid := gen_random_uuid();
  v_sh009 uuid := gen_random_uuid();
  v_sh010 uuid := gen_random_uuid();
  v_sh011 uuid := gen_random_uuid();
  v_sh012 uuid := gen_random_uuid();
  v_sh013 uuid := gen_random_uuid();
  v_sh014 uuid := gen_random_uuid();
  v_sh015 uuid := gen_random_uuid();
  v_sh016 uuid := gen_random_uuid();
  v_sh017 uuid := gen_random_uuid();
  v_sh018 uuid := gen_random_uuid();
  v_sh019 uuid := gen_random_uuid();
  v_sh020 uuid := gen_random_uuid();
  v_sh021 uuid := gen_random_uuid();

  -- wethers
  v_sh022 uuid := gen_random_uuid();
  v_sh023 uuid := gen_random_uuid();
  v_sh024 uuid := gen_random_uuid();
  v_sh025 uuid := gen_random_uuid();

  -- lambs
  v_sh026 uuid := gen_random_uuid();
  v_sh027 uuid := gen_random_uuid();
  v_sh028 uuid := gen_random_uuid();
  v_sh029 uuid := gen_random_uuid();
  v_sh030 uuid := gen_random_uuid();

  -- sold / dead
  v_sh031 uuid := gen_random_uuid();
  v_sh032 uuid := gen_random_uuid();

begin

  -- ── Profile ────────────────────────────────────────
  insert into profiles (id, name, initials, email)
  values (v_user_id, 'Nathan Jonck', 'NJ', 'test@sheeptrack.co.za')
  on conflict (id) do update set name = excluded.name, initials = excluded.initials;

  -- ── Farm ───────────────────────────────────────────
  insert into farms (id, name, location, season, logo, created_by)
  values (v_farm_id, 'Groenplaas', 'North Cape, South Africa', 'Season 2025', '/logos/groenplaas.svg', v_user_id);

  insert into farm_members (farm_id, user_id, role)
  values (v_farm_id, v_user_id, 'owner');

  -- ── Areas ──────────────────────────────────────────
  insert into areas (id, farm_id, name, type, capacity, description) values
    (v_area1, v_farm_id, 'North Paddock',  'pasture', 80, 'Main grazing paddock, fenced north boundary'),
    (v_area2, v_farm_id, 'South Paddock',  'pasture', 60, 'Kikuyu grass, good for ewes and lambs'),
    (v_area3, v_farm_id, 'East Paddock',   'pasture', 70, 'Newly planted ryegrass, rotational grazing'),
    (v_area4, v_farm_id, 'Lambing Pen',    'pen',     20, 'Protected pen for ewes close to lambing'),
    (v_area5, v_farm_id, 'Ram Camp',       'camp',    10, 'Separate camp for rams when not breeding'),
    (v_area6, v_farm_id, 'Treatment Pen',  'pen',      8, 'Isolation pen for sick or injured sheep');

  -- ── Sheep ──────────────────────────────────────────
  insert into sheep (id, farm_id, tag_number, name, sex, breed, date_of_birth, area_id, status, weight, notes) values
    (v_sh001, v_farm_id, 'R-001', 'Big Boy',  'ram',    'Merino', '2021-04-10', v_area5, 'healthy',  92.0,  'Top sire, calm temperament'),
    (v_sh002, v_farm_id, 'R-002', 'Duke',     'ram',    'Dorper', '2020-07-22', v_area5, 'healthy',  105.5, 'High-fertility ram'),
    (v_sh003, v_farm_id, 'R-003', 'Granite',  'ram',    'Dohne',  '2022-01-15', v_area5, 'healthy',  88.0,  ''),
    (v_sh004, v_farm_id, 'E-001', 'Daisy',    'ewe',    'Merino', '2021-08-03', v_area1, 'pregnant', 68.5,  'Due early May 2026'),
    (v_sh005, v_farm_id, 'E-002', 'Rosie',    'ewe',    'Merino', '2020-11-14', v_area4, 'pregnant', 72.0,  'Twins expected, due May 2026'),
    (v_sh006, v_farm_id, 'E-003', 'Bella',    'ewe',    'Dorper', '2021-03-27', v_area2, 'healthy',  65.0,  ''),
    (v_sh007, v_farm_id, 'E-004', 'Molly',    'ewe',    'Dorper', '2022-05-09', v_area2, 'healthy',  61.5,  ''),
    (v_sh008, v_farm_id, 'E-005', 'Pearl',    'ewe',    'Merino', '2020-09-18', v_area1, 'healthy',  70.0,  'Good milker'),
    (v_sh009, v_farm_id, 'E-006', 'Honey',    'ewe',    'Dohne',  '2021-12-01', v_area1, 'pregnant', 67.0,  ''),
    (v_sh010, v_farm_id, 'E-007', 'Clover',   'ewe',    'Merino', '2022-02-14', v_area2, 'healthy',  63.0,  ''),
    (v_sh011, v_farm_id, 'E-008', 'Fern',     'ewe',    'Dohne',  '2020-06-30', v_area1, 'sick',     58.5,  'Being treated for footrot'),
    (v_sh012, v_farm_id, 'E-009', 'Juniper',  'ewe',    'Merino', '2021-10-22', v_area6, 'sick',     60.0,  'Eye infection, isolating'),
    (v_sh013, v_farm_id, 'E-010', 'Misty',    'ewe',    'Dorper', '2022-04-11', v_area2, 'healthy',  64.5,  ''),
    (v_sh014, v_farm_id, 'E-011', 'Sage',     'ewe',    'Merino', '2020-08-07', v_area3, 'healthy',  69.0,  ''),
    (v_sh015, v_farm_id, 'E-012', 'Willow',   'ewe',    'Dohne',  '2021-07-19', v_area3, 'healthy',  66.5,  ''),
    (v_sh016, v_farm_id, 'E-013', 'Hazel',    'ewe',    'Merino', '2022-01-29', v_area3, 'pregnant', 71.0,  'First pregnancy'),
    (v_sh017, v_farm_id, 'E-014', 'Ivy',      'ewe',    'Suffolk','2021-05-03', v_area1, 'healthy',  74.0,  ''),
    (v_sh018, v_farm_id, 'E-015', 'Poppy',    'ewe',    'Suffolk','2020-10-15', v_area1, 'healthy',  76.5,  ''),
    (v_sh019, v_farm_id, 'E-016', 'Iris',     'ewe',    'Merino', '2022-03-08', v_area2, 'healthy',  62.0,  ''),
    (v_sh020, v_farm_id, 'E-017', 'Flora',    'ewe',    'Dohne',  '2021-09-25', v_area3, 'healthy',  65.5,  ''),
    (v_sh021, v_farm_id, 'E-018', 'Luna',     'ewe',    'Dorper', '2022-06-12', v_area2, 'healthy',  60.0,  ''),
    (v_sh022, v_farm_id, 'W-001', '',         'wether', 'Merino', '2023-09-14', v_area3, 'healthy',  52.0,  'Market ready'),
    (v_sh023, v_farm_id, 'W-002', '',         'wether', 'Merino', '2023-09-14', v_area3, 'healthy',  50.5,  'Market ready'),
    (v_sh024, v_farm_id, 'W-003', '',         'wether', 'Dorper', '2023-10-02', v_area1, 'healthy',  55.0,  ''),
    (v_sh025, v_farm_id, 'W-004', '',         'wether', 'Dohne',  '2023-11-18', v_area1, 'healthy',  48.0,  ''),
    (v_sh026, v_farm_id, 'L-001', 'Peanut',   'lamb',   'Merino', '2025-08-03', v_area4, 'healthy',  12.5,  'Twin A'),
    (v_sh027, v_farm_id, 'L-002', 'Button',   'lamb',   'Merino', '2025-08-03', v_area4, 'healthy',  11.8,  'Twin B'),
    (v_sh028, v_farm_id, 'L-003', '',         'lamb',   'Dorper', '2025-09-15', v_area2, 'healthy',  15.2,  ''),
    (v_sh029, v_farm_id, 'L-004', '',         'lamb',   'Dohne',  '2025-09-22', v_area2, 'healthy',  14.0,  ''),
    (v_sh030, v_farm_id, 'L-005', 'Sprout',   'lamb',   'Merino', '2025-10-01', v_area4, 'healthy',  9.5,   'Newborn, doing well'),
    (v_sh031, v_farm_id, 'W-005', '',         'wether', 'Merino', '2023-08-10', null,    'sold',     58.0,  'Sold to Van Wyk farm'),
    (v_sh032, v_farm_id, 'E-019', 'Heather',  'ewe',    'Dorper', '2019-04-22', null,    'dead',     0,     'Old age');

  -- set parentage
  update sheep set father_id = v_sh001 where id in (v_sh004,v_sh005,v_sh008,v_sh010,v_sh012,v_sh014,v_sh016,v_sh022,v_sh023,v_sh026,v_sh027,v_sh031);
  update sheep set father_id = v_sh002 where id in (v_sh006,v_sh007,v_sh013,v_sh021,v_sh024,v_sh028);
  update sheep set father_id = v_sh003 where id in (v_sh009,v_sh015,v_sh020,v_sh025,v_sh029,v_sh030);
  update sheep set mother_id = v_sh008 where id in (v_sh022,v_sh023);
  update sheep set mother_id = v_sh006 where id in (v_sh024,v_sh028);
  update sheep set mother_id = v_sh015 where id in (v_sh025,v_sh029);
  update sheep set mother_id = v_sh005 where id in (v_sh026,v_sh027);
  update sheep set mother_id = v_sh009 where id = v_sh030;

  -- ── Health Records ─────────────────────────────────
  insert into health_records (farm_id, sheep_id, date, type, treatment, notes, follow_up_date, vet) values
    (v_farm_id, v_sh011, '2026-04-20', 'treatment',   'Footrot spray – Zinc Sulphate',       'Mild footrot, hooves trimmed',      '2026-05-02', ''),
    (v_farm_id, v_sh012, '2026-04-18', 'treatment',   'Oxytetracycline injection',            'Eye infection, pinkeye suspected',  '2026-05-01', 'Dr. Coetzee'),
    (v_farm_id, v_sh030, '2025-10-01', 'checkup',     'Newborn check',                        'Healthy lamb, good suckle reflex',  null,         ''),
    (v_farm_id, v_sh005, '2025-09-28', 'checkup',     'Pregnancy scan',                       'Confirmed twins, on schedule',     null,         'Dr. Coetzee'),
    (v_farm_id, v_sh004, '2025-09-28', 'checkup',     'Pregnancy scan',                       'Single lamb, due ~Nov 5',          null,         'Dr. Coetzee'),
    (v_farm_id, v_sh001, '2025-09-10', 'vaccination', 'Pulpy Kidney & Tetanus booster',       'Annual vaccination done',          '2026-09-10', ''),
    (v_farm_id, v_sh002, '2025-09-10', 'vaccination', 'Pulpy Kidney & Tetanus booster',       'Annual vaccination done',          '2026-09-10', ''),
    (v_farm_id, v_sh003, '2025-09-10', 'vaccination', 'Pulpy Kidney & Tetanus booster',       'Annual vaccination done',          '2026-09-10', ''),
    (v_farm_id, v_sh026, '2025-09-01', 'vaccination', 'Lamb vaccination – Enterotoxemia',     'First dose at 4 weeks',            '2025-09-29', ''),
    (v_farm_id, v_sh027, '2025-09-01', 'vaccination', 'Lamb vaccination – Enterotoxemia',     'First dose at 4 weeks',            '2025-09-29', ''),
    (v_farm_id, v_sh008, '2025-08-15', 'deworming',   'Levamisole drench',                    'Routine deworming, whole flock',   '2025-11-15', ''),
    (v_farm_id, v_sh014, '2025-08-15', 'deworming',   'Levamisole drench',                    'Routine deworming, whole flock',   '2025-11-15', ''),
    (v_farm_id, v_sh011, '2025-07-02', 'injury',      'Wound cleaned, iodine applied',        'Wire cut on rear leg',             '2025-07-09', ''),
    (v_farm_id, v_sh032, '2025-04-10', 'vet_visit',   'Palliative care',                      'Old age decline, euthanised',      null,         'Dr. Coetzee'),
    (v_farm_id, v_sh009, '2025-09-20', 'vaccination', 'Pulpy Kidney booster',                 'Pre-lambing vaccination',          null,         '');

  -- ── Births ─────────────────────────────────────────
  insert into births (farm_id, date, mother_id, father_id, lamb_count, lamb_ids, type, stillborns, notes) values
    (v_farm_id,'2025-10-01',v_sh009,v_sh003,1,array[v_sh030::text],'single',  0,'Easy birth, lamb healthy'),
    (v_farm_id,'2025-09-22',v_sh015,v_sh003,1,array[v_sh029::text],'single',  0,''),
    (v_farm_id,'2025-09-15',v_sh006,v_sh002,1,array[v_sh028::text],'single',  0,''),
    (v_farm_id,'2025-08-03',v_sh005,v_sh001,2,array[v_sh026::text,v_sh027::text],'twins',0,'Both lambs strong'),
    (v_farm_id,'2025-07-18',v_sh008,v_sh001,2,array[v_sh022::text,v_sh023::text],'twins',0,'Twin wethers, weaned'),
    (v_farm_id,'2025-06-12',v_sh006,v_sh002,1,array[v_sh024::text],'single',  0,''),
    (v_farm_id,'2025-05-29',v_sh015,v_sh003,1,array[v_sh025::text],'single',  0,''),
    (v_farm_id,'2025-03-14',v_sh017,v_sh001,2,'{}','twins',  2,'Both stillborn, ewe recovered well'),
    (v_farm_id,'2025-02-07',v_sh014,v_sh001,1,'{}','single', 0,'Lamb sold at weaning'),
    (v_farm_id,'2024-11-20',v_sh018,v_sh002,3,'{}','triplets',1,'One stillborn, two lambs sold');

  -- ── Breeding Records ───────────────────────────────
  insert into breeding_records (farm_id, ewe_id, ram_id, mating_date, expected_lambing_date, status, lambs_produced, notes) values
    (v_farm_id,v_sh004,v_sh001,'2025-12-09','2026-05-08','pregnant',0,'Single confirmed by scan'),
    (v_farm_id,v_sh005,v_sh001,'2025-12-09','2026-05-08','pregnant',0,'Twins confirmed by scan'),
    (v_farm_id,v_sh009,v_sh003,'2025-06-02','2025-10-28','lambed',  1,'Single lamb, healthy'),
    (v_farm_id,v_sh016,v_sh001,'2026-01-15','2026-06-14','pregnant',0,'First pregnancy, monitoring closely'),
    (v_farm_id,v_sh015,v_sh003,'2025-04-20','2025-09-17','lambed',  1,''),
    (v_farm_id,v_sh006,v_sh002,'2025-04-18','2025-09-14','lambed',  1,''),
    (v_farm_id,v_sh017,v_sh001,'2024-11-15','2025-04-12','failed',  0,'Stillborns – see birth record'),
    (v_farm_id,v_sh008,v_sh001,'2025-02-20','2025-07-19','lambed',  2,'Twin wethers, weaned');

  -- ── Transactions ───────────────────────────────────
  insert into transactions (farm_id, type, date, sheep_ids, count, price_per_head, total_amount, party, notes) values
    (v_farm_id,'purchase','2024-03-05',array[v_sh017::text],1,1800,1800, 'Rooiwal Stud Farm',       'Registered Suffolk ewe'),
    (v_farm_id,'purchase','2024-03-05',array[v_sh018::text],1,1750,1750, 'Rooiwal Stud Farm',       'Registered Suffolk ewe'),
    (v_farm_id,'sale',    '2025-01-18',array[v_sh031::text],1,950, 950,  'Van Wyk Boerdery',        'Mature wether, good weight'),
    (v_farm_id,'sale',    '2025-02-28','{}',                2,820, 1640, 'Spar Butchery',            'Two wethers from Nov lambing'),
    (v_farm_id,'purchase','2025-03-10',array[v_sh003::text],1,3200,3200, 'Dohne Merino Society',    'Registered Dohne ram'),
    (v_farm_id,'sale',    '2025-04-15','{}',                5,780, 3900, 'Weekly Livestock Auction', 'Spring wethers'),
    (v_farm_id,'sale',    '2025-06-20','{}',                3,850, 2550, 'Piet Marais',              ''),
    (v_farm_id,'sale',    '2025-08-12','{}',                2,900, 1800, 'Weekly Livestock Auction', 'Weaned lambs');

  -- ── Tasks ──────────────────────────────────────────
  insert into tasks (farm_id, title, category, due_date, priority, completed, area_id, notes) values
    (v_farm_id,'Vaccinate North & South Paddock flocks',    'vaccination','2026-05-10','high',  false,v_area1,'Annual Pulpy Kidney + Tetanus booster'),
    (v_farm_id,'Move pregnant ewes to Lambing Pen',         'movement',  '2026-05-05','high',  false,v_area4,'E-001, E-002, E-013 due in May'),
    (v_farm_id,'Deworming – whole flock',                   'health',    '2026-05-20','medium',false,null,   'Levamisole drench, 3-month cycle'),
    (v_farm_id,'Follow-up on E-008 footrot treatment',      'health',    '2026-05-02','high',  false,v_area6,'Check hoof, re-spray if needed'),
    (v_farm_id,'Follow-up E-009 eye infection',             'health',    '2026-05-01','high',  false,v_area6,'Check with Dr. Coetzee'),
    (v_farm_id,'Weigh lambs in Lambing Pen',                'general',   '2026-05-08','medium',false,v_area4,'L-001 through L-005'),
    (v_farm_id,'Fix water trough in East Paddock',          'maintenance','2026-04-30','medium',false,v_area3,'Leak on the side joint'),
    (v_farm_id,'Rotational graze – move flock to East Paddock','general','2026-05-15','low',   false,v_area3,'Grass ready after 3-week rest'),
    (v_farm_id,'Pregnancy check – E-013 Hazel',             'health',    '2026-05-06','medium',false,null,   'Confirm pregnancy status'),
    (v_farm_id,'Sort and tag new lambs',                    'general',   '2026-04-10','high',  true, null,   'Done – all tagged'),
    (v_farm_id,'Ram camp fence repair',                     'maintenance','2026-03-20','high',  true, v_area5,'Fixed north-east corner post'),
    (v_farm_id,'Order feed supplements for lambing',        'general',   '2026-05-03','medium',false,null,   'Lick blocks + creep feed for lambs');

  -- ── Deaths ─────────────────────────────────────────
  insert into deaths (farm_id, sheep_id, date, cause, notes) values
    (v_farm_id,v_sh032,'2025-04-10','Old age',   'Heather, 6 years old. Natural death.'),
    (v_farm_id,null,   '2025-03-14','Stillborn', 'Two stillborn lambs from E-014 (Ivy)'),
    (v_farm_id,null,   '2024-11-20','Stillborn', 'One stillborn lamb from E-015 (Poppy)');

end $$;

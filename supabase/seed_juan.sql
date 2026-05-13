-- ══════════════════════════════════════════════════════
--  Juan Tester — Rooiberg Plaas seed data
--  Run in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════

do $$
declare
  v_user_id  uuid := 'c1d2e3f4-a5b6-7c8d-9e0f-a1b2c3d4e5f6';
  v_farm_id  uuid := gen_random_uuid();

  -- areas
  v_area1 uuid := gen_random_uuid();
  v_area2 uuid := gen_random_uuid();
  v_area3 uuid := gen_random_uuid();
  v_area4 uuid := gen_random_uuid();
  v_area5 uuid := gen_random_uuid();

  -- rams
  v_r1 uuid := gen_random_uuid();
  v_r2 uuid := gen_random_uuid();

  -- ewes
  v_e1  uuid := gen_random_uuid();
  v_e2  uuid := gen_random_uuid();
  v_e3  uuid := gen_random_uuid();
  v_e4  uuid := gen_random_uuid();
  v_e5  uuid := gen_random_uuid();
  v_e6  uuid := gen_random_uuid();
  v_e7  uuid := gen_random_uuid();
  v_e8  uuid := gen_random_uuid();
  v_e9  uuid := gen_random_uuid();
  v_e10 uuid := gen_random_uuid();
  v_e11 uuid := gen_random_uuid();
  v_e12 uuid := gen_random_uuid();

  -- wethers
  v_w1 uuid := gen_random_uuid();
  v_w2 uuid := gen_random_uuid();
  v_w3 uuid := gen_random_uuid();

  -- lambs
  v_l1 uuid := gen_random_uuid();
  v_l2 uuid := gen_random_uuid();
  v_l3 uuid := gen_random_uuid();
  v_l4 uuid := gen_random_uuid();

  -- sold/dead
  v_sold1 uuid := gen_random_uuid();
  v_dead1 uuid := gen_random_uuid();

begin

-- ── 1. Auth user ────────────────────────────────────────────────────────────
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_user_meta_data, raw_app_meta_data,
  is_super_admin, confirmation_token, recovery_token,
  email_change_token_new, email_change
) values (
  v_user_id,
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test2mail@mail.com',
  crypt('Tester2025', gen_salt('bf')),
  now(), now(), now(),
  '{"name":"Juan Tester"}',
  '{"provider":"email","providers":["email"]}',
  false, '', '', '', ''
) on conflict (id) do nothing;

-- ── 2. Profile ───────────────────────────────────────────────────────────────
insert into profiles (id, name, initials, email)
values (v_user_id, 'Juan Tester', 'JT', 'test2mail@mail.com')
on conflict (id) do nothing;

-- ── 3. Farm ──────────────────────────────────────────────────────────────────
insert into farms (id, name, location, season, created_by)
values (v_farm_id, 'Rooiberg Plaas', 'Western Cape, South Africa', 'Season 2025', v_user_id);

insert into farm_members (farm_id, user_id, role)
values (v_farm_id, v_user_id, 'owner');

-- ── 4. Areas ─────────────────────────────────────────────────────────────────
insert into areas (id, farm_id, name, type, capacity, description) values
  (v_area1, v_farm_id, 'Groot Weiveld',    'pasture', 90,  'Main grazing camp, rye grass and fynbos mix'),
  (v_area2, v_farm_id, 'Klein Weiveld',    'pasture', 50,  'Kikuyu grass, good for young ewes and lambs'),
  (v_area3, v_farm_id, 'Lam Kraal',        'pen',     25,  'Lambing pen, sheltered from wind'),
  (v_area4, v_farm_id, 'Ram Kamp',         'camp',    8,   'Separate camp for rams when not breeding'),
  (v_area5, v_farm_id, 'Siek Kraal',       'pen',     10,  'Isolation and treatment pen');

-- ── 5. Sheep — Rams ──────────────────────────────────────────────────────────
insert into sheep (id, farm_id, tag_number, name, sex, breed, date_of_birth, area_id, status, weight, notes) values
  (v_r1, v_farm_id, 'R-001', 'Goliath', 'ram', 'Dorper',  '2020-03-12', v_area4, 'healthy', 110.0, 'Excellent confirmation, proven sire'),
  (v_r2, v_farm_id, 'R-002', 'Samson',  'ram', 'Merino',  '2021-08-05', v_area4, 'healthy', 94.5,  'High wool clip, calm temperament');

-- ── 5. Sheep — Ewes ──────────────────────────────────────────────────────────
insert into sheep (id, farm_id, tag_number, name, sex, breed, date_of_birth, area_id, status, weight, mother_id, father_id, notes) values
  (v_e1,  v_farm_id, 'E-001', 'Sannie',   'ewe', 'Dorper', '2021-05-14', v_area1, 'pregnant', 72.0, null, v_r1, 'Second pregnancy, twins expected'),
  (v_e2,  v_farm_id, 'E-002', 'Miems',    'ewe', 'Dorper', '2020-11-20', v_area3, 'pregnant', 68.5, null, v_r1, 'Due mid-May, first lambing'),
  (v_e3,  v_farm_id, 'E-003', 'Bettie',   'ewe', 'Merino', '2021-02-08', v_area1, 'healthy',  65.0, null, v_r2, 'Good wool quality'),
  (v_e4,  v_farm_id, 'E-004', 'Katrien',  'ewe', 'Merino', '2020-09-17', v_area1, 'healthy',  69.5, null, v_r2, ''),
  (v_e5,  v_farm_id, 'E-005', 'Sofie',    'ewe', 'Dorper', '2022-01-30', v_area2, 'healthy',  61.0, null, v_r1, ''),
  (v_e6,  v_farm_id, 'E-006', 'Ralie',    'ewe', 'Dorper', '2021-07-11', v_area1, 'pregnant', 70.0, null, v_r1, 'Third pregnancy, good mother'),
  (v_e7,  v_farm_id, 'E-007', 'Hester',   'ewe', 'Merino', '2020-04-22', v_area2, 'healthy',  67.0, null, v_r2, 'Consistent 4.5kg wool clip'),
  (v_e8,  v_farm_id, 'E-008', 'Drieka',   'ewe', 'Merino', '2022-03-15', v_area1, 'healthy',  63.5, null, v_r2, ''),
  (v_e9,  v_farm_id, 'E-009', 'Lenie',    'ewe', 'Dorper', '2021-10-01', v_area5, 'sick',     58.0, null, v_r1, 'Treating for respiratory infection, on antibiotics'),
  (v_e10, v_farm_id, 'E-010', 'Trynie',   'ewe', 'Dorper', '2020-06-18', v_area1, 'healthy',  71.0, null, v_r1, 'Best dam on the farm, 8 lambs lifetime'),
  (v_e11, v_farm_id, 'E-011', 'Magda',    'ewe', 'Merino', '2022-05-03', v_area2, 'healthy',  60.0, null, v_r2, ''),
  (v_e12, v_farm_id, 'E-012', 'Francina', 'ewe', 'Dorper', '2021-12-25', v_area1, 'healthy',  66.0, null, v_r1, 'Born Christmas Day');

-- ── 5. Sheep — Wethers ───────────────────────────────────────────────────────
insert into sheep (id, farm_id, tag_number, name, sex, breed, date_of_birth, area_id, status, weight, mother_id, father_id, notes) values
  (v_w1, v_farm_id, 'W-001', '', 'wether', 'Dorper', '2024-04-10', v_area1, 'healthy', 58.0, v_e10, v_r1, 'Market ready end of month'),
  (v_w2, v_farm_id, 'W-002', '', 'wether', 'Dorper', '2024-04-10', v_area1, 'healthy', 55.5, v_e10, v_r1, 'Market ready end of month'),
  (v_w3, v_farm_id, 'W-003', '', 'wether', 'Merino', '2024-06-22', v_area2, 'healthy', 49.0, v_e3,  v_r2, '');

-- ── 5. Sheep — Lambs ─────────────────────────────────────────────────────────
insert into sheep (id, farm_id, tag_number, name, sex, breed, date_of_birth, area_id, status, weight, mother_id, father_id, notes) values
  (v_l1, v_farm_id, 'L-001', 'Bolletjie', 'lamb', 'Dorper', '2025-02-14', v_area3, 'healthy', 18.5, v_e6, v_r1, 'Fastest grower this season'),
  (v_l2, v_farm_id, 'L-002', '',           'lamb', 'Dorper', '2025-02-14', v_area3, 'healthy', 16.0, v_e6, v_r1, 'Twin with L-001'),
  (v_l3, v_farm_id, 'L-003', 'Kleinbaas', 'lamb', 'Merino', '2025-03-08', v_area2, 'healthy', 14.5, v_e4, v_r2, ''),
  (v_l4, v_farm_id, 'L-004', '',           'lamb', 'Dorper', '2025-04-02', v_area3, 'healthy', 10.0, v_e1, v_r1, 'Newborn, healthy');

-- ── 5. Sheep — Sold/Dead (history) ───────────────────────────────────────────
insert into sheep (id, farm_id, tag_number, name, sex, breed, date_of_birth, area_id, status, weight, notes) values
  (v_sold1, v_farm_id, 'W-004', '', 'wether', 'Dorper', '2023-05-10', null, 'sold', 62.0, 'Sold to Joubert farm, good price'),
  (v_dead1, v_farm_id, 'E-013', 'Ouma',   'ewe',    'Merino', '2018-08-14', null, 'dead',  0.0,  'Old age, 7 years');

-- ── 6. Health records ────────────────────────────────────────────────────────
insert into health_records (farm_id, sheep_id, date, type, treatment, vet, follow_up_date, notes) values
  (v_farm_id, v_e9,  '2025-04-28', 'treatment',    'Penicillin injection 10ml',       'Dr. Botha',  '2025-05-05', 'Respiratory infection, isolate from flock'),
  (v_farm_id, v_e9,  '2025-05-05', 'treatment',    'Second penicillin course',        'Dr. Botha',  '2025-05-12', 'Improving but keep isolated'),
  (v_farm_id, v_r1,  '2025-03-15', 'vaccination',  'Multivax P annual booster',       null,         null,         'All clear'),
  (v_farm_id, v_r2,  '2025-03-15', 'vaccination',  'Multivax P annual booster',       null,         null,         ''),
  (v_farm_id, null,  '2025-03-15', 'vaccination',  'Multivax P — full flock',         null,         null,         '28 ewes and wethers treated'),
  (v_farm_id, null,  '2025-03-20', 'dipping',      'Triatix pour-on, full flock',     null,         '2025-04-20', 'Tick and lice prevention'),
  (v_farm_id, v_e1,  '2025-04-10', 'checkup',      'Pre-lambing examination',         'Dr. Botha',  null,         'Twins confirmed on scan'),
  (v_farm_id, v_e2,  '2025-04-10', 'checkup',      'Pre-lambing examination',         'Dr. Botha',  null,         'Single lamb, good position'),
  (v_farm_id, v_e6,  '2025-01-20', 'checkup',      'Post-lambing check',              null,         null,         'Good recovery, lambs nursing well'),
  (v_farm_id, v_w1,  '2025-04-01', 'treatment',    'Footrot spray — zinc sulphate',   null,         '2025-04-15', 'Mild footrot, left front hoof'),
  (v_farm_id, null,  '2025-01-10', 'drenching',    'Prodose Arrow — full flock',      null,         '2025-07-10', 'Internal parasite control'),
  (v_farm_id, v_l1,  '2025-02-20', 'vaccination',  'Lamb pulpy kidney vaccine',       null,         '2025-03-06', '');

-- ── 7. Births ────────────────────────────────────────────────────────────────
insert into births (farm_id, date, mother_id, father_id, lamb_count, lamb_ids, type, stillborns, notes) values
  (v_farm_id, '2025-02-14', v_e6, v_r1, 2, ARRAY[v_l1::text, v_l2::text], 'twins',    0, 'Easy birth, both lambs nursing within the hour'),
  (v_farm_id, '2025-03-08', v_e4, v_r2, 1, ARRAY[v_l3::text],             'single',   0, 'Good strong lamb'),
  (v_farm_id, '2025-04-02', v_e1, v_r1, 1, ARRAY[v_l4::text],             'single',   0, 'Newborn, healthy start'),
  (v_farm_id, '2024-08-15', v_e10, v_r1, 2, ARRAY[]::text[],               'twins',   0, 'Both lambs sold at weaning'),
  (v_farm_id, '2024-09-22', v_e3,  v_r2, 1, ARRAY[]::text[],               'single',  0, 'Healthy ewe lamb, kept as replacement'),
  (v_farm_id, '2024-10-05', v_e7,  v_r2, 2, ARRAY[]::text[],               'twins',   1, 'One stillborn, ewe recovered well'),
  (v_farm_id, '2024-11-18', v_e12, v_r1, 1, ARRAY[]::text[],               'single',  0, ''),
  (v_farm_id, '2025-01-30', v_e2,  v_r1, 1, ARRAY[]::text[],               'single',  0, 'Good size lamb');

-- ── 8. Breeding records ──────────────────────────────────────────────────────
insert into breeding_records (farm_id, ewe_id, ram_id, mating_date, expected_lambing_date, status, lambs_produced, notes) values
  (v_farm_id, v_e1,  v_r1, '2024-12-01', '2025-05-10', 'pregnant', 0, 'Twins on scan'),
  (v_farm_id, v_e2,  v_r1, '2024-12-05', '2025-05-14', 'pregnant', 0, 'Single confirmed'),
  (v_farm_id, v_e6,  v_r1, '2024-09-20', '2025-02-14', 'lambed',   2, 'Twins, both survived'),
  (v_farm_id, v_e4,  v_r2, '2024-10-10', '2025-03-08', 'lambed',   1, 'Single ewe lamb'),
  (v_farm_id, v_e3,  v_r2, '2024-10-10', '2025-03-09', 'lambed',   1, 'Single ram lamb'),
  (v_farm_id, v_e10, v_r1, '2024-05-01', '2024-09-28', 'lambed',   2, 'Twins born Aug, sold at weaning'),
  (v_farm_id, v_e7,  v_r2, '2024-06-15', '2024-11-12', 'lambed',   1, 'One of twins stillborn'),
  (v_farm_id, v_e6,  v_r1, '2025-04-15', '2025-09-18', 'mated',    0, 'New cycle, mated last week');

-- ── 9. Transactions ──────────────────────────────────────────────────────────
insert into transactions (farm_id, type, date, sheep_ids, count, price_per_head, total_amount, party, notes) values
  (v_farm_id, 'sale',     '2025-04-20', ARRAY[v_sold1::text], 1,  820.00, 820.00,   'Joubert & Seuns',        'W-004 wether, live mass 62kg'),
  (v_farm_id, 'sale',     '2025-03-01', ARRAY[]::text[],       6, 750.00, 4500.00,  'Agri Wes Abattoir',      'Batch of 6 wethers, good grade'),
  (v_farm_id, 'purchase', '2025-01-15', ARRAY[]::text[],       1, 4200.00, 4200.00, 'Venter Stoet',           'Bought Samson (R-002), registered Merino'),
  (v_farm_id, 'sale',     '2024-12-10', ARRAY[]::text[],       4, 680.00, 2720.00,  'Agri Wes Abattoir',      'Year-end slaughter batch'),
  (v_farm_id, 'sale',     '2024-10-05', ARRAY[]::text[],       2, 1100.00, 2200.00, 'Private — Du Plessis',   'Two ewe lambs as breeding stock'),
  (v_farm_id, 'purchase', '2024-09-01', ARRAY[]::text[],       0, 0.00,    3800.00, 'Boland Veevoere',        'Bulk lucerne and supplement cubes'),
  (v_farm_id, 'sale',     '2024-07-22', ARRAY[]::text[],       8, 620.00, 4960.00,  'Agri Wes Abattoir',      'Mid-year slaughter, good prices'),
  (v_farm_id, 'purchase', '2024-06-10', ARRAY[]::text[],       0, 0.00,    1250.00, 'Agri SA',                'Vaccines, drenches, pour-on stock');

-- ── 10. Tasks ────────────────────────────────────────────────────────────────
insert into tasks (farm_id, title, category, due_date, priority, completed, area_id, notes) values
  (v_farm_id, 'Check on Lenie daily — respiratory treatment',   'health',       '2025-05-13', 'high',   false, v_area5, 'Continue antibiotic course until 12 May'),
  (v_farm_id, 'Prepare lambing pen for Sannie and Miems',       'general',      '2025-05-08', 'high',   false, v_area3, 'Both due mid-May'),
  (v_farm_id, 'Foot trimming — whole flock',                    'health',       '2025-05-20', 'medium', false, null,    'Do after morning dip'),
  (v_farm_id, 'Second dip rotation',                            'health',       '2025-04-20', 'medium', true,  null,    'Triatix pour-on, completed on schedule'),
  (v_farm_id, 'Sell W-001 and W-002 at auction',                'general',      '2025-05-30', 'medium', false, null,    'Both market-ready, target R850/head'),
  (v_farm_id, 'Repair north fence Groot Weiveld',               'maintenance',  '2025-05-15', 'high',   false, v_area1, 'Three poles broken after last storm'),
  (v_farm_id, 'Weigh all lambs and record growth',              'general',      '2025-05-10', 'medium', false, null,    'Monthly weigh-in'),
  (v_farm_id, 'Order lucerne bales for winter',                 'feeding',      '2025-06-01', 'medium', false, null,    'Min 80 bales, call Boland Veevoere'),
  (v_farm_id, 'Vaccinate new lambs — pulpy kidney',             'vaccination',  '2025-04-20', 'high',   true,  null,    'Done for L-001 and L-002, L-003 and L-004 due'),
  (v_farm_id, 'Annual vet visit — teeth and condition scoring', 'health',       '2025-06-15', 'low',    false, null,    'Book Dr. Botha'),
  (v_farm_id, 'Move wethers to Groot Weiveld after selling',    'movement',     '2025-06-01', 'low',    false, v_area1, 'Rebalance grazing pressure'),
  (v_farm_id, 'Internal parasite drench — second round',        'health',       '2025-07-10', 'medium', false, null,    'Due 6 months after Jan drench');

-- ── 11. Deaths ───────────────────────────────────────────────────────────────
insert into deaths (farm_id, sheep_id, date, cause, notes) values
  (v_farm_id, v_dead1, '2025-02-01', 'old_age',    'Ouma passed peacefully, 7 years old, 14 lambs lifetime'),
  (v_farm_id, null,    '2024-11-18', 'birth',      'Stillborn twin — ewe Francina''s second lambing'),
  (v_farm_id, null,    '2024-08-03', 'predator',   'Lamb lost to jackal — reinforced lambing pen after this');

end;
$$;

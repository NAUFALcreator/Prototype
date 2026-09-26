-- ChargeKita database schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' atau 'operator'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(20) NOT NULL,               -- 'spklu' atau 'battery_swap'
  address VARCHAR(255),
  connector_type VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'available', -- available, in_use, full, disrupted
  battery_available INT DEFAULT 0,
  battery_total INT DEFAULT 0,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Kalau tabel stations sudah ada dari sebelumnya (tanpa kolom koordinat), jalankan ini:
-- ALTER TABLE stations ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
-- ALTER TABLE stations ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  station_id INT REFERENCES stations(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  activity_type VARCHAR(50) NOT NULL,      -- charging, battery_swap, status_change, report_issue
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- contoh data awal (opsional)
INSERT INTO stations (name, type, address, connector_type, status, battery_available, battery_total, latitude, longitude)
VALUES
 ('SPKLU Malioboro', 'spklu', 'Jl. Malioboro, Yogyakarta', 'Type 2', 'available', 0, 0, -7.7925, 110.3656),
 ('Battery Swap UGM', 'battery_swap', 'Bulaksumur, Yogyakarta', '-', 'in_use', 8, 20, -7.7712, 110.3776),
 ('SPKLU Ambarukmo Plaza', 'spklu', 'Jl. Laksda Adisucipto, Yogyakarta', 'CCS2', 'disrupted', 0, 0, -7.7809, 110.4034)
ON CONFLICT DO NOTHING;

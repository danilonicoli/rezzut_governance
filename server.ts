import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("governance.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS governance_cycles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS okrs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cycle_id INTEGER,
    title TEXT NOT NULL,
    owner TEXT,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'on_track',
    FOREIGN KEY(cycle_id) REFERENCES governance_cycles(id)
  );

  CREATE TABLE IF NOT EXISTS key_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    okr_id INTEGER,
    title TEXT NOT NULL,
    target_value REAL,
    current_value REAL DEFAULT 0,
    unit TEXT,
    FOREIGN KEY(okr_id) REFERENCES okrs(id)
  );

  CREATE TABLE IF NOT EXISTS risks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    impact INTEGER,
    probability INTEGER,
    status TEXT DEFAULT 'monitored',
    owner TEXT
  );

  CREATE TABLE IF NOT EXISTS kpis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    target REAL,
    actual REAL,
    unit TEXT,
    trend TEXT
  );

  CREATE TABLE IF NOT EXISTS policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    version TEXT,
    status TEXT DEFAULT 'published',
    last_updated TEXT
  );
`);

// Seed initial data if empty
const cycleCount = db.prepare("SELECT COUNT(*) as count FROM governance_cycles").get() as { count: number };
if (cycleCount.count === 0) {
  const insertCycle = db.prepare("INSERT INTO governance_cycles (name, start_date, end_date) VALUES (?, ?, ?)");
  const cycleId = insertCycle.run("Ciclo Estratégico 2024", "2024-01-01", "2024-12-31").lastInsertRowid;

  const insertOkr = db.prepare("INSERT INTO okrs (cycle_id, title, owner, progress, status) VALUES (?, ?, ?, ?, ?)");
  insertOkr.run(cycleId, "Expandir Presença no Mercado Industrial", "Diretor Comercial", 65, "on_track");
  insertOkr.run(cycleId, "Excelência em SGI e Conformidade", "Diretor Operacional", 40, "at_risk");

  const insertKpi = db.prepare("INSERT INTO kpis (title, target, actual, unit, trend) VALUES (?, ?, ?, ?, ?)");
  insertKpi.run("Receita Bruta", 1000000, 850000, "BRL", "up");
  insertKpi.run("NPS Cliente", 85, 82, "%", "stable");

  const insertRisk = db.prepare("INSERT INTO risks (title, impact, probability, status, owner) VALUES (?, ?, ?, ?, ?)");
  insertRisk.run("Oscilação de Preços de Insumos", 4, 3, "monitored", "Compras");
  insertRisk.run("Cibersegurança e Dados", 5, 2, "mitigated", "TI");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/dashboard", (req, res) => {
    const okrs = db.prepare("SELECT * FROM okrs").all();
    const kpis = db.prepare("SELECT * FROM kpis").all();
    const risks = db.prepare("SELECT * FROM risks").all();
    const cycles = db.prepare("SELECT * FROM governance_cycles").all();
    res.json({ okrs, kpis, risks, cycles });
  });

  app.get("/api/okrs", (req, res) => {
    const okrs = db.prepare("SELECT * FROM okrs").all();
    res.json(okrs);
  });

  app.get("/api/risks", (req, res) => {
    const risks = db.prepare("SELECT * FROM risks").all();
    res.json(risks);
  });

  app.get("/api/kpis", (req, res) => {
    const kpis = db.prepare("SELECT * FROM kpis").all();
    res.json(kpis);
  });

  app.get("/api/policies", (req, res) => {
    const policies = db.prepare("SELECT * FROM policies").all();
    res.json(policies);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

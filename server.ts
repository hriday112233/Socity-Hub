import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("society.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'resident',
    is_premium INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    type TEXT, -- 'deposit', 'withdraw'
    method TEXT, -- 'upi', 'razorpay'
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    base_price REAL DEFAULT 2100.0,
    is_available INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    service_id INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    refund_amount REAL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(service_id) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    subject TEXT,
    description TEXT,
    status TEXT DEFAULT 'open',
    resolution_message TEXT,
    complaint_number TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    priority TEXT DEFAULT 'normal',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS amenities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    capacity INTEGER,
    status TEXT DEFAULT 'available'
  );

  CREATE TABLE IF NOT EXISTS amenity_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amenity_id INTEGER,
    booking_date DATE,
    time_slot TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(amenity_id) REFERENCES amenities(id)
  );
`);

// Migration: Add missing columns to users table
const columns = db.prepare("PRAGMA table_info(users)").all() as any[];
const columnNames = columns.map(c => c.name);

if (!columnNames.includes('subscription_expiry')) {
  db.exec("ALTER TABLE users ADD COLUMN subscription_expiry DATETIME");
}
if (!columnNames.includes('balance')) {
  db.exec("ALTER TABLE users ADD COLUMN balance REAL DEFAULT 0.0");
}
if (!columnNames.includes('created_at')) {
  db.exec("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP");
}

// Migration for complaints table
const complaintColumns = db.prepare("PRAGMA table_info(complaints)").all() as any[];
const complaintColumnNames = complaintColumns.map(c => c.name);

if (!complaintColumnNames.includes('resolution_message')) {
  db.exec("ALTER TABLE complaints ADD COLUMN resolution_message TEXT");
}
if (!complaintColumnNames.includes('complaint_number')) {
  db.exec("ALTER TABLE complaints ADD COLUMN complaint_number TEXT UNIQUE");
}

// Migration for bookings table
const bookingColumns = db.prepare("PRAGMA table_info(bookings)").all() as any[];
const bookingColumnNames = bookingColumns.map(c => c.name);

if (!bookingColumnNames.includes('refund_amount')) {
  db.exec("ALTER TABLE bookings ADD COLUMN refund_amount REAL DEFAULT 0");
}
if (!bookingColumnNames.includes('created_at')) {
  db.exec("ALTER TABLE bookings ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP");
}

// Migration for services table
const serviceColumns = db.prepare("PRAGMA table_info(services)").all() as any[];
const serviceColumnNames = serviceColumns.map(c => c.name);

if (!serviceColumnNames.includes('is_available')) {
  db.exec("ALTER TABLE services ADD COLUMN is_available INTEGER DEFAULT 1");
}

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (name, email, role, is_premium) VALUES (?, ?, ?, ?)").run("Admin User", "admin@society.com", "admin", 0);
  db.prepare("INSERT INTO users (name, email, role, is_premium) VALUES (?, ?, ?, ?)").run("John Doe", "john@society.com", "resident", 1);
  
  const services = [
    ['Electrician', 'Maintenance', 500],
    ['Plumber', 'Maintenance', 500],
    ['Milk Delivery', 'Daily Needs', 100],
    ['Lawyer', 'Legal', 2000],
    ['Doctor', 'Healthcare', 1000],
    ['RTI Filing', 'Legal', 500],
    ['Carpenter', 'Maintenance', 600],
    ['House Cleaning', 'Maintenance', 800],
    ['White Wash', 'Maintenance', 5000],
    ['Painting', 'Maintenance', 8000],
    ['Grocery Shop', 'Daily Needs', 200],
    ['General Store', 'Daily Needs', 150],
    ['Stationery Store', 'Daily Needs', 100],
    ['Book Store', 'Daily Needs', 300],
    ['Sabzi Wala', 'Daily Needs', 50],
    ['Fruit Wala', 'Daily Needs', 100],
    ['Security Guard', 'Security', 1500],
    ['Garbage Collection', 'Sanitation', 200],
    ['Pest Control', 'Maintenance', 1200],
    ['Laundry Service', 'Daily Needs', 300],
    ['Car Wash', 'Maintenance', 400],
    ['Internet Support', 'Technical', 500],
    ['Gas Delivery', 'Daily Needs', 1100],
    ['AC Servicing', 'Maintenance', 1500],
    ['Pharmacy Delivery', 'Healthcare', 50],
    ['Lab Sample Collection', 'Healthcare', 200],
    ['Pet Grooming', 'Daily Needs', 800],
    ['Courier Pickup', 'Daily Needs', 50],
    ['Broadband Setup', 'Technical', 1000],
    ['Patient Attendant', 'Healthcare', 1200],
    ['Maid Service', 'Daily Needs', 500],
    ['Job Provider', 'Professional', 0],
    ['Cosmetic Store', 'Daily Needs', 200],
    ['Beautician', 'Personal Care', 1500],
    ['Driver', 'Transportation', 800],
    ['Cook', 'Daily Needs', 600],
    ['App Designer', 'Technical', 5000],
    ['App Developer', 'Technical', 8000],
    ['Yoga Trainer', 'Healthcare', 1000],
    ['Physiotherapist', 'Healthcare', 1500],
    ['Tutor', 'Education', 500],
    ['Music Teacher', 'Education', 800],
    ['Dance Teacher', 'Education', 800],
    ['Event Planner', 'Professional', 5000],
    ['Photographer', 'Professional', 3000],
    ['Videographer', 'Professional', 4000],
    ['Makeup Artist', 'Personal Care', 2500],
    ['Tailor', 'Personal Care', 300],
    ['Barber', 'Personal Care', 200],
    ['Gardener', 'Maintenance', 400],
    ['Interior Designer', 'Professional', 10000],
    ['Architect', 'Professional', 15000],
    ['Civil Engineer', 'Professional', 10000],
    ['Electrician (Industrial)', 'Maintenance', 1500],
    ['HVAC Technician', 'Maintenance', 2000],
    ['CCTV Installation', 'Security', 2500],
    ['Fire Safety Audit', 'Security', 5000],
    ['Legal Consultant', 'Legal', 3000],
    ['Tax Consultant', 'Legal', 2000],
    ['CA Services', 'Professional', 5000],
    ['Digital Marketer', 'Technical', 3000],
    ['SEO Expert', 'Technical', 4000],
    ['Content Writer', 'Technical', 1500],
    ['Graphic Designer', 'Technical', 2000],
    ['UI/UX Designer', 'Technical', 4000],
    ['Social Media Manager', 'Technical', 3000],
    ['Data Entry Operator', 'Technical', 500],
    ['Virtual Assistant', 'Technical', 1000],
    ['Dog Walker', 'Daily Needs', 300],
    ['Baby Sitter', 'Daily Needs', 600],
    ['Elderly Care', 'Healthcare', 1500],
    ['Nursing Staff', 'Healthcare', 2000],
    ['Ambulance Service', 'Healthcare', 1000],
    ['Blood Bank Info', 'Healthcare', 0],
    ['Fitness Coach', 'Healthcare', 1200],
    ['Dietician', 'Healthcare', 1000],
    ['Psychologist', 'Healthcare', 2000],
    ['Astrologer', 'Professional', 1000],
    ['Pandit/Priest', 'Professional', 1500],
    ['Catering Service', 'Professional', 5000],
    ['Flower Delivery', 'Daily Needs', 200],
    ['Gift Shop', 'Daily Needs', 300],
    ['Hardware Store', 'Daily Needs', 500],
    ['Electrical Shop', 'Daily Needs', 400],
    ['Plumbing Shop', 'Daily Needs', 400],
    ['Paint Shop', 'Daily Needs', 1000],
    ['Furniture Repair', 'Maintenance', 800],
    ['Locksmith', 'Maintenance', 500],
    ['Key Maker', 'Maintenance', 200],
    ['Glass Repair', 'Maintenance', 1000],
    ['Aluminum Work', 'Maintenance', 2000],
    ['Welding Service', 'Maintenance', 1500],
    ['Fabrication', 'Maintenance', 5000],
    ['Solar Installation', 'Technical', 10000],
    ['Water Purifier Service', 'Maintenance', 500],
    ['Chimney Cleaning', 'Maintenance', 800],
    ['Sofa Cleaning', 'Maintenance', 1000],
    ['Carpet Cleaning', 'Maintenance', 1200],
    ['Tank Cleaning', 'Maintenance', 1500]
  ];
  const insertService = db.prepare("INSERT INTO services (name, category, base_price) VALUES (?, ?, ?)");
  services.forEach(s => insertService.run(s[0], s[1], s[2]));

  const notices = [
    ['Water Tank Cleaning', 'Water supply will be interrupted on Tuesday from 10 AM to 2 PM.', 'high'],
    ['Annual General Meeting', 'Join us for the AGM this Sunday at the Clubhouse.', 'normal']
  ];
  const insertNotice = db.prepare("INSERT INTO notices (title, content, priority) VALUES (?, ?, ?)");
  notices.forEach(n => insertNotice.run(n[0], n[1], n[2]));

  const amenities = [
    ['Clubhouse', 'Spacious hall for events and gatherings.', 100],
    ['Swimming Pool', 'Olympic sized pool with dedicated kids area.', 50],
    ['Tennis Court', 'Professional grade synthetic court.', 4],
    ['Gym', 'Fully equipped fitness center.', 20]
  ];
  const insertAmenity = db.prepare("INSERT INTO amenities (name, description, capacity) VALUES (?, ?, ?)");
  amenities.forEach(a => insertAmenity.run(a[0], a[1], a[2]));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users").all();
    res.json(users);
  });

  app.get("/api/services", (req, res) => {
    const services = db.prepare("SELECT * FROM services").all();
    res.json(services);
  });

  app.post("/api/services", (req, res) => {
    const { name, category, base_price } = req.body;
    const result = db.prepare("INSERT INTO services (name, category, base_price, is_available) VALUES (?, ?, ?, 1)").run(name, category, base_price);
    res.json({ id: result.lastInsertRowid, success: true });
  });

  app.patch("/api/services/:id", (req, res) => {
    const { id } = req.params;
    const { is_available } = req.body;
    db.prepare("UPDATE services SET is_available = ? WHERE id = ?").run(is_available ? 1 : 0, id);
    res.json({ success: true });
  });

  app.get("/api/bookings", (req, res) => {
    const bookings = db.prepare(`
      SELECT b.*, s.name as service_name, u.name as user_name 
      FROM bookings b 
      JOIN services s ON b.service_id = s.id 
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `).all();
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const { user_id, service_id } = req.body;
    const result = db.prepare("INSERT INTO bookings (user_id, service_id) VALUES (?, ?)").run(user_id, service_id);
    res.json({ id: result.lastInsertRowid, status: 'pending' });
  });

  app.patch("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Logic for refund: Customer gets 100% back, Provider pays the service charge (internal platform logic)
    let refund_amount = 0;
    if (status === 'cancelled') {
      const booking = db.prepare("SELECT b.*, s.base_price, u.is_premium FROM bookings b JOIN services s ON b.service_id = s.id JOIN users u ON b.user_id = u.id WHERE b.id = ?").get(id) as any;
      const paid_amount = booking.is_premium ? booking.base_price / 2 : booking.base_price;
      refund_amount = paid_amount;
    }

    db.prepare("UPDATE bookings SET status = ?, refund_amount = ? WHERE id = ?").run(status, refund_amount, id);
    res.json({ success: true, refund_amount });
  });

  app.get("/api/complaints", (req, res) => {
    const complaints = db.prepare(`
      SELECT c.*, u.name as user_name 
      FROM complaints c 
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `).all();
    res.json(complaints);
  });

  app.post("/api/complaints", (req, res) => {
    const { user_id, subject, description } = req.body;
    const complaint_number = "COMP-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const result = db.prepare("INSERT INTO complaints (user_id, subject, description, complaint_number) VALUES (?, ?, ?, ?)").run(user_id, subject, description, complaint_number);
    res.json({ id: result.lastInsertRowid, complaint_number });
  });

  app.patch("/api/complaints/:id", (req, res) => {
    const { id } = req.params;
    const { status, resolution_message } = req.body;
    db.prepare("UPDATE complaints SET status = ?, resolution_message = ? WHERE id = ?").run(status, resolution_message, id);
    res.json({ success: true });
  });

  app.get("/api/notices", (req, res) => {
    const notices = db.prepare("SELECT * FROM notices ORDER BY created_at DESC").all();
    res.json(notices);
  });

  app.post("/api/notices", (req, res) => {
    const { title, content, priority } = req.body;
    const result = db.prepare("INSERT INTO notices (title, content, priority) VALUES (?, ?, ?)").run(title, content, priority);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/amenities", (req, res) => {
    const amenities = db.prepare("SELECT * FROM amenities").all();
    res.json(amenities);
  });

  app.get("/api/amenity-bookings", (req, res) => {
    const bookings = db.prepare(`
      SELECT ab.*, a.name as amenity_name, u.name as user_name 
      FROM amenity_bookings ab 
      JOIN amenities a ON ab.amenity_id = a.id 
      JOIN users u ON ab.user_id = u.id
      ORDER BY ab.booking_date DESC
    `).all();
    res.json(bookings);
  });

  app.post("/api/amenity-bookings", (req, res) => {
    const { user_id, amenity_id, booking_date, time_slot } = req.body;
    const result = db.prepare("INSERT INTO amenity_bookings (user_id, amenity_id, booking_date, time_slot) VALUES (?, ?, ?, ?)").run(user_id, amenity_id, booking_date, time_slot);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/transactions", (req, res) => {
    const { user_id } = req.query;
    let transactions;
    if (user_id) {
      transactions = db.prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC").all(user_id);
    } else {
      transactions = db.prepare("SELECT t.*, u.name as user_name FROM transactions t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC").all();
    }
    res.json(transactions);
  });

  app.post("/api/transactions", (req, res) => {
    const { user_id, amount, type, method } = req.body;
    const result = db.prepare("INSERT INTO transactions (user_id, amount, type, method, status) VALUES (?, ?, ?, ?, 'completed')").run(user_id, amount, type, method);
    
    // Update user balance
    if (type === 'deposit') {
      db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").run(amount, user_id);
    } else if (type === 'withdraw') {
      db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?").run(amount, user_id);
    }
    
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/reports/registrations", (req, res) => {
    const reports = db.prepare(`
      SELECT date(created_at) as date, count(*) as count 
      FROM users 
      GROUP BY date(created_at) 
      ORDER BY date DESC
    `).all();
    res.json(reports);
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

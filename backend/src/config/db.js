const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jobhunt_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

<<<<<<< HEAD
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to Database:', process.env.DB_NAME || 'jobhunt_db');

    // Create users table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('job_seeker', 'recruiter') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create jobs table per specification
    await connection.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recruiter_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        company VARCHAR(150) NOT NULL,
        location VARCHAR(150),
        type ENUM('full-time', 'part-time', 'contract', 'internship') NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT,
        salary_min INT,
        salary_max INT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_recruiter (recruiter_id),
        INDEX idx_active (is_active),
        INDEX idx_type (type),
        FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create applications table per specification
    await connection.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        applicant_id INT NOT NULL,
        cover_letter TEXT,
        status ENUM('pending', 'reviewed', 'rejected') DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_job (job_id),
        INDEX idx_applicant (applicant_id),
        INDEX idx_status (status),
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Check if jobs table has initial seed data
    const [existingJobs] = await connection.query('SELECT COUNT(*) as count FROM jobs');
    if (existingJobs[0].count === 0) {
      // Find a recruiter user id or fallback to user id 1
      const [recruiters] = await connection.query("SELECT id FROM users WHERE role = 'recruiter' LIMIT 1");
      const recruiterId = recruiters.length > 0 ? recruiters[0].id : 1;

      const sampleJobs = [
        [
          recruiterId,
          'Principal Product Designer, Reality OS',
          'Kinetic Spatial Labs',
          'San Francisco, CA (Hybrid)',
          'full-time',
          'Spearhead foundational ergonomic interfaces and multimodal spatial canvas frameworks for next-generation hardware platforms. Lead system interaction design and spatial canvas architecture.',
          '9+ years experience in multi-modal systems design; Strong mastery of Figma, Three.js, and spatial interaction; Track record of shipping OS-level interfaces.',
          21000000,
          25000000,
          true
        ],
        [
          recruiterId,
          'VP of Brand Systems & Narrative',
          'Verdant Synthetic',
          'Remote (Worldwide)',
          'full-time',
          'Establish the global visual identity and voice of an industrial climate-computing infrastructure firm. Direct internal design labs and agency partners across editorial and film.',
          'Proven executive leadership in creative direction; Exceptional visual and typographic taste; 7+ years in high-growth tech or design agency.',
          24000000,
          28000000,
          true
        ],
        [
          recruiterId,
          'Founding Design Technologist',
          'Mirage Applied AI',
          'New York • SoHo Studio',
          'full-time',
          'Bridge high-fidelity design prototypes and webGL shaders with generative model latency pipelines. First design hire reporting directly to founders.',
          'Deep proficiency in React, Three.js, WebGL, and LLM tooling; Portfolio of creative technology experiments; Self-starter mindset.',
          19500000,
          22000000,
          true
        ],
        [
          recruiterId,
          'Senior Backend Systems Engineer',
          'Aura Cloud Platform',
          'Jakarta • Hybrid',
          'full-time',
          'Architect and maintain high-throughput distributed microservices in Node.js and Go. Ensure zero-downtime database migrations and low-latency cache layers.',
          '5+ years experience in Node.js, MySQL, Redis, and Docker; Solid understanding of REST APIs and OAuth2; Knowledge of cloud deployment.',
          18000000,
          26000000,
          true
        ],
        [
          recruiterId,
          'Director of Digital Experiences',
          'Origami Publishing Co.',
          'London / Hybrid',
          'contract',
          'Reinvent long-form cultural journalism across reader platforms, offline tablet magazines, and bespoke reading rooms.',
          'Leadership in digital publication architecture, editorial typography, and reader research; Minimum 6 years experience in editorial media.',
          18000000,
          21000000,
          true
        ],
        [
          recruiterId,
          'Junior Frontend Developer Intern',
          'Nexus Studios',
          'Jakarta • Onsite',
          'internship',
          'Assist senior engineers in building interactive web components using React, Tailwind CSS, and REST API integration.',
          'Basic proficiency in HTML, CSS, JavaScript, and React; Good collaboration and eagerness to learn modern web standards.',
          4000000,
          6000000,
          true
        ]
      ];

      const insertJobsQuery = `
        INSERT INTO jobs (recruiter_id, title, company, location, type, description, requirements, salary_min, salary_max, is_active)
        VALUES ?
      `;
      await connection.query(insertJobsQuery, [sampleJobs]);
      console.log('Seeded sample jobs into jobs table successfully.');
    }

    // Check if applications table has initial seed data
    const [existingApps] = await connection.query('SELECT COUNT(*) as count FROM applications');
    if (existingApps[0].count === 0) {
      // Find a job seeker user id (or fallback to id 1) and existing job ids
      const [seekers] = await connection.query("SELECT id FROM users WHERE role = 'job_seeker' LIMIT 2");
      const [jobs] = await connection.query("SELECT id FROM jobs LIMIT 3");

      if (seekers.length > 0 && jobs.length > 0) {
        const seeker1Id = seekers[0].id;
        const seeker2Id = seekers.length > 1 ? seekers[1].id : seekers[0].id;

        const sampleApplications = [
          [
            jobs[0].id,
            seeker1Id,
            'Saya memiliki pengalaman lebih dari 4 tahun dalam desain antarmuka dan interaksi spatial computing. Bersemangat untuk bergabung dengan tim!',
            'pending'
          ],
          [
            jobs[1].id,
            seeker2Id,
            'Portofolio brand identity dan narrative design saya terlampir. Sangat tertarik dengan visi industrial climate platform.',
            'reviewed'
          ]
        ];

        if (jobs.length > 2) {
          sampleApplications.push([
            jobs[2].id,
            seeker1Id,
            'Memiliki ketertarikan mendalam dalam arsitektur AI dan WebGL. Siap mengikuti tahap wawancara.',
            'rejected'
          ]);
        }

        const insertAppsQuery = `
          INSERT INTO applications (job_id, applicant_id, cover_letter, status)
          VALUES ?
        `;
        await connection.query(insertAppsQuery, [sampleApplications]);
        console.log('Seeded sample applications into applications table successfully.');
      }
    }

    connection.release();
  } catch (error) {
    console.error('Database connection or initialization error:', error.message);
  }
};

initializeDatabase();
=======
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to Database:', process.env.DB_NAME || 'jobhunt_db');
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
})();
>>>>>>> feature/auth-system

module.exports = pool;

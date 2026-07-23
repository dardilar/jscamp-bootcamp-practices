import { db } from "./database";


db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK(modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK(level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    job_id TEXT NOT NULL,
    description TEXT NOT NULL,
    id TEXT PRIMARY KEY,
    responsabilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`)

const insertJob = db.prepare(`
  INSERT INTO jobs (id, title, company, location, description, modality, level)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertJobTechnology = db.prepare(`
  INSERT INTO job_technologies (job_id, technology)
  VALUES (?, ?)
`)

const insertJobContent = db.prepare(`
  INSERT INTO job_content (job_id, description, id, responsabilities, requirements, about)
  VALUES (?, ?, ?, ?, ?, ?)
`)

const seed = db.transaction(() => {
  // Insert jobs
  insertJob.run('1', 'Frontend Developer', 'Google', 'Madrid', 'Description', 'remote', 'senior')
  insertJob.run('2', 'Backend Developer', 'Microsoft', 'Barcelona', 'Description', 'onsite', 'mid')
  insertJob.run('3', 'Fullstack Developer', 'Amazon', 'Valencia', 'Description', 'hybrid', 'junior')

  // Insert job technologies
  insertJobTechnology.run('1', 'React')
  insertJobTechnology.run('1', 'TypeScript')
  insertJobTechnology.run('2', 'Node.js')
  insertJobTechnology.run('2', 'Express')
  insertJobTechnology.run('3', 'React')
  insertJobTechnology.run('3', 'Node.js')
  insertJobTechnology.run('3', 'TypeScript')

  // Insert job content
  insertJobContent.run('1', 'Description', '1', 'Responsabilities', 'Requirements', 'About')
  insertJobContent.run('2', 'Description', '2', 'Responsabilities', 'Requirements', 'About')
  insertJobContent.run('3', 'Description', '3', 'Responsabilities', 'Requirements', 'About')
})

seed()

console.log('Database seeded successfully');
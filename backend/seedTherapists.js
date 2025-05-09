import jwt from 'jsonwebtoken';

const JWT_SECRET = 'supersecretkey';

// ✅ Replace with actual MongoDB _id values
const patientId = 'patient123'; // If static
const therapistId = '681cdcce39dd083ddab5cd9d'; // Real _id from DB

const patientToken = jwt.sign(
  { id: patientId, role: 'patient' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const therapistToken = jwt.sign(
  { id: therapistId, role: 'therapist' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

console.log('✅ Patient Token:\n', patientToken);
console.log('\n✅ Therapist Token:\n', therapistToken);

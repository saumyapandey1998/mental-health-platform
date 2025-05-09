import jwt from 'jsonwebtoken';

const JWT_SECRET = 'supersecretkey';

// ✅ Replace with actual MongoDB _id values
const patientId = '681ce2114d5736cf0f205862'; // Real _id for john_doe (from earlier login)
const therapistId = '681cdcce39dd083ddab5cd9d'; // Real _id for sarahj (from your JSON)

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
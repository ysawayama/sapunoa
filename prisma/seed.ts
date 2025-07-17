import { PrismaClient, UserRole, Gender } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 医師ユーザー作成
  const doctorPasswordHash = await bcrypt.hash('doctor123', 10);
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@supnoa.com' },
    update: {},
    create: {
      email: 'doctor@supnoa.com',
      password: doctorPasswordHash,
      name: '田中 太郎',
      role: UserRole.DOCTOR,
      medicalRecordNumber: 'DOC-001',
      isActive: true,
    },
  });

  console.log('✅ Created doctor user:', doctorUser.email);

  // 患者ユーザー作成
  const patientPasswordHash = await bcrypt.hash('patient123', 10);
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient1@example.com' },
    update: {},
    create: {
      email: 'patient1@example.com',
      password: patientPasswordHash,
      name: '山田 花子',
      role: UserRole.PATIENT,
      medicalRecordNumber: 'MRN-001',
      dateOfBirth: new Date('1980-05-15'),
      gender: Gender.FEMALE,
      phoneNumber: '090-1234-5678',
      isActive: true,
    },
  });

  console.log('✅ Created patient user:', patientUser.email);

  // Profile作成
  const profile = await prisma.profile.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      height: 158.0,
      weight: 52.0,
      smokingStatus: false,
      allergies: [],
      currentMedications: [],
    },
  });

  console.log('✅ Created patient profile');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
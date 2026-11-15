import { PrismaClient, Role, LeaveStatus, PurchaseStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MiniERP...');

  // Clear existing data
  await prisma.purchaseRequest.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.user.deleteMany();

  const hash = async (pw: string) => bcrypt.hash(pw, 10);
  const year = new Date().getFullYear();

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Riya Sharma',
      email: 'admin@minierp.com',
      passwordHash: await hash('Admin@123'),
      role: Role.ADMIN,
      department: 'Administration',
    },
  });

  const manager1 = await prisma.user.create({
    data: {
      name: 'Arjun Mehta',
      email: 'manager@minierp.com',
      passwordHash: await hash('Manager@123'),
      role: Role.MANAGER,
      department: 'Engineering',
    },
  });

  const manager2 = await prisma.user.create({
    data: {
      name: 'Priya Kapoor',
      email: 'manager2@minierp.com',
      passwordHash: await hash('Manager@123'),
      role: Role.MANAGER,
      department: 'Marketing',
    },
  });

  const employees = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Rahul Verma',
        email: 'employee@minierp.com',
        passwordHash: await hash('Employee@123'),
        role: Role.EMPLOYEE,
        department: 'Engineering',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sneha Joshi',
        email: 'sneha@minierp.com',
        passwordHash: await hash('Employee@123'),
        role: Role.EMPLOYEE,
        department: 'Engineering',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Karan Patel',
        email: 'karan@minierp.com',
        passwordHash: await hash('Employee@123'),
        role: Role.EMPLOYEE,
        department: 'Marketing',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Anjali Singh',
        email: 'anjali@minierp.com',
        passwordHash: await hash('Employee@123'),
        role: Role.EMPLOYEE,
        department: 'Marketing',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dev Nair',
        email: 'dev@minierp.com',
        passwordHash: await hash('Employee@123'),
        role: Role.EMPLOYEE,
        department: 'Engineering',
      },
    }),
  ]);

  console.log('Created users');

  // Create leave balances for all users
  const allUsers = [admin, manager1, manager2, ...employees];
  for (const user of allUsers) {
    await prisma.leaveBalance.createMany({
      data: [
        { employeeId: user.id, leaveType: 'SICK', totalDays: 10, usedDays: 0, year },
        { employeeId: user.id, leaveType: 'CASUAL', totalDays: 12, usedDays: 0, year },
        { employeeId: user.id, leaveType: 'ANNUAL', totalDays: 15, usedDays: 0, year },
      ],
    });
  }
  console.log('Created leave balances');

  const rahul = employees[0];
  const sneha = employees[1];

  // Approved leave (past)
  await prisma.leaveRequest.create({
    data: {
      employeeId: rahul.id,
      leaveType: 'ANNUAL',
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-05'),
      daysCount: 5,
      reason: 'Family vacation to Goa',
      status: LeaveStatus.APPROVED,
      reviewedBy: manager1.id,
      reviewedAt: new Date('2026-09-25'),
    },
  });
  await prisma.leaveBalance.update({
    where: {
      employeeId_leaveType_year: {
        employeeId: rahul.id,
        leaveType: 'ANNUAL',
        year,
      },
    },
    data: { usedDays: 5 },
  });

  // Pending leave
  await prisma.leaveRequest.create({
    data: {
      employeeId: sneha.id,
      leaveType: 'SICK',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      daysCount: 3,
      reason: 'Medical appointment and recovery',
      status: LeaveStatus.PENDING,
    },
  });

  // Rejected leave
  await prisma.leaveRequest.create({
    data: {
      employeeId: rahul.id,
      leaveType: 'CASUAL',
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-11'),
      daysCount: 2,
      reason: 'Personal work',
      status: LeaveStatus.REJECTED,
      reviewedBy: manager1.id,
      reviewedAt: new Date('2026-09-08'),
      rejectReason: 'Sprint deadline week - please reschedule',
    },
  });

  console.log('Created leave requests');

  // Purchase requests in various stages
  await prisma.purchaseRequest.create({
    data: {
      raisedById: rahul.id,
      title: 'MacBook Pro for development',
      description: 'Need M3 MacBook Pro for running local ML models and builds',
      itemName: 'MacBook Pro 14" M3',
      quantity: 1,
      estimatedCost: 189000,
      vendorName: 'Apple India',
      status: PurchaseStatus.APPROVED,
      managerId: manager1.id,
      managerApprovedAt: new Date('2026-10-15'),
      adminId: admin.id,
      adminApprovedAt: new Date('2026-10-16'),
    },
  });

  await prisma.purchaseRequest.create({
    data: {
      raisedById: sneha.id,
      title: 'Office chairs for team',
      description: 'Ergonomic chairs for the engineering floor',
      itemName: 'Herman Miller Aeron Chair',
      quantity: 5,
      estimatedCost: 75000,
      vendorName: 'Furnicraft',
      status: PurchaseStatus.PENDING_ADMIN,
      managerId: manager1.id,
      managerApprovedAt: new Date(),
    },
  });

  await prisma.purchaseRequest.create({
    data: {
      raisedById: employees[2].id,
      title: 'Marketing banner printing',
      description: 'Roll-up banners for the product launch event',
      itemName: 'Vinyl roll-up banner 6ft',
      quantity: 10,
      estimatedCost: 12000,
      vendorName: 'QuickPrint Solutions',
      status: PurchaseStatus.PENDING_MANAGER,
    },
  });

  await prisma.purchaseRequest.create({
    data: {
      raisedById: employees[4].id,
      title: 'AWS credits top-up',
      description: 'Need additional AWS credits for staging environment',
      itemName: 'AWS Credits',
      quantity: 1,
      estimatedCost: 25000,
      status: PurchaseStatus.ORDERED,
      managerId: admin.id,
      managerApprovedAt: new Date('2026-10-01'),
      adminId: admin.id,
      adminApprovedAt: new Date('2026-10-02'),
    },
  });

  await prisma.purchaseRequest.create({
    data: {
      raisedById: employees[3].id,
      title: 'Social media analytics tool',
      description: 'Annual subscription for social media campaign tracking',
      itemName: 'Hootsuite Pro License',
      quantity: 1,
      estimatedCost: 18000,
      vendorName: 'Hootsuite',
      status: PurchaseStatus.RECEIVED,
      managerId: manager2.id,
      managerApprovedAt: new Date('2026-09-15'),
      adminId: admin.id,
      adminApprovedAt: new Date('2026-09-16'),
    },
  });

  console.log('Created purchase requests');
  console.log('');
  console.log('Seed complete!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Admin:    admin@minierp.com    / Admin@123');
  console.log('  Manager:  manager@minierp.com  / Manager@123');
  console.log('  Employee: employee@minierp.com / Employee@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
// seed: added more realistic purchase request data
// seed: added leave balance initialization for all employees
// fix: seed should not fail if users already exist - use upsert

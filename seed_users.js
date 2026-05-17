const { User } = require('./src/models');
const bcrypt = require('bcrypt');

async function seedUsers() {
  try {
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Check if the department column actually exists in DB by syncing (altering).
    // Or just create users. If it fails, we know department column is missing in DB.
    
    const dummyUsers = [
      {
        name: 'Nguyễn Văn IT',
        email: 'it_user1@example.com',
        password: passwordHash,
        role: 'user',
        status: 'active',
        department: 'IT',
        is_active: 1
      },
      {
        name: 'Trần Thị HR',
        email: 'hr_user1@example.com',
        password: passwordHash,
        role: 'user',
        status: 'active',
        department: 'HR',
        is_active: 1
      },
      {
        name: 'Lê Văn Sales',
        email: 'sales_user1@example.com',
        password: passwordHash,
        role: 'user',
        status: 'inactive',
        department: 'Kinh doanh',
        is_active: 0
      },
      {
        name: 'Phạm Thị Kế Toán',
        email: 'acc_user1@example.com',
        password: passwordHash,
        role: 'admin',
        status: 'active',
        department: 'Kế toán',
        is_active: 1
      },
      {
        name: 'Hoàng Văn Marketing',
        email: 'mkt_user1@example.com',
        password: passwordHash,
        role: 'user',
        status: 'active',
        department: 'Marketing',
        is_active: 1
      }
    ];

    for (const u of dummyUsers) {
      // Check if email already exists
      const existing = await User.findOne({ where: { email: u.email } });
      if (!existing) {
        await User.create(u);
        console.log(`Created user: ${u.email}`);
      } else {
        console.log(`User already exists: ${u.email}, updating department...`);
        existing.department = u.department;
        await existing.save();
      }
    }
    
    // Let's also update the existing ones in the DB if they have no department
    await User.update({ department: 'IT' }, { where: { email: 'admin@example.com' } });
    await User.update({ department: 'HR' }, { where: { email: 'user@example.com' } });

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedUsers();

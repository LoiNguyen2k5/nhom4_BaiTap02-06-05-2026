const bcrypt = require('bcrypt');
const { User, Profile, Department } = require('./src/models');

async function seed() {
  try {
    console.log('Đang tạo tài khoản mẫu...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const [itDept] = await Department.findOrCreate({
      where: { name: 'IT' },
      defaults: { description: 'Phòng Công nghệ thông tin', status: 'active' }
    });
    
    for (let i = 1; i <= 25; i++) {
      const email = `test_it_${i}@example.com`;
      const name = `Nhân viên IT ${i}`;
      
      // Kiểm tra nếu đã tồn tại thì bỏ qua
      const existing = await User.findOne({ where: { email } });
      if (!existing) {
        const user = await User.create({
          name: name,
          email: email,
          password: hashedPassword,
          role: 'employee',
          department_id: itDept.id,
          status: 'active'
        });
        
        await Profile.create({
          user_id: user.id,
          full_name: name,
          phone: '0123456789'
        });
        console.log(`Đã tạo: ${email}`);
      }
    }
    
    console.log('\n✅ Tạo 25 tài khoản mẫu phòng IT thành công!');
    process.exit(0);
  } catch (err) {
    console.error('Lỗi seed:', err);
    process.exit(1);
  }
}

seed();

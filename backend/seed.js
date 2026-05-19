const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const Profile = require('./src/models/Profile');

async function seed() {
  try {
    console.log('Đang tạo tài khoản mẫu...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
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
          role: 'user',
          department: 'IT',
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

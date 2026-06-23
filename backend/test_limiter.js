const BASE_URL = 'http://localhost:3000/api';

async function testLimiter() {
  console.log('=== BẮT ĐẦU KIỂM THỬ RATE LIMITER ĐĂNG NHẬP ===\n');

  for (let i = 1; i <= 7; i++) {
    try {
      console.log(`[Thử nghiệm ${i}] Đang gửi yêu cầu đăng nhập sai...`);
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nonexistent@example.com', password: 'WrongPassword123' })
      });

      const status = res.status;
      const data = await res.json().catch(() => ({}));

      console.log(`-> Phản hồi từ Server: HTTP ${status}`);
      console.log(`-> Dữ liệu: ${JSON.stringify(data)}`);
      console.log('------------------------------------------------');
    } catch (error) {
      console.error(`-> Lỗi kết nối: ${error.message}`);
      console.log('------------------------------------------------');
    }
  }
}

testLimiter();

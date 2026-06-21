const roleNames = {
  admin: 'Quản trị viên',
  hr: 'Nhân sự',
  manager: 'Quản lý',
  accountant: 'Kế toán',
  employee: 'Nhân viên',
  user: 'Nhân viên',
};

const mapEmployeeProfile = (user) => {
  if (!user) return null;
  const userJson = user.toJSON ? user.toJSON() : user;
  if (!userJson.Profile) {
    userJson.Profile = {};
  }
  userJson.Profile.job_title = roleNames[userJson.role] || 'Nhân viên';
  userJson.Profile.department = userJson.department?.name || 'Chưa phân phòng';
  return userJson;
};

module.exports = { roleNames, mapEmployeeProfile };

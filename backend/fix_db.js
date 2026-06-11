const sequelize = require('./src/config/database');
sequelize.query("UPDATE users SET role = 'employee' WHERE role = 'user'")
  .then(() => sequelize.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'hr', 'manager', 'accountant', 'employee') NOT NULL DEFAULT 'employee'"))
  .then(() => {
    console.log('Fixed ENUM');
    return sequelize.close();
  })
  .catch(console.error);

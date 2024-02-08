 import Sequelize from 'sequelize';

const db = new Sequelize("jafaservice", "root", "12345", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  define: {
    timestamps: true, // Debe ser "timestamps", no "Timestamps"
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // operatorsAliases se eliminó en Sequelize v4
});

export default db;



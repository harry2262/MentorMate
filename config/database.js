const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      (con) => {
        console.log(
          `from 'database.js':MongoDB Database connected with HOST: ${con.connection.host}\n`
        );
      },
      (err) => {
        console.log(`from 'database.js'` + err);
      }
    );
};

module.exports = connectDatabase;

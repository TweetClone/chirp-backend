const pool = require("../database/db");
const userQueries = require("../models/UserModel");

const getUserInfo = async (req, res) => {
  const auth0Id = req.auth.sub;
  const query = await pool.query(userQueries.getUserInfo, [auth0Id]);
  const user = query.rows[0];
  user.isLoading = false;
  res.send(user);
  console.log(user);
};

const updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { username, displayName, birthDate } = req.body;
  const query = await pool.query(userQueries.updateUserInfo, [
    username,
    displayName,
    birthDate,
    userId,
  ]);
  res.send({ ...query.rows[0], isLoading: false });
};

module.exports = {
  getUserInfo,
  updateUserInfo,
};

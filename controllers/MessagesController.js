const pool = require("../database/db");
const messageQueries = require("../models/MessagesModel");

const addMessage = async (req, res) => {
  try {
    const { receivedUserId, textContent, sentUserId } = req.body;
    const timestamp = new Date();
    const query = await pool.query(messageQueries.addMessage, [
      timestamp,
      textContent,
      sentUserId,
      receivedUserId,
    ]);
    res.status(201).send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(messageQueries.getConversations, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messageQuery = await pool.query(messageQueries.getMessages, [
      userId1,
      userId2,
    ]);
    const chatBioQuery = await pool.query(messageQueries.getChatBio, [userId2]);
    res.send({
      messages: messageQuery.rows,
      chatBio: chatBioQuery.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  addMessage,
  getConversations,
  getMessages,
};

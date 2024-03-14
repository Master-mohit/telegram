const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  photo: {
    type: String 
  }
});

module.exports = mongoose.model('Message', messageSchema);

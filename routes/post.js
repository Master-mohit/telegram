const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  photo: {
    type: String 
  },
  post:[{ 
    type:mongoose.Schema.Types.ObjectId , 
    ref:"post"
  }],
  user:[{ 
    type:mongoose.Schema.Types.ObjectId , 
    ref:"user"
  }]
});

module.exports = mongoose.model('Message', messageSchema);

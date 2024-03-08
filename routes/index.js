var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post")
const passport = require("passport");
const localStrategy = require("passport-local");
const http = require('http');
const socketIo = require('socket.io');
const upload = require("./multer");


passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/upload', function(req, res, next) {
  res.render('upload'); // Render the upload.ejs file
});


router.post('/register', function(req, res, next) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
  });
  userModel.register(userData, req.body.password)
    .then((result)=> {
      passport.authenticate("local")(req, res, ()=> {
        res.redirect("/home");
      });
    })
    .catch((err)=> {
      res.send(err);
    });
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login"
}));

// GET logout route
router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect('/');
    });
  else {
    res.redirect('/');
  }
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get('/home', async function(req, res ) {
const logdinUser = await userModel.findOne({username: req.session.passport.user}).populate('friends')
  res.render('home', {footer: true, logdinUser});
  console.log(logdinUser);
});

router.post('/searchUser', async function(req, res, next) {
  try {
    const searchData = req.body.data;
    if (typeof searchData !== 'string') {
      return res.status(400).json({ error: 'Search data must be a string' });
    }
    
    const searchedUsers = await userModel.find({
      username: {
        $regex: searchData,
        $options: 'i'
      }
    });

    console.log('Searched Users:', searchedUsers); // Log searched users

    res.status(200).json(searchedUsers);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addfriend', async function(req, res, next) {
  try {
    const apnaFriend = req.body.friendId;
    const apnaDost = await userModel.findOne({
      _id: apnaFriend
    });
    const self = await userModel.findOne({ username: req.session.passport.user });

    const apnaDostHai = self.friends.indexOf(apnaDost._id);

    if (apnaDostHai !== -1) {
      return res.status(200).json({
        message: 'Friend already exists'
      });
    }

    apnaDost.friends.push(self._id);
    self.friends.push(apnaDost._id);

    await apnaDost.save();
    await self.save();
    res.redirect("/home");
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

;


router.post('/upload', isLoggedIn, upload.single('photo'), async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user});

    if (!Array.isArray(user.posts)) {
      user.posts = [];
    }

    const post = await postModel.create({ photo: req.file.filename });

    user.posts.push(post._id);

    await user.save();
    io.emit('newPhoto', { photo: req.file.filename });
    res.redirect("/home");
  } catch (error) {
    console.error('Error uploading post:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Other routes and middleware...

module.exports = router;



module.exports = router;

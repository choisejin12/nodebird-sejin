const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { addFollowing } =require('../controllers/user');
const User = require('../models/user');

const router = express.Router();

router.post('/:id/follow',isLoggedIn,addFollowing);

// router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
//   try {
//     //req.params.id 상대꺼 
//     //req.user.id본인꺼 
//     const user = await User.findOne({ where: { id: req.user.id } });
//     if (user) {
//       await user.addFollowing(parseInt(req.params.id, 10));
//       res.send('success');
//     } else {
//       res.status(404).send('no user');
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });


router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    console.log("이거거거"+req.params.id);
    if (user) {
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/newnick', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await User.update({nick: req.body.newnick },{ where: { id: req.user.id } })
      return res.redirect('/');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
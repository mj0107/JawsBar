const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag, Scrap, sequelize } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'Profile' });
});

router.get('/followings', isLoggedIn, (req, res) => {
  res.render('followings', { title: 'Followings' });
});

router.get('/followers', isLoggedIn, (req, res) => {
  res.render('followers', { title: 'Followers' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: 'Join to - JawsBar' });
});

router.get('/scrap', async (req, res, next) => {
  try {
    const scraps = await Scrap.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.render('scrap', {
      title: 'Scraps',
      scraps: scraps,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });

    const likes = await sequelize.models.likes.findAll();

    res.render('main', {
      title: 'Jawsbar',
      twits: posts,
      likes: likes,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;

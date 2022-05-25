const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Post, Hashtag, Scrap, sequelize } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log(req.user);
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/share', isLoggedIn, async (req, res, next) => {
  try {
    const share = await Post.create({
      content: req.body.ownerContent,
      subContent: `${req.body.owner} 로부터 공유됨`,
      UserId: req.user.id,
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const post = await Post.findOne({ where: { id: req.body.postId } });
    const isClicked = req.body.isClicked;

    if (user && post) {
      if (isClicked) {
        await user.addLikedPost(parseInt(req.body.postId, 10));
        //await post.addLiker(parseInt(req.user.id, 10));
      }
      else {
        await sequelize.models.likes.destroy({
          where: { postId: req.body.postId, userId: req.user.id }
        });
      }
      const count = await sequelize.models.likes.findAndCountAll({
        where: {
          postId: req.body.postId,
        }
      });
      await Post.update({ likeCounts: count.count }, { where: { id: parseInt(req.body.postId, 10) } });
      res.send({ cnt: count.count });
    }
    else {
      res.status(404).send('no user and post');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/scrap', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const scrap = await Scrap.create({
      content: req.body.ownerContent,
      subContent: `${req.body.owner} 의 포스트 스크랩`,
      UserId: req.user.id,
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
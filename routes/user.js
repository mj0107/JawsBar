const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

// 요청받은 id에 해당하는 유저 팔로우 추가
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    // req로 들어온 user의 id를 User 테이블에서 찾음
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) { // 만약 table에 user가 있다면,
      // req로 들어온 parameter의 id를 10진수로 변환
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

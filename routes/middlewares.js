// req가 인증되었으면 다음 라우터로,
// 인증되지 않았으면 403에러, '로그인 필요' send
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

// req가 인증되지 않았으면 다음 라우터로,
// 인증된 상태라면 /?error=${'로그인한 상태입니다.'}로 redirect
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};

const footers = document.querySelectorAll(".twit-footer");
const sharingButtons = document.querySelectorAll(".twit-footer-share");
const scrapButtons = document.querySelectorAll(".twit-footer-scrap");
const likeButtons = document.querySelectorAll(".bi-suit-heart");

footers.forEach(function (footer) {
  const icons = footer.querySelectorAll("i");
  const [heart, sharing, scrap] = icons;

  let heart_class = heart.classList.item(1);
  let sharing_class = sharing.classList.item(1);
  let scrap_class = scrap.classList.item(1);

  if(heart.classList.contains('clicked')) heart.style.color = 'red';

  heart.addEventListener("click", function() {
    this.classList.toggle("clicked");
    if(this.classList.contains("clicked")) {
      this.classList.replace(heart_class, `${heart_class}-fill`);
      this.style.color = 'red';
    }
    else {
      this.classList.replace(`${heart_class}-fill`, heart_class);
      this.style.color = 'black';
    }
  });

  sharing.addEventListener("mousedown", function() {
    this.classList.replace(sharing_class, `${sharing_class}-fill`);
  });
  sharing.addEventListener("mouseup", function() {
    this.classList.replace(`${sharing_class}-fill`, sharing_class);
  });

  scrap.addEventListener("mousedown", function() {
    this.classList.replace(scrap_class, `${scrap_class}-fill`);
    this.style.color = 'lightblue';
  });
  scrap.addEventListener("mouseup", function() {
    this.classList.replace(`${scrap_class}-fill`, scrap_class);
    this.style.color = 'black';
  });
});

sharingButtons.forEach((tag) => {
  tag.addEventListener('click', () => {
    const myId = document.querySelector('#my-id');

    if(myId) {
      const owner = tag.parentNode.parentElement.querySelector('.owner-name').value;
      const ownerContent = tag.parentNode.parentElement.querySelector('.owner-content').value;

      axios.post('/post/share', {
        owner: owner,
        ownerContent: ownerContent,
      }).
      then(() => {
        location.reload();
      }).catch((err) => {
        console.error(err);
      });
    }
  });
});

likeButtons.forEach((tag) => {
  tag.addEventListener('click', () => {
    const myId = document.querySelector('#my-id').value;
    const postId = tag.parentNode.parentNode.parentNode.querySelector('.twit-id').value;
    const likeCounts = tag.parentNode.querySelector('.likeCounts');

    if(myId) {
      let isClicked = false;

      if(tag.classList.contains('clicked')) isClicked = true;
      else isClicked = false;
      // console.log(isClicked);

      axios.post(`/post/${myId}/like`, {
        userId: myId, // 좋아요 누른 사람의 id
        postId: postId, // 좋아요가 눌러진 post의 id
        isClicked, // 클릭했는지, 해제했는지
      }).
      then((res) => {
        console.log(`전송할 myId:${myId}, postId:${postId}, isClicked:${isClicked}`);
        const cnt = parseInt(res.data.cnt, 10);
        likeCounts.innerHTML = cnt;
        // location.reload();
      }).catch((err) => {
        console.error(err);
      });
    }
  });
});
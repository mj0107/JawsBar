const footers = document.querySelectorAll(".twit-footer");
const sharingButtons = document.querySelectorAll('.twit-footer-share');

footers.forEach(function (footer) {
  const icons = footer.querySelectorAll("i");
  const [heart, sharing, scrap] = icons;

  let heart_class = heart.classList.item(1);
  let sharing_class = sharing.classList.item(1);
  let scrap_class = scrap.classList.item(1);

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

    console.log(myId);

    if(myId) {
      const owner = tag.parentNode.parentElement.querySelector('.owner-name').value;
      const ownerContent = tag.parentNode.parentElement.querySelector('.owner-content').value;

      console.log(owner, ownerContent);

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
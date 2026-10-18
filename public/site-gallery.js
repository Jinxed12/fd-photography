const galleryItems = document.querySelectorAll('.masonry-item[data-album]');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lightboxImage = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCollection = document.getElementById('lightbox-collection');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
  const lightboxPrevious = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxClose = document.querySelector('.lightbox-close');
  let activeAlbum = [];
  let activePhotoIndex = 0;
  let lastFocusedPhoto = null;

  function showAlbumPhoto(index) {
    if (!activeAlbum.length) return;

    activePhotoIndex = (index + activeAlbum.length) % activeAlbum.length;
    const photo = activeAlbum[activePhotoIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.title;
    lightboxCollection.textContent = photo.collection;
    lightboxCounter.textContent = `${activePhotoIndex + 1} / ${activeAlbum.length}`;
    lightboxPrevious.disabled = activeAlbum.length < 2;
    lightboxNext.disabled = activeAlbum.length < 2;

    [...lightboxThumbnails.children].forEach((thumbnail, thumbnailIndex) => {
      if (thumbnailIndex === activePhotoIndex) {
        thumbnail.setAttribute('aria-current', 'true');
      } else {
        thumbnail.removeAttribute('aria-current');
      }
    });
  }

  function openAlbum(card) {
    const albumId = card.dataset.album;
    const albumTitle = card.dataset.albumTitle;
    const coverAlt = card.querySelector('img').alt;
    activeAlbum = card.dataset.albumType === 'single'
      ? [{ src: `/images/${albumId}.webp`, alt: coverAlt, title: albumTitle, collection: 'Nature' }]
      : Array.from({ length: 6 }, (_, index) => ({
        src: `/images/${albumId}-${String(index + 1).padStart(2, '0')}.webp`,
        alt: `${albumTitle}, photo ${index + 1}`,
        title: `Photo ${index + 1}`,
        collection: albumTitle,
      }));
    activePhotoIndex = 0;
    lastFocusedPhoto = card;
    lightboxThumbnails.replaceChildren();

    activeAlbum.forEach((photo, index) => {
      const thumbnail = document.createElement('button');
      thumbnail.type = 'button';
      thumbnail.className = 'lightbox-thumbnail';
      thumbnail.setAttribute('aria-label', `View ${photo.title}`);
      const image = document.createElement('img');
      image.src = photo.src;
      image.alt = '';
      image.loading = 'lazy';
      thumbnail.append(image);
      thumbnail.addEventListener('click', () => showAlbumPhoto(index));
      lightboxThumbnails.append(thumbnail);
    });

    showAlbumPhoto(activePhotoIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    lightboxThumbnails.replaceChildren();
    activeAlbum = [];
    document.body.style.overflow = '';
    if (lastFocusedPhoto) lastFocusedPhoto.focus();
  }

  galleryItems.forEach((card) => {
    card.addEventListener('click', () => openAlbum(card));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrevious.addEventListener('click', () => showAlbumPhoto(activePhotoIndex - 1));
  lightboxNext.addEventListener('click', () => showAlbumPhoto(activePhotoIndex + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (activeAlbum.length > 1 && event.key === 'ArrowLeft') showAlbumPhoto(activePhotoIndex - 1);
    if (activeAlbum.length > 1 && event.key === 'ArrowRight') showAlbumPhoto(activePhotoIndex + 1);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    const filter = button.dataset.filter;
    galleryItems.forEach((item) => {
      item.hidden = filter !== 'all' && item.dataset.cat !== filter;
    });
  });
});

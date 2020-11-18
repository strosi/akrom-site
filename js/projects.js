const loadGalleryImages = (function () {
    const getImgFileName = function (hrefStr) {
        const index = hrefStr.lastIndexOf('/');
        const imgName = hrefStr.substring(index + 1);

        return imgName;
    }

    const showImgIfInView = function (img, index) {
        if (img.getBoundingClientRect().top < window.innerHeight) {
            img.classList.add('scale-normal');
            img.style.transitionDelay = 200 * index + 'ms';
        }
    }

    const showImgOnScroll = function (galleryItems) {
        let timeout;

        window.addEventListener('scroll', function (event) {
            // If there's a timer, cancel it
            if (timeout) {
                window.cancelAnimationFrame(timeout);
            }

            // Setup the new requestAnimationFrame()
            for (let i = 0; i < galleryItems.length; i++) {
                timeout = window.requestAnimationFrame(function () {
                    showImgIfInView(galleryItems[i], i);
                });
            }

        }, false);
    }

    const showImgsOnLoad = function (galleryItems) {
        window.addEventListener('load', function () {
            for (let i = 0; i < galleryItems.length; i++) {
                showImgIfInView(galleryItems[i], i);
            }
        });
    }

    const reqListener = function () {
        const gallery = document.querySelector('.gallery');
        const parser = new DOMParser();
        const parsedHtml = parser.parseFromString(this.responseText, 'text/html');
        const links = parsedHtml.getElementsByTagName('a');
        const imagesLinks = Array.from(links)
            .filter(el => el.getAttribute('href').includes('.jpg'));

        for (let i = 0; i < imagesLinks.length; i++) {
            let newImg = document.createElement('img');
            newImg.setAttribute('src', '../images/projects/'
                + getImgFileName(imagesLinks[i].getAttribute('href')));

            let imgInnerHolder = document.createElement('div');
            imgInnerHolder.classList.add('item-holder');
            imgInnerHolder.appendChild(newImg);

            let imgOuterHolder = document.createElement('div');
            imgOuterHolder.classList.add('gallery-item');
            imgOuterHolder.appendChild(imgInnerHolder);

            gallery.appendChild(imgOuterHolder);
        }
    }

    var request = new XMLHttpRequest();
    request.addEventListener("load", reqListener);
    request.open("GET", "../images/projects/");
    request.send();

    let galleryItemsList = document.getElementsByClassName('item-holder');
    showImgOnScroll(galleryItemsList);
    showImgsOnLoad(galleryItemsList);
})();
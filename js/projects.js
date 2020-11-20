let gallery = document.querySelector('.gallery');
let projects;

// Load images in the gallery from json file
const jsonUrl = '../images/main-gallery/main-gallery-items.json';
let request = new XMLHttpRequest();

request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        projects = JSON.parse(this.responseText);
        populateGallery(projects);
    }
};
request.open('GET', jsonUrl, true);
request.send();

function populateGallery(arr) {
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                entry.target.style.opacity = 1;
                entry.target.firstElementChild.style.transform = 'scale(1)';
            } else {
                entry.target.style.opacity = 0.5;
                entry.target.firstElementChild.style.transform = 'scale(0.5)';
            }
        })
    });

    for (let i = 0; i < arr.length; i++) {
        let imgUrl = '../images/main-gallery/' + arr[i].projectName + '/' + arr[i].thumbImg;
        let newImg = document.createElement('img');
        newImg.setAttribute('src', imgUrl);

        let imgContainer = document.createElement('div');
        imgContainer.appendChild(newImg);
        imgContainer.classList.add('gallery-item');
        gallery.appendChild(imgContainer);

        observer.observe(imgContainer);
    }
}

// Get img information on click event
const body = document.querySelector('body');
const prevBtn = document.querySelector('.prev');
const closeBtn = document.querySelector('.close');
const nextBtn = document.querySelector('.next');
const subGallery = document.querySelector('.subgallery');
const subGalleryImgs = document.querySelector('.subgallery .project-images');
let currentImg = '';
const titleHolder = document.querySelector('.description .title');
const textHolder = document.querySelector('.description .text');

function setSubGalleryNavi(targetImg) {
    if (targetImg === gallery.firstElementChild.firstElementChild) {
        prevBtn.classList.add('noActiveBtn');
    }

    if (targetImg === gallery.lastElementChild.firstElementChild) {
        nextBtn.classList.add('noActiveBtn');
    }
}

function loadSubGalleryImages(imgObject) {
    for (let i = 0; i < imgObject.subImagesCount; i++) {
        const subImgName = '../images/main-gallery/' + imgObject.projectName + '/' + imgObject.projectName + '-' + (i + 1) + '.jpg';
        const newImg = document.createElement('img');
        newImg.setAttribute('src', subImgName);
        subGalleryImgs.append(newImg);
    }
}

function loadSubGalleryText(imgObject) {
    const clientName = document.createElement('h2');
    const projectType = document.createElement('p');
    const descriptText = document.createElement('p');

    clientName.innerHTML = imgObject.client;
    projectType.innerHTML = imgObject.projectType;
    descriptText.innerHTML = imgObject.description;

    titleHolder.append(clientName);
    titleHolder.append(projectType);
    textHolder.append(descriptText);
}

function setSubGalleryContent(targetImg) {
    currentImg = targetImg;
    const imgSrc = targetImg.getAttribute('src');
    let imgObject;

    for (let i = 0; i < projects.length; i++) {
        if (imgSrc.substring(imgSrc.lastIndexOf('/') + 1) === projects[i].thumbImg) {
            imgObject = projects[i];
            setSubGalleryNavi(targetImg);
            loadSubGalleryImages(imgObject);
            loadSubGalleryText(imgObject);
            break;
        }
    }
}

function openSubGallery(targetImg) {
    body.classList.add('noscroll');
    subGallery.classList.add('active');
    setSubGalleryContent(targetImg);
}

gallery.addEventListener('click', function (event) {
    if (!subGallery.classList.contains('active')) {
        if (event.target.tagName === 'IMG') {
            openSubGallery(event.target);
        }
    }
});

// Set subgallery 'previous', 'close', 'next' functionalities
function removeSubGalleryContent() {
    subGalleryImgs.innerHTML = '';
    titleHolder.innerHTML = '';
    textHolder.innerHTML = '';
}

function closeSubGallery() {
    prevBtn.classList.remove('noActiveBtn');
    nextBtn.classList.remove('noActiveBtn');
    removeSubGalleryContent();
    subGallery.classList.remove('active');
    body.classList.remove('noscroll');
}

function previousImageSubgallery() {
    const prevImg = currentImg.parentElement.previousElementSibling.firstElementChild;
    removeSubGalleryContent();
    setSubGalleryContent(prevImg);
    nextBtn.classList.remove('noActiveBtn');
}

function nextImageSubgallery() {
    const nextImg = currentImg.parentElement.nextElementSibling.firstElementChild;
    removeSubGalleryContent();
    setSubGalleryContent(nextImg);
    prevBtn.classList.remove('noActiveBtn');
}

prevBtn.addEventListener('click', function (event) {
    if (event.target.classList.contains('noActiveBtn')) { return; }
    previousImageSubgallery();
});
closeBtn.addEventListener('click', closeSubGallery);
nextBtn.addEventListener('click', function (event) {
    if (event.target.classList.contains('noActiveBtn')) { return; }
    nextImageSubgallery();
});

window.addEventListener('click', function (event) {
    if (event.target === subGallery) {
        closeSubGallery();
    }
});



// const loadGalleryImages = (function () {
//     const getImgFileName = function (hrefStr) {
//         const index = hrefStr.lastIndexOf('/');
//         const imgName = hrefStr.substring(index + 1);

//         return imgName;
//     }

//     const showImgIfInView = function (img, index) {
//         if (img.getBoundingClientRect().top < window.innerHeight) {
//             img.classList.add('scale-normal');
//             img.style.transitionDelay = 200 * index + 'ms';
//         }
//     }

//     const showImgOnScroll = function (galleryItems) {
//         let timeout;

//         window.addEventListener('scroll', function (event) {
//             // If there's a timer, cancel it
//             if (timeout) {
//                 window.cancelAnimationFrame(timeout);
//             }

//             // Setup the new requestAnimationFrame()
//             for (let i = 0; i < galleryItems.length; i++) {
//                 timeout = window.requestAnimationFrame(function () {
//                     showImgIfInView(galleryItems[i], i);
//                 });
//             }

//         }, false);
//     }

//     const showImgsOnLoad = function (galleryItems) {
//         window.addEventListener('load', function () {
//             for (let i = 0; i < galleryItems.length; i++) {
//                 showImgIfInView(galleryItems[i], i);
//             }
//         });
//     }

//     const reqListener = function () {
//         const gallery = document.querySelector('.gallery');
//         const parser = new DOMParser();
//         const parsedHtml = parser.parseFromString(this.responseText, 'text/html');
//         const links = parsedHtml.getElementsByTagName('a');
//         const imagesLinks = Array.from(links)
//             .filter(el => el.getAttribute('href').includes('.jpg'));

//         for (let i = 0; i < imagesLinks.length; i++) {
//             let newImg = document.createElement('img');
//             newImg.setAttribute('src', '../images/projects/'
//                 + getImgFileName(imagesLinks[i].getAttribute('href')));

//             let imgInnerHolder = document.createElement('div');
//             imgInnerHolder.classList.add('item-holder');
//             imgInnerHolder.appendChild(newImg);

//             let imgOuterHolder = document.createElement('div');
//             imgOuterHolder.classList.add('gallery-item');
//             imgOuterHolder.appendChild(imgInnerHolder);

//             gallery.appendChild(imgOuterHolder);
//         }
//     }

//     var request = new XMLHttpRequest();
//     request.addEventListener("load", reqListener);
//     request.open("GET", "../images/projects/");
//     request.send();

//     let galleryItemsList = document.getElementsByClassName('item-holder');
//     showImgOnScroll(galleryItemsList);
//     showImgsOnLoad(galleryItemsList);
// }) ();
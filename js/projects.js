// Load images in the main gallery from json file
let galleryModule = (function () {
    return {
        populateGallery: function (arr, galleryContainer) {

            let projectsCount = arr.length;

            // If the current page is the home page, shows only the first six projects in the gallery
            if(document.querySelector('title').innerHTML === 'Акром') {
                projectsCount = 6;
            }

            let observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0) {
                        entry.target.classList.remove('zoomout');
                        entry.target.style.transitionDelay = 60 * (parseInt(entry.target.firstElementChild.id)) + 'ms';
                    } else {
                        entry.target.classList.add('zoomout');
                    }
                })
            });

            for (let i = 0; i < projectsCount; i++) {
                let imgUrl = '../images/main-gallery/' + arr[i].projectName + '/' + arr[i].thumbImg;
                let newImg = document.createElement('img');
                newImg.setAttribute('src', imgUrl);
                newImg.setAttribute('id', i.toString());
                
                let imgHolder = document.createElement('div');
                imgHolder.appendChild(newImg);
                imgHolder.classList.add('item-holder');
                imgHolder.classList.add('zoomout');

                let galleryItem = document.createElement('div');
                galleryItem.appendChild(imgHolder);
                galleryItem.classList.add('gallery-item');

                galleryContainer.appendChild(galleryItem);
                observer.observe(imgHolder);
            }
        }
    }
})();

const jsonUrl = '../images/main-gallery/main-gallery-items.json';
let request = new XMLHttpRequest();
let projectsArr;
let projectsGallery = document.querySelector('.gallery');

request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        projectsArr = JSON.parse(this.responseText);
        galleryModule.populateGallery(projectsArr, projectsGallery);
    }
};
request.open('GET', jsonUrl, true);
request.send();


// Open popup and load selected project images
let popupModule = (function () {
    const body = document.querySelector('body');
    let popupContainer;
    let currentProjId;
    let projects;
    let prev, close, next;
    let imgsContainer, titleContainer, descriptContainer;

    setPopupNavi = function (id, range) {
        if (id == 0) { prevBtn.classList.add('noActiveBtn'); }
        if (id == range - 1) { nextBtn.classList.add('noActiveBtn'); }
    }

    loadPopupImgs = function (obj) {
        for (let i = 0; i < obj.subImagesCount; i++) {
            const subImgSrc = '../images/main-gallery/' + obj.projectName + '/' + obj.projectName + '-' + (i + 1) + '.jpg';
            const newImg = document.createElement('img');
            newImg.setAttribute('src', subImgSrc);
            imgsContainer.append(newImg);
        }
    }

    loadPopupText = function (obj) {
        const clientName = document.createElement('h2');
        const projectType = document.createElement('p');
        const descriptText = document.createElement('p');

        clientName.innerHTML = obj.client;
        projectType.innerHTML = obj.projectType;
        descriptText.innerHTML = obj.description;

        titleContainer.append(clientName);
        titleContainer.append(projectType);
        descriptContainer.append(descriptText);
    }

    setPopupContent = function (id) {
        let projectObj = projects[id];
        setPopupNavi(id, projects.length);
        loadPopupImgs(projectObj);
        loadPopupText(projectObj);
    }

    clearPopupContent = function () {
        imgsContainer.innerHTML = '';
        titleContainer.innerHTML = '';
        descriptContainer.innerHTML = '';
    }

    closePopup = function () {
        prev.classList.remove('noActiveBtn');
        next.classList.remove('noActiveBtn');
        clearPopupContent();
        popupContainer.classList.remove('active');
        body.classList.remove('noscroll');
    }

    prevProj = function () {

        if (prev.classList.contains('noActiveBtn')) { return; }

        clearPopupContent();
        currentProjId--;
        setPopupContent(currentProjId);
        next.classList.remove('noActiveBtn');
    }

    nextProj = function () {

        if (next.classList.contains('noActiveBtn')) { return; }

        clearPopupContent();
        currentProjId++;
        setPopupContent(currentProjId);
        prev.classList.remove('noActiveBtn');
    }
    
    window.addEventListener('click', function (event) {
        if (event.target === popupContainer) {
            closePopup();
        }
    });

    return {
        setupPopup: function (targetProject, projectsArr, projectPopupLayout, 
            prevBtn, closeBtn, nextBtn, projectImagesContainer, projectTitle, projectDescription) {

                body.classList.add('noscroll');
                popupContainer = projectPopupLayout;
                popupContainer.classList.add('active');

                currentProjId = parseInt(targetProject.id);
                [prev, close, next] = [prevBtn, closeBtn, nextBtn];
                [imgsContainer, titleContainer, descriptContainer] = [projectImagesContainer, projectTitle, projectDescription];
                projects = projectsArr;
                setPopupContent(currentProjId);

                prev.addEventListener('click', prevProj);
                close.addEventListener('click', closePopup);
                next.addEventListener('click', nextProj);
        }
    };
})();

// Popup layout container and inner containers
const projectPopupLayout = document.querySelector('.popup-layout');
const projectPopupImgs = document.querySelector('.popup-layout .project-images');
const projectTitle = document.querySelector('.description .title');
const projectDescription = document.querySelector('.description .text');
// Popup layout navigation buttons
const prevBtn = document.querySelector('.prev');
const closeBtn = document.querySelector('.close');
const nextBtn = document.querySelector('.next');

projectsGallery.addEventListener('click', function (event) {
    if (!projectPopupLayout.classList.contains('active')) {
        if (event.target.tagName === 'IMG') {
            popupModule.setupPopup(event.target, projectsArr, projectPopupLayout,
                prevBtn, closeBtn, nextBtn, projectPopupImgs, projectTitle, projectDescription);
        }
    }
});

// projectsGallery - element that holds all projects
// projectsArr - parsed json file
// subGallery -> projectPopupLayout
// >>>>>
// Mobile menu functionality

const mobileToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.nav-holder');

mobileToggle.addEventListener('click', function () {
    if (this.classList.contains('active')) {
        this.classList.remove('active');
        mobileMenu.classList.remove('opened');
    } else {
        this.classList.add('active');
        mobileMenu.classList.add('opened');
    }
});

// Reset mobile menu on window resize
window.addEventListener('resize', function () {
    if (window.innerWidth >= 900 && mobileToggle.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('opened');
    }
});
// <<<<<


// >>>>>
// Show elements on entering the viewport

const servicesList = document.querySelectorAll('.service');
const worksSection = document.querySelector('.works');
const worksList = document.querySelectorAll('.item-holder');
let timeout;

if (servicesList != null && worksSection != null) {
    window.addEventListener('scroll', function (event) {

        // If there's a timer, cancel it
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }

        // Setup the new requestAnimationFrame()
        timeout = window.requestAnimationFrame(function () {
            for (let i = 0; i < servicesList.length; i++) {
                if (servicesList[i].getBoundingClientRect().top < (window.innerHeight - 70)) {
                    servicesList[i].classList.add('slide-vert');
                    servicesList[i].style.transitionDelay = 60 * i + 'ms';
                }
            }

            if (worksSection.getBoundingClientRect().top < window.innerHeight) {
                worksSection.classList.add('show');
            }
        });

    }, false);
}
// <<<<<


// >>>>>
// Back to top of the page button

const scrollTopBtn = document.querySelector('.back-to-top-btn');
const target = document.querySelector('header');

let observer = new IntersectionObserver(callback);
observer.observe(target);

function callback(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            scrollTopBtn.classList.add('show-btn');
        } else {
            scrollTopBtn.classList.remove('show-btn');
        }
    });
}
// <<<<<
// my loader
setTimeout(() => {
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.content').style.display = 'block';
},4000);

// JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // 1. Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });

            // Update active nav link
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // 2. Highlight active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;

        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    
    // 4. Blog post data (simulated)
    const blogPosts = [
        {
            id: 1,
            title: "Embracing Change: My Move to Nairobi",
            date: "April 15, 2025",
            excerpt: "Reflections on leaving my hometown and adapting to life in a new city...",
            image: "https://images.unsplash.com/photo-1496442226666-8d1883a95c4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            content: "<p>Full content would go here with more details about my experience moving from Kampala to Nairobi...</p>"
        },
        {
            id: 2,
            title: "Ugandan Traditions I Still Cherish",
            date: "March 28, 2025",
            excerpt: "Cultural practices from my childhood that I maintain even while living abroad...",
            image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            content: "<p>Full content would go here with descriptions of Ugandan traditions...</p>"
        },
        {
            id: 3,
            title: "Balancing Two Homes",
            date: "March 10, 2025",
            excerpt: "How I maintain connections with both Uganda and Kenya, and what each place means to me...",
            image: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            content: "<p>Full content would go here about maintaining connections with both countries...</p>"
        }
    ];

    // 5. Blog post modal functionality
    function setupBlogModal(post) {
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${post.image}" alt="${post.title}" class="modal-image">
                <h2>${post.title}</h2>
                <p class="modal-date">${post.date}</p>
                <div class="modal-body">${post.content}</div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal when clicking X
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.remove();
        });

        // Close modal when clicking outside content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 6. Handle "Read More" button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('read-more')) {
            e.preventDefault();
            const postId = parseInt(e.target.getAttribute('data-post-id'));
            const post = blogPosts.find(p => p.id === postId);

            if (post) {
                setupBlogModal(post);
            }
        }
    });

    // 7. Update copyright year automatically
    document.querySelector('footer p:first-of-type').innerHTML =
        `<marquee>&copy; ${new Date().getFullYear()} Byabasajja matayo's Personal Blog. All rights reserved.</marquee>`;

    // 8. Initialize first nav link as active
    document.querySelector('nav a').classList.add('active');
});

 document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.querySelector('.carousel');
            const slides = document.querySelectorAll('.slide');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            const indicators = document.querySelectorAll('.indicator');

            let currentIndex = 0;
            const slideCount = slides.length;

            // Auto-play configuration
            let autoplayInterval = 5000; // 5 seconds
            let autoplay = setInterval(nextSlide, autoplayInterval);

            // Pause autoplay when hovering over carousel
            const carouselContainer = document.querySelector('.carousel-container');
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoplay);
            });

            carouselContainer.addEventListener('mouseleave', () => {
                autoplay = setInterval(nextSlide, autoplayInterval);
            });

            // Update carousel position
            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

                // Update indicators
                indicators.forEach((indicator, index) => {
                    if (index === currentIndex) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });

                // Pause all videos except current slide
                const videos = document.querySelectorAll('video');
                videos.forEach((video, index) => {
                    if (index === currentIndex) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            }

            // Next slide function
            function nextSlide() {
                currentIndex = (currentIndex + 1) % slideCount;
                updateCarousel();
            }

            // Previous slide function
            function prevSlide() {
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                updateCarousel();
            }

            // Button event listeners
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);

            // Indicator click event
            indicators.forEach(indicator => {
                indicator.addEventListener('click', function() {
                    currentIndex = parseInt(this.getAttribute('data-slide'));
                    updateCarousel();
                });
            });

            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight') {
                    nextSlide();
                } else if (e.key === 'ArrowLeft') {
                    prevSlide();
                }
            });

            // Touch events for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            carouselContainer.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});

            carouselContainer.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, {passive: true});

            function handleSwipe() {
                if (touchEndX < touchStartX) {
                    nextSlide(); // Swipe left
                } else if (touchEndX > touchStartX) {
                    prevSlide(); // Swipe right
                }
            }
        });

        const viewportMeta = document.createElement('meta');
viewportMeta.name = 'viewport';
viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.head.appendChild(viewportMeta);

const nameText = "Byabasajja Matayo";
const nameElement = document.getElementById("name");
let index = 0;

function typeName() {
    if (index < nameText.length) {
        nameElement.innerText += nameText[index];
        index++;
        setTimeout(typeName, 300); // Adjust the speed here
    } else {
        setTimeout(() => {
            nameElement.innerText = "";
            index = 0;
            typeName();
        }, 1000); // Delay before resetting
    }
}

typeName();

function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clock.innerText = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

const aboutBtn = document.getElementById('aboutBtn');
        
        aboutBtn.addEventListener('click', function() {
            // Navigate to about page (replace with your actual link)
            window.location.href = "Card.html";
        });
                                        

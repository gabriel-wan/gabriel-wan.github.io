// Navbar hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarLinks = document.querySelectorAll('.navbar-menu li a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navbarMenu?.classList.remove('active');

            // Set active link based on href
            const href = this.getAttribute('href');
            navbarLinks.forEach(l => l.classList.remove('active'));
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                this.classList.add('active');
            } else if (href.split('/').pop() === currentPage) {
                this.classList.add('active');
            }
        });
    });

    // Set active link on page load
    setActiveLink();

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar-container')) {
            hamburger?.classList.remove('active');
            navbarMenu?.classList.remove('active');
        }
    });
});

function setActiveLink() {
    const navbarLinks = document.querySelectorAll('.navbar-menu li a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navbarLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (href === 'index.html' && (currentPage === '' || currentPage === 'index.html'))) {
            link.classList.add('active');
        }
    });
}

// Recheck on page visibility change (useful for SPA or tab switching)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setActiveLink();
    }
});

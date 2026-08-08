document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    const toggle = nav.querySelector('.nav-menu-toggle');
    const toggleIcon = toggle?.querySelector('i');
    const links = nav.querySelectorAll('.site-nav-links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    function setMenu(open) {
        nav.classList.toggle('nav-open', open);
        toggle?.setAttribute('aria-expanded', String(open));
        toggleIcon?.classList.toggle('fa-bars', !open);
        toggleIcon?.classList.toggle('fa-xmark', open);
    }

    links.forEach(function (link) {
        const href = link.getAttribute('href');
        const isCurrent = href === currentPage ||
            (href === 'index.html' && (currentPage === '' || currentPage === 'index.html'));

        link.classList.toggle('active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');

        link.addEventListener('click', function () {
            setMenu(false);
        });
    });

    toggle?.addEventListener('click', function () {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('click', function (event) {
        if (!nav.contains(event.target)) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setMenu(false);
            toggle?.focus();
        }
    });

    const courseworkList = document.querySelector('.selected-coursework');
    const courseworkToggle = document.querySelector('.coursework-toggle');

    courseworkToggle?.addEventListener('click', function () {
        const showNames = courseworkList.classList.toggle('show-course-names');
        courseworkToggle.setAttribute('aria-expanded', String(showNames));
        courseworkToggle.textContent = showNames ? 'Hide course names' : 'View course names';
    });
});

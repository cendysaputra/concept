// JavaScript for PERKOMINA wireframe

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                }
            }
        });
    });

    // Form submission handler for contact form
    const contactForm = document.querySelector('form[onsubmit="handleContact(event)"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContact(e);
        });
    }

    // Form submission handler for registration form
    const registrationForm = document.querySelector('form[onsubmit="handleRegistration(event)"]');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration(e);
        });
    }

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.add('ripple');
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });

    // Add hover lift effect to service cards
    const serviceCards = document.querySelectorAll('#kegiatan .bg-white');
    serviceCards.forEach(card => {
        card.classList.add('hover-lift');
    });
});

// Activity detail modal functions
function showActivityDetail(activityType) {
    const modal = document.getElementById('activity-detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    const activityData = {
        'artikel': {
            title: 'Artikel',
            content: `
                <div class="space-y-4">
                    <p class="text-gray-600">Kumpulan artikel dari para ahli dan praktisi industri asuransi Indonesia.</p>
                    <div class="space-y-4">
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h5 class="font-semibold">Tata Kelola Asuransi di Era Digital</h5>
                            <p class="text-sm text-gray-600">Oleh: Dr. Ahmad Wijaya | 15 Nov 2025</p>
                            <p class="text-gray-700 mt-2">Transformasi digital membawa tantangan baru dalam tata kelola perusahaan asuransi...</p>
                        </div>
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h5 class="font-semibold">Risk Management untuk Komisaris Independen</h5>
                            <p class="text-sm text-gray-600">Oleh: Prof. Bambang Sutrisno | 10 Nov 2025</p>
                            <p class="text-gray-700 mt-2">Peran strategis Komisaris Independen dalam manajemen risiko perusahaan...</p>
                        </div>
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h5 class="font-semibold">Etika dan Integritas dalam Kepemimpinan</h5>
                            <p class="text-sm text-gray-600">Oleh: Siti Nurhaliza | 5 Nov 2025</p>
                            <p class="text-gray-700 mt-2">Pentingnya integritas sebagai fondasi kepemimpinan yang efektif...</p>
                        </div>
                    </div>
                    <div class="text-center mt-6">
                        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            Lihat Semua Artikel
                        </button>
                    </div>
                </div>
            `
        },
        'diskusi': {
            title: 'Diskusi',
            content: `
                <div class="space-y-4">
                    <p class="text-gray-600">Forum diskusi interaktif tentang isu terkini industri asuransi.</p>
                    <div class="space-y-4">
                        <div class="border rounded-lg p-4">
                            <h5 class="font-semibold">Dampak Regulasi Baru OJK pada Industri Asuransi</h5>
                            <p class="text-sm text-gray-600">123 peserta | Aktif</p>
                            <p class="text-gray-700 mt-2">Diskusi mendalam tentang implikasi regulasi terbaru...</p>
                        </div>
                        <div class="border rounded-lg p-4">
                            <h5 class="font-semibold">Strategi Menghadapi Disrupsi FinTech di Asuransi</h5>
                            <p class="text-sm text-gray-600">89 peserta | Aktif</p>
                            <p class="text-gray-700 mt-2">Berbagi pengalaman dan strategi adaptasi...</p>
                        </div>
                    </div>
                    <div class="text-center mt-6">
                        <button class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                            Bergabung ke Forum Diskusi
                        </button>
                    </div>
                </div>
            `
        },
        'berita': {
            title: 'Berita',
            content: `
                <div class="space-y-4">
                    <p class="text-gray-600">Update berita terkini seputar industri asuransi Indonesia.</p>
                    <div class="space-y-4">
                        <div class="border-l-4 border-purple-500 pl-4">
                            <h5 class="font-semibold">OJK Luncurkan Panduan Baru Tata Kelola Asuransi</h5>
                            <p class="text-sm text-gray-600">15 November 2025</p>
                            <p class="text-gray-700 mt-2">Otoritas Jasa Keuangan merilis panduan terbaru...</p>
                        </div>
                        <div class="border-l-4 border-purple-500 pl-4">
                            <h5 class="font-semibold">Pertumbuhan Industri Asuransi Triwulan III 2025</h5>
                            <p class="text-sm text-gray-600">12 November 2025</p>
                            <p class="text-gray-700 mt-2">Industri asuransi mencatat pertumbuhan positif...</p>
                        </div>
                    </div>
                    <div class="text-center mt-6">
                        <button class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                            Baca Semua Berita
                        </button>
                    </div>
                </div>
            `
        },
        'riset': {
            title: 'Riset',
            content: `
                <div class="space-y-4">
                    <p class="text-gray-600">Hasil riset dan kajian mendalam tentang industri asuransi.</p>
                    <div class="space-y-4">
                        <div class="border-l-4 border-orange-500 pl-4">
                            <h5 class="font-semibold">Analisis Tren Digitalisasi Asuransi Indonesia 2025</h5>
                            <p class="text-sm text-gray-600">Riset Tim PERFORMA | November 2025</p>
                            <p class="text-gray-700 mt-2">Studi komprehensif tentang adopsi teknologi digital...</p>
                        </div>
                        <div class="border-l-4 border-orange-500 pl-4">
                            <h5 class="font-semibold">Efektivitas Komisaris Independen dalam Pengawasan</h5>
                            <p class="text-sm text-gray-600">Riset Kolaboratif | Oktober 2025</p>
                            <p class="text-gray-700 mt-2">Evaluasi peran dan dampak Komisaris Independen...</p>
                        </div>
                    </div>
                    <div class="text-center mt-6">
                        <button class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
                            Unduh Riset Lengkap
                        </button>
                    </div>
                </div>
            `
        }
    };
    
    const data = activityData[activityType];
    if (data) {
        modalTitle.textContent = data.title;
        modalContent.innerHTML = data.content;
        modal.classList.remove('hidden');
    }
}

function closeActivityDetail() {
    const modal = document.getElementById('activity-detail-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Contact form handler
function handleContact(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name') || form.querySelector('input[type="text"]').value;
    const email = formData.get('email') || form.querySelector('input[type="email"]').value;
    const phone = formData.get('phone') || form.querySelector('input[type="tel"]').value;
    const subject = formData.get('subject') || form.querySelector('select').value;
    const message = formData.get('message') || form.querySelector('textarea').value;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Mohon masukkan email yang valid', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Pesan Anda telah dikirim! Kami akan segera menghubungi Anda.', 'success');
    form.reset();
}

// Registration form handler
function handleRegistration(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    if (!isValid) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
        return;
    }
    
    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailRegex.test(emailInput.value)) {
        showNotification('Mohon masukkan email yang valid', 'error');
        emailInput.classList.add('border-red-500');
        return;
    }
    
    // Phone validation (if provided)
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput && phoneInput.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phoneInput.value)) {
            showNotification('Mohon masukkan nomor telepon yang valid', 'error');
            phoneInput.classList.add('border-red-500');
            return;
        }
    }
    
    // Experience validation
    const experienceInput = form.querySelector('input[type="number"]');
    if (experienceInput && parseInt(experienceInput.value) < 5) {
        showNotification('Pengalaman kerja minimal 5 tahun', 'error');
        experienceInput.classList.add('border-red-500');
        return;
    }
    
    // Simulate form submission
    showNotification('Pendaftaran Anda telah diterima! Kami akan menghubungi Anda untuk proses selanjutnya.', 'success');
    form.reset();
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
    
    // Set color based on type
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on load
window.addEventListener('load', function() {
    // Hide loading spinner if present
    const spinner = document.querySelector('.spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
});

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('activity-detail-modal');
    if (modal && event.target === modal) {
        closeActivityDetail();
    }
});

// Escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeActivityDetail();
    }
});

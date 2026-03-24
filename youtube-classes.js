// YouTube Classes System
// Video data storage and management

const videos = [
    {
        id: 'class1-intro',
        title: 'Class 1 - Introduction',
        videoId: 'dMCz8dvIpTQ',
        duration: '15:30',
        description: 'Introduction to Class 1 curriculum and basic concepts'
    },
    {
        id: 'class1-basics',
        title: 'Class 1 - Basic Concepts',
        videoId: 'hoP_TxM0vQA',
        duration: '22:45',
        description: 'Fundamental concepts and foundational lessons'
    },
    {
        id: 'class1-advanced',
        title: 'Class 1 - Advanced Topics',
        videoId: 'BcYoAnRK2No',
        duration: '18:20',
        description: 'Advanced topics and comprehensive review'
    },
    {
        id: 'class2-intro',
        title: 'Class 2 - Getting Started',
        videoId: 'oAlSBpGqW7M',
        duration: '12:15',
        description: 'Introduction to Class 2 materials and setup'
    },
    {
        id: 'class2-fundamentals',
        title: 'Class 2 - Core Fundamentals',
        videoId: 'HZbQUnaBUDQ',
        duration: '25:30',
        description: 'Essential concepts and practical applications'
    },
    {
        id: 'class2-practice',
        title: 'Class 2 - Practice Session',
        videoId: 'yLiSW-7rVv4',
        duration: '20:45',
        description: 'Hands-on practice and problem solving'
    },
    {
        id: 'class3-beginner',
        title: 'Class 3 - Beginner Level',
        videoId: 'hy7SyG5ycNo',
        duration: '16:40',
        description: 'Starting points for Class 3 students'
    },
    {
        id: 'class3-intermediate',
        title: 'Class 3 - Intermediate Level',
        videoId: 'ijgripWsicc',
        duration: '28:15',
        description: 'Intermediate concepts and exercises'
    },
    {
        id: 'class3-advanced',
        title: 'Class 3 - Advanced Topics',
        videoId: 'Z9gCVva7QyI',
        duration: '35:20',
        description: 'Advanced topics and final preparations'
    }
];

// DOM Elements
let mainVideoPlayer = document.getElementById('main-video-player');
let videoList = document.getElementById('video-list');
let searchInput = document.getElementById('video-search');
let searchBtn = document.getElementById('search-btn');
let currentVideo = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderVideoList(videos);
    setupEventListeners();
    loadVideo('class1-intro'); // Load first video by default
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Render video list
function renderVideoList(videosToRender) {
    videoList.innerHTML = '';
    
    videosToRender.forEach((video, index) => {
        const videoItem = createVideoItem(video, index + 1);
        videoList.appendChild(videoItem);
    });
}

// Create video item element
function createVideoItem(video, number) {
    const li = document.createElement('li');
    li.className = 'video-item';
    li.dataset.videoId = video.id;
    
    li.innerHTML = `
        <div class="video-number">${number}</div>
        <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-duration">${video.duration}</div>
            <div class="video-description">${video.description}</div>
        </div>
    `;
    
    li.addEventListener('click', () => loadVideo(video.id));
    
    return li;
}

// Load video into main player
function loadVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (video) {
        currentVideo = video;
        updateMainPlayer(video);
        updateActiveVideo(videoId);
    }
}

// Update main video player
function updateMainPlayer(video) {
    mainVideoPlayer.src = `https://www.youtube.com/embed/${video.videoId}`;
    mainVideoPlayer.title = video.title;
}

// Update active video highlighting
function updateActiveVideo(activeVideoId) {
    // Remove all active classes
    document.querySelectorAll('.video-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current video
    const activeItem = document.querySelector(`[data-video-id="${activeVideoId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        
        // Removed automatic scrolling to prevent unwanted page scroll
        // activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderVideoList(videos);
        return;
    }
    
    const filteredVideos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm)
    );
    
    renderVideoList(filteredVideos);
}

// Clear search
function clearSearch() {
    searchInput.value = '';
    renderVideoList(videos);
}

// Keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Number keys 1-9 for quick video selection
    if (event.key >= '1' && event.key <= '9') {
        const videoIndex = parseInt(event.key) - 1;
        if (videoIndex < videos.length) {
            loadVideo(videos[videoIndex].id);
        }
    }
    
    // Escape key to clear search
    if (event.key === 'Escape') {
        clearSearch();
    }
    
    // Arrow keys for navigation
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        navigateVideoList(event.key === 'ArrowUp' ? -1 : 1);
    }
}

// Navigate video list with arrow keys
function navigateVideoList(direction) {
    const activeItem = document.querySelector('.video-item.active');
    if (!activeItem) return;
    
    const allItems = Array.from(document.querySelectorAll('.video-item'));
    const currentIndex = allItems.indexOf(activeItem);
    let newIndex = currentIndex + direction;
    
    // Wrap around list
    if (newIndex < 0) newIndex = allItems.length - 1;
    if (newIndex >= allItems.length) newIndex = 0;
    
    loadVideo(allItems[newIndex].dataset.videoId);
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Utility functions
function formatDuration(duration) {
    return duration;
}

function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

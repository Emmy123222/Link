// main.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && e.target !== sidebarToggle) {
            sidebar.classList.add('-translate-x-full');
        }
    });
    
    // Dark mode toggle function
    function toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    }
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    // Post interaction handlers
    const likeButtons = document.querySelectorAll('.post-actions button:first-child');
    const commentButtons = document.querySelectorAll('.post-actions button:nth-child(2)');
    const shareButtons = document.querySelectorAll('.post-actions button:last-child');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle like state
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                this.classList.add('text-primary-600');
            } else {
                icon.classList.replace('fas', 'far');
                this.classList.remove('text-primary-600');
            }
        });
    });
    
    commentButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Focus on the comment input for this post
            const post = this.closest('.feed-item');
            const commentInput = post.querySelector('.comment-input');
            if (commentInput) {
                commentInput.focus();
            }
        });
    });
    
    // Create post functionality
    const postTextarea = document.querySelector('.comment-input');
    const postButton = document.querySelector('.bg-primary-600.hover\\:bg-primary-700');
    
    if (postButton && postTextarea) {
        postButton.addEventListener('click', function() {
            const postContent = postTextarea.value.trim();
            if (postContent) {
                createNewPost(postContent);
                postTextarea.value = '';
            }
        });
    }
    
    // Function to create a new post
    function createNewPost(content) {
        const feedContainer = document.querySelector('.space-y-6');
        if (!feedContainer) return;
        
        const newPost = document.createElement('div');
        newPost.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden feed-item animate-fade-in';
        
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        newPost.innerHTML = `
            <div class="p-4">
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" class="w-10 h-10 rounded-full">
                        <div>
                            <h3 class="font-medium">Sarah Johnson</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Just now</p>
                        </div>
                    </div>
                    <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                <div class="mt-4">
                    <p class="text-gray-700 dark:text-gray-300">${content}</p>
                </div>
                <div class="mt-4 flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
                    <div class="flex items-center space-x-2">
                        <span><i class="far fa-thumbs-up mr-1"></i> 0</span>
                        <span><i class="far fa-comment mr-1"></i> 0</span>
                        <span><i class="fas fa-share mr-1"></i> 0</span>
                    </div>
                    <span>0 shares</span>
                </div>
                <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
                    <button class="flex-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center post-actions">
                        <i class="far fa-thumbs-up mr-2"></i> Like
                    </button>
                    <button class="flex-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center post-actions">
                        <i class="far fa-comment mr-2"></i> Comment
                    </button>
                    <button class="flex-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center post-actions">
                        <i class="fas fa-share mr-2"></i> Share
                    </button>
                </div>
            </div>
        `;
        
        // Insert the new post at the top of the feed
        if (feedContainer.firstChild) {
            feedContainer.insertBefore(newPost, feedContainer.firstChild);
        } else {
            feedContainer.appendChild(newPost);
        }
        
        // Add event listeners to the new post's buttons
        const newLikeButton = newPost.querySelector('.post-actions button:first-child');
        newLikeButton.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                this.classList.add('text-primary-600');
            } else {
                icon.classList.replace('fas', 'far');
                this.classList.remove('text-primary-600');
            }
        });
    }
    
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.bg-gray-100.dark\\:bg-gray-700');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary-600', 'text-white');
                btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'hover:bg-gray-200', 'dark:hover:bg-gray-600');
            });
            
            // Add active class to clicked button
            this.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'hover:bg-gray-200', 'dark:hover:bg-gray-600');
            this.classList.add('bg-primary-600', 'text-white');
        });
    });
    
    // Add animation to feed items on scroll
    const animateOnScroll = () => {
        const feedItems = document.querySelectorAll('.feed-item');
        
        feedItems.forEach(item => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (itemPosition < screenPosition) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize feed items with opacity 0 for animation
    const feedItems = document.querySelectorAll('.feed-item');
    feedItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.3s ease ${index * 0.1}s`;
    });
    
    // Run once on load
    animateOnScroll();
    
    // Then run on scroll
    window.addEventListener('scroll', animateOnScroll);
});
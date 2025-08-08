// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    
    // Toggle sidebar visibility
    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('-translate-x-full');
    });
    
    // Close sidebar
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && e.target !== sidebarToggle && window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
        }
    });
    
    // Prevent sidebar close when clicking inside
    sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Dark mode toggle functionality
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'dark-mode-toggle';
    darkModeToggle.className = 'p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500';
    darkModeToggle.innerHTML = `
        <span class="dark:hidden"><i class="fas fa-moon text-gray-600"></i></span>
        <span class="hidden dark:inline"><i class="fas fa-sun text-yellow-300"></i></span>
        <span class="sr-only">Toggle dark mode</span>
    `;
    
    // Insert dark mode toggle into the header
    const headerRight = document.querySelector('header > div > div:last-child');
    headerRight.insertBefore(darkModeToggle, headerRight.firstChild);
    
    // Dark mode toggle event
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Check for saved dark mode preference or system preference
    function checkDarkModePreference() {
        if (localStorage.getItem('darkMode') === 'true' || 
            (localStorage.getItem('darkMode') === null && 
             window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    // Toggle dark mode function
    function toggleDarkMode() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', isDark);
    }
    
    // Initialize dark mode
    checkDarkModePreference();
    
    // Listen for system color scheme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('darkMode') === null) {
            checkDarkModePreference();
        }
    });
    
    // Chat functionality
    const chatInput = document.querySelector('.team-chat input[type="text"]');
    const chatSendBtn = document.querySelector('.team-chat button');
    const chatMessages = document.querySelector('.team-chat .overflow-y-auto');
    
    if (chatInput && chatSendBtn && chatMessages) {
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                // Create new message element
                const messageElement = document.createElement('div');
                messageElement.className = 'flex items-start justify-end';
                messageElement.innerHTML = `
                    <div class="text-right">
                        <div class="message-out px-4 py-2 max-w-xs inline-block">
                            <p class="text-sm">${message}</p>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">You - ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                `;
                
                // Add to chat
                chatMessages.appendChild(messageElement);
                chatInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate reply after 1-3 seconds
                setTimeout(simulateReply, 1000 + Math.random() * 2000);
            }
        }
        
        function simulateReply() {
            const replies = [
                "Sounds good!",
                "I'll look into it.",
                "Can we discuss this in our next meeting?",
                "Thanks for the update!",
                "Let me check and get back to you.",
                "Great work!",
                "I have a question about that."
            ];
            
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const users = [
                {name: "Michael", img: "https://randomuser.me/api/portraits/men/32.jpg"},
                {name: "Emma", img: "https://randomuser.me/api/portraits/women/65.jpg"},
                {name: "David", img: "https://randomuser.me/api/portraits/men/75.jpg"}
            ];
            
            const randomUser = users[Math.floor(Math.random() * users.length)];
            
            const replyElement = document.createElement('div');
            replyElement.className = 'flex items-start';
            replyElement.innerHTML = `
                <img src="${randomUser.img}" alt="User" class="w-8 h-8 rounded-full mr-2">
                <div>
                    <div class="message-in px-4 py-2 max-w-xs">
                        <p class="text-sm">${randomReply}</p>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${randomUser.name} - ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
            `;
            
            chatMessages.appendChild(replyElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Notification bell animation
    const notificationBell = document.querySelector('[aria-label="Notifications"]');
    if (notificationBell) {
        notificationBell.addEventListener('click', function(e) {
            e.preventDefault();
            // Here you would typically show a notifications dropdown
            // For now, we'll just animate the bell
            this.querySelector('i').classList.add('animate-ping-slow');
            setTimeout(() => {
                this.querySelector('i').classList.remove('animate-ping-slow');
            }, 1000);
        });
    }
    
    // Add animation to the rocket icon in the welcome card
    const startMeetingBtn = document.querySelector('.welcome-card button');
    if (startMeetingBtn) {
        startMeetingBtn.addEventListener('click', function() {
            const rocketIcon = document.createElement('div');
            rocketIcon.className = 'absolute bottom-4 right-4 text-3xl text-primary-500 animate-rocket-launch';
            rocketIcon.innerHTML = '<i class="fas fa-rocket"></i>';
            document.body.appendChild(rocketIcon);
            
            setTimeout(() => {
                rocketIcon.remove();
            }, 1500);
        });
    }
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.bg-white, .bg-gray-50, .bg-blue-50, .bg-green-50, .bg-purple-50, .bg-orange-50');
    cards.forEach(card => {
        card.classList.add('transition-all', 'duration-200', 'hover:shadow-md');
    });
    
    // Add animation to the VUNO logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.classList.add('animate-logo-pulse');
    }
});
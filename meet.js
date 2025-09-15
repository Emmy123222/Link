
    document.addEventListener('DOMContentLoaded', function() {
      const joinButton = document.getElementById('join-info-button');
      const modal = document.getElementById('join-modal');
      const closeButton = document.getElementById('close-modal');
      const copyButton = document.getElementById('copy-button');
      const modalContent = modal.querySelector('.transform');
      
      function openModal() {
        modal.classList.remove('hidden');
        setTimeout(() => {
          modalContent.classList.remove('scale-95', 'opacity-0');
        }, 10);
      }
      
      function closeModal() {
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
          modal.classList.add('hidden');
        }, 300);
      }
      
      if (joinButton) {
        joinButton.addEventListener('click', openModal);
      }
      
      if (closeButton) {
        closeButton.addEventListener('click', closeModal);
      }
      
      if (copyButton) {
        copyButton.addEventListener('click', function() {
          navigator.clipboard.writeText('http://127.0.0.1:5500/contact.html?meeting=${meetingId}')
            .then(() => {
              const originalHTML = copyButton.innerHTML;
              copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
              
              setTimeout(() => {
                copyButton.innerHTML = originalHTML;
              }, 2000);
            });
        });
      }
      
      // Close modal when clicking outside
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    });
  
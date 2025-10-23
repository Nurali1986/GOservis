// Booking functionality
document.addEventListener('DOMContentLoaded', function() {
  const bookButtons = document.querySelectorAll('.book-btn');
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.querySelector('.close');
  const bookingForm = document.querySelector('.booking-form');

  // Open modal
  bookButtons.forEach(button => {
    button.addEventListener('click', function() {
      modal.style.display = 'block';
    });
  });

  // Close modal
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Handle form submission
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Sizning broningiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.');
    modal.style.display = 'none';
  });
});

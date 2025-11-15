// Firebase Rating System
class ProductRating {
    constructor() {
        this.currentRating = 0;
        this.reviews = [];
        this.firebaseUrl = 'https://stem-yut-2025-default-rtdb.asia-southeast1.firebasedatabase.app';
        this.init();
    }

    init() {
        this.createStarDisplay();
        this.createStarInput();
        this.attachEventListeners();
        this.loadReviews();
    }

    createStarDisplay() {
        const container = document.getElementById('starContainer');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.className = 'star-display';
            star.textContent = '★';
            star.style.opacity = i < Math.round(this.getAverageRating()) ? '1' : '0.3';
            container.appendChild(star);
        }
    }

    createStarInput() {
        const container = document.getElementById('starsInput');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star-input';
            star.textContent = '★';
            star.dataset.rating = i;
            star.addEventListener('click', () => this.setRating(i));
            star.addEventListener('mouseover', () => this.previewRating(i));
            container.appendChild(star);
        }
        container.addEventListener('mouseleave', () => this.updateStarInput());
    }

    setRating(rating) {
        this.currentRating = rating;
        this.updateStarInput();
        this.updateSelectedRating();
        this.checkFormValidity();
    }

    previewRating(rating) {
        const stars = document.querySelectorAll('.star-input');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    updateStarInput() {
        const stars = document.querySelectorAll('.star-input');
        stars.forEach((star, index) => {
            if (index < this.currentRating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    updateSelectedRating() {
        const selectedRatingEl = document.getElementById('selectedRating');
        const ratings = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        if (selectedRatingEl) {
            selectedRatingEl.textContent = this.currentRating ? `${this.currentRating} - ${ratings[this.currentRating]}` : 'Select a rating';
        }
    }

    attachEventListeners() {
        const submitBtn = document.getElementById('submitBtn');
        const resetBtn = document.getElementById('resetBtn');
        const reviewText = document.getElementById('reviewText');
        const reviewName = document.getElementById('reviewName');

        if (submitBtn) submitBtn.addEventListener('click', () => this.submitReview());
        if (resetBtn) resetBtn.addEventListener('click', () => this.clearForm());
        
        if (reviewText) reviewText.addEventListener('input', () => this.checkFormValidity());
        if (reviewName) reviewName.addEventListener('input', () => this.checkFormValidity());
    }

    checkFormValidity() {
        const submitBtn = document.getElementById('submitBtn');
        const reviewText = document.getElementById('reviewText');
        const reviewName = document.getElementById('reviewName');

        if (submitBtn) {
            const isValid = this.currentRating > 0 && 
                           reviewText.value.trim() !== '' && 
                           reviewName.value.trim() !== '';
            submitBtn.disabled = !isValid;
        }
    }

    async submitReview() {
        const reviewName = document.getElementById('reviewName');
        const reviewText = document.getElementById('reviewText');
        const submitBtn = document.getElementById('submitBtn');

        if (this.currentRating > 0 && reviewText.value.trim() && reviewName.value.trim()) {
            // Disable button to prevent double submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const review = {
                name: reviewName.value.trim(),
                rating: this.currentRating,
                text: reviewText.value.trim(),
                date: new Date().toLocaleDateString(),
                timestamp: Date.now()
            };

            try {
                // Save to Firebase
                const response = await fetch(`${this.firebaseUrl}/reviews.json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(review)
                });

                if (response.ok) {
                    alert('Review submitted successfully!');
                    this.clearForm();
                    await this.loadReviews();
                } else {
                    throw new Error('Failed to submit review');
                }
            } catch (error) {
                console.error('Error submitting review:', error);
                alert('Failed to submit review. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
                this.checkFormValidity();
            }
        }
    }

    clearForm() {
        document.getElementById('reviewName').value = '';
        document.getElementById('reviewText').value = '';
        this.currentRating = 0;
        this.updateStarInput();
        this.updateSelectedRating();
        this.checkFormValidity();
    }

    async loadReviews() {
        try {
            const response = await fetch(`${this.firebaseUrl}/reviews.json`);
            const data = await response.json();

            if (data) {
                // Convert Firebase object to array
                this.reviews = Object.entries(data).map(([id, review]) => ({
                    id,
                    ...review
                }));

                // Sort by timestamp (newest first)
                this.reviews.sort((a, b) => b.timestamp - a.timestamp);
            } else {
                this.reviews = [];
            }

            this.displayReviews();
            this.updateDisplay();
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.reviews = [];
            this.displayReviews();
            this.updateDisplay();
        }
    }

    displayReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        if (this.reviews.length === 0) {
            reviewsList.innerHTML = '<div class="no-reviews">No reviews yet. Be the first to review!</div>';
            return;
        }

        reviewsList.innerHTML = this.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${this.escapeHtml(review.name)}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-stars">${'★'.repeat(review.rating)}</div>
                <div class="review-text">"${this.escapeHtml(review.text)}"</div>
            </div>
        `).join('');
    }

    updateDisplay() {
        this.updateOverallRating();
        this.updateRatingBars();
        this.createStarDisplay();
    }

    getAverageRating() {
        if (this.reviews.length === 0) return 0;
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / this.reviews.length;
    }

    updateOverallRating() {
        const overallRating = document.getElementById('overallRating');
        const totalReviews = document.getElementById('totalReviews');

        if (overallRating) {
            overallRating.textContent = this.getAverageRating().toFixed(1);
        }
        if (totalReviews) {
            totalReviews.textContent = `(${this.reviews.length} review${this.reviews.length !== 1 ? 's' : ''})`;
        }
    }

    updateRatingBars() {
        const counts = [0, 0, 0, 0, 0];
        this.reviews.forEach(review => {
            counts[review.rating - 1]++;
        });

        const total = this.reviews.length || 1;
        const barIds = ['oneStarBar', 'twoStarBar', 'threeStarBar', 'fourStarBar', 'fiveStarBar'];
        const countIds = ['oneStarCount', 'twoStarCount', 'threeStarCount', 'fourStarCount', 'fiveStarCount'];

        counts.forEach((count, index) => {
            const percentage = (count / total) * 100;
            const barEl = document.getElementById(barIds[index]);
            const countEl = document.getElementById(countIds[index]);

            if (barEl) barEl.style.width = percentage + '%';
            if (countEl) countEl.textContent = count;
        });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductRating();
});

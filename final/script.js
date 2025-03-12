document.addEventListener("DOMContentLoaded", function() {
    console.log("TrashSync Loaded");
    
    // API base URL - make sure this matches your server
    const API_BASE_URL = "http://127.0.0.1:5000";

    // 🚀 Schedule Pickup Form
    document.getElementById("pickupForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let user = document.getElementById("user").value;
        let location = document.getElementById("location").value;
        let date = document.getElementById("date").value;

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        fetch(`${API_BASE_URL}/schedule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: user, location: location, date: date })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Schedule response:", data);
            // Show success notification
            showNotification('Success! Your pickup has been scheduled.', 'success');
            
            // Reset form
            document.getElementById("pickupForm").reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            fetchPickups();  // Refresh pickup list
        })
        .catch(error => {
            console.error("Error:", error);
            showNotification('There was an error scheduling your pickup. Please try again.', 'error');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // 🚀 Report Form
    document.getElementById("reportForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let pickupId = document.getElementById("pickupId").value;
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        fetch(`${API_BASE_URL}/report`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: parseInt(pickupId) })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Report response:", data);
            // Show success notification
            showNotification('Issue reported successfully!', 'success');
            
            // Reset form
            document.getElementById("reportForm").reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            fetchPickups();  // Refresh pickup list
        })
        .catch(error => {
            console.error("Error:", error);
            showNotification('There was an error reporting the issue. Please check the ID and try again.', 'error');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });

    // 🚀 Hire Cleaner Form
    document.getElementById("hireForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let cleaningType = document.getElementById("cleaningType").value;
        let location = document.getElementById("hireLocation").value;
        let dateTime = document.getElementById("hireDateTime").value;
        let details = document.getElementById("hireDetails").value;
        let name = document.getElementById("contactName").value;
        let phone = document.getElementById("contactPhone").value;
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        fetch(`${API_BASE_URL}/hire-cleaner`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                cleaningType: cleaningType,
                location: location,
                dateTime: dateTime,
                details: details,
                contactName: name,
                contactPhone: phone
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Hire response:", data);
            // Show success notification
            showNotification('Success! Your cleaning request has been submitted.', 'success');
            
            // Reset form
            document.getElementById("hireForm").reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            fetchCleaners();  // Refresh cleaners list
        })
        .catch(error => {
            console.error("Error:", error);
            showNotification('There was an error submitting your request. Please try again.', 'error');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });

    // 🚀 Fetch Scheduled Pickups
    function fetchPickups() {
        const pickupList = document.getElementById("pickupList");
        
        // Show loading indicator
        pickupList.innerHTML = '<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Loading pickups...</div>';
        
        fetch(`${API_BASE_URL}/pickups`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Pickups data:", data);
            pickupList.innerHTML = "";
            
            // If no pickups, show a message
            if (data.length === 0) {
                let emptyMessage = document.createElement("div");
                emptyMessage.className = "empty-message";
                emptyMessage.innerHTML = '<i class="fas fa-inbox"></i> No pickups scheduled yet.';
                pickupList.appendChild(emptyMessage);
                return;
            }
            
            data.forEach(pickup => {
                // Check if all required fields exist
                if (pickup.id && pickup.user && pickup.location && pickup.date && pickup.status) {
                    let li = document.createElement("li");
                    
                    // Apply different styling based on status
                    if (pickup.status.toLowerCase() === "uncollected") {
                        li.className = "status-uncollected";
                    }
                    
                    // Format the date to be more readable if it's in ISO format
                    let displayDate = pickup.date;
                    try {
                        if (pickup.date.includes('-')) {
                            const dateObj = new Date(pickup.date);
                            if (!isNaN(dateObj)) {
                                displayDate = dateObj.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric'
                                });
                            }
                        }
                    } catch (e) {
                        console.warn("Date formatting failed, using original format");
                    }
                    
                    // Create status pill
                    const statusClass = pickup.status.toLowerCase() === "uncollected" ? "uncollected" : "scheduled";
                    
                    // Enhanced content format
                    li.innerHTML = `
                        <span class="pickup-id">ID: ${pickup.id}</span>
                        <div><strong>${pickup.user}</strong> - ${pickup.location}</div>
                        <div class="date-display"><i class="far fa-calendar-alt"></i> ${displayDate}</div>
                        <div>Status: <span class="status-pill ${statusClass}">${pickup.status}</span></div>
                    `;
                    
                    pickupList.appendChild(li);
                } else {
                    console.error("Incomplete pickup data:", pickup);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching pickups:", error);
            pickupList.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Failed to load pickups. Please refresh the page or check if the server is running.</div>';
        });
    }
    
    // 🚀 Fetch Available Cleaners
    function fetchCleaners() {
        const cleanerList = document.getElementById("cleanerList");
        
        // Show loading indicator
        cleanerList.innerHTML = '<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Loading available cleaners...</div>';
        
        fetch(`${API_BASE_URL}/cleaners`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Cleaners data:", data);
            cleanerList.innerHTML = "";
            
            // If no cleaners, show a message
            if (data.length === 0) {
                let emptyMessage = document.createElement("div");
                emptyMessage.className = "empty-message";
                emptyMessage.innerHTML = '<i class="fas fa-user-slash"></i> No cleaners available at the moment.';
                cleanerList.appendChild(emptyMessage);
                return;
            }
            
            data.forEach(cleaner => {
                // Check if all required fields exist
                if (cleaner.id && cleaner.name && cleaner.contact && cleaner.status) {
                    let li = document.createElement("li");
                    
                    // Apply different styling based on status
                    if (cleaner.status.toLowerCase() === "busy") {
                        li.className = "status-busy";
                    }
                    
                    // Create status pill
                    const statusClass = cleaner.status.toLowerCase() === "available" ? "available" : "busy";
                    
                    // Enhanced content format with service types if available
                    const services = cleaner.services ? 
                        `<div class="services">
                            ${cleaner.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
                        </div>` : '';
                    
                    li.innerHTML = `
                        <div class="cleaner-card">
                            <div class="cleaner-header">
                                <i class="fas fa-user-tie cleaner-icon"></i>
                                <span class="cleaner-name">${cleaner.name}</span>
                                <span class="status-pill ${statusClass}">${cleaner.status}</span>
                            </div>
                            <div class="cleaner-info">
                                <div><i class="fas fa-phone"></i> ${cleaner.contact}</div>
                                ${services}
                                ${cleaner.rating ? `<div class="rating">
                                    ${generateStars(cleaner.rating)}
                                    <span class="rating-text">${cleaner.rating.toFixed(1)}/5</span>
                                </div>` : ''}
                            </div>
                            <button class="hire-now-btn" data-id="${cleaner.id}">
                                <i class="fas fa-handshake"></i> Hire Now
                            </button>
                        </div>
                    `;
                    
                    cleanerList.appendChild(li);
                } else {
                    console.error("Incomplete cleaner data:", cleaner);
                }
            });
            
            // Add event listeners to hire buttons
            document.querySelectorAll('.hire-now-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const cleanerId = this.getAttribute('data-id');
                    document.getElementById('hire').scrollIntoView({ behavior: 'smooth' });
                    showNotification('Fill out the form to hire this cleaner', 'info');
                });
            });
        })
        .catch(error => {
            console.error("Error fetching cleaners:", error);
            cleanerList.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Failed to load cleaners. Please refresh the page or check if the server is running.</div>';
        });
    }
    
    // Helper function to generate star ratings
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Add half star if needed
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Add empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // 🚀 Notification system
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Icon based on type
        let icon = 'fas fa-info-circle';
        if (type === 'success') icon = 'fas fa-check-circle';
        else if (type === 'error') icon = 'fas fa-exclamation-circle';
        else if (type === 'info') icon = 'fas fa-info-circle';
        
        notification.innerHTML = `<i class="${icon}"></i> ${message}`;
        document.body.appendChild(notification);
        
        // Animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // 🚀 Add notification and cleaner styling
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: white;
            color: #333;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-size: 0.9rem;
            z-index: 1000;
            transform: translateY(-20px);
            opacity: 0;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification.success {
            border-left: 4px solid #22c55e;
        }
        
        .notification.success i {
            color: #22c55e;
        }
        
        .notification.error {
            border-left: 4px solid #ef4444;
        }
        
        .notification.error i {
            color: #ef4444;
        }
        
        .notification.info {
            border-left: 4px solid #0ea5e9;
        }
        
        .notification.info i {
            color: #0ea5e9;
        }
        
        .loading {
            text-align: center;
            padding: 2rem;
            color: var(--gray, #64748b);
        }
        
        .loading i {
            margin-right: 8px;
        }
        
        .error-message {
            text-align: center;
            padding: 2rem;
            color: var(--danger, #ef4444);
        }
        
        .error-message i {
            margin-right: 8px;
        }
        
        /* Cleaner card styling */
        .cleaner-card {
            background-color: white;
            border-radius: 0.75rem;
            padding: 1.25rem;
            box-shadow: var(--shadow-sm);
            margin-bottom: 1rem;
            transition: var(--transition);
            border: 1px solid var(--gray-light);
        }
        
        .cleaner-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow);
        }
        
        .cleaner-header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            gap: 0.75rem;
        }
        
        .cleaner-icon {
            font-size: 1.2rem;
            color: var(--primary);
            background: rgba(34, 197, 94, 0.1);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        
        .cleaner-name {
            font-weight: 600;
            font-size: 1.1rem;
            flex-grow: 1;
        }
        
        .cleaner-info {
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .status-pill.available {
            background-color: var(--primary-light);
            color: var(--primary-dark);
        }
        
        .status-pill.busy {
            background-color: #fef3c7;
            color: #d97706;
        }
        
        .services {
            margin-top: 0.75rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .service-tag {
            background-color: #e0f2fe;
            color: #0369a1;
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-weight: 500;
        }
        
        .rating {
            margin-top: 0.75rem;
            color: #f59e0b;
        }
        
        .rating-text {
            color: var(--dark);
            margin-left: 0.5rem;
            font-weight: 500;
        }
        
        .hire-now-btn {
            background: linear-gradient(to right, var(--secondary), #0c4a6e);
            color: white;
            padding: 0.75rem 1rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.95rem;
            width: 100%;
            margin-top: 0.5rem;
            transition: all 0.2s ease;
        }
        
        .hire-now-btn:hover {
            filter: brightness(110%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
        }
        
        /* Improve select input styling */
        select {
            width: 100%;
            padding: 0.9rem 1rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-family: inherit;
            transition: var(--transition);
            border: 1px solid var(--gray-light);
            background-color: var(--light);
            outline: none;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 1.5rem;
            cursor: pointer;
        }
        
        select:focus {
            border-color: var(--secondary);
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
        }
        
        /* Improve textarea styling */
        textarea {
            width: 100%;
            padding: 0.9rem 1rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-family: inherit;
            transition: var(--transition);
            border: 1px solid var(--gray-light);
            background-color: var(--light);
            outline: none;
            resize: vertical;
            min-height: 100px;
        }
        
        textarea:focus {
            border-color: var(--secondary);
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
        }
        
        textarea::placeholder {
            color: var(--gray);
            font-size: 0.95rem;
        }
        
        #cleanerList {
            list-style: none;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        @media (max-width: 768px) {
            #cleanerList {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);

    // 🚀 Initialize by loading data
    fetchPickups();
    fetchCleaners();
});
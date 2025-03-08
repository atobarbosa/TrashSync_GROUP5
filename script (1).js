document.addEventListener("DOMContentLoaded", function() {
    console.log("TrashSync Loaded");

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

        fetch("http://127.0.0.1:5000/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: user, location: location, date: date })
        }).then(response => response.json())
          .then(data => {
              // Show success notification
              showNotification('Success! Your pickup has been scheduled.', 'success');
              
              // Reset form
              document.getElementById("pickupForm").reset();
              
              // Reset button
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
              
              fetchPickups();  // Refresh pickup list
          }).catch(error => {
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

        fetch("http://127.0.0.1:5000/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: parseInt(pickupId) })
        }).then(response => response.json())
          .then(data => {
              // Show success notification
              showNotification('Issue reported successfully!', 'success');
              
              // Reset form
              document.getElementById("reportForm").reset();
              
              // Reset button
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
              
              fetchPickups();  // Refresh pickup list
          }).catch(error => {
              console.error("Error:", error);
              showNotification('There was an error reporting the issue. Please check the ID and try again.', 'error');
              
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
        
        fetch("http://127.0.0.1:5000/pickups")
        .then(response => response.json())
        .then(data => {
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
        }).catch(error => {
            console.error("Error fetching pickups:", error);
            pickupList.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Failed to load pickups. Please refresh the page.</div>';
        });
    }
    
    // 🚀 Notification system
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Icon based on type
        let icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
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
    
    // 🚀 Add notification styling
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
    `;
    document.head.appendChild(style);

    // 🚀 Initialize by loading pickups
    fetchPickups();
});
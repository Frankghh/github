// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const uploadBox = document.querySelector('.upload-box');
    const fileInput = document.getElementById('image-upload');
    const uploadBtn = document.querySelector('.btn-upload');
    const urlInput = document.querySelector('.url-input input');
    const urlBtn = document.querySelector('.btn-url');
    
    // Drag and drop functionality
    if (uploadBox) {
        // Drag event - enter area
        uploadBox.addEventListener('dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('active');
        });
        
        // Drag event - over area
        uploadBox.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('active');
        });
        
        // Drag event - leave area
        uploadBox.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('active');
        });
        
        // Drag event - drop file
        uploadBox.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('active');
            
            const files = e.dataTransfer.files;
            if (files.length) {
                handleImageUpload(files[0]);
            }
        });
    }
    
    // Click upload button to trigger file selection
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', function() {
            if (this.files.length) {
                handleImageUpload(this.files[0]);
            }
        });
    }
    
    // URL input detection
    if (urlBtn && urlInput) {
        urlBtn.addEventListener('click', function() {
            const imageUrl = urlInput.value.trim();
            if (imageUrl) {
                handleImageUrl(imageUrl);
            } else {
                showMessage('Please enter a valid image URL', 'error');
            }
        });
        
        // Also submit URL on Enter key
        urlInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const imageUrl = this.value.trim();
                if (imageUrl) {
                    handleImageUrl(imageUrl);
                } else {
                    showMessage('Please enter a valid image URL', 'error');
                }
            }
        });
    }
    
    // Handle image file upload
    function handleImageUpload(file) {
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showMessage('Please upload an image file', 'error');
            return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Create a FormData object
        const formData = new FormData();
        formData.append('image', file);
        
        // Simulate API request - in a real application this would be an actual API call
        // We use setTimeout to simulate network request
        setTimeout(function() {
            // Assume we got a detection result
            const result = {
                isAI: Math.random() > 0.5, // Random determination if AI-generated
                confidence: Math.floor(Math.random() * 30) + 70, // 70%-99% confidence
                details: {
                    artifacts: Math.floor(Math.random() * 100),
                    inconsistencies: Math.floor(Math.random() * 100),
                    metadata: Math.floor(Math.random() * 100)
                }
            };
            
            displayResults(result, URL.createObjectURL(file));
        }, 2000);
    }
    
    // Handle image URL
    function handleImageUrl(url) {
        // Show loading state
        showLoadingState();
        
        // Check if URL is valid
        const img = new Image();
        img.onload = function() {
            // URL is valid, simulate API request
            setTimeout(function() {
                // Assume we got a detection result
                const result = {
                    isAI: Math.random() > 0.5,
                    confidence: Math.floor(Math.random() * 30) + 70,
                    details: {
                        artifacts: Math.floor(Math.random() * 100),
                        inconsistencies: Math.floor(Math.random() * 100),
                        metadata: Math.floor(Math.random() * 100)
                    }
                };
                
                displayResults(result, url);
            }, 2000);
        };
        
        img.onerror = function() {
            hideLoadingState();
            showMessage('Unable to load image, please check the URL', 'error');
        };
        
        img.src = url;
    }
    
    // Show loading state
    function showLoadingState() {
        // Create and add loading indicator
        if (!document.querySelector('.loading-overlay')) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = '<div class="loading-spinner"></div><p>Analyzing image...</p>';
            document.body.appendChild(loadingOverlay);
            
            // Add CSS styles
            const style = document.createElement('style');
            style.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    color: white;
                }
                .loading-spinner {
                    border: 5px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top: 5px solid var(--primary-color);
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Hide loading state
    function hideLoadingState() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }
    
    // Display results
    function displayResults(result, imageUrl) {
        hideLoadingState();
        
        // Check if result container already exists, if so remove it
        const existingResult = document.querySelector('.result-container');
        if (existingResult) {
            existingResult.remove();
        }
        
        // Create result container
        const resultContainer = document.createElement('div');
        resultContainer.className = 'result-container';
        
        // Add result content
        resultContainer.innerHTML = `
            <div class="result-header">
                <h2>Detection Results</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="result-content">
                <div class="result-image">
                    <img src="${imageUrl}" alt="Analyzed Image">
                </div>
                <div class="result-data">
                    <div class="result-summary ${result.isAI ? 'ai-generated' : 'authentic'}">
                        <div class="result-badge">${result.isAI ? 'AI-Generated' : 'Authentic Image'}</div>
                        <div class="confidence-level">Confidence: ${result.confidence}%</div>
                    </div>
                    <div class="result-details">
                        <h3>Detailed Analysis</h3>
                        <div class="detail-item">
                            <span>AI Artifact Index:</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${result.details.artifacts}%"></div>
                            </div>
                            <span>${result.details.artifacts}%</span>
                        </div>
                        <div class="detail-item">
                            <span>Inconsistency Index:</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${result.details.inconsistencies}%"></div>
                            </div>
                            <span>${result.details.inconsistencies}%</span>
                        </div>
                        <div class="detail-item">
                            <span>Metadata Anomaly Index:</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${result.details.metadata}%"></div>
                            </div>
                            <span>${result.details.metadata}%</span>
                        </div>
                    </div>
                    <div class="result-explanation">
                        <h3>Result Explanation</h3>
                        <p>${result.isAI ? 
                            'This image is likely AI-generated. We detected typical AI generation artifacts, including unnatural textures, anomalous metadata, and inconsistent details.' : 
                            'This image appears to be authentic. We did not detect significant AI-generation features, but please note that as AI technology advances, detection results are for reference only.'
                        }</p>
                    </div>
                    <button class="btn-primary download-report">Download Full Report</button>
                </div>
            </div>
        `;
        
        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .result-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 1000px;
                max-height: 90vh;
                background-color: white;
                border-radius: var(--border-radius);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                overflow: auto;
            }
            .result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            .result-header h2 {
                margin: 0;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--gray-color);
            }
            .result-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                padding: 30px;
            }
            .result-image img {
                width: 100%;
                border-radius: var(--border-radius);
                box-shadow: var(--box-shadow);
            }
            .result-summary {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-radius: var(--border-radius);
                margin-bottom: 20px;
            }
            .ai-generated {
                background-color: #ffeded;
                border-left: 4px solid var(--error-color);
            }
            .authentic {
                background-color: #edffed;
                border-left: 4px solid var(--success-color);
            }
            .result-badge {
                font-weight: bold;
                font-size: 18px;
            }
            .ai-generated .result-badge {
                color: var(--error-color);
            }
            .authentic .result-badge {
                color: var(--success-color);
            }
            .confidence-level {
                font-weight: 500;
            }
            .result-details, .result-explanation {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: var(--border-radius);
                margin-bottom: 20px;
            }
            .detail-item {
                display: grid;
                grid-template-columns: 120px 1fr 40px;
                gap: 15px;
                align-items: center;
                margin-bottom: 15px;
            }
            .progress-bar {
                height: 8px;
                background-color: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
            }
            .progress {
                height: 100%;
                background-color: var(--primary-color);
            }
            .download-report {
                width: 100%;
                margin-top: 20px;
            }
            
            /* Media queries */
            @media (max-width: 768px) {
                .result-content {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add result container to page
        document.body.appendChild(resultContainer);
        
        // Add close button functionality
        const closeBtn = resultContainer.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            resultContainer.remove();
        });
        
        // Add download report button functionality
        const downloadBtn = resultContainer.querySelector('.download-report');
        downloadBtn.addEventListener('click', function() {
            // Simulate report download functionality
            alert('Report download feature is under development. Please check back later!');
        });
        
        // Add ESC key close functionality
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                resultContainer.remove();
            }
        });
    }
    
    // Show message toast
    function showMessage(message, type = 'info') {
        // Check if message toast already exists, if so remove it
        const existingMessage = document.querySelector('.message-toast');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message toast
        const messageToast = document.createElement('div');
        messageToast.className = `message-toast ${type}`;
        messageToast.textContent = message;
        
        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .message-toast {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 20px;
                border-radius: var(--border-radius);
                color: white;
                font-weight: 500;
                z-index: 9999;
                animation: fadeInOut 3s forwards;
            }
            .message-toast.info {
                background-color: var(--primary-color);
            }
            .message-toast.error {
                background-color: var(--error-color);
            }
            .message-toast.success {
                background-color: var(--success-color);
            }
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, 20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                90% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
            }
        `;
        document.head.appendChild(style);
        
        // Add message toast to page
        document.body.appendChild(messageToast);
        
        // Set auto-dismiss
        setTimeout(function() {
            if (messageToast) {
                messageToast.remove();
            }
        }, 3000);
    }
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // Add header scroll effect CSS
    const headerStyle = document.createElement('style');
    headerStyle.textContent = `
        header.scrolled {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 10px 0;
        }
        header, header .container {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(headerStyle);
}); 

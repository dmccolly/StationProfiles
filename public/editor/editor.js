// Initialize Quill editors
let profileEditor;
let contentEditor;
let currentStation = null;
let currentImage = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeEditors();
    setupEventListeners();
    loadStationsList();
});

// Initialize Quill editors with custom toolbar
function initializeEditors() {
    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
    ];

    profileEditor = new Quill('#profileEditor', {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Write the station profile here...'
    });

    contentEditor = new Quill('#contentEditor', {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Write the complete station history here...'
    });

    // Update preview on content change
    profileEditor.on('text-change', updatePreview);
    contentEditor.on('text-change', updatePreview);
}

// Setup all event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });

    // Load station button
    document.getElementById('loadStation').addEventListener('click', function() {
        document.getElementById('stationModal').classList.add('active');
    });

    // Save station button
    document.getElementById('saveStation').addEventListener('click', saveStation);

    // Delete station button (if exists)
    const deleteBtn = document.getElementById('deleteStation');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteStation);
    }

    // Preview toggle
    document.getElementById('previewToggle').addEventListener('click', togglePreview);

    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    document.getElementById('addImageUrl').addEventListener('click', handleImageUrl);
    document.getElementById('insertImage').addEventListener('click', insertImageIntoEditor);
    document.getElementById('removeImage').addEventListener('click', removeImage);

    // Image styling controls
    document.getElementById('imagePosition').addEventListener('change', updateImagePreview);
    document.getElementById('textWrap').addEventListener('change', updateImagePreview);
    document.getElementById('imageWidth').addEventListener('input', function() {
        document.getElementById('widthValue').textContent = this.value + 'px';
        updateImagePreview();
    });
    document.getElementById('borderRadius').addEventListener('input', function() {
        document.getElementById('radiusValue').textContent = this.value + 'px';
        updateImagePreview();
    });
    document.getElementById('imageShadow').addEventListener('change', updateImagePreview);
    document.getElementById('borderWidth').addEventListener('input', updateImagePreview);
    document.getElementById('borderColor').addEventListener('input', updateImagePreview);

    // Form inputs - update preview
    const formInputs = ['stationName', 'frequency', 'location', 'format', 'established', 'synopsis'];
    formInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');

    updatePreview();
}

// Toggle preview panel
function togglePreview() {
    const previewPanel = document.getElementById('previewPanel');
    const editorLayout = document.querySelector('.editor-layout');
    
    previewPanel.classList.toggle('hidden');
    editorLayout.classList.toggle('preview-hidden');
}

// Load stations list
async function loadStationsList() {
    try {
        const response = await fetch('/data/stations/index.json');
        const data = await response.json();
        
        const stationList = document.getElementById('stationList');
        stationList.innerHTML = '';

        for (const stationId of data.stations) {
            const stationResponse = await fetch(`/data/stations/${stationId}.json`);
            const station = await stationResponse.json();
            
            const item = document.createElement('div');
            item.className = 'station-item';
            item.innerHTML = `
                <strong>${station.stationName || stationId}</strong><br>
                <small>${station.frequency || ''} ${station.location || ''}</small>
            `;
            item.addEventListener('click', () => loadStation(stationId));
            stationList.appendChild(item);
        }
    } catch (error) {
        console.error('Error loading stations:', error);
        alert('Error loading stations list');
    }
}

// Load a specific station
async function loadStation(stationId) {
    try {
        const response = await fetch(`/data/stations/${stationId}.json`);
        const station = await response.json();
        
        currentStation = station;
        
        // Fill form fields
        document.getElementById('stationId').value = station.id || '';
        document.getElementById('stationName').value = station.stationName || '';
        document.getElementById('frequency').value = station.frequency || '';
        document.getElementById('location').value = station.location || '';
        document.getElementById('format').value = station.format || '';
        document.getElementById('established').value = station.established || '';
        document.getElementById('synopsis').value = station.synopsis || '';
        document.getElementById('website').value = station.website || '';
        document.getElementById('facebook').value = station.facebook || '';
        document.getElementById('twitter').value = station.twitter || '';
        document.getElementById('instagram').value = station.instagram || '';

        // Load content into editors
        profileEditor.root.innerHTML = station.fullProfile || '';
        contentEditor.root.innerHTML = station.fullContent || '';

        // Load image if exists
        if (station.logo) {
            currentImage = station.logo;
            showImagePreview(station.logo);
        }

        closeModal();
        updatePreview();
        
        alert(`Loaded station: ${station.stationName}`);
    } catch (error) {
        console.error('Error loading station:', error);
        alert('Error loading station data');
    }
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        currentImage = e.target.result;
        showImagePreview(currentImage);
    };
    reader.readAsDataURL(file);
}

// Handle image URL
function handleImageUrl() {
    const url = document.getElementById('imageUrl').value.trim();
    if (!url) {
        alert('Please enter an image URL');
        return;
    }

    currentImage = url;
    showImagePreview(currentImage);
}

// Show image preview
function showImagePreview(imageSrc) {
    const section = document.getElementById('currentImageSection');
    const img = document.getElementById('currentImage');
    
    img.src = imageSrc;
    section.style.display = 'block';
    
    updateImagePreview();
}

// Update image preview with styling
function updateImagePreview() {
    const img = document.getElementById('currentImage');
    if (!img.src) return;

    const position = document.getElementById('imagePosition').value;
    const textWrap = document.getElementById('textWrap').value;
    const width = document.getElementById('imageWidth').value;
    const borderRadius = document.getElementById('borderRadius').value;
    const shadow = document.getElementById('imageShadow').value;
    const borderWidth = document.getElementById('borderWidth').value;
    const borderColor = document.getElementById('borderColor').value;

    let style = `width: ${width}px; border-radius: ${borderRadius}px;`;
    
    if (borderWidth > 0) {
        style += ` border: ${borderWidth}px solid ${borderColor};`;
    }

    switch (shadow) {
        case 'small':
            style += ' box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
            break;
        case 'medium':
            style += ' box-shadow: 0 4px 8px rgba(0,0,0,0.15);';
            break;
        case 'large':
            style += ' box-shadow: 0 8px 16px rgba(0,0,0,0.2);';
            break;
    }

    switch (position) {
        case 'left':
            style += ' float: left;';
            break;
        case 'right':
            style += ' float: right;';
            break;
        case 'center':
            style += ' display: block; margin: 0 auto;';
            break;
    }

    switch (textWrap) {
        case 'wrap':
            style += ' margin: 10px;';
            break;
        case 'tight':
            style += ' margin: 5px;';
            break;
        case 'loose':
            style += ' margin: 20px;';
            break;
        case 'no-wrap':
            style += ' display: block; clear: both;';
            break;
    }

    img.style.cssText = style;
}

// Insert image into editor
function insertImageIntoEditor() {
    if (!currentImage) {
        alert('No image selected');
        return;
    }

    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const editor = activeTab === 'profile' ? profileEditor : contentEditor;

    // Get current styling
    const position = document.getElementById('imagePosition').value;
    const width = document.getElementById('imageWidth').value;
    const borderRadius = document.getElementById('borderRadius').value;
    const shadow = document.getElementById('imageShadow').value;
    const borderWidth = document.getElementById('borderWidth').value;
    const borderColor = document.getElementById('borderColor').value;

    // Build style string
    let style = `width: ${width}px; border-radius: ${borderRadius}px;`;
    
    if (borderWidth > 0) {
        style += ` border: ${borderWidth}px solid ${borderColor};`;
    }

    switch (shadow) {
        case 'small':
            style += ' box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
            break;
        case 'medium':
            style += ' box-shadow: 0 4px 8px rgba(0,0,0,0.15);';
            break;
        case 'large':
            style += ' box-shadow: 0 8px 16px rgba(0,0,0,0.2);';
            break;
    }

    switch (position) {
        case 'left':
            style += ' float: left; margin: 10px 20px 10px 0;';
            break;
        case 'right':
            style += ' float: right; margin: 10px 0 10px 20px;';
            break;
        case 'center':
            style += ' display: block; margin: 20px auto;';
            break;
    }

    // Insert image with styling
    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, 'image', currentImage);
    
    // Apply styling to the inserted image
    setTimeout(() => {
        const images = editor.root.querySelectorAll('img');
        const lastImage = images[images.length - 1];
        if (lastImage) {
            lastImage.style.cssText = style;
        }
    }, 100);

    updatePreview();
}

// Remove image
function removeImage() {
    currentImage = null;
    document.getElementById('currentImageSection').style.display = 'none';
    document.getElementById('currentImage').src = '';
    document.getElementById('imageUpload').value = '';
    document.getElementById('imageUrl').value = '';
}

// Update preview
function updatePreview() {
    const previewContent = document.getElementById('previewContent');
    
    const stationName = document.getElementById('stationName').value;
    const frequency = document.getElementById('frequency').value;
    const location = document.getElementById('location').value;
    const format = document.getElementById('format').value;
    const synopsis = document.getElementById('synopsis').value;
    
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const content = activeTab === 'profile' 
        ? profileEditor.root.innerHTML 
        : contentEditor.root.innerHTML;

    let html = '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">';
    
    if (stationName) {
        html += `<h1 style="color: #1f2937; margin-bottom: 10px;">${stationName}</h1>`;
    }
    
    if (frequency || location) {
        html += `<p style="color: #6b7280; margin-bottom: 20px;">`;
        if (frequency) html += `<strong>${frequency}</strong>`;
        if (frequency && location) html += ' • ';
        if (location) html += location;
        html += '</p>';
    }
    
    if (format) {
        html += `<p style="color: #374151; margin-bottom: 20px;"><strong>Format:</strong> ${format}</p>`;
    }
    
    if (synopsis) {
        html += `<p style="color: #4b5563; margin-bottom: 20px; font-style: italic;">${synopsis}</p>`;
    }
    
    html += '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">';
    html += content;
    html += '</div>';
    
    previewContent.innerHTML = html;
}

// Save station
async function saveStation() {
    const stationId = document.getElementById('stationId').value.trim();
    const stationName = document.getElementById('stationName').value.trim();

    // Debug logging
    console.log('Save attempt - Field values:', {
        stationId: stationId,
        stationName: stationName,
        stationIdElement: document.getElementById('stationId'),
        stationNameElement: document.getElementById('stationName'),
        stationIdValue: document.getElementById('stationId').value,
        stationNameValue: document.getElementById('stationName').value
    });

    if (!stationId) {
        alert('❌ Station ID is required.\n\nThe Station ID field appears to be empty.\nPlease enter a station ID (e.g., krvb-fm)');
        document.getElementById('stationId').focus();
        return;
    }
    
    if (!stationName) {
        alert('❌ Station Name is required.\n\nThe Station Name field appears to be empty.\nPlease enter a station name (e.g., KRVB - The River)');
        document.getElementById('stationName').focus();
        return;
    }
    
    console.log('✅ Validation passed, proceeding with save...');

    const stationData = {
        id: stationId,
        stationName: stationName,
        frequency: document.getElementById('frequency').value.trim(),
        location: document.getElementById('location').value.trim(),
        format: document.getElementById('format').value.trim(),
        established: document.getElementById('established').value.trim(),
        synopsis: document.getElementById('synopsis').value.trim(),
        fullProfile: profileEditor.root.innerHTML,
        fullContent: contentEditor.root.innerHTML,
        website: document.getElementById('website').value.trim(),
        facebook: document.getElementById('facebook').value.trim(),
        twitter: document.getElementById('twitter').value.trim(),
        instagram: document.getElementById('instagram').value.trim(),
        logo: currentImage || ''
    };

    // Show loading state
    const saveBtn = document.getElementById('saveStation');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    try {
        // Determine if this is a new station or update
        const action = currentStation && currentStation.id === stationId ? 'update' : 'create';
        
        // Call the Netlify function
        const response = await fetch('/.netlify/functions/update-station', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                stationId: stationId,
                stationData: stationData
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || 'Failed to save station');
        }

        // Update current station
        currentStation = stationData;

        // Show success message
        alert(`✅ Success!\n\nStation ${action === 'create' ? 'created' : 'updated'} successfully!\n\nChanges have been pushed to GitHub and will be live in about 2 minutes after Netlify deploys.`);

        // Reset button
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;

    } catch (error) {
        console.error('Error saving station:', error);
        
        // Show error with fallback option
        const fallback = confirm(
            `❌ Error saving to GitHub:\n\n${error.message}\n\n` +
            `Would you like to download the JSON file manually instead?\n\n` +
            `Click OK to download, or Cancel to try again.`
        );

        if (fallback) {
            // Fallback to manual download
            downloadStationJSON(stationData, stationId);
        }

        // Reset button
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}

// Fallback function to download JSON manually
function downloadStationJSON(stationData, stationId) {
    const dataStr = JSON.stringify(stationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${stationId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`Station data downloaded: ${stationId}.json\n\nPlease upload this file to GitHub at:\npublic/data/stations/${stationId}.json`);
}

// Close modal
function closeModal() {
    document.getElementById('stationModal').classList.remove('active');
}

// Delete station
async function deleteStation() {
    if (!currentStation || !currentStation.id) {
        alert('No station loaded to delete');
        return;
    }

    const confirmDelete = confirm(
        `⚠️ WARNING: Delete Station?\n\n` +
        `Station: ${currentStation.stationName}\n` +
        `ID: ${currentStation.id}\n\n` +
        `This action cannot be undone!\n\n` +
        `Are you sure you want to delete this station?`
    );

    if (!confirmDelete) {
        return;
    }

    // Double confirmation
    const doubleConfirm = confirm(
        `🚨 FINAL CONFIRMATION\n\n` +
        `You are about to permanently delete:\n` +
        `${currentStation.stationName}\n\n` +
        `Click OK to proceed with deletion.`
    );

    if (!doubleConfirm) {
        return;
    }

    // Show loading state
    const deleteBtn = document.getElementById('deleteStation');
    const originalText = deleteBtn ? deleteBtn.textContent : 'Delete Station';
    if (deleteBtn) {
        deleteBtn.textContent = 'Deleting...';
        deleteBtn.disabled = true;
    }

    try {
        // Call the Netlify function
        const response = await fetch('/.netlify/functions/update-station', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                stationId: currentStation.id
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || 'Failed to delete station');
        }

        // Show success message
        alert(`✅ Station Deleted!\n\n${currentStation.stationName} has been removed from GitHub.\n\nChanges will be live in about 2 minutes after Netlify deploys.`);

        // Clear the form
        currentStation = null;
        document.getElementById('stationId').value = '';
        document.getElementById('stationName').value = '';
        document.getElementById('frequency').value = '';
        document.getElementById('location').value = '';
        document.getElementById('format').value = '';
        document.getElementById('established').value = '';
        document.getElementById('synopsis').value = '';
        document.getElementById('website').value = '';
        document.getElementById('facebook').value = '';
        document.getElementById('twitter').value = '';
        document.getElementById('instagram').value = '';
        profileEditor.root.innerHTML = '';
        contentEditor.root.innerHTML = '';
        removeImage();

        // Reload stations list
        loadStationsList();

        // Reset button
        if (deleteBtn) {
            deleteBtn.textContent = originalText;
            deleteBtn.disabled = false;
        }

    } catch (error) {
        console.error('Error deleting station:', error);
        alert(`❌ Error deleting station:\n\n${error.message}\n\nPlease try again or contact support.`);

        // Reset button
        if (deleteBtn) {
            deleteBtn.textContent = originalText;
            deleteBtn.disabled = false;
        }
    }
}

// Make closeModal available globally
window.closeModal = closeModal;
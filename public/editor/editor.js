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

    if (!stationId || !stationName) {
        alert('Station ID and Name are required');
        return;
    }

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

    // Download JSON file
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

    alert(`Station saved! File downloaded: ${stationId}.json\n\nPlease upload this file to GitHub at:\npublic/data/stations/${stationId}.json`);
}

// Close modal
function closeModal() {
    document.getElementById('stationModal').classList.remove('active');
}

// Make closeModal available globally
window.closeModal = closeModal;
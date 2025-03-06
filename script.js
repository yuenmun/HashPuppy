// DOM Elements - Generate Tab
const generateFileInput = document.getElementById('generateFile');
const generateFileName = document.getElementById('generateFileName');
const generateBtn = document.getElementById('generateBtn');
const generateResult = document.getElementById('generateResult');
const resultFileName = document.getElementById('resultFileName');
const resultTimestamp = document.getElementById('resultTimestamp');
const resultHash = document.getElementById('resultHash');
const copyHashBtn = document.getElementById('copyHashBtn');
const saveJsonBtn = document.getElementById('saveJsonBtn');
const dropArea = document.getElementById('dropArea');
const browseBtn = document.getElementById('browseBtn');

// DOM Elements - Verify Tab
const verifyFileInput = document.getElementById('verifyFile');
const verifyFileName = document.getElementById('verifyFileName');
const manualHash = document.getElementById('manualHash');
const hashJsonFile = document.getElementById('hashJsonFile');
const hashJsonName = document.getElementById('hashJsonName');
const verifyBtn = document.getElementById('verifyBtn');
const verifyResult = document.getElementById('verifyResult');
const matchStatus = document.getElementById('matchStatus');
const verifyStatusText = document.getElementById('verifyStatusText');
const verifyDetails = document.getElementById('verifyDetails');
const verifyResultFileName = document.getElementById('verifyResultFileName');
const verifyResultTimestamp = document.getElementById('verifyResultTimestamp');
const expectedHash = document.getElementById('expectedHash');
const calculatedHash = document.getElementById('calculatedHash');
const verifyDropArea = document.getElementById('verifyDropArea');
const verifyBrowseBtn = document.getElementById('verifyBrowseBtn');
const uploadStampBtn = document.querySelector('.upload-stamp-btn');

// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Variables to store file data
let generateFileData = null;
let verifyFileData = null;
let hashData = {
    fileName: '',
    timestamp: '',
    hash: ''
};

// Initialize the application
function init() {
    setupEventListeners();
    setupDragAndDrop();
}

// Set up all event listeners
function setupEventListeners() {
    // Tab navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Set active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show active tab content
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Browse buttons
    browseBtn.addEventListener('click', () => {
        generateFileInput.click();
    });
    
    verifyBrowseBtn.addEventListener('click', () => {
        verifyFileInput.click();
    });
    
    uploadStampBtn.addEventListener('click', () => {
        hashJsonFile.click();
    });
    
    // Generate file upload
    generateFileInput.addEventListener('change', (e) => {
        handleFileUpload(e, 'generate');
    });
    
    // Generate hash button
    generateBtn.addEventListener('click', generateHash);
    
    // Copy hash button
    copyHashBtn.addEventListener('click', copyHashToClipboard);
    
    // Save JSON button
    saveJsonBtn.addEventListener('click', saveHashInfoAsJson);
    
    // Verify file upload
    verifyFileInput.addEventListener('change', (e) => {
        handleFileUpload(e, 'verify');
    });
    
    // Hash JSON file upload
    hashJsonFile.addEventListener('change', handleHashJsonUpload);
    
    // Manual hash input
    manualHash.addEventListener('input', updateVerifyButtonState);
    
    // Verify button
    verifyBtn.addEventListener('click', verifyDocument);
}

// Set up drag and drop functionality
function setupDragAndDrop() {
    // Prevent default behavior for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        verifyDropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when file is dragged over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('active');
        }, false);
        
        verifyDropArea.addEventListener(eventName, () => {
            verifyDropArea.classList.add('active');
        }, false);
    });
    
    // Remove highlight when file leaves drop area
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('active');
        }, false);
        
        verifyDropArea.addEventListener(eventName, () => {
            verifyDropArea.classList.remove('active');
        }, false);
    });
    
    // Handle dropped files
    dropArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length) {
            generateFileInput.files = files;
            handleFileUpload({ target: { files } }, 'generate');
        }
    }, false);
    
    verifyDropArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length) {
            verifyFileInput.files = files;
            handleFileUpload({ target: { files } }, 'verify');
        }
    }, false);
}

// Prevent default behavior for drag events
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Handle file uploads
function handleFileUpload(event, type) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (type === 'generate') {
        generateFileData = file;
        generateFileName.textContent = file.name;
        generateBtn.disabled = false;
        generateResult.classList.add('hidden');
    } else if (type === 'verify') {
        verifyFileData = file;
        verifyFileName.textContent = file.name;
        updateVerifyButtonState();
        verifyResult.classList.add('hidden');
    }
}

// Generate SHA-256 hash for a file
async function generateHash() {
    if (!generateFileData) return;
    
    try {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Stamp...';
        
        const fileBuffer = await readFileAsArrayBuffer(generateFileData);
        const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Store hash information
        hashData.fileName = generateFileData.name;
        hashData.timestamp = new Date().toISOString();
        hashData.hash = hashHex;
        
        // Display results
        resultFileName.textContent = hashData.fileName;
        resultTimestamp.textContent = new Date(hashData.timestamp).toLocaleString();
        resultHash.textContent = hashData.hash;
        
        generateResult.classList.remove('hidden');
    } catch (error) {
        console.error('Error generating security stamp:', error);
        alert('Error creating security stamp. Please try again.');
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-fingerprint"></i> Create Security Stamp';
    }
}

// Read file as ArrayBuffer (for hashing)
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        
        reader.readAsArrayBuffer(file);
    });
}

// Copy hash to clipboard
function copyHashToClipboard() {
    navigator.clipboard.writeText(hashData.hash)
        .then(() => {
            const originalText = copyHashBtn.innerHTML;
            copyHashBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyHashBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy security stamp:', err);
            alert('Failed to copy security stamp to clipboard.');
        });
}

// Save hash information as JSON file
function saveHashInfoAsJson() {
    if (!hashData.hash) return;
    
    const hashJson = JSON.stringify(hashData, null, 2);
    const blob = new Blob([hashJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${hashData.fileName.split('.')[0]}_security_stamp_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// Handle hash JSON file upload
function handleHashJsonUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    hashJsonName.textContent = file.name;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            if (jsonData.hash && jsonData.fileName && jsonData.timestamp) {
                hashData = jsonData;
                manualHash.value = jsonData.hash;
            } else {
                alert('Invalid security stamp format.');
            }
        } catch (error) {
            console.error('Error parsing security stamp:', error);
            alert('Error parsing security stamp file. Please ensure it\'s a valid security stamp file.');
        }
    };
    
    reader.onerror = () => {
        console.error('Error reading file:', reader.error);
        alert('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
    updateVerifyButtonState();
}

// Update verify button state
function updateVerifyButtonState() {
    const hasFile = verifyFileData !== null;
    const hasHash = manualHash.value.trim() !== '' || hashJsonFile.files.length > 0;
    
    verifyBtn.disabled = !(hasFile && hasHash);
}

// Verify document against hash
async function verifyDocument() {
    if (!verifyFileData || (!manualHash.value.trim() && !hashData.hash)) {
        return;
    }
    
    try {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        
        const fileBuffer = await readFileAsArrayBuffer(verifyFileData);
        const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const calculatedHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Get the expected hash
        const expectedHashValue = manualHash.value.trim() || hashData.hash;
        
        // Get timestamp if available
        const timestampValue = hashData.timestamp ? new Date(hashData.timestamp).toLocaleString() : 'N/A';
        
        // Check if hashes match
        const isMatch = calculatedHashHex.toLowerCase() === expectedHashValue.toLowerCase();
        
        // Update UI - always hide mismatch icon as requested
        matchStatus.querySelector('.match-icon').classList.toggle('hidden', !isMatch);
        matchStatus.querySelector('.mismatch-icon').classList.add('hidden'); // Always hide red cross
        
        // Set verification status message and color
        if (isMatch) {
            verifyStatusText.textContent = 'Document Verified!';
            verifyStatusText.style.color = 'var(--success-color)';
        } else {
            verifyStatusText.textContent = 'Verification Failed';
            verifyStatusText.style.color = 'var(--error-color)';
        }
        
        verifyResultFileName.textContent = verifyFileData.name;
        verifyResultTimestamp.textContent = timestampValue;
        expectedHash.textContent = expectedHashValue;
        calculatedHash.textContent = calculatedHashHex;
        
        verifyResult.classList.remove('hidden');
        verifyDetails.classList.remove('hidden');
    } catch (error) {
        console.error('Error verifying document:', error);
        alert('Error verifying document. Please try again.');
    } finally {
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify Document';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init); 
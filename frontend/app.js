// frontend/app.js

// Interactive Heading Typewriter Effect for the Tagline
const taglineElement = document.getElementById('tagline');
const taglineTexts = ["AI/ML Enthusiast", "Full Stack Developer", "IOT Developer", "ABAP Developer", "SAP Data Migration", "Python Developer"];
let currentTextIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewriter() {
  const currentText = taglineTexts[currentTextIndex];
  let displayedText = currentText.substring(0, charIndex);
  taglineElement.textContent = displayedText;

  if (!isDeleting && charIndex < currentText.length) {
    charIndex++;
    setTimeout(typewriter, 150);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typewriter, 100);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      currentTextIndex = (currentTextIndex + 1) % taglineTexts.length;
    }
    setTimeout(typewriter, 1000);
  }
}

if (taglineElement) {
  typewriter();
}

// Admin Page Functionality
if (document.getElementById('loginBtn')) {
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Basic client-side validation
    if (!username || !password) {
      document.getElementById('login-error').innerText = 'Please enter both username and password.';
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        loadUploads();
      } else {
        document.getElementById('login-error').innerText = data.error || 'Login failed';
      }
    } catch (error) {
      document.getElementById('login-error').innerText = 'An error occurred during login.';
      console.error('Login error:', error);
    }
  });
}

// Upload Video/Tutorial Functionality
if (document.getElementById('uploadBtn')) {
  const uploadBtn = document.getElementById('uploadBtn');
  uploadBtn.addEventListener('click', async () => {
    const title = document.getElementById('upload-title').value.trim();
    const description = document.getElementById('upload-description').value.trim();
    const videoUrl = document.getElementById('videoUrl').value.trim();
    
    // Basic client-side validation
    if (!title || !videoUrl) {
      document.getElementById('upload-message').innerText = 'Title and Video URL are required.';
      return;
    }
    
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
        body: JSON.stringify({ title, description, videoUrl })
      });
      const data = await res.json();
      if (data.upload) {
        document.getElementById('upload-message').innerText = 'Upload successful!';
        loadUploads();
      } else {
        document.getElementById('upload-message').innerText = data.error || 'Upload failed.';
      }
    } catch (error) {
      document.getElementById('upload-message').innerText = 'An error occurred during upload.';
      console.error('Upload error:', error);
    }
  });
}

// CV Upload Functionality
if (document.getElementById('uploadCvBtn')) {
  const uploadCvBtn = document.getElementById('uploadCvBtn');
  uploadCvBtn.addEventListener('click', async () => {
    const cvFile = document.getElementById('cvFile').files[0];
    if (!cvFile) {
      document.getElementById('cv-upload-message').innerText = 'Please select a file to upload.';
      return;
    }
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('cv', cvFile);

    try {
      const res = await fetch('http://localhost:5000/api/admin/upload-cv', {
        method: 'POST',
        headers: { 'authorization': token },
        body: formData
      });
      const data = await res.json();
      if (data.message) {
        document.getElementById('cv-upload-message').innerText = data.message;
      } else {
        document.getElementById('cv-upload-message').innerText = data.error || 'CV upload failed.';
      }
    } catch (error) {
      document.getElementById('cv-upload-message').innerText = 'An error occurred during CV upload.';
      console.error('CV Upload error:', error);
    }
  });
}

// Load uploaded content for the admin panel
async function loadUploads() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/admin/uploads', {
      headers: { 'authorization': token }
    });
    const uploads = await res.json();
    const uploadsList = document.getElementById('uploads');
    uploadsList.innerHTML = '';
    uploads.forEach(upload => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${upload.title}</strong> - ${upload.description} <br> <a href="${upload.videoUrl}" target="_blank">Watch Video</a>`;
      uploadsList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading uploads:', error);
  }
}

/* Simple Live Chat Widget Functionality */
const chatToggle = document.querySelector('.chat-toggle');
const chatPanel = document.querySelector('.chat-panel');
const chatClose = document.querySelector('.chat-close');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');

// Toggle chat panel
chatToggle.addEventListener('click', () => {
  chatPanel.style.display = chatPanel.style.display === 'flex' ? 'none' : 'flex';
});
chatClose.addEventListener('click', () => {
  chatPanel.style.display = 'none';
});

// Simulated chat send functionality (replace with real-time chat API as needed)
chatSendBtn.addEventListener('click', () => {
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Create user message element
  const userMsg = document.createElement('div');
  userMsg.classList.add('chat-message', 'user-message');
  userMsg.textContent = message;
  chatBody.appendChild(userMsg);
  
  // Clear input
  chatInput.value = '';
  
  // Scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;
  
  // Simulated auto-response (for demo purposes)
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.classList.add('chat-message', 'bot-message');
    botMsg.textContent = "Thanks for your message! I'll get back to you shortly.";
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 1000);
});

// frontend/app.js

// ------------------------------
// Admin Panel Functionality
// ------------------------------
if (document.getElementById('loginBtn')) {
  const loginBtn = document.getElementById('loginBtn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  async function login() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
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
        loadSampleProjectsAdmin();
        loadBlogsAdmin();
      } else {
        document.getElementById('login-error').innerText = data.error || 'Login failed';
      }
    } catch (error) {
      document.getElementById('login-error').innerText = 'An error occurred during login.';
      console.error('Login error:', error);
    }
  }

  loginBtn.addEventListener('click', login);
  [usernameInput, passwordInput].forEach(input => {
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') login();
    });
  });
}

if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });
}

// ------------------------------
// Sample Projects Management (Admin)
// ------------------------------
if (document.getElementById('uploadSampleBtn')) {
  document.getElementById('uploadSampleBtn').addEventListener('click', async () => {
    const title = document.getElementById('sample-title').value.trim();
    const description = document.getElementById('sample-description').value.trim();
    const videoFile = document.getElementById('sample-video').files[0];
    if (!title || !videoFile) {
      document.getElementById('sample-upload-message').innerText = 'Title and video file are required.';
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      document.getElementById('sample-upload-message').innerText = 'Not authenticated. Please log in.';
      return;
    }
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);
    try {
      const res = await fetch('http://localhost:5000/api/admin/sample-projects', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.sampleProject) {
        document.getElementById('sample-upload-message').innerText = 'Sample project uploaded!';
        loadSampleProjectsAdmin();
      } else {
        document.getElementById('sample-upload-message').innerText = data.error || 'Upload failed.';
      }
    } catch (error) {
      document.getElementById('sample-upload-message').innerText = 'An error occurred during upload.';
      console.error('Upload error:', error);
    }
  });
}

async function loadSampleProjectsAdmin() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/sample-projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const projects = await res.json();
    const list = document.getElementById('sample-projects-list');
    list.innerHTML = '';
    projects.forEach(project => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${project.title}</strong>
        <button onclick="editSampleProject('${project._id}')">Edit</button>
        <button onclick="deleteSampleProject('${project._id}')">Delete</button>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading sample projects:', error);
  }
}

window.deleteSampleProject = async function(id) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:5000/api/admin/sample-projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.message) loadSampleProjectsAdmin();
    else alert(data.error || 'Failed to delete sample project.');
  } catch (error) {
    console.error('Delete error:', error);
  }
}

window.editSampleProject = async function(id) {
  const newTitle = prompt('Enter new title:');
  if (!newTitle) return;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:5000/api/admin/sample-projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTitle })
    });
    const data = await res.json();
    if (data.sampleProject) loadSampleProjectsAdmin();
    else alert(data.error || 'Failed to update sample project.');
  } catch (error) {
    console.error('Edit error:', error);
  }
}

// ------------------------------
// Blog Management (Admin)
// ------------------------------
if (document.getElementById('addBlogBtn')) {
  document.getElementById('addBlogBtn').addEventListener('click', async () => {
    const title = document.getElementById('blog-title').value.trim();
    const content = CKEDITOR.instances['blog-content'].getData();
    const image = document.getElementById('blog-image').value.trim();
    if (!title || !content) {
      document.getElementById('blog-message').innerText = 'Title and content are required.';
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      document.getElementById('blog-message').innerText = 'Not authenticated. Please log in.';
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, image })
      });
      const data = await res.json();
      if (res.ok && data.blog) {
        document.getElementById('blog-message').innerText = 'Blog created!';
        loadBlogsAdmin();
      } else {
        document.getElementById('blog-message').innerText = data.error || 'Failed to add blog.';
      }
    } catch (error) {
      document.getElementById('blog-message').innerText = 'An error occurred while adding the blog.';
      console.error('Add blog error:', error);
    }
  });
}

async function loadBlogsAdmin() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/blogs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const blogs = await res.json();
    const list = document.getElementById('blogs-list');
    list.innerHTML = '';
    blogs.forEach(blog => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${blog.title}</strong>
        <button onclick="editBlog('${blog._id}')">Edit</button>
        <button onclick="deleteBlog('${blog._id}')">Delete</button>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading blogs:', error);
  }
}

window.deleteBlog = async function(id) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:5000/api/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.message) loadBlogsAdmin();
    else alert(data.error || 'Failed to delete blog.');
  } catch (error) {
    console.error('Delete blog error:', error);
  }
}

window.editBlog = async function(id) {
  const newTitle = prompt('Enter new blog title:');
  const newContent = prompt('Enter new blog content (HTML allowed):');
  if (!newTitle || !newContent) return;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:5000/api/admin/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTitle, content: newContent })
    });
    const data = await res.json();
    if (data.blog) loadBlogsAdmin();
    else alert(data.error || 'Failed to update blog.');
  } catch (error) {
    console.error('Edit blog error:', error);
  }
};

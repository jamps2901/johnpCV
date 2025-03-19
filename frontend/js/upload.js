document.getElementById('cvUploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('cvFile');
    if (fileInput.files.length === 0) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('cv', fileInput.files[0]);

    try {
        const res = await fetch('http://localhost:5000/api/upload/cv', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (res.ok) {
            alert('CV uploaded successfully!');
            console.log('File Path:', data.filePath);
        } else {
            alert(data.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the CV.');
    }
});

document.getElementById('videoUploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById('videoFile');
    if (fileInput.files.length === 0) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('video', fileInput.files[0]);

    try {
        const res = await fetch('http://localhost:5000/api/upload/video', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (res.ok) {
            alert('Video uploaded successfully!');
            console.log('File Path:', data.filePath);
        } else {
            alert(data.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the video.');
    }
});




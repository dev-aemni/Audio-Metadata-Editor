// image.js

const ImageEditor = {
    currentCoverArrayBuffer: null,
    currentCoverMimeType: 'image/jpeg', // Default format

    handleImageUpload: async (file, previewImgElement) => {
        try {
            // Store the new image's mimeType (e.g. image/png or image/jpeg)
            ImageEditor.currentCoverMimeType = file.type || 'image/jpeg';

            const options = {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 800,
                useWebWorker: true
            };
            const compressedFile = await imageCompression(file, options);
            
            ImageEditor.currentCoverArrayBuffer = await compressedFile.arrayBuffer();
            
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImgElement.src = e.target.result;
            };
            reader.readAsDataURL(compressedFile);
            
        } catch (error) {
            console.error("Image Processing Error:", error);
            alert("Error processing cover image.");
        }
    },

    removeCover: (previewImgElement) => {
        ImageEditor.currentCoverArrayBuffer = null;
        ImageEditor.currentCoverMimeType = 'image/jpeg';
        previewImgElement.src = "https://dummyimage.com/300x300/282828/1db954.png&text=No+Cover";
    }
};
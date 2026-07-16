// app.js

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const audioInput = document.getElementById('audioInput');
    const editorArea = document.getElementById('editorArea');
    const coverPreview = document.getElementById('coverPreview');
    const coverInput = document.getElementById('coverInput');
    const removeCoverBtn = document.getElementById('removeCoverBtn');
    
    const fields = {
        title: document.getElementById('tagTitle'),
        artist: document.getElementById('tagArtist'),
        album: document.getElementById('tagAlbum'),
        albumArtist: document.getElementById('tagAlbumArtist'),
        genre: document.getElementById('tagGenre'),
        year: document.getElementById('tagYear'),
        track: document.getElementById('tagTrack'),
        composer: document.getElementById('tagComposer'),
        comment: document.getElementById('tagComment'),
    };

    const compareModal = document.getElementById('compareModal');
    const beforeTags = document.getElementById('beforeTags');
    const afterTags = document.getElementById('afterTags');

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('border-spotify'); });
    dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('border-spotify'); });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-spotify');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    dropZone.addEventListener('click', () => audioInput.click());
    audioInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    function handleFile(file) {
        if (!file.type.includes('audio') && !file.name.toLowerCase().endsWith('.mp3')) {
            return alert("Please select an MP3 file!");
        }
        
        document.getElementById('infoCodec').innerText = file.name.split('.').pop().toUpperCase();
        document.getElementById('infoSize').innerText = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        
        Metadata.read(file, (tags) => {
            fields.title.value = tags.title || '';
            fields.artist.value = tags.artist || '';
            fields.album.value = tags.album || '';
            fields.genre.value = tags.genre || '';
            fields.year.value = tags.year || '';
            fields.track.value = tags.track || '';

            if (tags.picture && tags.picture.data) {
                let base64String = "";
                for (let i = 0; i < tags.picture.data.length; i++) {
                    base64String += String.fromCharCode(tags.picture.data[i]);
                }
                const base64 = window.btoa(base64String);
                
                const format = tags.picture.format || 'image/jpeg';
                ImageEditor.currentCoverMimeType = format;
                
                coverPreview.src = `data:${format};base64,${base64}`;

                // Safe deep-copy of picture bytes to prevent shared memory overflow
                const picData = new Uint8Array(tags.picture.data);
                const cleanBuffer = new ArrayBuffer(picData.length);
                new Uint8Array(cleanBuffer).set(picData);
                
                ImageEditor.currentCoverArrayBuffer = cleanBuffer;
            } else {
                coverPreview.src = "https://dummyimage.com/300x300/282828/1db954.png&text=No+Cover";
                ImageEditor.currentCoverArrayBuffer = null;
                ImageEditor.currentCoverMimeType = 'image/jpeg';
            }

            dropZone.classList.add('hidden');
            editorArea.classList.remove('hidden');
            document.getElementById('searchBtn').classList.remove('hidden');
        });
    }

    coverInput.addEventListener('change', (e) => {
        if(e.target.files.length) ImageEditor.handleImageUpload(e.target.files[0], coverPreview);
    });
    removeCoverBtn.addEventListener('click', () => ImageEditor.removeCover(coverPreview));

    document.getElementById('autoFixBtn').addEventListener('click', () => {
        Object.keys(fields).forEach(key => {
            if (fields[key].value) fields[key].value = Utils.cleanText(fields[key].value);
        });
    });

    document.getElementById('searchBtn').addEventListener('click', async () => {
        const title = fields.title.value;
        const artist = fields.artist.value;
        if(!title) return alert("Enter at least a song title to search.");
        
        document.getElementById('searchBtn').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Searching...';
        const result = await Utils.searchMusicBrainz(title, artist);
        
        if(result) {
            if(result.title && !fields.title.value) fields.title.value = result.title;
            if(result.artist && !fields.artist.value) fields.artist.value = result.artist;
            if(result.album && !fields.album.value) fields.album.value = result.album;
            if(result.year && !fields.year.value) fields.year.value = result.year;
        } else {
            alert("No exact match found on MusicBrainz.");
        }
        document.getElementById('searchBtn').innerHTML = '<i class="fas fa-search mr-2"></i>Search MusicBrainz';
    });

    document.getElementById('compareBtn').addEventListener('click', () => {
        beforeTags.innerHTML = '';
        afterTags.innerHTML = '';

        const orig = Metadata.originalTags || {};
        const keys = ['title', 'artist', 'album', 'genre', 'year', 'track'];
        
        keys.forEach(k => {
            const originalVal = orig[k] || '-';
            const newVal = fields[k].value || '-';
            const colorClass = originalVal !== newVal ? 'text-spotify font-bold' : 'text-gray-300';

            beforeTags.innerHTML += `<p><span class="capitalize text-gray-500">${k}:</span> ${originalVal}</p>`;
            afterTags.innerHTML += `<p><span class="capitalize text-gray-500">${k}:</span> <span class="${colorClass}">${newVal}</span></p>`;
        });

        compareModal.classList.remove('hidden');
    });

    document.getElementById('cancelSaveBtn').addEventListener('click', () => {
        compareModal.classList.add('hidden');
    });

    document.getElementById('confirmSaveBtn').addEventListener('click', () => {
        const newTags = {};
        Object.keys(fields).forEach(key => { newTags[key] = fields[key].value.trim(); });
        
        Metadata.writeAndDownload(
            newTags, 
            ImageEditor.currentCoverArrayBuffer, 
            ImageEditor.currentCoverMimeType
        );
        compareModal.classList.add('hidden');
    });
}); 
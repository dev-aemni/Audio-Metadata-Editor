// metadata.js

const Metadata = {
    originalAudioBuffer: null,
    fileName: "",
    originalTags: {},

    read: (file, callback) => {
        Metadata.fileName = file.name;
        
        const reader = new FileReader();
        reader.onload = () => { Metadata.originalAudioBuffer = reader.result; };
        reader.readAsArrayBuffer(file);

        window.jsmediatags.read(file, {
            onSuccess: function(tag) {
                const tags = tag.tags;
                Metadata.originalTags = {
                    title: tags.title || '',
                    artist: tags.artist || '',
                    album: tags.album || '',
                    genre: tags.genre || '',
                    year: tags.year || '',
                    track: tags.track || '',
                    picture: tags.picture
                };
                callback(Metadata.originalTags);
            },
            onError: function(error) {
                console.log('Error reading tags:', error);
                callback({}); 
            }
        });
    },

    writeAndDownload: (newTags, newCoverBuffer, mimeType) => {
        if (!Metadata.originalAudioBuffer) return alert("Audio buffer not found!");

        try {
            const WriterClass = window.browserID3Writer || window.BrowserID3Writer;
            
            if (!WriterClass) {
                throw new Error("ID3 Writer constructor missing.");
            }

            const writer = new WriterClass(Metadata.originalAudioBuffer);
            
            if (newTags.title) writer.setFrame('TIT2', newTags.title);
            if (newTags.artist) writer.setFrame('TPE1', newTags.artist); 
            if (newTags.albumArtist) writer.setFrame('TPE2', newTags.albumArtist);
            if (newTags.album) writer.setFrame('TALB', newTags.album);
            if (newTags.genre) writer.setFrame('TCON', newTags.genre); 
            if (newTags.composer) writer.setFrame('TCOM', newTags.composer); 
            
            // FIX: Added mandatory 'language' parameter for Comment frame
            if (newTags.comment) {
                writer.setFrame('COMM', { 
                    description: '', 
                    text: newTags.comment,
                    language: 'eng' // 3-letter ISO language code
                });
            }

            if (newTags.year) writer.setFrame('TYER', String(newTags.year));
            if (newTags.track) writer.setFrame('TRCK', String(newTags.track));

            if (newCoverBuffer) {
                writer.setFrame('APIC', {
                    type: 3, 
                    data: newCoverBuffer,
                    description: 'Cover',
                    mimeType: mimeType || 'image/jpeg' 
                });
            }

            writer.addTag();
            const taggedSongBuffer = writer.arrayBuffer;
            
            const blob = new Blob([taggedSongBuffer], { type: 'audio/mpeg' });
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `[Edited] ${Metadata.fileName}`;
            link.click();
            window.URL.revokeObjectURL(url);
            
        } catch (e) {
            console.error("ID3 Writer Error Details:", e);
            alert(`Error saving tags: ${e.message}`);
        }
    }
};
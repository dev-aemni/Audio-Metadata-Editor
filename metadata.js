// metadata.js

const Metadata = {
    originalAudioBuffer: null,
    fileName: "",
    originalTags: {},

    // Strips out any pre-existing ID3v2 tags from original MP3 buffer
    stripId3v2: (arrayBuffer) => {
        const view = new DataView(arrayBuffer);
        if (arrayBuffer.byteLength > 10 && 
            view.getUint8(0) === 0x49 && // 'I'
            view.getUint8(1) === 0x44 && // 'D'
            view.getUint8(2) === 0x33) { // '3'
            
            const s0 = view.getUint8(6);
            const s1 = view.getUint8(7);
            const s2 = view.getUint8(8);
            const s3 = view.getUint8(9);
            const tagSize = (s0 << 21) | (s1 << 14) | (s2 << 7) | s3;
            const totalTagSize = tagSize + 10;
            
            console.log("Found existing ID3v2 tag. Stripping", totalTagSize, "bytes.");
            return arrayBuffer.slice(totalTagSize);
        }
        return arrayBuffer;
    },

    read: (file, callback) => {
        Metadata.fileName = file.name;
        
        const reader = new FileReader();
        reader.onload = () => { 
            Metadata.originalAudioBuffer = reader.result; 
            
            console.log("File loaded. Initiating safe jsmediatags read...");
            
            // Runs inside reader.onload to prevent parallel file-access blocks (CORS)
            window.jsmediatags.read(file, {
                onSuccess: function(tag) {
                    const tags = tag.tags;
                    console.log("=== JSMEDIATAGS READ SUCCESS ===");
                    console.log("Raw tags parsed:", tags);
                    
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
                    console.error("=== JSMEDIATAGS READ ERROR ===");
                    console.error(error);
                    callback({}); 
                }
            });
        };
        reader.readAsArrayBuffer(file);
    },

    writeAndDownload: (newTags, newCoverBuffer, mimeType) => {
        if (!Metadata.originalAudioBuffer) return alert("Audio buffer not found!");

        try {
            const WriterClass = window.browserID3Writer || window.BrowserID3Writer;
            if (!WriterClass) {
                throw new Error("ID3 Writer constructor is missing.");
            }

            // Stripping original tags before applying new ones to prevent double-tag errors
            const cleanAudioBuffer = Metadata.stripId3v2(Metadata.originalAudioBuffer);
            const writer = new WriterClass(cleanAudioBuffer);
            
            if (newTags.title) writer.setFrame('TIT2', newTags.title);
            if (newTags.artist) writer.setFrame('TPE1', newTags.artist); 
            if (newTags.albumArtist) writer.setFrame('TPE2', newTags.albumArtist);
            if (newTags.album) writer.setFrame('TALB', newTags.album);
            if (newTags.genre) writer.setFrame('TCON', newTags.genre); 
            if (newTags.composer) writer.setFrame('TCOM', newTags.composer); 
            
            if (newTags.comment) {
                writer.setFrame('COMM', { 
                    description: '', 
                    text: newTags.comment,
                    language: 'eng'
                });
            }

            if (newTags.year) writer.setFrame('TYER', String(newTags.year));
            if (newTags.track) writer.setFrame('TRCK', String(newTags.track));

            if (newCoverBuffer) {
                console.log("Injected Cover Art buffer size:", newCoverBuffer.byteLength, "Mime:", mimeType);
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
            console.log("New MP3 generated and downloaded successfully!");
            
        } catch (e) {
            console.error("ID3 Writer Error:", e);
            alert(`Error saving tags: ${e.message}`);
        }
    }
};
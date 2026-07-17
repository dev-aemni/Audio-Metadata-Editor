<<<<<<< HEAD
const Utils = {
    // AI / Auto Cleanup Text (Capitalization & removing basic junk)
    cleanText: (text) => {
        if (!text) return "";
        // Convert "rick astly" -> "Rick Astley"
        let cleaned = text.trim().toLowerCase().split(' ').map(word => {
            // Check for common abbreviations like 'u' -> 'you' (Optional extra logic)
            if (word === 'u') return 'You';
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        
        return cleaned;
    },

    // Search MusicBrainz based on current Title and Artist
    searchMusicBrainz: async (title, artist) => {
        if (!title) return null;
        const query = encodeURIComponent(`recording:"${title}" AND artist:"${artist}"`);
        const url = `https://musicbrainz.org/ws/2/recording/?query=${query}&fmt=json`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.recordings && data.recordings.length > 0) {
                const rec = data.recordings[0];
                return {
                    title: rec.title,
                    artist: rec['artist-credit']?.[0]?.name,
                    album: rec.releases?.[0]?.title,
                    year: rec.releases?.[0]?.date?.split('-')[0],
                    track: rec.releases?.[0]?.media?.[0]?.['track-offset'] + 1 || ''
                };
            }
        } catch (error) {
            console.error("MusicBrainz Error:", error);
        }
        return null;
    },

    // Convert ArrayBuffer to Base64 (For Image Preview)
    arrayBufferToBase64: (buffer) => {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
=======
const Utils = {
    // AI / Auto Cleanup Text (Capitalization & removing basic junk)
    cleanText: (text) => {
        if (!text) return "";
        // Convert "rick astly" -> "Rick Astley"
        let cleaned = text.trim().toLowerCase().split(' ').map(word => {
            // Check for common abbreviations like 'u' -> 'you' (Optional extra logic)
            if (word === 'u') return 'You';
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        
        return cleaned;
    },

    // Search MusicBrainz based on current Title and Artist
    searchMusicBrainz: async (title, artist) => {
        if (!title) return null;
        const query = encodeURIComponent(`recording:"${title}" AND artist:"${artist}"`);
        const url = `https://musicbrainz.org/ws/2/recording/?query=${query}&fmt=json`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.recordings && data.recordings.length > 0) {
                const rec = data.recordings[0];
                return {
                    title: rec.title,
                    artist: rec['artist-credit']?.[0]?.name,
                    album: rec.releases?.[0]?.title,
                    year: rec.releases?.[0]?.date?.split('-')[0],
                    track: rec.releases?.[0]?.media?.[0]?.['track-offset'] + 1 || ''
                };
            }
        } catch (error) {
            console.error("MusicBrainz Error:", error);
        }
        return null;
    },

    // Convert ArrayBuffer to Base64 (For Image Preview)
    arrayBufferToBase64: (buffer) => {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
>>>>>>> d9348e4759808e38232fa7e81db214b7fcf98035
};
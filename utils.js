// utils.js

const Utils = {
    cleanText: (text) => {
        if (!text) return "";
        return text.trim().toLowerCase().split(' ').map(word => {
            if (word === 'u') return 'You';
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    },

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
    }
};
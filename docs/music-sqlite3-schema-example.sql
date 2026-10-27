DROP TABLE tracks;


-- Create the tracks table
CREATE TABLE tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre TEXT NOT NULL,
    duration TEXT NOT NULL,
    audio_url TEXT NOT NULL
);

-- Insert some sample open-source music clips
INSERT INTO tracks (title, artist, genre, duration, audio_url) VALUES 
('Lo-Fi Chill Sunset', 'Acoustic Labs', 'Lo-Fi', '0:45', 'https://r2.dev'),
('Synthwave Horizon', 'Neon Rider', 'Electronic', '1:12', 'https://r2.dev'),
('Ofrebrero', 'dericbytes', 'podcast', '1:12', 'audio/ofrebrería.mp3'),
('Cinematic Piano Intro', 'Elena Rostova', 'Classical', '0:30', 'https://r2.dev');

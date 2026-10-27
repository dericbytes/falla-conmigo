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
('Ofrebrero', 'deric', 'day 1', '1:12', 'audio/ofrebrería.mp3'),
('Not Here', 'deric', 'day 1', '1:12', 'audio/not-here.mp3');


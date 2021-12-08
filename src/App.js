import { useState, useRef } from 'react';
//COMPONENTS
import Song from './components/Song';
import Player from './components/Player';
import Nav from './components/Nav';
import Library from './components/Library';
import DarkMode from './components/DarkMode';
//STYLING
import './styles/app.scss';

//SONG DATA
import lofiPlaylist from './lofiPlaylist';

function App() {
  //useRef() Hook
  const audioRef = useRef(undefined);
  //STATE
  //This State is used to hold playlist data
  const [songs, setSongs] = useState(lofiPlaylist());
  //This State is used to show which song is selected
  const [currentSong, setCurrentSong] = useState(songs[0]);
  //This State determines if the song selected is playing
  const [isPlaying, setIsPlaying] = useState(false);
  //Information of song Selected
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  //Determines if Library should be open or not
  const [libraryStatus, setLibraryStatus] = useState(false);
  //DarkMode toggle
  const [darkMode, setDarkMode] = useState();
  //EVENT HANDLER
  //Adds values to setSongInfo state
  const timeUpdateHandler = (e) => {
    //Get Values from audio tag when it starts playing
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //Round numbers to hundredths from millionths
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    //Used to determine place in song bar
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };
  //Starts next song when the song ends
  const songEndHandler = async (e) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };

  return (
    <div
      className={`App ${libraryStatus ? 'library-active' : ''}
    ${darkMode ? 'dark-mode-active' : ''}`}
    >
      {/* Navbar is to the left. When library Status state becomes true it move the library to the center and goes back when false*/}
      <Nav
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Song currentSong={currentSong} />
      <Player
        songs={songs}
        setSongs={setSongs}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
      />
      <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
      <Library
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;

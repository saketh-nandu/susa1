import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, X, Lock } from 'lucide-react';

interface Episode {
  id: number;
  title: string;
  duration: string;
  videoUrl?: string;
  available: boolean;
}

interface Season {
  id: number;
  title: string;
  episodes: Episode[];
}

interface SUSAStudioProps {
  onClose: () => void;
}

const SUSAStudio = ({ onClose }: SUSAStudioProps) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showClickToContinue, setShowClickToContinue] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // UPDATE THIS VIDEO URL
  const seasons: Season[] = [
    {
      id: 1,
      title: "Season 1",
      episodes: [
        {
          id: 1,
          title: "Introduction",
          duration: "3:45",
          videoUrl: "https://www.dropbox.com/scl/fi/3phmqzdaw4nt02njmw2ug/Introducing_SUSA.mp4?rlkey=1i4tguwdj3mfnzt71250hdqgy&st=pderzwn7&dl=1",
          available: true
        },
        { id: 2, title: "Coming Soon", duration: "TBA", available: false },
        { id: 3, title: "Coming Soon", duration: "TBA", available: false },
        { id: 4, title: "Coming Soon", duration: "TBA", available: false },
        { id: 5, title: "Coming Soon", duration: "TBA", available: false }
      ]
    },
    {
      id: 2,
      title: "Season 2",
      episodes: Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        title: "Coming Soon",
        duration: "TBA",
        available: false
      }))
    },
    {
      id: 3,
      title: "Season 3",
      episodes: Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        title: "Coming Soon",
        duration: "TBA",
        available: false
      }))
    },
    {
      id: 4,
      title: "Season 4",
      episodes: Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        title: "Coming Soon",
        duration: "TBA",
        available: false
      }))
    },
    {
      id: 5,
      title: "Season 5",
      episodes: Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        title: "Coming Soon",
        duration: "TBA",
        available: false
      }))
    }
  ];

  const currentSeason = seasons.find(s => s.id === selectedSeason);
  const currentEpisode = currentSeason?.episodes.find(e => e.id === selectedEpisode);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setShowClickToContinue(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentEpisode]);

  const handlePlay = () => {
    if (videoRef.current && currentEpisode?.available) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowClickToContinue(false);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowClickToContinue(true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectEpisode = (seasonId: number, episodeId: number) => {
    const season = seasons.find(s => s.id === seasonId);
    const episode = season?.episodes.find(e => e.id === episodeId);
    
    if (episode?.available) {
      setSelectedSeason(seasonId);
      setSelectedEpisode(episodeId);
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Enter video fullscreen when episode is selected
      setTimeout(() => {
        if (videoRef.current && !document.fullscreenElement) {
          videoRef.current.requestFullscreen().then(() => {
            // Auto-play when entering fullscreen
            videoRef.current?.play();
            setIsPlaying(true);
          }).catch(err => {
            console.log('Fullscreen error:', err);
          });
        }
      }, 100);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Pause video when exiting fullscreen
      if (!document.fullscreenElement && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowClickToContinue(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex"
      onMouseMove={handleMouseMove}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/70 transition-all group"
      >
        <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-8 left-8 z-40">
          <h1 className="text-3xl font-bold text-white tracking-wider">
            SUSA <span className="text-blue-500">STUDIO</span>
          </h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">THE SUSA NETFLIX</p>
        </div>

        <div className="relative w-full max-w-3xl aspect-video">
          {currentEpisode?.available && currentEpisode.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={currentEpisode.videoUrl}
                className="w-full h-full rounded-lg"
                onClick={togglePlay}
                muted={isMuted}
                playsInline
                style={{ boxShadow: '0 0 60px rgba(59, 130, 246, 0.3)' }}
              />

              {/* Pause Overlay - Shows in both normal and fullscreen */}
              <AnimatePresence>
                {showClickToContinue && !isPlaying && currentTime > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/90 via-black/60 to-black/30 rounded-lg cursor-pointer z-50"
                    onClick={handlePlay}
                    style={{
                      position: document.fullscreenElement ? 'fixed' : 'absolute',
                      borderRadius: document.fullscreenElement ? '0' : undefined
                    }}
                  >
                    <div className="text-center space-y-4">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">SUSA Launch Event</h2>
                        <p className="text-xl md:text-3xl text-blue-400 mb-1">Government Institute of Electronics</p>
                        <p className="text-lg md:text-2xl text-gray-300">Secunderabad</p>
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white text-lg md:text-2xl font-light tracking-wider mt-6"
                      >
                        (Click to Continue)
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {!isPlaying && currentTime === 0 && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={handlePlay}
                    className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-blue-600/90 flex items-center justify-center hover:bg-blue-500 transition-all hover:scale-110"
                    style={{ boxShadow: '0 0 60px rgba(59, 130, 246, 0.6)' }}
                  >
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Video Controls - Shows in both normal and fullscreen */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 rounded-b-lg z-40"
                    style={{
                      position: document.fullscreenElement ? 'fixed' : 'absolute',
                      borderRadius: document.fullscreenElement ? '0' : undefined
                    }}
                  >
                    <div className="mb-3">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                          {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                        </button>
                        <button onClick={toggleMute} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                          {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                        </button>
                        <div className="text-white text-sm font-mono">{formatTime(currentTime)} / {formatTime(duration)}</div>
                      </div>
                      <div className="text-white text-xs tracking-wider">S{selectedSeason}:E{selectedEpisode} - {currentEpisode.title}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Episode Not Available</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{currentEpisode?.title}</h2>
          <p className="text-gray-400">Season {selectedSeason} • Episode {selectedEpisode} • {currentEpisode?.duration}</p>
        </div>
      </div>

      <div className="w-1/2 h-full overflow-y-auto p-8 bg-gradient-to-l from-gray-900 to-black">
        <h2 className="text-3xl font-bold text-white mb-8">Episodes</h2>
        <div className="flex gap-2 mb-6 flex-wrap">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSeason === season.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Season {season.id}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {currentSeason?.episodes.map((episode) => (
            <div
              key={episode.id}
              onClick={() => selectEpisode(selectedSeason, episode.id)}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedEpisode === episode.id && selectedSeason === currentSeason.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : episode.available
                  ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  : 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-gray-700 flex items-center justify-center">
                    {episode.available ? <Play className="w-6 h-6 text-blue-500" /> : <Lock className="w-6 h-6 text-gray-600" />}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Episode {episode.id}: {episode.title}</h3>
                    <p className="text-gray-400 text-sm">{episode.duration}</p>
                  </div>
                </div>
                {!episode.available && (
                  <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">Coming Soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
        }
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
        }
      `}</style>
    </motion.div>
  );
};

export default SUSAStudio;
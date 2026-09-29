import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc, Radio, AlertCircle } from 'lucide-react';
import { Track, Release } from '../types';

interface AudioPreviewPlayerProps {
  currentTrack: Track | null;
  currentRelease: Release | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectTrack: (track: Track, release: Release) => void;
}

export const AudioPreviewPlayer: React.FC<AudioPreviewPlayerProps> = ({
  currentTrack,
  currentRelease,
  isPlaying,
  onTogglePlay,
}) => {
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const duration = currentTrack?.audioSpec?.durationSeconds || 180;

  // Web Audio synthetic musical tone preview for interactive listening
  useEffect(() => {
    if (isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm analog chord synth frequency
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 3); // E4

        const vol = isMuted ? 0 : volume * 0.15;
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
      } catch (e) {
        console.warn('AudioContext not started:', e);
      }
    } else {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.1);
        setTimeout(() => {
          try {
            oscillatorRef.current?.stop();
            oscillatorRef.current?.disconnect();
          } catch {
            // Already stopped
          }
        }, 150);
      }
    }

    return () => {
      try {
        oscillatorRef.current?.stop();
        oscillatorRef.current?.disconnect();
      } catch {
        // ignore
      }
    };
  }, [isPlaying, isMuted, volume, currentTrack]);

  // Timer loop
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  // Clean up animation frames
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack || !currentRelease) {
    return null;
  }

  const spec = currentTrack.audioSpec;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--player-height)',
        background: 'rgba(10, 13, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Left: Track & Artwork info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '320px', minWidth: 0 }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-surface-3)',
            border: '1px solid var(--border-medium)',
            position: 'relative',
          }}
        >
          {currentRelease.artwork?.url ? (
            <img
              src={currentRelease.artwork.url}
              alt={currentRelease.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Disc size={20} color="var(--text-muted)" />
            </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentTrack.title}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{currentTrack.primaryArtist}</span>
            <span>•</span>
            <span style={{ color: 'var(--emerald-400)', fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>
              {currentTrack.isrc || 'ISRC PENDING'}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Controls & Interactive Waveform */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flex: 1,
          maxWidth: '620px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onTogglePlay}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isPlaying ? 'var(--emerald-400)' : 'var(--emerald-500)',
              color: '#031a11',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px var(--emerald-glow)',
              transition: 'transform 0.15s ease',
            }}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} style={{ marginLeft: '2px' }} />}
          </button>
        </div>

        {/* Progress & Waveform representation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: '35px' }}>
            {formatTime(currentTime)}
          </span>

          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              setCurrentTime(Math.floor(clickPos * duration));
            }}
            style={{
              flex: 1,
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              cursor: 'pointer',
              padding: '0 4px',
            }}
          >
            {(spec?.waveformSample || Array.from({ length: 44 }, () => Math.random() * 0.7 + 0.2)).map((barHeight, idx, arr) => {
              const barProgress = idx / arr.length;
              const currentProgress = currentTime / duration;
              const isPast = barProgress <= currentProgress;
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: `${Math.max(4, barHeight * 22)}px`,
                    borderRadius: '2px',
                    backgroundColor: isPast
                      ? 'var(--emerald-400)'
                      : 'rgba(255, 255, 255, 0.18)',
                    transition: 'background-color 0.1s ease',
                  }}
                />
              );
            })}
          </div>

          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: '35px' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Audio Spec Fidelity Badge & Volume */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '320px', justifyContent: 'flex-end' }}>
        {spec ? (
          <div
            style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '6px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Radio size={12} color="var(--cyan-400)" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan-400)', fontWeight: 600 }}>
              {spec.bitDepth}-bit / {spec.sampleRateHz / 1000}kHz {spec.format}
            </span>
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AlertCircle size={12} color="var(--red-500)" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--red-500)', fontWeight: 600 }}>
              NO MASTER FILE
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            style={{
              width: '70px',
              accentColor: 'var(--emerald-400)',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );
};

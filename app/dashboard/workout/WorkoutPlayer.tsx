"use client"

import Link from "next/link"
import { useState, useEffect, useCallback, useRef } from "react"

interface Exercise {
    id: number
    name: string
    sets: number
    reps: string | number
    isTimed: boolean
    duration: number
    restTime: number
}

interface Workout {
    name: string
    duration: number
    exercises: Exercise[]
}

interface WorkoutPlayerProps {
    workout: Workout
    planId: string
    profileId: string
}

type WorkoutState = 'idle' | 'exercising' | 'resting' | 'completed'

// Music genres with YouTube video IDs (workout music playlists/mixes)
const musicGenres = [
    { id: 'none', name: 'Sem música', icon: '🔇', youtubeId: '' },
    { id: 'motivational', name: 'Motivacional', icon: '💪', youtubeId: 'n8X9_MgEdCg' },
    { id: 'electronic', name: 'Eletrônica', icon: '🎧', youtubeId: 'ibFkvrR4PHI' },
    { id: 'rock', name: 'Rock', icon: '🎸', youtubeId: 'yHTHnVnx3Ug' },
    { id: 'hiphop', name: 'Hip Hop', icon: '🎤', youtubeId: 'RviOwY0OKyE' },
    { id: 'lofi', name: 'Lo-Fi', icon: '🌙', youtubeId: 'jfKfPfyJRdk' },
]

// Exercise images from free illustration APIs (using placeholder for now)
// These can be replaced with actual exercise GIFs/images
const exerciseImages: { [key: string]: string } = {
    // Upper body
    'flexão': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=300&h=200&fit=crop',
    'flexão de braço': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=300&h=200&fit=crop',
    'supino': 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=300&h=200&fit=crop',
    'supino reto': 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=300&h=200&fit=crop',
    'desenvolvimento': 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=300&h=200&fit=crop',
    'rosca': 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=300&h=200&fit=crop',
    'tríceps': 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=300&h=200&fit=crop',
    // Core
    'abdominal': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop',
    'prancha': 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=300&h=200&fit=crop',
    'crunch': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop',
    // Lower body
    'agachamento': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop',
    'leg press': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=300&h=200&fit=crop',
    'afundo': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=300&h=200&fit=crop',
    'panturrilha': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=300&h=200&fit=crop',
    // Cardio
    'burpee': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=200&fit=crop',
    'polichinelo': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=200&fit=crop',
    'corrida': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=300&h=200&fit=crop',
    // Default
    'default': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop'
}

// Get exercise image URL by matching exercise name keywords
function getExerciseImage(exerciseName: string): string {
    const nameLower = exerciseName.toLowerCase()
    for (const [keyword, url] of Object.entries(exerciseImages)) {
        if (nameLower.includes(keyword)) {
            return url
        }
    }
    return exerciseImages['default']
}

// Coaching messages
const coachingMessages = {
    starting: [
        "Vamos lá! 💪",
        "Foco total no treino!",
        "Você consegue!",
        "Hora de dar o seu melhor!"
    ],
    exercising: [
        "Mantenha a postura!",
        "Respire corretamente!",
        "Força! Você está indo bem!",
        "Controle o movimento!",
        "Foco na execução!"
    ],
    resting: [
        "Descanse um pouco! 😌",
        "Tome água! 💧",
        "Hidrate-se!",
        "Respire fundo...",
        "Recupere o fôlego!",
        "Beba água agora! 🥤"
    ],
    completed: [
        "Parabéns! 🎉",
        "Treino concluído!",
        "Excelente trabalho!",
        "Você é incrível! 💪"
    ]
}

function getRandomMessage(type: keyof typeof coachingMessages): string {
    const messages = coachingMessages[type]
    return messages[Math.floor(Math.random() * messages.length)]
}

export default function WorkoutPlayer({ workout, planId, profileId }: WorkoutPlayerProps) {
    const [state, setState] = useState<WorkoutState>('idle')
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [currentSet, setCurrentSet] = useState(1)
    const [timer, setTimer] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    // Use fixed initial message to avoid hydration mismatch
    const [coachMessage, setCoachMessage] = useState("Vamos lá! 💪")
    const [completedExercises, setCompletedExercises] = useState<number[]>([])

    // Audio state
    const [selectedGenre, setSelectedGenre] = useState('none')
    const [isMusicPlaying, setIsMusicPlaying] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [showMusicPanel, setShowMusicPanel] = useState(false)

    // Audio refs (for beeps only)
    const audioContextRef = useRef<AudioContext | null>(null)

    const currentExercise = workout.exercises[currentExerciseIndex]
    const totalExercises = workout.exercises.length
    const isLastExercise = currentExerciseIndex === totalExercises - 1
    const isLastSet = currentSet === currentExercise?.sets

    // Initialize audio context
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        return () => {
            audioContextRef.current?.close()
        }
    }, [])

    // Play beep sound using Web Audio API
    const playBeep = useCallback((frequency: number = 800, duration: number = 0.15, volume: number = 0.3) => {
        if (!soundEnabled || !audioContextRef.current) return

        try {
            const ctx = audioContextRef.current
            if (ctx.state === 'suspended') {
                ctx.resume()
            }

            const oscillator = ctx.createOscillator()
            const gainNode = ctx.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(ctx.destination)

            oscillator.frequency.value = frequency
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(volume, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + duration)
        } catch (e) {
            console.log('Audio error:', e)
        }
    }, [soundEnabled])

    // Play countdown beep (higher pitch for last second)
    const playCountdownBeep = useCallback((secondsLeft: number) => {
        if (secondsLeft === 1) {
            // Final beep - longer and higher
            playBeep(1000, 0.3, 0.5)
        } else {
            // Regular countdown beep
            playBeep(600, 0.1, 0.3)
        }
    }, [playBeep])

    // Play alarm sound (timer finished)
    const playAlarm = useCallback(() => {
        if (!soundEnabled || !audioContextRef.current) return

        // Play 3 ascending beeps
        setTimeout(() => playBeep(600, 0.15, 0.4), 0)
        setTimeout(() => playBeep(800, 0.15, 0.4), 200)
        setTimeout(() => playBeep(1000, 0.25, 0.5), 400)
    }, [soundEnabled, playBeep])

    // Timer effect with countdown beeps
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if ((state === 'exercising' || state === 'resting') && !isPaused && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => {
                    // Countdown beeps in last 5 seconds
                    if (prev <= 6 && prev > 1) {
                        playCountdownBeep(prev - 1)
                    }

                    if (prev <= 1) {
                        // Timer finished - play alarm
                        playAlarm()

                        if (state === 'exercising') {
                            handleExerciseComplete()
                        } else if (state === 'resting') {
                            handleRestComplete()
                        }
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [state, isPaused, timer, playCountdownBeep, playAlarm])

    // Update coaching message periodically during exercise
    useEffect(() => {
        if (state === 'exercising' && !isPaused) {
            const interval = setInterval(() => {
                setCoachMessage(getRandomMessage('exercising'))
            }, 8000)
            return () => clearInterval(interval)
        }
    }, [state, isPaused])

    const startWorkout = () => {
        // Resume audio context on user interaction
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume()
        }

        setState('exercising')
        setCoachMessage(getRandomMessage('starting'))
        playBeep(800, 0.2, 0.4)

        if (currentExercise?.isTimed) {
            setTimer(currentExercise.duration)
        }
    }

    const togglePause = () => {
        setIsPaused(!isPaused)
        playBeep(500, 0.1, 0.2)
    }

    const handleExerciseComplete = useCallback(() => {
        if (isLastSet) {
            setCompletedExercises(prev => [...prev, currentExercise.id])

            if (isLastExercise) {
                setState('completed')
                setCoachMessage(getRandomMessage('completed'))
            } else {
                startRest()
            }
        } else {
            startRest()
        }
    }, [currentSet, currentExercise, isLastSet, isLastExercise])

    const startRest = () => {
        setState('resting')
        setTimer(currentExercise.restTime)
        setCoachMessage(getRandomMessage('resting'))
    }

    const handleRestComplete = useCallback(() => {
        if (isLastSet) {
            setCurrentExerciseIndex(prev => prev + 1)
            setCurrentSet(1)
        } else {
            setCurrentSet(prev => prev + 1)
        }
        setState('exercising')
        setCoachMessage(getRandomMessage('exercising'))

        const nextExercise = isLastSet ? workout.exercises[currentExerciseIndex + 1] : currentExercise
        if (nextExercise?.isTimed) {
            setTimer(nextExercise.duration)
        } else {
            setTimer(0)
        }
    }, [currentSet, currentExercise, isLastSet, currentExerciseIndex, workout.exercises])

    const markSetComplete = () => {
        playBeep(800, 0.15, 0.3)
        handleExerciseComplete()
    }

    const skipExercise = () => {
        playBeep(400, 0.1, 0.2)
        if (isLastExercise) {
            setState('completed')
            setCoachMessage(getRandomMessage('completed'))
        } else {
            setCurrentExerciseIndex(prev => prev + 1)
            setCurrentSet(1)
            setState('exercising')
            const nextExercise = workout.exercises[currentExerciseIndex + 1]
            if (nextExercise?.isTimed) {
                setTimer(nextExercise.duration)
            } else {
                setTimer(0)
            }
        }
    }

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const progressPercent = ((currentExerciseIndex + (currentSet / currentExercise?.sets || 1)) / totalExercises) * 100

    // Is timer in countdown zone (last 5 seconds)?
    const isCountdownZone = timer > 0 && timer <= 5

    return (
        <div className="workout-player">

            <nav className="player-nav">
                <Link href="/dashboard" className="back-btn">
                    ← Voltar
                </Link>
                <h1>🏋️ {workout.name}</h1>
                <div className="nav-actions">
                    <button
                        className={`sound-btn ${soundEnabled ? 'on' : 'off'}`}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        title={soundEnabled ? 'Som ligado' : 'Som desligado'}
                    >
                        {soundEnabled ? '🔊' : '🔇'}
                    </button>
                    <button
                        className="music-btn"
                        onClick={() => setShowMusicPanel(!showMusicPanel)}
                        title="Escolher música"
                    >
                        🎵
                    </button>
                </div>
            </nav>

            {/* Music Selection Panel */}
            {showMusicPanel && (
                <div className="music-panel">
                    <h3>🎵 Escolha o Estilo de Música</h3>
                    <div className="genre-grid">
                        {musicGenres.map(genre => (
                            <button
                                key={genre.id}
                                className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedGenre(genre.id)
                                    setIsMusicPlaying(genre.id !== 'none')
                                    playBeep(600, 0.1, 0.2)
                                }}
                            >
                                <span className="genre-icon">{genre.icon}</span>
                                <span className="genre-name">{genre.name}</span>
                            </button>
                        ))}
                    </div>

                    <p className="music-note">
                        💡 A música será reproduzida em loop durante o treino
                    </p>
                    <button className="close-panel" onClick={() => setShowMusicPanel(false)}>
                        Fechar
                    </button>
                </div>
            )}

            {/* Background Music Player - YouTube iframe (hidden visually but plays audio) */}
            {isMusicPlaying && selectedGenre !== 'none' && (
                <>
                    <div className="music-indicator">
                        <span className="music-playing">🎵 {musicGenres.find(g => g.id === selectedGenre)?.name}</span>
                        <button onClick={() => setIsMusicPlaying(false)}>⏹️</button>
                    </div>
                    <iframe
                        className="youtube-player"
                        src={`https://www.youtube.com/embed/${musicGenres.find(g => g.id === selectedGenre)?.youtubeId}?autoplay=1&loop=1&playlist=${musicGenres.find(g => g.id === selectedGenre)?.youtubeId}`}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        style={{
                            position: 'fixed',
                            bottom: 10,
                            right: 10,
                            width: 200,
                            height: 120,
                            border: 'none',
                            borderRadius: 10,
                            zIndex: 1000,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}
                    />
                </>
            )}

            {/* Progress Bar */}
            <div className="progress-container">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <span className="progress-text">{currentExerciseIndex + 1}/{totalExercises} exercícios</span>
            </div>

            <main className="player-main">
                {state === 'completed' ? (
                    <div className="completion-screen">
                        <div className="completion-icon">🎉</div>
                        <h2>Treino Concluído!</h2>
                        <p className="coach-message">{coachMessage}</p>
                        <div className="completion-stats">
                            <div className="stat">
                                <span className="stat-value">{totalExercises}</span>
                                <span className="stat-label">Exercícios</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{workout.duration}</span>
                                <span className="stat-label">Minutos</span>
                            </div>
                        </div>
                        <Link href="/dashboard" className="btn-primary">
                            Voltar ao Dashboard
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Current Exercise Card */}
                        <div className={`exercise-card ${state} ${isCountdownZone ? 'countdown-zone' : ''}`}>
                            <div className="exercise-state-badge">
                                {state === 'idle' && '⏸️ Pronto'}
                                {state === 'exercising' && '🏋️ Exercitando'}
                                {state === 'resting' && '😌 Descansando'}
                            </div>

                            <h2 className="exercise-name">{currentExercise?.name}</h2>

                            {/* Exercise Image */}
                            <div className="exercise-image-container">
                                <img
                                    src={getExerciseImage(currentExercise?.name || '')}
                                    alt={currentExercise?.name}
                                    className="exercise-image"
                                />
                            </div>

                            <div className="exercise-details">
                                <span className="sets-info">
                                    Série {currentSet} de {currentExercise?.sets}
                                </span>
                                <span className="reps-info">
                                    {currentExercise?.isTimed ? `${currentExercise.duration}s` : `${currentExercise?.reps} reps`}
                                </span>
                            </div>

                            {/* Timer Display */}
                            {(state === 'exercising' && currentExercise?.isTimed) || state === 'resting' ? (
                                <div className={`timer-display ${state === 'resting' ? 'resting' : ''} ${isCountdownZone ? 'pulse' : ''}`}>
                                    <div className="timer-value">{formatTime(timer)}</div>
                                    <div className="timer-label">
                                        {state === 'resting' ? 'Descanso' : 'Tempo'}
                                    </div>
                                    {isCountdownZone && (
                                        <div className="countdown-alert">
                                            🔔 Prepare-se!
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {/* Coaching Message */}
                            <div className={`coach-bubble ${state === 'resting' ? 'water' : ''}`}>
                                <span className="coach-avatar">🧑‍🏫</span>
                                <p>{coachMessage}</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="controls">
                            {state === 'idle' ? (
                                <button className="btn-start" onClick={startWorkout}>
                                    ▶️ Iniciar Treino
                                </button>
                            ) : state === 'exercising' ? (
                                <>
                                    {currentExercise?.isTimed ? (
                                        <button className="btn-pause" onClick={togglePause}>
                                            {isPaused ? '▶️ Continuar' : '⏸️ Pausar'}
                                        </button>
                                    ) : (
                                        <button className="btn-complete" onClick={markSetComplete}>
                                            ✓ Série Concluída
                                        </button>
                                    )}
                                    <button className="btn-skip" onClick={skipExercise}>
                                        ⏭️ Pular
                                    </button>
                                </>
                            ) : state === 'resting' ? (
                                <>
                                    <button className="btn-pause" onClick={togglePause}>
                                        {isPaused ? '▶️ Continuar' : '⏸️ Pausar'}
                                    </button>
                                    <button className="btn-skip" onClick={handleRestComplete}>
                                        ⏭️ Pular Descanso
                                    </button>
                                </>
                            ) : null}
                        </div>

                        {/* Next Exercise Preview */}
                        {!isLastExercise && (
                            <div className="next-preview">
                                <span className="next-label">Próximo:</span>
                                <span className="next-name">{workout.exercises[currentExerciseIndex + 1]?.name}</span>
                            </div>
                        )}

                        {/* Exercise List */}
                        <div className="exercise-list">
                            <h3>Exercícios</h3>
                            {workout.exercises.map((ex, idx) => (
                                <div
                                    key={ex.id}
                                    className={`exercise-item ${idx === currentExerciseIndex ? 'current' : ''} ${completedExercises.includes(ex.id) ? 'completed' : ''}`}
                                >
                                    <span className="exercise-number">
                                        {completedExercises.includes(ex.id) ? '✓' : idx + 1}
                                    </span>
                                    <span className="exercise-name">{ex.name}</span>
                                    <span className="exercise-sets">{ex.sets}x{ex.reps}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            <style jsx>{`
                .workout-player {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
                    color: white;
                }

                .player-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px;
                    background: rgba(255,255,255,0.05);
                }

                .back-btn {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                }

                .player-nav h1 {
                    margin: 0;
                    font-size: 1.3rem;
                }

                .nav-actions {
                    display: flex;
                    gap: 10px;
                }

                .sound-btn, .music-btn {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .sound-btn:hover, .music-btn:hover {
                    background: rgba(255,255,255,0.2);
                }

                .sound-btn.off {
                    opacity: 0.5;
                }

                .music-panel {
                    background: rgba(0,0,0,0.9);
                    padding: 25px;
                    margin: 10px 20px;
                    border-radius: 15px;
                    border: 1px solid rgba(255,255,255,0.2);
                }

                .music-panel h3 {
                    margin: 0 0 20px 0;
                    text-align: center;
                }

                .genre-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .genre-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    padding: 15px 10px;
                    background: rgba(255,255,255,0.1);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .genre-btn:hover {
                    background: rgba(255,255,255,0.2);
                }

                .genre-btn.active {
                    background: rgba(0,217,255,0.3);
                    border-color: #00d9ff;
                }

                .genre-icon {
                    font-size: 1.5rem;
                }

                .genre-name {
                    font-size: 0.8rem;
                }

                .music-note {
                    text-align: center;
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.6);
                    margin: 15px 0;
                }

                .close-panel {
                    width: 100%;
                    padding: 12px;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                }

                .music-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    padding: 10px;
                    background: rgba(0,217,255,0.2);
                }

                .music-playing {
                    font-size: 0.9rem;
                }

                .music-indicator button {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                }

                .volume-control {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 15px 0;
                }

                .volume-slider {
                    flex: 1;
                    height: 6px;
                    -webkit-appearance: none;
                    appearance: none;
                    background: rgba(255,255,255,0.3);
                    border-radius: 3px;
                    outline: none;
                }

                .volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: #00d9ff;
                    border-radius: 50%;
                    cursor: pointer;
                }

                .progress-container {
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .progress-bar {
                    flex: 1;
                    height: 8px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #00d9ff 0%, #00ff88 100%);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }

                .progress-text {
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.7);
                    white-space: nowrap;
                }

                .player-main {
                    padding: 20px;
                    max-width: 500px;
                    margin: 0 auto;
                }

                .exercise-card {
                    background: rgba(255,255,255,0.1);
                    border-radius: 20px;
                    padding: 30px;
                    text-align: center;
                    position: relative;
                    margin-bottom: 20px;
                    transition: all 0.3s;
                }

                .exercise-card.resting {
                    background: linear-gradient(135deg, rgba(0,217,255,0.2) 0%, rgba(0,255,136,0.2) 100%);
                    border: 2px solid rgba(0,217,255,0.5);
                }

                .exercise-card.countdown-zone {
                    animation: pulse-border 1s infinite;
                }

                @keyframes pulse-border {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.7); }
                    50% { box-shadow: 0 0 0 15px rgba(255,107,107,0); }
                }

                .exercise-state-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    font-size: 0.8rem;
                    background: rgba(0,0,0,0.3);
                    padding: 5px 10px;
                    border-radius: 15px;
                }

                .exercise-card .exercise-name {
                    font-size: 1.8rem;
                    margin: 10px 0 15px 0;
                }

                .exercise-image-container {
                    margin: 0 auto 15px;
                    border-radius: 15px;
                    overflow: hidden;
                    max-width: 280px;
                }

                .exercise-image {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    display: block;
                }

                .exercise-details {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    margin-bottom: 20px;
                }

                .sets-info, .reps-info {
                    font-size: 1.1rem;
                    color: rgba(255,255,255,0.8);
                }

                .reps-info {
                    color: #00d9ff;
                    font-weight: 600;
                }

                .timer-display {
                    margin: 30px 0;
                }

                .timer-display.pulse .timer-value {
                    animation: pulse-text 1s infinite;
                }

                @keyframes pulse-text {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .timer-value {
                    font-size: 4rem;
                    font-weight: 700;
                    font-family: monospace;
                    color: #ff6b6b;
                    transition: transform 0.2s;
                }

                .timer-display.resting .timer-value {
                    color: #00d9ff;
                }

                .timer-label {
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.6);
                    margin-top: 5px;
                }

                .countdown-alert {
                    margin-top: 10px;
                    padding: 8px 15px;
                    background: rgba(255,107,107,0.3);
                    border-radius: 20px;
                    display: inline-block;
                    font-size: 0.9rem;
                    animation: blink 0.5s infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .coach-bubble {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255,255,255,0.1);
                    padding: 15px 20px;
                    border-radius: 15px;
                    margin-top: 20px;
                }

                .coach-bubble.water {
                    background: linear-gradient(135deg, rgba(0,150,255,0.3) 0%, rgba(0,200,255,0.3) 100%);
                    border: 1px solid rgba(0,200,255,0.5);
                }

                .coach-avatar {
                    font-size: 1.5rem;
                }

                .coach-bubble p {
                    margin: 0;
                    flex: 1;
                    text-align: left;
                }

                .controls {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 30px;
                }

                .controls button {
                    flex: 1;
                    padding: 18px;
                    border: none;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-start {
                    background: linear-gradient(135deg, #00ff88 0%, #00d9ff 100%);
                    color: #1a1a2e;
                }

                .btn-complete {
                    background: linear-gradient(135deg, #00ff88 0%, #00d9ff 100%);
                    color: #1a1a2e;
                }

                .btn-pause {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }

                .btn-skip {
                    background: rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.8);
                }

                .controls button:hover {
                    transform: translateY(-2px);
                }

                .next-preview {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 15px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                    margin-bottom: 30px;
                }

                .next-label {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.9rem;
                }

                .next-name {
                    font-weight: 500;
                }

                .exercise-list {
                    background: rgba(255,255,255,0.05);
                    border-radius: 15px;
                    padding: 20px;
                }

                .exercise-list h3 {
                    margin: 0 0 15px 0;
                    font-size: 1rem;
                    color: rgba(255,255,255,0.6);
                }

                .exercise-list .exercise-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 10px;
                    margin-bottom: 8px;
                    transition: all 0.2s;
                }

                .exercise-list .exercise-item.current {
                    background: rgba(0,217,255,0.2);
                    border: 1px solid rgba(0,217,255,0.5);
                }

                .exercise-list .exercise-item.completed {
                    opacity: 0.5;
                }

                .exercise-number {
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    font-size: 0.85rem;
                }

                .exercise-list .exercise-item.completed .exercise-number {
                    background: #00ff88;
                    color: #1a1a2e;
                }

                .exercise-list .exercise-name {
                    flex: 1;
                    font-size: 0.95rem;
                }

                .exercise-sets {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.85rem;
                }

                /* Completion Screen */
                .completion-screen {
                    text-align: center;
                    padding: 40px 20px;
                }

                .completion-icon {
                    font-size: 5rem;
                    margin-bottom: 20px;
                }

                .completion-screen h2 {
                    font-size: 2rem;
                    margin: 0 0 10px 0;
                }

                .completion-screen .coach-message {
                    color: rgba(255,255,255,0.8);
                    font-size: 1.2rem;
                    margin-bottom: 40px;
                }

                .completion-stats {
                    display: flex;
                    justify-content: center;
                    gap: 50px;
                    margin-bottom: 40px;
                }

                .completion-stats .stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .stat-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #00ff88;
                }

                .stat-label {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.9rem;
                }

                .btn-primary {
                    display: inline-block;
                    background: linear-gradient(135deg, #00ff88 0%, #00d9ff 100%);
                    color: #1a1a2e;
                    padding: 15px 40px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                @media (max-width: 480px) {
                    .exercise-card .exercise-name {
                        font-size: 1.4rem;
                    }

                    .timer-value {
                        font-size: 3rem;
                    }

                    .controls {
                        flex-direction: column;
                    }

                    .genre-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
        </div>
    )
}

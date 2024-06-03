"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

type PresetNames = "s" | "m" | "l";

interface TimerConfig {
    workTime: number;
    chillTime: number;
}

export default function Home() {
    const presets: Record<PresetNames, TimerConfig> = {
        "s": { workTime: 10, chillTime: 5 },
        "m": { workTime: 15 * 60, chillTime: 5 * 60 },
        "l": { workTime: 45 * 60, chillTime: 15 * 60 },
    };

    const [presetName, setPresetName] = useState<PresetNames>("l");
    const [timerConfig, setTimerConfig] = useState<TimerConfig>(presets[presetName]);
    const [timeRemaining, setTimeRemaining] = useState(timerConfig.workTime);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isChillTime, setIsChillTime] = useState(false);
    const [streak, setStreak] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const startAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setTimeRemaining(timerConfig.workTime);
        resetTimer(false);
    }, [timerConfig]);

    useEffect(() => {
        if (isTimerRunning && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev: number) => prev - 1);
            }, 1000);
        } else if (isTimerRunning && timeRemaining === 0) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            setTimeRemaining(isChillTime ? timerConfig.workTime : timerConfig.chillTime);
            if (isChillTime) {
                setStreak(prevStreak => prevStreak + 1);
            } else {
                triggerConfetti();
            }
            setIsChillTime(!isChillTime);

            if (audioRef.current) {
                audioRef.current.play();
            }
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning, timeRemaining, isChillTime, timerConfig]);

    const startTimer = () => {
        if (!isTimerRunning) {
            setIsTimerRunning(true);
            if (startAudioRef.current) {
                startAudioRef.current.play();
            }
        }
    };

    const resetTimer = (forceReset?: boolean) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setIsTimerRunning(false);
        setIsChillTime(false);
        setTimeRemaining(timerConfig.workTime);
        if(forceReset) {
            setStreak(0);
        }
    };

    const selectPreset = (preset: PresetNames) => {
        setPresetName(preset);
        setTimerConfig(presets[preset]);
        resetTimer(true);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const triggerConfetti = () => {
        const poop = confetti.shapeFromText({ text: '💩' });
        const toilet = confetti.shapeFromText({ text: '🚽' });
        confetti({
            particleCount: 200,
            angle: 60,
            spread: 100,
            origin: { x: 0 },
            shapes: [poop, toilet],
        });

        confetti({
            particleCount: 200,
            angle: 120,
            spread: 100,
            origin: { x: 1 },
            shapes: [poop, toilet],
        });
    };

    return (
        <>
            <main className="flex flex-col items-center justify-center h-[calc(100dvh-64px)] space-y-4 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={`h-[600px] w-[600px] rounded-full bg-zinc-200 dark:bg-zinc-800 ${isTimerRunning ? "animate-pulse" : ""}`}/>
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 relative z-10">
                    {isChillTime ? "Chill" : "Working"}
                </div>
                <div className="text-8xl font-bold text-zinc-900 dark:text-zinc-50 relative z-10">
                    {formatTime(timeRemaining)}
                </div>
                <div className="flex gap-4 relative z-10">
                    <Button variant="outline" className={presetName === "m" ? "bg-blue-500 hover:bg-blue-400 text-white hover:text-white" : ""} onClick={() => selectPreset("m")}>15/5</Button>
                    <Button variant="outline" className={presetName === "l" ? "bg-blue-500 hover:bg-blue-400 text-white hover:text-white" : ""} onClick={() => selectPreset("l")}>45/15</Button>
                    <Button variant="outline" className={presetName === "s" ? "bg-blue-500 hover:bg-blue-400 text-white hover:text-white" : ""} onClick={() => selectPreset("s")}>Dev mode</Button>
                </div>
                <div className="flex gap-4 relative z-10">
                    <Button onClick={startTimer}>Start</Button>
                    <Button variant="outline" onClick={() => resetTimer(true)}>Reset</Button>
                </div>
                {streak > 0 && (
                    <div className="relative z-10 flex items-center gap-1">
                        <span className="text-zinc-500 dark:text-zinc-400">Streak :</span>
                        <span className="text-zinc-900 dark:text-zinc-50 font-bold">
                            {Array(streak).fill('💩').join('')}
                        </span>
                    </div>
                )}
                <div className="relative z-10">
                    <Button variant="link">History</Button>
                </div>
            </main>
            <audio ref={audioRef}>
                <source src="/fart-with-reverb.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <audio ref={startAudioRef}>
                <source src="/whip.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </>
    );
}

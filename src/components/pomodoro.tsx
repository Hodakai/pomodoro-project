"use client"

import {useState, useRef, useEffect, useCallback} from 'react';
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { HistoryPomodoro } from "../../app/page";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

type PresetNames = "s" | "m" | "l";

interface TimerConfig {
    workTime: number;
    chillTime: number;
}

interface PomodoroProps {
    history: HistoryPomodoro[],
    callback: Function
}

export default function Pomodoro({ history, callback }: PomodoroProps) {
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

    const resetTimer = useCallback((forceReset?: boolean) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setIsTimerRunning(false);
        setIsChillTime(false);
        setTimeRemaining(timerConfig.workTime);
        if (forceReset) {
            setStreak(0);
        }
    }, [timerConfig.workTime]);

    useEffect(() => {
        setTimeRemaining(timerConfig.workTime);
        resetTimer(false);
    }, [resetTimer, timerConfig]);

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
                callback(timerConfig.workTime, timerConfig.chillTime, streak + 1); // Call the callback with necessary parameters
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
    }, [isTimerRunning, timeRemaining, isChillTime, timerConfig, callback, streak]);

    const startTimer = () => {
        if (!isTimerRunning) {
            setIsTimerRunning(true);
            if (startAudioRef.current) {
                startAudioRef.current.play();
            }
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
                        className={`h-[600px] w-[600px] rounded-full bg-zinc-200 dark:bg-zinc-800 ${isTimerRunning ? "animate-pulse" : ""}`} />
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
                    <Sheet>
                        <SheetTrigger className="hover:underline">History</SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>History</SheetTitle>
                                <SheetDescription>
                                    Here you can see your popo-modoro history
                                </SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col gap-2 mt-4">
                                {history.map((item) => (
                                    <div key={item.id} className="border border-secondary bg-primary text-primary-foreground dark:border-gray-700 rounded-lg p-2">
                                        <p>Work Time: {item.work_time} seconds</p>
                                        <p>Break Time: {item.break_time} seconds</p>
                                        <p>Streak: {item.streak}</p>
                                        <p>Date: {item.date_created.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
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

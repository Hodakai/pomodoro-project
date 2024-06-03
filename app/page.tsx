import Pomodoro from "@/components/pomodoro";
import excuteQuery from '@/lib/db';
import React from "react";

export interface HistoryPomodoro {
    id: number,
    work_time: number,
    break_time: number,
    streak: number,
    date_created: Date
}

async function getHistory(): Promise<HistoryPomodoro[]> {
    const query = 'SELECT id, work_time, break_time, streak, date_created FROM fart_history';
    const results = await excuteQuery<HistoryPomodoro[]>({ query, values: [] });

    if ('error' in results) {
        console.error(results.error);
        return [];
    }

    return results.map(history => ({
        ...history,
        date_created: new Date(history.date_created)
    }));
}

async function saveTimer(work_time: number, break_time: number, streak: number) {
    "use server"
    const query = 'INSERT INTO fart_history (work_time, break_time, streak) VALUES (?, ?, ?)';
    const values = [work_time, break_time, streak];
    const result = await excuteQuery<{ insertId: number }>({ query, values });

    return result.insertId;
}

export default async function Home() {
    const data = await getHistory();

    return (
        <div>
            <Pomodoro history={data} callback={saveTimer} />
        </div>
    );
}

import mysql from 'serverless-mysql';

const db = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : undefined,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        connectTimeout: 10000
    }
});

interface ExecuteQueryParams {
    query: string;
    values: any[];
}

export default async function excuteQuery<T = any>({ query, values }: ExecuteQueryParams): Promise<T> {
    try {
        const results = await db.query(query, values);
        await db.end();
        return results as T;
    } catch (error) {
        console.error(error);
        throw new Error('Query execution failed');
    }
}

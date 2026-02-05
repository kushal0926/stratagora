"use client";

import { useState } from "react";

export default function Home() {
    const [pgn, setPgn] = useState("");
    const [moves, setMoves] = useState<
        { moveNumber: string; notation: string }[]
    >([]);

    // checking pgn
    const submitPgn = async () => {
        const response = await fetch("http://localhost:8080/parse-pgn", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pgn }),
        });
        const data = await response.json();
        setMoves(data.moves);
    };

    return (
        <section className="flex items-center flex-col p-10 m-10 rounded-2xl">
            <textarea
                value={pgn}
                onChange={(e) => setPgn(e.target.value)}
                className="h-32 w-200 border-s-stone-950 text-black bg-amber-100 p-4"
                placeholder="your pgn file"
            />
            <button onClick={submitPgn} className="text-black border-s-stone-600 bg-blue-400  mt-20 p-4">parse ur pgn</button>

            <ul className="mt-4">
                {moves.map((m) => (
                    <li key={m.moveNumber}>
                        {m.moveNumber}. {m.notation}
                    </li>
                ))}
            </ul>
        </section>
    );
}

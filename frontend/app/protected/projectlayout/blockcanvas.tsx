"use client";
import { redirect } from "next/navigation";
import { useState } from "react";
import { CodeBlockBase, SELECT, IdentifierInput } from "./blocks";
import Canvas from "./Canvas";
import React, { useRef } from "react";

export default function BlockCanvas() {
    const [geminiResp, setGeminiResp] = useState("GEMINI COMMENT:");
    const blockslist: any[] = [];
    const blocksRef = useRef<any[]>(blockslist);
    const toSQLRef = useRef<((block: any) => string) | null>(null);
    blockslist.push(new SELECT(700, 50));
    blockslist.push(new IdentifierInput(700, 80));

    return (
        <div className="bg-ui-beige-100 rounded-lg shadow-sm">
            <div className="w-fit h-fit rounded-lg flex-col flex">
                <div className="bg-ui-navy-700 p-5 text-white w-full m-2 rounded-lg shadow-md">{geminiResp}</div>
                <div className="flex flex-row">
                    <Canvas shapes={blockslist} width={1450} height={550} blocksRef={blocksRef} toSQLRef={toSQLRef} />
                </div>
                <div className="flex justify-center space-x-4 p-2">
                    <button
                        className="bg-ui-navy-700 hover:bg-ui-navy-600 w-[45%] text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                        onClick={() => {
                            if (blocksRef.current && blocksRef.current.length > 0 && toSQLRef.current) {
                                // fetch to localhost, to get the gemini response of the current query:
                                console.log(toSQLRef.current(blocksRef.current[0]));
                                const data = {
                                    prompt: toSQLRef.current(blocksRef.current[0]),
                                };
                                fetch("http://127.0.0.1:8000/gemini_request", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(data),
                                })
                                    .then((response) => response.json())
                                    .then((result) => {
                                        // If result is an object, stringify it, otherwise use as is
                                        if (typeof result === "object") {
                                            setGeminiResp("GEMINI RESPONSE" + JSON.stringify(result));
                                        } else {
                                            setGeminiResp("GEMINI RESPONSE:" + result);
                                        }
                                    })
                                    .catch((error) => console.error("Error:", error));
                            } else {
                                setGeminiResp("GEMINI RESP: No blocks in SQL to analyze");
                                console.log("No blocks or toSQL function not available");
                            }
                        }}
                    >
                        Ask Gemini
                    </button>

                    <button
                        className="bg-ui-terracotta-500 hover:bg-ui-terracotta-400 w-[45%] text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                        onClick={() => {
                            if (blocksRef.current && blocksRef.current.length > 0 && toSQLRef.current) {
                                // fetch to localhost, to get the gemini response of the current query:
                                console.log(toSQLRef.current(blocksRef.current[0]));
                                const data = {
                                    prompt: toSQLRef.current(blocksRef.current[0]),
                                };
                                fetch("http://127.0.0.1:8000/update_send", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(data),
                                })
                                    .then((response) => response.json())
                                    .then((result) => {
                                        if ((result = true)) fetch("http://127.0.0.1:8000/update_send");
                                    })
                                    .catch((error) => console.error("Error:", error));
                            } else {
                                setGeminiResp("GEMINI RESP: No blocks in SQL to analyze");
                                console.log("No blocks or toSQL function not available");
                            }
                        }}
                    >
                        Query Postgres
                    </button>
                </div>
            </div>
        </div>
    );
}

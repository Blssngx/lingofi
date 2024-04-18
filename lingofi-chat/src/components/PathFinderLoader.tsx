// @ts-nocheck
"use client"
import React, { useEffect, useState } from "react";

export const PathFinderLoader = () => {
  return (
    <div className="grid h-screen w-full place-content-center ">
      <PathFinder />
    </div>
  );
};

export const PathFinder = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    useEffect(() => {
        loaded && playGame();
    }, [loaded, playGame]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const playGame = useCallback(async () => {
        const startTop = Math.floor(Math.random() * ROWS);
        const startLeft = Math.floor(Math.random() * COLS);

        const endTop = Math.floor(Math.random() * ROWS);
        const endLeft = Math.floor(Math.random() * COLS);

        const startEl = document.getElementById(`${startTop}-${startLeft}`);
        const endEl = document.getElementById(`${endTop}-${endLeft}`);

        if (startEl && endEl) {
            startEl.style.background = START_COLOR;
            startEl.dataset.visited = "true";
            endEl.style.background = START_COLOR;

            let answer = await bfs({
                startTop,
                startLeft,
                endTop,
                endLeft,
            });

            await paintPath(answer);
            await reset();
            playGame();
        }
    });

    const paintPath = async (answer) => {
        for (let i = 1; i < answer.length; i++) {
            const { top, left } = answer[i];
            const el = document.getElementById(`${top}-${left}`);

            if (el) {  // Check if element exists
                if (i === answer.length - 1) {
                    el.style.background = GOAL_COLOR;
                } else {
                    el.style.background = FOUND_PATH_COLOR;
                }

                await sleep(25);
            }
        }
    };


    const reset = async () => {
        await sleep(1500);
        document.querySelectorAll(".game-box").forEach((el) => {
            (el as HTMLElement).style.background = "transparent";
            (el as HTMLElement).dataset.visited = "false";
        });
        await sleep(1000);
    };

    const bfs = async ({
        startTop,
        startLeft,
        endTop,
        endLeft,
    }: {
        startTop: number;
        startLeft: number;
        endTop: number;
        endLeft: number;
    }): Promise<Coordinate[]> => {
        let possiblePaths: Coordinate[][] = [[{ top: startTop, left: startLeft }]];
        let answer: Coordinate[] = [];

        while (possiblePaths.length) {
            const curPath = possiblePaths.pop();

            let curStep = curPath?.length ? curPath[curPath.length - 1] : null;

            if (!curPath || !curStep) return answer;

            await sleep(5);

            const curStepEl = document.getElementById(
                `${curStep.top}-${curStep.left}`
            );

            if (!curStepEl) return answer;

            const newPaths = getPossibleNextSteps(curStep).map((s) => [
                ...curPath,
                s,
            ]);

            newPaths.forEach((p) => {
                const target = p[p.length - 1];

                const el = document.getElementById(`${target.top}-${target.left}`);
                el!.dataset.visited = "true";

                if (target.top === endTop && target.left === endLeft) {
                    answer = p;
                } else {
                    el!.style.background = FLOOD_COLOR;
                }
            });

            if (answer.length) {
                break;
            }

            possiblePaths = [...newPaths, ...possiblePaths];
        }

        return answer;
    };

    const getPossibleNextSteps = ({ top, left }: Coordinate) => {
        const canGoLeft = left > 0;
        const canGoRight = left < COLS - 1;
        const canGoUp = top > 0;
        const canGoDown = top < ROWS - 1;

        const newPaths = [];

        // --- Diagonal moves
        if (canGoUp && canGoLeft) {
            newPaths.push({
                top: top - 1,
                left: left - 1,
            });
        }
        if (canGoUp && canGoRight) {
            newPaths.push({
                top: top - 1,
                left: left + 1,
            });
        }
        if (canGoDown && canGoLeft) {
            newPaths.push({
                top: top + 1,
                left: left - 1,
            });
        }
        if (canGoDown && canGoRight) {
            newPaths.push({
                top: top + 1,
                left: left + 1,
            });
        }

        // --- Horizontal and vertical moves
        if (canGoLeft) {
            newPaths.push({
                top,
                left: left - 1,
            });
        }
        if (canGoRight) {
            newPaths.push({
                top,
                left: left + 1,
            });
        }
        if (canGoUp) {
            newPaths.push({
                top: top - 1,
                left,
            });
        }
        if (canGoDown) {
            newPaths.push({
                top: top + 1,
                left,
            });
        }

        return newPaths.filter((s) => {
            const el = document.getElementById(`${s.top}-${s.left}`);
            return el?.dataset.visited === "false";
        });
    };

    const generateBoxes = () => {
        const els = [];

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                els.push(
                    <div
                        data-visited="false"
                        id={`${r}-${c}`}
                        className="game-box col-span-1 aspect-square w-full border-b border-r border-neutral-800 transition-colors duration-1000"
                        key={`${r}-${c}`}
                    />
                );
            }
        }

        return <>{els}</>;
    };

    return (
        <div
            style={{
                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            }}
            className="grid w-[75vmin] border-l border-t border-neutral-800 bg-neutral-950 shadow-2xl shadow-neutral-900"
        >
            {generateBoxes()}
        </div>
    );
};

const START_COLOR = "#8b5cf6";
const GOAL_COLOR = "#10b981";
const FLOOD_COLOR = "#404040";
const FOUND_PATH_COLOR = "#FFFFFF";

const ROWS = 16;
const COLS = 16;

type Coordinate = {
    top: number;
    left: number;
};

const sleep = async (ms: number) => new Promise((r) => setTimeout(r, ms));
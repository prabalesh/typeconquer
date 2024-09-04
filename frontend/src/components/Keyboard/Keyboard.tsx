import React, { useState, useEffect } from "react";

const Keyboard: React.FC = () => {
    const [pressedKey, setPressedKey] = useState<string | null>(null);
    const [capsLock, setCapsLock] = useState<boolean>(false);
    const [leftShiftActive, setLeftShiftActive] = useState<boolean>(false);
    const [rightShiftActive, setRightShiftActive] = useState<boolean>(false);
    const [leftCtrlActive, setLeftCtrlActive] = useState<boolean>(false);
    const [rightCtrlActive, setRightCtrlActive] = useState<boolean>(false);
    const [leftAltActive, setLeftAltActive] = useState<boolean>(false);
    const [rightAltActive, setRightAltActive] = useState<boolean>(false);

    const leftHandKeys = new Set([
        "esc",
        "1",
        "2",
        "3",
        "4",
        "5",
        "tab",
        "q",
        "w",
        "e",
        "r",
        "t",
        "capslock",
        "a",
        "s",
        "d",
        "f",
        "g",
        "shiftleft",
        "z",
        "x",
        "c",
        "v",
        "lctrl",
        "lalt",
    ]);

    const rightHandKeys = new Set([
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "backspace",
        "y",
        "u",
        "i",
        "o",
        "p",
        "[",
        "]",
        "\\",
        "h",
        "j",
        "k",
        "l",
        ";",
        "'",
        "enter",
        "b",
        "n",
        "m",
        ",",
        ".",
        "/",
        "shiftright",
        "rctrl",
        "ralt",
    ]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();

            if (event.getModifierState("CapsLock")) {
                setCapsLock(true);
            } else {
                setCapsLock(false);
            }

            if (event.code === "ShiftLeft") {
                setLeftShiftActive(true);
            } else if (event.code === "ShiftRight") {
                setRightShiftActive(true);
            }

            if (event.code === "ControlLeft") {
                setLeftCtrlActive(true);
            } else if (event.code === "ControlRight") {
                setRightCtrlActive(true);
            }

            if (event.code === "AltLeft") {
                setLeftAltActive(true);
            } else if (event.code === "AltRight") {
                setRightAltActive(true);
            }

            setPressedKey(key === " " ? "space" : key);
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === "ShiftLeft") {
                setLeftShiftActive(false);
            } else if (event.code === "ShiftRight") {
                setRightShiftActive(false);
            }

            if (event.code === "ControlLeft") {
                setLeftCtrlActive(false);
            } else if (event.code === "ControlRight") {
                setRightCtrlActive(false);
            }

            if (event.code === "AltLeft") {
                setLeftAltActive(false);
            } else if (event.code === "AltRight") {
                setRightAltActive(false);
            }

            setPressedKey(null);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const keys = [
        [
            "esc",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "0",
            "-",
            "=",
            "backspace",
        ],
        [
            "tab",
            "q",
            "w",
            "e",
            "r",
            "t",
            "y",
            "u",
            "i",
            "o",
            "p",
            "[",
            "]",
            "\\",
        ],
        [
            "capslock",
            "a",
            "s",
            "d",
            "f",
            "g",
            "h",
            "j",
            "k",
            "l",
            ";",
            "'",
            "enter",
        ],
        [
            "shiftleft",
            "z",
            "x",
            "c",
            "v",
            "b",
            "n",
            "m",
            ",",
            ".",
            "/",
            "shiftright",
        ],
        ["lctrl", "lalt", "space", "ralt", "rctrl"],
    ];

    return (
        <div className="keyboard">
            {keys.map((row, rowIndex) => (
                <div className="keyboard-row" key={rowIndex}>
                    {row.map((key) => (
                        <div
                            key={key}
                            className={`keyboard-key ${
                                pressedKey === key ? "active" : ""
                            } ${key === "space" ? "space-key" : ""} ${
                                key === "capslock" && capsLock ? "active" : ""
                            } ${
                                key === "shiftleft" && leftShiftActive
                                    ? "active"
                                    : ""
                            } ${
                                key === "shiftright" && rightShiftActive
                                    ? "active"
                                    : ""
                            } ${
                                key === "lctrl" && leftCtrlActive
                                    ? "active"
                                    : ""
                            } ${
                                key === "rctrl" && rightCtrlActive
                                    ? "active"
                                    : ""
                            } ${
                                key === "lalt" && leftAltActive ? "active" : ""
                            } ${
                                key === "ralt" && rightAltActive ? "active" : ""
                            }`}
                            style={{
                                backgroundColor: leftHandKeys.has(key)
                                    ? "#cceeff"
                                    : rightHandKeys.has(key)
                                    ? "#ffffcc"
                                    : undefined,
                            }}
                        >
                            {key === "space" ? " " : key}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;

import React from 'react';
import Typewriter from 'typewriter-effect';

const TypewriterText = ({ texts, speed = 50, pause = 2000 }) => {
    return (
        <span className="inline-block min-w-[200px] text-primary font-mono">
            <Typewriter
                options={{
                    strings: texts,
                    autoStart: true,
                    loop: true,
                    delay: speed,
                    deleteSpeed: 30,
                    pauseFor: pause,
                    cursor: '|',
                }}
            />
        </span>
    );
};

export default TypewriterText;

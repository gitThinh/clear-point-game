import React, { FC, useRef } from 'react';
import { Circle, CIRCLE_SIZE } from '../models/circle';

interface Circleprops {
    circle: Circle;
    onClick: (id: number) => boolean;
}

const RenderCircle: FC<Circleprops> = ({ circle, onClick }) => {
    const circleRef = useRef<HTMLDivElement>(null);

    const handleCircleClick = () => {
        const isSuccess = onClick(circle.id);

        if (circleRef.current && isSuccess) {
            circleRef.current.style.backgroundColor = "red";
        }
    };

    return (
        <div
            ref={circleRef}
            className="cursor-pointer bg-gray-200 border-2 border-black rounded-full flex items-center justify-center absolute select-none transition-colors duration-700"
            style={{ width: `${CIRCLE_SIZE}px`, height: `${CIRCLE_SIZE}px`, top: `${circle.y}px`, left: `${circle.x}px`, zIndex: 99999999 - circle.id }}
            onClick={handleCircleClick}
        >
            {circle.id}
        </div>
    );
};

export default RenderCircle;

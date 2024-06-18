import React, { useState, useRef, useEffect, ReactNode } from 'react';
import './Popper.css';

type PopperProp = {
    chilldren:ReactNode,
    button:ReactNode,
}

const Popper: React.FC<PopperProp> = ({chilldren,button}) => {
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popperRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            popperRef.current &&
            !popperRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setIsVisible(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="container">
            <button ref={buttonRef} onClick={() => setIsVisible(!isVisible)}>
                {button}
            </button>
            {isVisible && (
                <div ref={popperRef} className="popper">
                    {chilldren}
                </div>
            )}
        </div>
    );
};

export default Popper;

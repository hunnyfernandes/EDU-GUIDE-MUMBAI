import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({
    children,
    animation = 'animate-fade-in-up',
    duration = '1000ms',
    delay = '0ms',
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, we can stop observing if we only want it to trigger once
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Offset to trigger slightly before/after
        });

        const currentElement = domRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`${className} ${isVisible ? `${animation} is-visible` : 'opacity-0 translate-y-8'}`} // Start hidden and offset
            style={{
                transitionDuration: duration,
                transitionDelay: delay,
                transitionProperty: 'opacity, transform',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' // smooth ease-out
            }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;

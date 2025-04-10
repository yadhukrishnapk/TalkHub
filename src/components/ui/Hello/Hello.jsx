import { useEffect, useRef, useState } from 'react';

const SplitText = ({
  text = '',
  className = '',
  delay = 100,
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
}) => {
  const words = text.split(' ').map(word => word.split(''));
  const letters = words.flat();
  const [inView, setInView] = useState(false);
  const ref = useRef();
  const animatedCount = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleTransitionEnd = () => {
    animatedCount.current += 1;
    if (
      animatedCount.current === letters.length &&
      onLetterAnimationComplete
    ) {
      onLetterAnimationComplete();
    }
  };

  return (
    <p
      ref={ref}
      className={`split-parent ${className}`}
      style={{ textAlign, whiteSpace: 'normal', wordWrap: 'break-word' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.map((letter, letterIndex) => {
            const index = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length, 0) + letterIndex;
            return (
              <span
                key={index}
                className="letter"
                style={{
                  display: 'inline-block',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                  transitionDelay: `${index * delay}ms`,
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {letter}
              </span>
            );
          })}
          <span style={{ display: 'inline-block', width: '0.3em' }}> </span>
        </span>
      ))}
    </p>
  );
};

export default SplitText;
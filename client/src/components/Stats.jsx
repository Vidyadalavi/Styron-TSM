import { useEffect, useRef, useState } from 'react';

function StatItem({ target, label }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setValue(target);
              clearInterval(timer);
            } else {
              setValue(Math.floor(start));
            }
          }, 16);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="stat">
      <div className="stat-num" ref={ref}>{value}+</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <div className="stats">
      <StatItem target={500} label="Projects Completed" />
      <StatItem target={300} label="Happy Clients" />
      <StatItem target={10} label="Years Experience" />
      <StatItem target={5000} label="Tons Delivered" />
    </div>
  );
}

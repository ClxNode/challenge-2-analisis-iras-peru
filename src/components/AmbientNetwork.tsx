import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Discreet animated network behind the wheel; the canvas never receives input. */
export function AmbientNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let elapsed = 0;
    let previousTime = 0;
    let disposed = false;
    let targetX = 0;
    let targetY = 0;
    let smoothX = 0;
    let smoothY = 0;

    const updatePhoto = (dt: number) => {
      const follow = 1 - Math.exp(-dt * 3.2);
      smoothX += (targetX - smoothX) * follow;
      smoothY += (targetY - smoothY) * follow;
      if (photoRef.current) {
        photoRef.current.style.transform = `translate3d(${-smoothX * 15}px, ${-smoothY * 11}px, 0) scale(1.045)`;
      }
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = clamp(Math.round((width * height) / 17_000), width < 640 ? 24 : 38, width < 640 ? 48 : 112);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        r: 0.7 + Math.random() * 1.6,
        a: 0.18 + Math.random() * 0.38,
      }));
      draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      // A compact spatial hash keeps connection checks local rather than quadratic.
      const cellSize = 112;
      const grid = new Map<string, number[]>();
      particles.forEach((particle, index) => {
        const key = `${Math.floor(particle.x / cellSize)},${Math.floor(particle.y / cellSize)}`;
        const bucket = grid.get(key);
        if (bucket) bucket.push(index);
        else grid.set(key, [index]);
      });

      context.lineWidth = 0.7;
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const cx = Math.floor(particle.x / cellSize);
        const cy = Math.floor(particle.y / cellSize);
        let links = 0;
        for (let ox = -1; ox <= 1 && links < 4; ox++) {
          for (let oy = -1; oy <= 1 && links < 4; oy++) {
            const bucket = grid.get(`${cx + ox},${cy + oy}`);
            if (!bucket) continue;
            for (const j of bucket) {
              if (j <= i) continue;
              const other = particles[j];
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distance = Math.hypot(dx, dy);
              if (distance < cellSize) {
                context.strokeStyle = `rgba(48, 143, 255, ${(1 - distance / cellSize) * 0.16})`;
                context.beginPath();
                context.moveTo(particle.x, particle.y);
                context.lineTo(other.x, other.y);
                context.stroke();
                links++;
                if (links >= 4) break;
              }
            }
          }
        }
      }

      // Slow, low contrast light trails drift along the lower and right edges.
      for (let i = 0; i < 3; i++) {
        const phase = elapsed * 0.12 + i * 1.25;
        context.beginPath();
        context.moveTo(width * (0.12 + i * 0.08), height * (0.91 + i * 0.018));
        context.bezierCurveTo(
          width * (0.43 + Math.sin(phase) * 0.06), height * (0.72 + i * 0.04),
          width * (0.78 + Math.cos(phase * 0.7) * 0.04), height * (0.98 - i * 0.08),
          width * (1.03 - i * 0.035), height * (0.7 - i * 0.12),
        );
        context.strokeStyle = `rgba(29, 126, 255, ${0.075 - i * 0.014})`;
        context.lineWidth = i === 0 ? 1.4 : 0.8;
        context.stroke();
      }

      for (const particle of particles) {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(92, 184, 255, ${particle.a})`;
        context.fill();
      }
    };

    const animate = (time: number) => {
      if (disposed || document.hidden || motionQuery.matches) return;
      let dt = 0;
      if (previousTime) {
        dt = Math.min((time - previousTime) / 1000, 0.04);
        elapsed += dt;
        for (const particle of particles) {
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          if (particle.x < -4) particle.x = width + 4;
          else if (particle.x > width + 4) particle.x = -4;
          if (particle.y < -4) particle.y = height + 4;
          else if (particle.y > height + 4) particle.y = -4;
        }
      }
      previousTime = time;
      updatePhoto(dt);
      draw();
      frame = window.requestAnimationFrame(animate);
    };

    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };
    const start = () => {
      stop();
      if (disposed || document.hidden) return;
      if (motionQuery.matches) {
        updatePhoto(0);
        draw();
      }
      else frame = window.requestAnimationFrame(animate);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionChange = () => start();
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || motionQuery.matches) return;
      const bounds = canvas.getBoundingClientRect();
      targetX = clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1);
      targetY = clamp(((event.clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1);
    };
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        targetX = 0;
        targetY = 0;
      }
    };

    resize();
    start();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <>
      <div
        ref={photoRef}
        aria-hidden="true"
        className="ambient-photo"
        style={{
          backgroundImage: `linear-gradient(rgba(5, 13, 27, 0.28), rgba(5, 13, 27, 0.3)), url("${import.meta.env.BASE_URL}images/iras-network-bg.png")`,
        }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="ambient-network" />
    </>
  );
}

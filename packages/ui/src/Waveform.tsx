"use client";

import * as React from "react";
import { cn } from "./cn";

type WaveformProps = {
  /** AudioContext, MediaStream или null. Если null — waveform «спит». */
  stream: MediaStream | null;
  /** Высота канваса в px (по умолчанию 48). */
  height?: number;
  className?: string;
  /** Цвет столбиков. */
  color?: string;
};

/**
 * Живой осциллограф через AnalyserNode + requestAnimationFrame.
 * Подключается к MediaStream из getUserMedia().
 * Очищается автоматически при размонтировании.
 */
export function Waveform({ stream, height = 48, className, color }: WaveformProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!stream || !canvasRef.current) return;
    const ctxEl = canvasRef.current;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      if (!canvasRef.current) return;
      analyser.getByteTimeDomainData(data);
      const cnv = canvasRef.current;
      const c = cnv.getContext("2d");
      if (!c) return;
      const W = cnv.width;
      const H = cnv.height;
      c.clearRect(0, 0, W, H);
      const stroke = color || getComputedStyle(document.documentElement).getPropertyValue("--primary-500").trim() || "#4d6b4b";
      c.fillStyle = stroke + "22";
      c.strokeStyle = stroke;
      c.lineWidth = 2;
      const slice = W / data.length;
      let x = 0;
      c.beginPath();
      for (let i = 0; i < data.length; i++) {
        const v = data[i]! / 128 - 1; // [-1, 1]
        const y = H / 2 + (v * H) / 2;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
        x += slice;
      }
      c.stroke();
      // fill below curve
      c.lineTo(W, H);
      c.lineTo(0, H);
      c.closePath();
      c.fill();
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      source.disconnect();
      analyser.disconnect();
      audioCtx.close();
    };
  }, [stream, color]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={height}
      className={cn("w-full rounded-2xl bg-[var(--surface-container-low)]", className)}
    />
  );
}
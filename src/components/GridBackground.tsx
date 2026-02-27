"use client";

type Props = { enabled: boolean; intensity: number; matrix: boolean };

export default function GridBackground({ enabled, intensity, matrix }: Props) {
  return (
    <>
      {enabled && <div className="grid-bg animate" style={{ opacity: intensity / 100 }} />}
      {matrix && <div className="matrix-bg" />}
    </>
  );
}

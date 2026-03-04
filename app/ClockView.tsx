"use client";

import { useEffect, useMemo, useState } from "react";
import GoHomeAnimation from "./GoHomeAnimation";

const CX = 275;
const CY = 275;
const R = 175;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: Math.round((cx + r * Math.cos(rad)) * 1e10) / 1e10,
    y: Math.round((cy + r * Math.sin(rad)) * 1e10) / 1e10,
  };
}

function describeSector(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const delta = (endDeg - startDeg + 360) % 360;
  const largeArc = delta > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function fmt(d: Date | null) {
  if (!d) return "--:--";
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const NUM_COLORS = [
  "#FF4757", "#FF6348", "#FFA502", "#2ED573",
  "#1E90FF", "#5352ED", "#FF6B81", "#A55EEA",
  "#00BCD4", "#26DE81", "#FC5C65", "#F53B57",
];

export default function ClockView() {
  const [now, setNow] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  /* マウント時に即設定＋毎秒更新 */
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* スリープ / タブ復帰時にも即更新 */
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setNow(new Date());
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  /* タイマー終了検知 */
  useEffect(() => {
    if (endTime && !finished && now && now.getTime() >= endTime.getTime()) {
      setFinished(true);
    }
  }, [now, endTime, finished]);

  const remainMin = useMemo(() => {
    if (!endTime || !now) return null;
    return Math.max(
      Math.ceil((endTime.getTime() - now.getTime()) / 60000),
      0
    );
  }, [endTime, now]);

  const minDeg = now ? now.getMinutes() * 6 : 0;
  const hourDeg = now
    ? ((now.getHours() % 12) + now.getMinutes() / 60) * 30
    : 0;

  const sector = useMemo(() => {
    if (!remainMin || !now) return null;
    const start = now.getMinutes() * 6;
    return { start, end: start + remainMin * 6 };
  }, [remainMin, now]);

  const handleStart = (min: number) => {
    const st = new Date();
    st.setSeconds(0, 0);
    setStartTime(st);
    setEndTime(new Date(st.getTime() + min * 60000));
    setDurationMin(min);
    setFinished(false);
    setShowPanel(false);
  };

  const handleReset = () => {
    setStartTime(null);
    setEndTime(null);
    setDurationMin(null);
    setFinished(false);
    setShowPanel(false);
  };

  const timerActive = startTime !== null && endTime !== null;

  if (finished) {
    return <GoHomeAnimation onReset={handleReset} />;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        background: "linear-gradient(180deg, #87CEEB 0%, #B0E0F0 40%, #D4ECFA 70%, #A8D5A2 70.1%, #7CB870 72%, #6B6B6B 72.1%, #555 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* ===== 道路の白線 ===== */}
      <div
        style={{
          position: "absolute",
          bottom: "13%",
          width: "100%",
          height: 4,
          backgroundImage:
            "repeating-linear-gradient(90deg, #fff 0px, #fff 40px, transparent 40px, transparent 70px)",
        }}
      />

      {/* ===== 時計SVG ===== */}
      <svg
        viewBox="0 0 550 550"
        style={{
          width: "min(100vw, 96dvh)",
          height: "min(100vw, 96dvh)",
          filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.18))",
        }}
      >
        <defs>
          <radialGradient id="tire" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#555" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>
          <radialGradient id="clockFace" cx="48%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F5F0E8" />
          </radialGradient>
        </defs>

        {/* ===== タイヤリング ===== */}
        <circle cx={CX} cy={CY} r={R + 35} fill="url(#tire)" />

        {/* タイヤの溝パターン */}
        {Array.from({ length: 48 }).map((_, i) => {
          const deg = i * 7.5;
          const p1 = polar(CX, CY, R + 19, deg);
          const p2 = polar(CX, CY, R + 34, deg);
          return (
            <line
              key={`t${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#383838"
              strokeWidth={5}
              strokeLinecap="round"
            />
          );
        })}

        {/* クロームリム */}
        <circle
          cx={CX}
          cy={CY}
          r={R + 12}
          fill="none"
          stroke="#C0C0C0"
          strokeWidth={7}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R + 5}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth={3}
        />

        {/* 文字盤 */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="url(#clockFace)"
          stroke="#CCC"
          strokeWidth={2}
        />

        {/* タイマー扇形 */}
        {sector && (
          <path
            d={describeSector(CX, CY, R - 10, sector.start, sector.end)}
            fill="rgba(255,100,140,0.25)"
          />
        )}

        {/* 目盛 */}
        {Array.from({ length: 60 }).map((_, i) => {
          const deg = i * 6;
          const isMajor = i % 5 === 0;
          const inner = polar(CX, CY, isMajor ? R - 22 : R - 12, deg);
          const outer = polar(CX, CY, R - 5, deg);
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={isMajor ? "#FF4757" : "#D5CDBD"}
              strokeWidth={isMajor ? 3.5 : 1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* 乗り物アイコン（1.5倍：66×66） */}
        {Array.from({ length: 12 }).map((_, i) => {
          const n = i + 1;
          const p = polar(CX, CY, R - 48, n * 30);
          return (
            <image
              key={n}
              href={`/vehicles/vehicle_${n}.png`}
              x={p.x - 33}
              y={p.y - 33}
              width={66}
              height={66}
            />
          );
        })}

        {/* 数字バッジ（大きくポップに） */}
        {Array.from({ length: 12 }).map((_, i) => {
          const n = i + 1;
          const p = polar(CX, CY, R + 56, n * 30);
          return (
            <g key={n}>
              {/* 影 */}
              <circle
                cx={p.x + 1}
                cy={p.y + 3}
                r={28}
                fill="rgba(0,0,0,0.15)"
              />
              {/* バッジ本体 */}
              <circle cx={p.x} cy={p.y} r={28} fill={NUM_COLORS[i]} />
              {/* ハイライト */}
              <circle
                cx={p.x - 5}
                cy={p.y - 7}
                r={10}
                fill="rgba(255,255,255,0.22)"
              />
              {/* 数字 */}
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={n >= 10 ? 24 : 30}
                fontWeight={900}
                fill="#FFF"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth={1}
              >
                {n}
              </text>
            </g>
          );
        })}

        {/* 短針（赤） */}
        <line
          x1={CX}
          y1={CX}
          x2={CX}
          y2={CY - 78}
          stroke="#FF4757"
          strokeWidth={14}
          strokeLinecap="round"
          transform={`rotate(${hourDeg} ${CX} ${CY})`}
        />

        {/* 長針（青） */}
        <line
          x1={CX}
          y1={CY}
          x2={CX}
          y2={CY - 118}
          stroke="#1E90FF"
          strokeWidth={9}
          strokeLinecap="round"
          transform={`rotate(${minDeg} ${CX} ${CY})`}
        />

        {/* 中心ハブ */}
        <circle
          cx={CX}
          cy={CY}
          r={13}
          fill="#FFD93D"
          stroke="#FF4757"
          strokeWidth={4}
        />
      </svg>

      {/* ===== タイマー情報（左下・縦並び） ===== */}
      {timerActive && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            background: "rgba(255,255,255,0.88)",
            borderRadius: 14,
            padding: "10px 16px",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            border: "2px solid #90A4AE",
            color: "#333",
          }}
        >
          <div>スタート {fmt(startTime)}</div>
          <div>おしまい {fmt(endTime)}</div>
          <div style={{ color: "#FF4757", fontWeight: 800 }}>
            {durationMin}分間
          </div>
        </div>
      )}

      {/* ===== 設定ボタン ===== */}
      <button
        onClick={() => setShowPanel((v) => !v)}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.85)",
          border: "2px solid #90A4AE",
          fontSize: 22,
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        &#9881;
      </button>

      {/* ===== 設定パネル ===== */}
      {showPanel && (
        <div
          style={{
            position: "absolute",
            top: 72,
            right: 16,
            width: 210,
            background: "rgba(255,255,255,0.95)",
            border: "2px solid #90A4AE",
            borderRadius: 16,
            padding: 16,
            fontSize: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            color: "#333",
          }}
        >
          <select
            value=""
            onChange={(e) => {
              const m = Number(e.target.value);
              if (!m) return;
              handleStart(m);
            }}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          >
            <option value="">何分後にする？</option>
            {Array.from({ length: 59 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}分
              </option>
            ))}
          </select>

          {timerActive && (
            <button
              onClick={handleReset}
              style={{
                width: "100%",
                marginTop: 8,
                padding: 8,
                borderRadius: 8,
                background: "#FF4757",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              取り消し
            </button>
          )}
        </div>
      )}
    </div>
  );
}

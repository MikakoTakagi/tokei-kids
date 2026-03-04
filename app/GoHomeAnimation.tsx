"use client";

type Props = {
  onReset?: () => void;
};

/**
 * うさぎSVG（差し替え用に分離）
 * 後で <image href="/bunny.png" ... /> に置き換えてOK
 */
function BunnySvg({ size = 140 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 140 140"
      width={size}
      height={size}
      style={{ display: "block" }}
    >
      {/* 奥の耳 */}
      <ellipse
        cx="75"
        cy="28"
        rx="9"
        ry="30"
        fill="#E8A0B0"
        transform="rotate(12 75 28)"
      />
      <ellipse
        cx="75"
        cy="28"
        rx="5"
        ry="22"
        fill="#FFD1DC"
        transform="rotate(12 75 28)"
      />

      {/* 手前の耳 */}
      <ellipse
        cx="55"
        cy="22"
        rx="10"
        ry="34"
        fill="#FFB6C1"
        transform="rotate(-5 55 22)"
      />
      <ellipse
        cx="55"
        cy="22"
        rx="6"
        ry="26"
        fill="#FFD1DC"
        transform="rotate(-5 55 22)"
      />

      {/* しっぽ */}
      <circle cx="24" cy="78" r="11" fill="#FFD1DC" />

      {/* からだ */}
      <ellipse cx="58" cy="88" rx="36" ry="30" fill="#FFB6C1" />

      {/* 頭 */}
      <circle cx="78" cy="66" r="26" fill="#FFB6C1" />

      {/* ほっぺ */}
      <ellipse cx="96" cy="72" rx="7" ry="5" fill="#FF9BB0" opacity="0.5" />

      {/* 目 */}
      <circle cx="90" cy="62" r="4.5" fill="#333" />
      <circle cx="91.5" cy="60" r="1.8" fill="#fff" />

      {/* 鼻 */}
      <ellipse cx="100" cy="70" rx="3" ry="2.5" fill="#FF8FA0" />

      {/* 口 */}
      <path
        d="M97 74 Q100 78 103 74"
        fill="none"
        stroke="#D4A0A0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* 前足 */}
      <ellipse cx="85" cy="112" rx="12" ry="8" fill="#FFB6C1" />

      {/* 後ろ足 */}
      <ellipse cx="42" cy="114" rx="14" ry="9" fill="#FFB6C1" />
    </svg>
  );
}

/**
 * 家SVG（差し替え用に分離）
 * 後で <image href="/house.png" ... /> に置き換えてOK
 */
function HouseSvg({ size = 120 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      style={{ display: "block" }}
    >
      {/* 煙突 */}
      <rect x="78" y="18" width="16" height="32" fill="#C0392B" rx="2" />

      {/* 屋根 */}
      <polygon
        points="60,8 8,58 112,58"
        fill="#E74C3C"
        stroke="#C0392B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 壁 */}
      <rect x="18" y="58" width="84" height="52" fill="#FFF3E0" rx="3" />

      {/* ドア */}
      <rect x="46" y="70" width="26" height="40" fill="#8D6E63" rx="3" />
      {/* ドアノブ */}
      <circle cx="66" cy="92" r="2.5" fill="#FFD700" />

      {/* 左窓 */}
      <rect x="24" y="66" width="16" height="16" fill="#81D4FA" rx="2" />
      <line
        x1="32"
        y1="66"
        x2="32"
        y2="82"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <line
        x1="24"
        y1="74"
        x2="40"
        y2="74"
        stroke="#fff"
        strokeWidth="1.5"
      />

      {/* 右窓 */}
      <rect x="78" y="66" width="16" height="16" fill="#81D4FA" rx="2" />
      <line
        x1="86"
        y1="66"
        x2="86"
        y2="82"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <line
        x1="78"
        y1="74"
        x2="94"
        y2="74"
        stroke="#fff"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function GoHomeAnimation({ onReset }: Props) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        background:
          "linear-gradient(180deg, #FFA726 0%, #FF7043 35%, #F06292 70%, #CE93D8 100%)",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* アニメーション定義 */}
      <style>{`
        @keyframes bunny-move {
          0%   { left: -160px; }
          100% { left: 110vw; }
        }
        @keyframes bunny-hop {
          0%, 100% { transform: translateY(0); }
          45%      { transform: translateY(-60px); }
        }
      `}</style>

      {/* ===== おしまい（上部に小さく） ===== */}
      <div
        style={{
          position: "absolute",
          top: 24,
          width: "100%",
          textAlign: "center",
          color: "#fff",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 4,
          textShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        おしまい
      </div>

      {/* ===== 家（右側ゴール） ===== */}
      <div
        style={{
          position: "absolute",
          right: "6%",
          bottom: "11%",
        }}
      >
        <HouseSvg size={130} />
      </div>

      {/* ===== うさぎ（ぴょんぴょん） ===== */}
      <div
        style={{
          position: "absolute",
          bottom: "13%",
          animation: "bunny-move 7s linear infinite",
        }}
      >
        <div
          style={{
            animation: "bunny-hop 0.55s ease-in-out infinite",
          }}
        >
          <BunnySvg size={140} />
        </div>
      </div>

      {/* ===== 地面ライン ===== */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          width: "100%",
          height: 4,
          background: "rgba(255,255,255,0.25)",
          borderRadius: 2,
        }}
      />

      {/* ===== もどるボタン（親向け） ===== */}
      {onReset && (
        <button
          onClick={onReset}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: "8px 20px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.3)",
            border: "2px solid rgba(255,255,255,0.6)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}
        >
          もどる
        </button>
      )}
    </div>
  );
}

import React, { useState, useEffect, useMemo, useLayoutEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Minus, Plus, X, Shield, Swords, Heart, Zap, Info } from 'lucide-react';

const Xe = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" };
const Me = { 1: "A", 11: "J", 12: "Q", 13: "K" };
const Mf = a => a === 1 ? 1 : a === 11 ? 11 : a === 12 ? 10 : a === 13 ? 12 : a;
const b2 = a => a === 12 ? 10 : Mf(a);
const gu = a => a === 12 ? 10 : Mf(a);
const kl = a => {
  const l = [...a];
  for (let o = l.length - 1; o > 0; o--) {
    const u = Math.floor(Math.random() * (o + 1));
    [l[o], l[u]] = [l[u], l[o]];
  }
  return l;
};

const S2 = ({ x, y, value, kind, onComplete }) => {
  useEffect(() => {
    const h = setTimeout(onComplete, 1000);
    return () => clearTimeout(h);
  }, [onComplete]);
  return <div className={`floating-number ${kind}`} style={{ left: x, top: y }}>{value}</div>;
};

const Mu = ({ card, isBack = false, isSelected = false, isAttackerSelected = false, isPendingAttacker = false, isBlockFocus = false, isPaired = false, isRecentDraw = false, onClick, onLongPress, className = "" }: any) => {
  const b = useRef(null);
  const x = () => { onLongPress && (b.current = setTimeout(onLongPress, 500)); };
  const C = () => { b.current && (clearTimeout(b.current), b.current = null); };
  if (isBack || !card) return <div className={`card card-back w-[82px] h-[118px] rounded-card shadow-card border-2 border-white/15 flex items-center justify-center ${className}`}><div className="text-2xl font-black opacity-50">🂠</div></div>;
  const B = card.suit === "hearts" || card.suit === "diamonds" ? "text-bad" : "text-black";
  return (
    <motion.div
      layout
      initial={isRecentDraw ? { scale: .8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      data-card-id={card.id}
      data-hud-scope="true"
      className={`card bg-white text-black w-[82px] h-[118px] rounded-card shadow-card border-2 transition-all cursor-pointer overflow-hidden relative
        ${isSelected ? "border-blue-400 -translate-y-4 shadow-2xl" : "border-black/10"}
        ${isAttackerSelected ? "border-bad -translate-y-4 shadow-red-500/20" : ""}
        ${isPendingAttacker ? "border-orange-400 -translate-y-6 shadow-orange-500/40 ring-4 ring-orange-400/20" : ""}
        ${isBlockFocus ? "border-blue-400 -translate-y-4 shadow-blue-500/20" : ""}
        ${isPaired ? "border-gold shadow-gold/20" : ""}
        ${isRecentDraw ? "ring-2 ring-purple-400" : ""}
        ${className}
      `}
      onClick={onClick}
      onMouseDown={x}
      onMouseUp={C}
      onTouchStart={x}
      onTouchEnd={C}
    >
      <div className={`p-2 h-full flex flex-col justify-between ${B}`}>
        <div className="text-sm font-black leading-none">{Me[card.rank] || card.rank}<br />{Xe[card.suit]}</div>
        <div className="text-3xl font-black self-center opacity-80">{Xe[card.suit]}</div>
        <div className="flex flex-wrap gap-0.5 justify-center">
          {card.rank === 1 && <span className="text-[8px] bg-black/5 px-1 rounded-full font-bold">Block Only</span>}
          {card.shield > 0 && <span className="text-[8px] bg-blue-100 px-1 rounded-full font-bold">S:{card.shield}</span>}
          {card.attackBuff > 0 && <span className="text-[8px] bg-green-100 px-1 rounded-full font-bold">+{card.attackBuff}A</span>}
          {card.tempAttackDebuff > 0 && <span className="text-[8px] bg-red-100 px-1 rounded-full font-bold">-{card.tempAttackDebuff}A</span>}
        </div>
      </div>
    </motion.div>
  );
};

const Py = ({ card, side, isSelected = false, isAttackerSelected = false, isPendingAttacker = false, isBlockFocus = false, isPaired = false, effectiveAttack, onClick, onLongPress }: any) => (
  <div className="relative group">
    <Mu card={card} isSelected={isSelected} isAttackerSelected={isAttackerSelected} isPendingAttacker={isPendingAttacker} isBlockFocus={isBlockFocus} isPaired={isPaired} onClick={onClick} onLongPress={onLongPress} className="w-[76px] h-[110px]" />
    <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-bg/90 border border-white/10 rounded-full px-1.5 py-0.5 text-[10px] font-black z-10 shadow-lg">AT {effectiveAttack}</div>
    <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-bg/90 border border-white/10 rounded-full px-1.5 py-0.5 text-[10px] font-black z-10 shadow-lg">HP {Math.max(0, card.currentHealth)}</div>
    {card.shield > 0 && <div className="absolute -top-2 right-0 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black border border-white/20 shadow-md z-20">{card.shield}</div>}
  </div>
);

export default function App() {
  const [a, l] = useState(null);
  const [o, u] = useState("game");
  const [c, h] = useState([]);
  const [d, m] = useState(false);
  const [g, p] = useState(null);
  const [v, b] = useState([]);
  const [x, C] = useState({});
  const [zu, Ku] = useState(null);
  const [hudPos, setHudPos] = useState(null);
  const [B, L] = useState({ attackBuffs: {}, shields: {}, counter: {}, nullifyTarget: null, globalAttackDebuff: 0 });
  const Y = useRef(1);
  const q = useRef(0);

  const K = useCallback((S, A = false, G = "player") => {
    if (B.nullifyTarget === S.id) return S.baseAttack;
    let w = S.baseAttack + (S.attackBuff || 0) - (S.tempAttackDebuff || 0);
    if (B.attackBuffs[S.id]) w += B.attackBuffs[S.id];
    if (G === "cpu" && A) w -= B.globalAttackDebuff;
    if (A && S.suit === "spades") w += 1;
    return Math.max(0, w);
  }, [B]);

  const U = useCallback(S => {
    switch (S.suit) {
      case "spades": return { label: "Vanguard", desc: "+1 ATK while attacking. Blocks don't consume HP." };
      case "hearts": return { label: "Lifesteal", desc: "Heal player for 50% of damage dealt." };
      case "diamonds": return { label: "Piercing", desc: "Deals 50% damage to player even if blocked." };
      case "clubs": return { label: "Tactician", desc: "Draw a card when this unit destroys an enemy." };
      default: return { label: "Neutral", desc: "Standard unit." };
    }
  }, []);

  const normalizeHudCard = useCallback((S, A = "player", G = false) => {
    if (!S) return null;
    const w = S.baseAtk ?? S.baseAttack ?? 0;
    const ut = S.baseHp ?? gu(S.rank);
    const I = Math.max(0, S.hp ?? S.currentHealth ?? ut);
    const ht = S.atk ?? K(S, G, A);
    const dt = (S.shield || 0) + (B.shields[S.id] || 0);
    const ot = [];
    if (S.rank === 1) ot.push("Block Only");
    if ((S.attackBuff || 0) > 0) ot.push(`Attack +${S.attackBuff}`);
    if (B.attackBuffs[S.id]) ot.push(`Emergiburn ATK +${B.attackBuffs[S.id]}`);
    if ((S.tempAttackDebuff || 0) > 0) ot.push(`Attack -${S.tempAttackDebuff}`);
    if (B.counter[S.id]) ot.push("Counterstrike");
    if (B.nullifyTarget === S.id) ot.push("Nullified");
    if (A === "cpu" && G && B.globalAttackDebuff > 0) ot.push(`War Tax -${B.globalAttackDebuff}`);
    return { ...S, baseAtk: w, baseHp: ut, atk: ht, hp: I, shield: dt, buffs: ot, bonusAtk: ht - w, bonusHp: I - ut };
  }, [B, K]);

  const selectedHudCard = useMemo(() => {
    if (!a || !zu) return null;
    let S = null, A = "player", G = false;
    if (zu.zone === "playerHand") S = a.playerHand.find(w => w.id === zu.id);
    else if (zu.zone === "playerBoard") {
      S = a.playerBoard.find(w => w.id === zu.id);
      G = (a.pendingAttackSide === "player" || a.phase === "attack") && a.selectedAttackers.has(zu.id);
    } else if (zu.zone === "cpuBoard") {
      S = a.cpuBoard.find(w => w.id === zu.id);
      A = "cpu";
      G = a.pendingAttackSide === "cpu" && a.selectedAttackers.has(zu.id);
    }
    return S ? normalizeHudCard(S, A, G) : null;
  }, [a, zu, normalizeHudCard]);

  useLayoutEffect(() => {
    if (!zu || !a) {
      setHudPos(null);
      return;
    }
    const update = () => {
      const el = document.querySelector(`[data-card-id="${zu.id}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const hudWidth = 180;
      const hudHeight = 180;
      const padding = 16;
      let left = rect.left + rect.width / 2;
      left = Math.max(hudWidth / 2 + padding, Math.min(window.innerWidth - hudWidth / 2 - padding, left));
      let top, bottom, placement;
      if (rect.top > hudHeight + 40) {
        bottom = window.innerHeight - rect.top + 12;
        top = "auto";
        placement = "top";
      } else {
        top = rect.bottom + 12;
        bottom = "auto";
        placement = "bottom";
      }
      setHudPos({ left, top, bottom, placement });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [zu, a]);

  const formatHudBonus = (val) => val > 0 ? `+${val}` : val < 0 ? val : "±0";

  const X_gen = useCallback((S, A) => ({ id: Y.current++, rank: S, suit: A, baseValue: Mf(S), baseAttack: b2(S), baseAtk: b2(S), currentHealth: gu(S), baseHp: gu(S), hp: gu(S), attackBuff: 0, shield: 0, buffs: [], tempAttackDebuff: 0 }), []);
  
  const J = useCallback(() => {
    const S = ["spades", "hearts", "diamonds", "clubs"], A = [];
    for (let G = 1; G <= 13; G++) for (const w of S) A.push(X_gen(G, w));
    return kl(A);
  }, [X_gen]);

  const Q = useCallback(() => {
    const S = J(), A = S.splice(0, 5), G = S.splice(0, 5);
    l({ playerHand: A, playerBoard: [], cpuHand: G, cpuBoard: [], deck: S, playerHp: 30, cpuHp: 30, turn: 1, phase: "draw", log: ["Game Start!"], selectedAttackers: new Set(), pendingAttackSide: null, recentDraws: new Set() });
    u("game");
  }, [J]);

  useEffect(() => { Q(); }, [Q]);

  const addLog = useCallback(S => { l(A => ({ ...A, log: [S, ...A.log].slice(0, 5) })); }, []);
  const addFloating = useCallback((S, A, G, w) => { h(ut => [...ut, { id: q.current++, x: S, y: A, value: G, kind: w }]); }, []);

  const handleCardClick = (S, A) => {
    if (a.phase === "draw" && A === "playerHand") {
      if (a.playerBoard.length >= 5) return addLog("Board Full!");
      const G = a.playerHand.find(w => w.id === S);
      l(w => ({ ...w, playerHand: w.playerHand.filter(ut => ut.id !== S), playerBoard: [...w.playerBoard, G], phase: "attack" }));
      addLog(`Played ${Me[G.rank] || G.rank} of ${G.suit}`);
    } else {
      Ku(zu?.id === S ? null : { id: S, zone: A });
    }
  };

  const nextTurn = () => {
    l(S => {
      const A = J(), G = A.splice(0, 5), w = A.splice(0, 5);
      return { ...S, playerHand: G, cpuHand: w, deck: A, turn: S.turn + 1, phase: "draw", log: [`Turn ${S.turn + 1} Start!`], selectedAttackers: new Set(), pendingAttackSide: null, recentDraws: new Set() };
    });
    L({ attackBuffs: {}, shields: {}, counter: {}, nullifyTarget: null, globalAttackDebuff: 0 });
  };

  if (!a) return null;

  return (
    <div className="app max-w-[1200px] mx-auto p-2 sm:p-4">
      <AnimatePresence>
        {c.map(S => (
          <S2 key={S.id} {...S} onComplete={() => h(A => A.filter(G => G.id !== S.id))} />
        ))}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        {/* CPU Hand */}
        <div className="flex justify-center gap-2 h-24 opacity-50">
          {a.cpuHand.map(S => <Mu key={S.id} isBack />)}
        </div>

        {/* CPU Board */}
        <div className="flex justify-center gap-4 min-h-[140px] border-b border-white/5 pb-4">
          {a.cpuBoard.map(S => (
            <Py key={S.id} card={S} side="cpu" effectiveAttack={K(S, false, "cpu")} onClick={() => handleCardClick(S.id, "cpuBoard")} />
          ))}
        </div>

        {/* Player Board */}
        <div className="flex justify-center gap-4 min-h-[140px] pt-4">
          {a.playerBoard.map(S => (
            <Py key={S.id} card={S} side="player" effectiveAttack={K(S, false, "player")} onClick={() => handleCardClick(S.id, "playerBoard")} />
          ))}
        </div>

        {/* Player Hand */}
        <div className="flex justify-center items-end h-40 relative px-10">
          {a.playerHand.map((S, A) => {
            const rot = (A - (a.playerHand.length - 1) / 2) * 10;
            const ty = Math.abs(rot) * 0.5;
            return (
              <div key={S.id} style={{ transform: `rotate(${rot}deg) translateY(${ty}px)`, marginLeft: A === 0 ? 0 : -40 }} className="relative z-10">
                <Mu card={S} isSelected={zu?.id === S.id} onClick={() => handleCardClick(S.id, "playerHand")} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating HUD */}
      <AnimatePresence>
        {zu && selectedHudCard && hudPos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: hudPos.placement === "top" ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[300] pointer-events-none bg-bg/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-3 flex flex-col gap-1"
            style={{
              width: "180px",
              left: hudPos.left,
              top: hudPos.top,
              bottom: hudPos.bottom,
              transform: "translateX(-50%)"
            }}
          >
            <div className="text-[10px] uppercase tracking-widest text-muted/60 font-black mb-1">
              {zu.zone === "playerHand" ? "Play Preview" : zu.zone === "cpuBoard" ? "Enemy Unit" : "Your Unit"}
            </div>
            <div className="text-sm font-black mb-2">
              {Me[selectedHudCard.rank] || selectedHudCard.rank} {Xe[selectedHudCard.suit]}
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-good font-black">HP {selectedHudCard.hp} ({formatHudBonus(selectedHudCard.bonusHp)})</div>
              <div className="text-gold font-black">ATK {selectedHudCard.atk} ({formatHudBonus(selectedHudCard.bonusAtk)})</div>
              <div className="text-blue-300 font-black">{U(selectedHudCard).label}</div>
              <div className="text-muted leading-relaxed">{U(selectedHudCard).desc}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <button onClick={nextTurn} className="bg-gold text-bg font-black px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
          END TURN
        </button>
        <button onClick={Q} className="bg-white/10 text-white font-black px-4 py-2 rounded-full text-sm backdrop-blur-sm">
          RESTART
        </button>
      </div>

      {/* Log */}
      <div className="fixed bottom-4 left-4 max-w-[200px] pointer-events-none">
        {a.log.map((S, A) => (
          <div key={A} className="text-[10px] font-bold text-white/40 mb-1 last:text-white/100 last:text-xs">
            {S}
          </div>
        ))}
      </div>
    </div>
  );
}

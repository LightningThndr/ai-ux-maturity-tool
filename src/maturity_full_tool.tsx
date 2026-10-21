import { useState, type ReactNode } from "react";
import "./maturity_full_tool.css";
import { archetypeIconMap } from "./assets/icons/archetype-icons";
import futureUxLogo from "./assets/futureux-logo.png";
import {
  FACTORS, LEVELS, ROLES, PRODUCT_LAYER, SOCIETY_LAYER, ARCHETYPES, NASCENT_HARD, NASCENT_SOFT,
  type Archetype, type Factor, type FactorId, type LayerId, type Skill,
} from "./maturity_data";
import { FEEDBACK_ENDPOINT, FEEDBACK_VERSION, sendFeedback } from "./feedback";

type Scores = Partial<Record<FactorId, number>>;
type LevelMeta = typeof LEVELS[number];
type FeedbackStatus = "idle" | "sending" | "sent" | "error" | "unconfigured";

// Five pyramid layers — Society unlocks at Level 5
const PYRAMID_LAYERS = [
  {id:"self",     label:"Oneself",            minLevel:1},
  {id:"teams",    label:"UX & Product Teams", minLevel:1},
  {id:"orgs",     label:"Organizations",      minLevel:1},
  {id:"products", label:"AI Products",        minLevel:1},
  {id:"society",  label:"Society",            minLevel:SOCIETY_LAYER.minLevel},
];

const ACCURACY_LABELS = ["Not at all accurate","Slightly accurate","Somewhat accurate","Mostly accurate","Very accurate"];

const pad = (n: number) => String(n).padStart(2,"0");

// ── HELPERS ───────────────────────────────────────────────────────────────

const score = (scores: Scores, id: FactorId) => scores[id] ?? 0;

function getComposite(scores: Scores) {
  return FACTORS.reduce((s,f) => s + score(scores,f.id)*f.weight, 0);
}
function getLevelMeta(c: number): LevelMeta {
  return LEVELS.find(l => c < l.level + 0.75) || LEVELS[4];
}
function getPriorityFactor(scores: Scores) {
  return FACTORS.reduce((best,f) => {
    const d  = (5-score(scores,f.id))*f.weight;
    const bd = (5-score(scores,best.id))*best.weight;
    return d > bd ? f : best;
  });
}
function getArchetype(scores: Scores): Archetype | "nascent" {
  const composite = getComposite(scores);
  const ids  = FACTORS.map(f=>f.id);
  const vals = ids.map(id=>score(scores,id));
  const max = Math.max(...vals), min = Math.min(...vals);
  // Every factor tied for highest/lowest counts, so list order never decides the archetype
  const highs = ids.filter(id=>score(scores,id)===max);
  const lows  = ids.filter(id=>score(scores,id)===min);
  const gap = max-min;
  const highCount = ids.filter(id=>score(scores,id)>=3.5).length;
  const lowCount  = ids.filter(id=>score(scores,id)<=2.5).length;
  const siloed   = ARCHETYPES.find(a=>a.isSiloed)!;
  const balanced = ARCHETYPES.find(a=>a.isBalanced)!;
  const paired   = ARCHETYPES.filter(a=>!a.isSiloed&&!a.isBalanced);
  if (composite <= 1.74 && gap < 1.5) return "nascent";
  if (highCount===1 && lowCount>=3)    return siloed;
  if (gap < 1.5)                       return balanced;
  const weight = (id?: FactorId) => FACTORS.find(f=>f.id===id)?.weight ?? 0;
  // Among ties, the heavier low factor matters most (it drives the priority gap)
  const rank = (a: Archetype) => weight(a.low)*10 + weight(a.high);
  const byRank = (a: Archetype, b: Archetype) => rank(b)-rank(a);
  const exact = paired.filter(a=>highs.includes(a.high!)&&lows.includes(a.low!)).sort(byRank)[0];
  if (exact) return exact;
  // No exact pair: match the real gap first, then the real strength
  const byLow = paired.filter(a=>lows.includes(a.low!))
    .sort((a,b)=>score(scores,b.high!)-score(scores,a.high!) || byRank(a,b))[0];
  if (byLow) return byLow;
  // Low Literacy has no archetype of its own yet; fall back on the strength
  return paired.filter(a=>highs.includes(a.high!)).sort(byRank)[0] || balanced;
}

function RadarChart({scores}: {scores: Scores}) {
  const cx=120,cy=120,r=85,n=FACTORS.length;
  const ang=FACTORS.map((_,i)=>(Math.PI*2*i)/n-Math.PI/2);
  const pt=(a:number,v:number)=>[cx+r*(v/5)*Math.cos(a),cy+r*(v/5)*Math.sin(a)];
  return (
    <svg viewBox="-30 0 300 240" className="radar-svg" role="img" aria-label="Radar chart of factor scores">
      {[1,2,3,4,5].map(lv=><polygon key={lv} points={FACTORS.map((_,i)=>pt(ang[i],lv).join(",")).join(" ")} fill="none" stroke="rgba(60,151,212,0.22)" strokeDasharray={lv===5?undefined:"2 3"} strokeWidth={lv===5?1:0.8}/>)}
      {FACTORS.map((_,i)=>{const [x,y]=pt(ang[i],5);return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(60,151,212,0.22)" strokeWidth={0.8}/>;  })}
      <polygon points={FACTORS.map((f,i)=>pt(ang[i],score(scores,f.id)).join(",")).join(" ")} fill="rgba(60,151,212,0.14)" stroke="#3C97D4" strokeWidth={1.6}/>
      {FACTORS.map((f,i)=>{const [x,y]=pt(ang[i],score(scores,f.id));return <circle key={f.id} cx={x} cy={y} r={4.5} fill={f.color} stroke="white" strokeWidth={1.4}/>;  })}
      {FACTORS.map((f,i)=>{const [lx,ly]=pt(ang[i],5.8);const a=lx<cx-8?"end":lx>cx+8?"start":"middle";return <text key={f.id} x={lx} y={ly+3} textAnchor={a} fontSize={8} fill={f.color} fontFamily="Space Mono, monospace" fontWeight="700">{f.short.toUpperCase()}</text>;})}
    </svg>
  );
}

// FutureUX maturity scale: past stages dim, current stage haloed, future stages faint
function MaturityScale({active}: {active: number}) {
  return (
    <div className="maturity-h" data-active={active}>
      <div className="maturity-rule"/>
      <div className="maturity-track">
        {LEVELS.map(l=>(
          <div key={l.level} className={`m-stage${l.level===active?" is-active":l.level<active?" is-past":""}`}>
            <div className="m-node">{l.level}</div>
            <div className="m-meta">
              <span className="m-num">Stage {pad(l.level)}</span>
              <span className="m-name">{l.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Eyebrow({children}: {children: ReactNode}) {
  return <p className="eyebrow">{children}</p>;
}

// ── FACTOR PAGE ───────────────────────────────────────────────────────────

interface FactorPageProps {
  factor: Factor;
  index: number;
  value?: number;
  unsure: boolean;
  onScore: (v: number) => void;
  onUnsure: (v: boolean) => void;
}

function FactorPage({factor:f, index, value, unsure, onScore, onUnsure}: FactorPageProps) {
  return (
    <div className="factor-page">
      <header className="page-header">
        <Eyebrow>Factor {pad(index+1)} / {pad(FACTORS.length)} · {Math.round(f.weight*100)}% weight</Eyebrow>
        <h1 className="page-title"><span className="factor-swatch" style={{background:f.color}}/>{f.name}</h1>
        <p className="page-lede">{f.subtext}</p>
      </header>

      <section className="card question-card">
        <span className="card-label">The question</span>
        <h2 className="question-headline">{f.question.headline}</h2>
        <p className="question-leadin">{f.question.leadIn}</p>
        <ul className="question-probes">
          {f.question.probes.map((p,i)=><li key={i}>{p}</li>)}
        </ul>
        <details className="subfactor-details">
          <summary>What this factor covers</summary>
          <div className="subfactor-list">
            {f.subfactors.map(sf=>(
              <div key={sf.name} className="subfactor-item">
                <span className="subfactor-name">{sf.name}</span>
                <span>{sf.desc}</span>
              </div>
            ))}
          </div>
        </details>
      </section>

      <section>
        <h3 className="field-label">Which best describes what is actually true most of the time?</h3>
        <div className="level-options" role="radiogroup" aria-label={f.name+" level"}>
          {LEVELS.map(l=>{
            const selected = value===l.level;
            return (
              <button key={l.level} role="radio" aria-checked={selected} onClick={()=>onScore(l.level)}
                className={`level-option${selected?" selected":""}`}>
                <span className="m-node">{l.level}</span>
                <span className="level-option-body">
                  <span className="level-option-label">{l.label}</span>
                  <span className="level-option-text">{f.hallmarks[l.level]}</span>
                </span>
              </button>
            );
          })}
        </div>
        <label className="unsure-row">
          <input type="checkbox" checked={unsure} onChange={e=>onUnsure(e.target.checked)}/>
          <span>I'm not sure. This is my best guess from where I sit.</span>
        </label>
      </section>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────

const STEP_KEYS   = ["assess","results","archetype","skills"];
const STEP_LABELS = ["Assess","Results","Archetype","Skills"];

export default function App() {
  const [scores,    setScores]    = useState<Scores>({});
  const [unsure,    setUnsure]    = useState<Partial<Record<FactorId, boolean>>>({});
  const [role,      setRole]      = useState<string|null>(null);
  const [step,      setStep]      = useState("assess");
  const [page,      setPage]      = useState(0); // 0 = intro, 1..5 = factor pages
  const [skillTab,  setSkillTab]  = useState("hard");
  const [layer,     setLayer]     = useState("self");
  const [accuracy,  setAccuracy]  = useState<number|null>(null);
  const [comments,  setComments]  = useState("");
  const [fbStatus,  setFbStatus]  = useState<FeedbackStatus>("idle");

  const allScored   = FACTORS.every(f=>scores[f.id]!==undefined);
  const scoredCount = FACTORS.filter(f=>scores[f.id]!==undefined).length;
  const composite   = allScored ? getComposite(scores) : null;
  const levelMeta   = composite!=null ? getLevelMeta(composite) : null;
  const archetype   = allScored ? getArchetype(scores) : null;
  const sortedF     = allScored ? [...FACTORS].sort((a,b)=>score(scores,b.id)-score(scores,a.id)) : [];
  const priorityF   = allScored ? getPriorityFactor(scores) : null;
  const nextLvl     = levelMeta ? Math.min(levelMeta.level+1,5) : null;
  const isNascent   = archetype==="nascent";
  const archName    = archetype==="nascent" ? "Nascent" : archetype?.name ?? "";
  const roleMeta    = ROLES.find(r=>r.id===role);
  const unsureF     = FACTORS.filter(f=>unsure[f.id]);

  const reset = ()=>{
    setScores({});setUnsure({});setRole(null);setStep("assess");setPage(0);setSkillTab("hard");setLayer("self");
    setAccuracy(null);setComments("");setFbStatus("idle");window.scrollTo?.(0,0);
  };
  const canNav = (s: string) => s==="assess"||(allScored&&["results","archetype","skills"].includes(s));
  const goTo = (s: string) => { setStep(s); window.scrollTo?.(0,0); };
  const goPage = (p: number) => { setPage(p); window.scrollTo?.(0,0); };

  const submitFeedback = async () => {
    if (!accuracy || !levelMeta || composite==null || !priorityF) return;
    if (!FEEDBACK_ENDPOINT) { setFbStatus("unconfigured"); return; }
    setFbStatus("sending");
    try {
      await sendFeedback({
        submittedAt: new Date().toISOString(),
        version: FEEDBACK_VERSION,
        role: roleMeta?.label ?? null,
        scores: Object.fromEntries(FACTORS.map(f=>[f.id, scores[f.id]])),
        notSure: unsureF.map(f=>f.name),
        composite: Number(composite.toFixed(2)),
        level: levelMeta.level,
        archetype: archName,
        priorityGap: priorityF.name,
        accuracy,
        comments: comments.trim(),
      });
      setFbStatus("sent");
    } catch {
      setFbStatus("error");
    }
  };

  const currentFactor = page>0 ? FACTORS[page-1] : null;

  const isFactorLayer = layer==="self"||layer==="teams"||layer==="orgs";
  const priorityScore = priorityF ? score(scores,priorityF.id) : 0;
  const currentSkill: Skill | null = priorityF && isFactorLayer ? priorityF.levelSkills[layer as LayerId][priorityScore] : null;
  const stretchSkill: Skill | null = priorityF && isFactorLayer && priorityScore<5 ? priorityF.levelSkills[layer as LayerId][priorityScore+1] : null;

  const archSkills = archetype && archetype!=="nascent"
    ? (skillTab==="hard" ? archetype.hard : archetype.soft)
    : (skillTab==="hard" ? NASCENT_HARD   : NASCENT_SOFT);

  // Gap analysis questions — computed as plain array before JSX
  let gapQ: {q:string; label:string; factor:Factor}[] = [];
  if (allScored && priorityF && levelMeta) {
    if (isNascent) {
      gapQ = [
        {q:"Priority",   label:"AI-Native Process carries the most weight, and AI-UX Strategy gets UX into the decisions. What is one AI product decision in the next 90 days where UX should be involved earlier?", factor:FACTORS[0]},
        {q:"Risk",       label:"What specifically gets worse for users, your team, or the organization if all five factors stay at Level 1 for the next 12 months?",                        factor:FACTORS[0]},
        {q:"First step", label:"What is one concrete action — within your control, doable in two weeks — that starts to move Process or Strategy forward?",                                factor:FACTORS[1]}
      ];
    } else {
      gapQ = [
        {q:"Leverage",   label:"Your highest factor is your foothold. How might you use your strength to create momentum in your priority gap factor?",                                     factor:sortedF[0]||FACTORS[0]},
        {q:"Risk",       label:"What specifically gets worse for users, your team, or the organization if you stay at Level "+levelMeta.level+" for the next 12 months?",                  factor:priorityF},
        {q:"First step", label:"What is the single most concrete action — within your control, doable in two weeks — that moves your priority gap factor toward the next level?",          factor:priorityF}
      ];
    }
  }

  // ── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div className="maturity-container">

      {/* Step nav */}
      <nav className="step-nav" aria-label="Assessment steps">
        {STEP_KEYS.map((s,i)=>(
          <button key={s} onClick={()=>canNav(s)&&goTo(s)}
            className={`step-nav-button${step===s?" active":""}`}
            aria-current={step===s?"step":undefined}
            disabled={!canNav(s)}>
            <span className="step-nav-number">{pad(i+1)}</span>
            <span className="step-nav-label">{STEP_LABELS[i]}</span>
          </button>
        ))}
      </nav>

      {/* ── STEP 1: ASSESS ── */}
      {step==="assess" && (
        <div className="step-body" key={"assess-"+page}>
          {/* Page progress */}
          <div className="page-progress" aria-label="Assessment progress">
            <button className={`page-dot${page===0?" active":""}`} onClick={()=>goPage(0)}>Start</button>
            {FACTORS.map((f,i)=>{
              const done = scores[f.id]!==undefined;
              return (
                <button key={f.id} onClick={()=>goPage(i+1)}
                  className={`page-dot${page===i+1?" active":""}${done?" done":""}`}
                  aria-label={f.name+(done?" (answered)":"")}>
                  {done && <span className="page-dot-mark" aria-hidden="true">✓</span>}{f.short}
                </button>
              );
            })}
          </div>

          {page===0 && (
            <>
              <header className="page-header">
                <Eyebrow>AI-UX Maturity Assessment</Eyebrow>
                <h1 className="display-title">Where does your team <span className="accent">really stand?</span></h1>
                <p className="page-lede">You'll answer one question for each of five factors. Each question asks about a real, recent example, so you can answer it whatever your role. Then pick the description that matches what is <strong>actually true most of the time</strong>, not what you wish were true.</p>
                <p className="page-lede">If you can't see something from where you sit, tick <em>“I'm not sure”</em>. That's useful data, not a failure: when a team takes this together, the gaps between how leaders and practitioners answer are often the most useful finding.</p>
              </header>
              <section>
                <h3 className="field-label">Answer from where you sit. What best describes your role?</h3>
                <div className="role-options">
                  {ROLES.map(r=>(
                    <button key={r.id} onClick={()=>setRole(role===r.id?null:r.id)}
                      className={`role-option${role===r.id?" selected":""}`} aria-pressed={role===r.id}>
                      <span className="role-option-label">{r.label}</span>
                      <span className="role-option-desc">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </section>
              <div className="page-nav single">
                <button onClick={()=>goPage(1)} className="btn btn-filled">Start the assessment →</button>
              </div>
            </>
          )}

          {currentFactor && (
            <>
              <FactorPage factor={currentFactor} index={page-1}
                value={scores[currentFactor.id]} unsure={!!unsure[currentFactor.id]}
                onScore={v=>setScores(s=>({...s,[currentFactor.id]:v}))}
                onUnsure={v=>setUnsure(s=>({...s,[currentFactor.id]:v}))}/>
              <div className="page-nav">
                <button onClick={()=>goPage(page-1)} className="btn btn-ghost">← Back</button>
                {page<FACTORS.length ? (
                  <button onClick={()=>goPage(page+1)} disabled={scores[currentFactor.id]===undefined} className="btn btn-filled">
                    {scores[currentFactor.id]===undefined?"Choose a level to continue":"Next factor →"}
                  </button>
                ) : (
                  <button onClick={()=>goTo("results")} disabled={!allScored} className="btn btn-filled">
                    {allScored?"See my results →":"Answer all 5 factors ("+scoredCount+"/5)"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP 2: RESULTS ── */}
      {step==="results" && allScored && levelMeta && composite!=null && (
        <div className="step-body" key="results">
          <header className="page-header">
            <Eyebrow>Your results</Eyebrow>
            <h1 className="page-title">Level {levelMeta.level} · {levelMeta.label}</h1>
          </header>

          <section className="card level-card">
            <div className="level-score">
              <span className="level-number">{composite.toFixed(1)}</span>
              <span className="level-of">/ 5.0 composite</span>
            </div>
            <p className="level-headline">“{levelMeta.headline}”</p>
            <MaturityScale active={levelMeta.level}/>
          </section>

          <div className="results-grid">
            <section className="card radar-card">
              <span className="card-label">Factor profile</span>
              <RadarChart scores={scores}/>
              <div className="radar-list">
                {sortedF.map(f=>(
                  <div key={f.id} className="radar-item">
                    <span className="radar-dot" style={{background:f.color}}/>
                    <span className="radar-name">{f.name}{unsure[f.id]&&<span className="unsure-mark" title="Marked as not sure"> ?</span>}</span>
                    <span className="radar-scale">{[1,2,3,4,5].map(v=><span key={v} className="scale-dot" style={{background:v<=score(scores,f.id)?f.color:undefined}}/>)}</span>
                    <span className="radar-score" style={{color:f.color}}>{scores[f.id]}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="card calc-table">
              <span className="card-label">Weighted calculation</span>
              {FACTORS.map(f=>(
                <div key={f.id} className="calc-row">
                  <span className="calc-label"><span className="calc-dot" style={{background:f.color}}/>{f.name}</span>
                  <span className="calc-value">{scores[f.id]} × {f.weight} = {(score(scores,f.id)*f.weight).toFixed(2)}</span>
                </div>
              ))}
              <div className="calc-total">
                <span>Composite</span><span>{composite.toFixed(2)}</span>
              </div>
            </section>
          </div>

          {priorityF && (
            <section className="card">
              <span className="card-label">Priority gap · highest weighted deficit</span>
              <div className="priority-items">
                {[sortedF[0],priorityF].map((f,idx)=>(
                  <div key={f.id+""+idx} className="priority-item" style={{background:f.bg}}>
                    <span className="priority-kind" style={{color:f.textDark}}>{idx===0?"Leverage":"Priority gap"}</span>
                    <span className="priority-name">{f.name}</span>
                    <span className="priority-score" style={{color:f.color}}>{scores[f.id]}</span>
                    <span className="priority-weight">{Math.round(f.weight*100)}% weight</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(roleMeta || unsureF.length>0) && (
            <section className="card">
              <span className="card-label">Confidence</span>
              {roleMeta && <p className="evidence-row">Answered as: <strong>{roleMeta.label}</strong></p>}
              {unsureF.length>0 && (
                <p className="evidence-row">Marked “not sure”: <strong>{unsureF.map(f=>f.name).join(", ")}</strong>. Check these with colleagues in other roles before acting on them.</p>
              )}
            </section>
          )}

          <div className="page-nav single">
            <button onClick={()=>goTo("archetype")} className="btn btn-filled">See my archetype →</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: ARCHETYPE ── */}
      {step==="archetype" && allScored && levelMeta && archetype && (
        <div className="step-body" key="archetype">
          <header className="page-header">
            <Eyebrow>Your {isNascent?"profile":"archetype"} · Level {levelMeta.level} · {levelMeta.label}</Eyebrow>
          </header>

          {archetype==="nascent" ? (
            <section className="card archetype-card">
              <div className="archetype-icon">{archetypeIconMap["Nascent"]}</div>
              <h1 className="archetype-name">Nascent — building the foundation</h1>
              <p className="body-text">Your scores are uniformly low across all five factors. At this stage, no single archetype applies because no factor stands out as either a leverage point or a vulnerability. Every factor needs investment, but not equally.</p>
              <div className="archetype-content">
                <div className="archetype-box">
                  <span className="card-label">Where to start</span>
                  <p>Focus on <strong>AI-Native Process</strong> and <strong>AI-UX Strategy</strong> first. Process carries the highest weight (25%), and Strategy is what gets UX into the decisions that shape everything else.</p>
                </div>
                <div className="archetype-box">
                  <span className="card-label">First move</span>
                  <p>Identify one upcoming AI product decision where UX could have been involved earlier. Make a specific, concrete case for inclusion. One upstream win begins the pattern.</p>
                </div>
              </div>
              <p className="archetype-description">All five factors are uniformly low. This is a starting point, not a verdict — and it is more common than most practitioners admit when assessing honestly. The core tension is that when everything is low, it is tempting to try to fix everything at once — which means fixing nothing effectively. The development need is sequencing, not breadth.</p>
            </section>
          ) : (
            <section className="card archetype-card">
              <div className="archetype-icon">
                {archetypeIconMap[archetype.name as keyof typeof archetypeIconMap] ?? <span className="archetype-glyph">{archetype.icon}</span>}
              </div>
              <h1 className="archetype-name">{archetype.name}</h1>
              <p className="archetype-tension">{archetype.tension}</p>
              {archetype.high && archetype.low && (
                <div className="archetype-tags">
                  <span className="tag">High · {FACTORS.find(f=>f.id===archetype.high)?.name}</span>
                  <span className="tag tag-muted">Low · {FACTORS.find(f=>f.id===archetype.low)?.name}</span>
                </div>
              )}
              <div className="archetype-content">
                <div className="archetype-box">
                  <span className="card-label">Core tension</span>
                  <p className="italic">“{archetype.tension}”</p>
                </div>
                <div className="archetype-box">
                  <span className="card-label">First move</span>
                  <p>{archetype.move}</p>
                </div>
              </div>
              <p className="archetype-description">{archetype.description}</p>
            </section>
          )}

          <section className="card card-flush">
            <div className="card-head"><span className="card-label">Gap analysis questions</span></div>
            {gapQ.map((item,i)=>(
              <div key={i} className="question-item">
                <span className="tag" style={{color:item.factor.textDark,background:item.factor.bg,borderColor:"transparent"}}>{item.q}</span>
                <p className="question-text">{item.label}</p>
              </div>
            ))}
          </section>

          <div className="page-nav single">
            <button onClick={()=>goTo("skills")} className="btn btn-filled">See my skills recommendations →</button>
          </div>
        </div>
      )}

      {/* ── STEP 4: SKILLS ── */}
      {step==="skills" && allScored && priorityF && levelMeta && archetype && (
        <div className="step-body" key="skills">
          <header className="page-header">
            <Eyebrow>Skills to develop</Eyebrow>
            <div className="context-strip">
              <div className="context-item"><span className="card-label">Composite level</span><span className="context-value">Level {levelMeta.level} · {levelMeta.label}</span></div>
              <div className="context-item"><span className="card-label">{isNascent?"Profile":"Archetype"}</span><span className="context-value">{isNascent?"Nascent — all factors low":archName}</span></div>
              <div className="context-item"><span className="card-label">Priority gap</span><span className="context-value">{priorityF.name} (L{priorityScore} · {Math.round(priorityF.weight*100)}%)</span></div>
            </div>
            <p className="page-lede">
              {isNascent
                ? "Priority is determined by weighted deficit. With all factors low, "+priorityF.name+" surfaces first because its "+Math.round(priorityF.weight*100)+"% weight means improving it moves your composite score most. Track 1 shows foundational skills. Track 2 shows the skills for your priority gap factor at your current level and the next, plus the AI Products layer, which applies the Trust Stack to what you ship. The Society layer unlocks at Level 5."
                : "Track 1 targets your archetype's gap dynamic. Track 2 shows the skills for your priority gap factor at your current level and the next, for yourself, your team, and your organization, plus the AI Products layer, which applies the Trust Stack to what you ship."}
            </p>
          </header>

          {/* ── TRACK 1: ARCHETYPE / FOUNDATIONAL ── */}
          <section className="card card-flush">
            <div className="card-head">
              <span className="card-label">{isNascent?"Track 01 — Foundational skills":"Track 01 — Archetype skills"}</span>
              <div className="segmented" role="tablist">
                {["hard","soft"].map(t=>(
                  <button key={t} role="tab" aria-selected={skillTab===t} onClick={()=>setSkillTab(t)}
                    className={`segmented-btn${skillTab===t?" active":""}`}>
                    {t==="hard"?"Hard skills":"Soft skills"}
                  </button>
                ))}
              </div>
            </div>
            {archSkills.map((sk,i)=>(
              <div key={i} className="skill-item">
                <span className="skill-number">{pad(i+1)}</span>
                <div>
                  <h3 className="skill-name">{sk.s}</h3>
                  <p className="skill-desc">{sk.w}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ── PYRAMID LAYER TABS + TRACK 2 ── */}
          <section className="card card-flush">
            <div className="card-head"><span className="card-label">Track 02 — Priority gap & layer skills</span></div>

            <div className="pyramid-tabs" role="tablist">
              {PYRAMID_LAYERS.map(pl=>{
                const locked = levelMeta.level < pl.minLevel;
                return (
                  <button key={pl.id} role="tab" aria-selected={layer===pl.id} onClick={()=>!locked&&setLayer(pl.id)}
                    className={`pyramid-tab${layer===pl.id?" active":""}${locked?" locked":""}`}
                    disabled={locked}>
                    {pl.label}
                    {locked&&<span className="pyramid-tab-sublevel">L{pl.minLevel}+</span>}
                  </button>
                );
              })}
            </div>

            {/* Factor layers: Oneself / Teams / Orgs */}
            {isFactorLayer && (
              <div className="pyramid-content">
                <div className="track-section">
                  <span className="track-header">Current level · {priorityF.name} at L{priorityScore}</span>
                  {currentSkill ? (
                    <>
                      <h3 className="track-title">{currentSkill.name}</h3>
                      <p className="track-desc">{currentSkill.desc}</p>
                    </>
                  ) : <p className="track-desc">No skill data for this combination.</p>}
                </div>
                <div className="track-section">
                  <span className="track-header">Stretch · {priorityF.name} at L{Math.min(priorityScore+1,5)}</span>
                  {stretchSkill ? (
                    <>
                      <h3 className="track-title">{stretchSkill.name}</h3>
                      <p className="track-desc">{stretchSkill.desc}</p>
                    </>
                  ) : <p className="track-desc">Already at maximum level for this factor.</p>}
                </div>
              </div>
            )}

            {/* AI Products layer — the Trust Stack, open at every level */}
            {layer==="products" && (()=>{
              const cur = PRODUCT_LAYER.skills[levelMeta.level];
              const nxt = nextLvl && nextLvl>levelMeta.level ? PRODUCT_LAYER.skills[nextLvl] : null;
              const further = [4,5].filter(l=>l<=levelMeta.level).flatMap(l=>PRODUCT_LAYER.skills[l].further ?? []);
              return (
                <div className="pyramid-content">
                  <div className="horizon-box">
                    <span className="card-label">The Trust Stack · Reliability → Honesty → Transparency → Agency → Benevolence</span>
                    <p className="horizon-content">{PRODUCT_LAYER.aspiration}</p>
                  </div>
                  <div className="track-section">
                    <span className="track-header">Current level · L{levelMeta.level} · {cur.stack}</span>
                    <h3 className="track-title">{cur.name}</h3>
                    <p className="track-desc">{cur.desc}</p>
                  </div>
                  {nxt && (
                    <div className="track-section">
                      <span className="track-header">Stretch · L{nextLvl} · {nxt.stack}</span>
                      <h3 className="track-title">{nxt.name}</h3>
                      <p className="track-desc">{nxt.desc}</p>
                    </div>
                  )}
                  {further.length>0 && (
                    <div className="track-section">
                      <span className="track-header">Going further</span>
                      {further.map(sk=>(
                        <div key={sk.name} className="further-item">
                          <h3 className="track-title">{sk.name}</h3>
                          <p className="track-desc">{sk.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Society layer */}
            {layer==="society" && (
              <div className="pyramid-content">
                <div className="horizon-box">
                  <span className="card-label">Horizon unlocked at Level 5</span>
                  <p className="horizon-content">{SOCIETY_LAYER.aspiration}</p>
                </div>
                <div className="track-section">
                  <span className="track-header">Key skill</span>
                  <h3 className="track-title">{SOCIETY_LAYER.skill.name}</h3>
                  <p className="track-desc">{SOCIETY_LAYER.skill.desc}</p>
                </div>
                <div className="track-section">
                  <span className="track-header">Stretch</span>
                  <h3 className="track-title">{SOCIETY_LAYER.skill.stretch.name}</h3>
                  <p className="track-desc">{SOCIETY_LAYER.skill.stretch.desc}</p>
                </div>
                <span className="card-label society-count">{SOCIETY_LAYER.societalSkills.length} societal capability areas</span>
                {SOCIETY_LAYER.societalSkills.map(sk=>(
                  <div key={sk.category} className="society-item">
                    <h3 className="track-title">{sk.category}</h3>
                    <p className="track-desc">{sk.desc}</p>
                    <p className="society-item-ref">{sk.ref}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="page-nav">
            <button onClick={reset} className="btn btn-ghost">↺ Start again</button>
            <button onClick={()=>goTo("feedback")} className="btn btn-filled">Share feedback →</button>
          </div>
        </div>
      )}

      {/* ── FINAL STEP: FEEDBACK (not in the top nav) ── */}
      {step==="feedback" && allScored && (
        <div className="step-body" key="feedback">
          <header className="page-header">
            <Eyebrow>Final step · Feedback</Eyebrow>
            <h1 className="page-title">How did we do?</h1>
            <p className="page-lede">Your feedback helps improve the assessment for everyone who takes it next.</p>
          </header>

          {fbStatus==="sent" ? (
            <section className="card form-frame">
              <span className="card-label">Received</span>
              <h2 className="question-headline">Thank you. Your feedback has been sent.</h2>
              <p className="body-text">You can go back to your results at any time, or start a new assessment.</p>
              <div className="page-nav">
                <button onClick={()=>goTo("skills")} className="btn btn-ghost">← Back to skills</button>
                <button onClick={reset} className="btn btn-filled">Start again</button>
              </div>
            </section>
          ) : (
            <section className="card form-frame">
              <fieldset className="fieldset">
                <legend className="field-label">How accurately did this assessment describe your situation? <span className="req">*</span></legend>
                <div className="rating" role="radiogroup" aria-label="Accuracy rating">
                  {ACCURACY_LABELS.map((lbl,i)=>{
                    const v=i+1, selected=accuracy===v;
                    return (
                      <button key={v} role="radio" aria-checked={selected} aria-label={v+" – "+lbl}
                        onClick={()=>setAccuracy(v)} className={`rating-option${selected?" selected":""}`}>
                        <span className="m-node">{v}</span>
                        <span className="rating-label">{lbl}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="field">
                <label className="field-label" htmlFor="fb-comments">Any suggestions or comments? <span className="optional-tag">(optional)</span></label>
                <textarea id="fb-comments" className="textarea" rows={5} maxLength={2000} value={comments}
                  onChange={e=>setComments(e.target.value)}
                  placeholder="What felt right, what felt off, and what would make this more useful to you?"/>
              </div>

              <p className="field-helper">When you submit, your rating and comments are sent to FutureUX together with your anonymous results (role, factor scores, level, and archetype). No names or contact details are collected.</p>

              {fbStatus==="error" && <p className="field-helper error" role="alert">Something went wrong and your feedback wasn't sent. Please check your connection and try again.</p>}
              {fbStatus==="unconfigured" && <p className="field-helper error" role="alert">Feedback collection isn't switched on for this version yet, so nothing was sent.</p>}

              <div className="page-nav">
                <button onClick={()=>goTo("skills")} className="btn btn-ghost">← Back</button>
                <button onClick={submitFeedback} disabled={!accuracy||fbStatus==="sending"} className="btn btn-filled">
                  {fbStatus==="sending"?"Sending…":!accuracy?"Choose a rating to submit":"Submit feedback"}
                </button>
              </div>
            </section>
          )}
        </div>
      )}

      <footer className="site-footer">
        <p className="site-footer-text">© 2026 Angela Pesta · FutureUX · <a href="https://futureux.org" target="_blank" rel="noopener noreferrer">futureux.org</a> · all rights reserved · Personal and internal organizational use permitted with attribution. Other uses require permission.</p>
        <a href="https://futureux.org" target="_blank" rel="noopener noreferrer" className="site-footer-logo">
          <img src={futureUxLogo} alt="FutureUX" width={369} height={62}/>
        </a>
      </footer>
    </div>
  );
}

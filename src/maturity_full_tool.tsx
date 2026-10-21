import { useState } from "react";
import "./maturity_full_tool.css";
import { archetypeIconMap } from "./assets/icons/archetype-icons";
import futureUxLogo from "./assets/futureux-logo.png";
import {
  FACTORS, LEVELS, ROLES, PRODUCT_LAYER, SOCIETY_LAYER, ARCHETYPES, NASCENT_HARD, NASCENT_SOFT,
  type Archetype, type Factor, type FactorId, type LayerId, type Skill,
} from "./maturity_data";

type Scores = Partial<Record<FactorId, number>>;
type LevelMeta = typeof LEVELS[number];

// Five pyramid layers — Society unlocks at Level 5
const PYRAMID_LAYERS = [
  {id:"self",     label:"Oneself",            color:"#534AB7", minLevel:1},
  {id:"teams",    label:"UX & Product Teams", color:"#750192", minLevel:1},
  {id:"orgs",     label:"Organizations",      color:"#0c7892", minLevel:1},
  {id:"products", label:"AI Products",        color:"#1E7E4E", minLevel:1},
  {id:"society",  label:"Society",            color:"#2558C8", minLevel:SOCIETY_LAYER.minLevel},
];

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
  const ids = FACTORS.map(f=>f.id);
  const maxF = ids.reduce((a,b)=>score(scores,a)>=score(scores,b)?a:b);
  const minF = ids.reduce((a,b)=>score(scores,a)<=score(scores,b)?a:b);
  const gap = score(scores,maxF)-score(scores,minF);
  const highCount = ids.filter(id=>score(scores,id)>=3.5).length;
  const lowCount  = ids.filter(id=>score(scores,id)<=2.5).length;
  const siloed   = ARCHETYPES.find(a=>a.isSiloed)!;
  const balanced = ARCHETYPES.find(a=>a.isBalanced)!;
  const paired   = ARCHETYPES.filter(a=>!a.isSiloed&&!a.isBalanced);
  if (composite <= 1.74 && gap < 1.5) return "nascent";
  if (highCount===1 && lowCount>=3)    return siloed;
  if (gap < 1.5)                       return balanced;
  return paired.find(a=>a.high===maxF&&a.low===minF)
    || paired.find(a=>a.high===maxF)
    || paired.find(a=>a.low===minF)
    || balanced;
}

function RadarChart({scores}: {scores: Scores}) {
  const cx=120,cy=120,r=85,n=FACTORS.length;
  const ang=FACTORS.map((_,i)=>(Math.PI*2*i)/n-Math.PI/2);
  const pt=(a:number,v:number)=>[cx+r*(v/5)*Math.cos(a),cy+r*(v/5)*Math.sin(a)];
  return (
    <svg viewBox="0 0 240 240" className="radar-svg">
      {[1,2,3,4,5].map(lv=><polygon key={lv} points={FACTORS.map((_,i)=>pt(ang[i],lv).join(",")).join(" ")} fill="none" stroke="#e2e8f0" strokeWidth={lv===5?1.2:0.6}/>)}
      {FACTORS.map((_,i)=>{const [x,y]=pt(ang[i],5);return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth={0.6}/>;  })}
      <polygon points={FACTORS.map((f,i)=>pt(ang[i],score(scores,f.id)).join(",")).join(" ")} fill="rgba(83,74,183,0.12)" stroke="#534AB7" strokeWidth={1.8}/>
      {FACTORS.map((f,i)=>{const [x,y]=pt(ang[i],score(scores,f.id));return <circle key={f.id} cx={x} cy={y} r={4.5} fill={f.color} stroke="white" strokeWidth={1.2}/>;  })}
      {FACTORS.map((f,i)=>{const [lx,ly]=pt(ang[i],5.8);const a=lx<cx-8?"end":lx>cx+8?"start":"middle";return <text key={f.id} x={lx} y={ly+3} textAnchor={a} fontSize={8} fill={f.color} fontWeight="500">{f.short}</text>;})}
    </svg>
  );
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
      <div className="factor-page-header" style={{borderLeftColor:f.color}}>
        <div className="factor-page-eyebrow" style={{color:f.color}}>Factor {index+1} of {FACTORS.length} · {Math.round(f.weight*100)}% weight</div>
        <div className="factor-page-name">{f.name}</div>
        <div className="factor-page-subtext">{f.subtext}</div>
      </div>

      <div className="question-card">
        <div className="question-headline">{f.question.headline}</div>
        <div className="question-leadin">{f.question.leadIn}</div>
        <ul className="question-probes">
          {f.question.probes.map((p,i)=><li key={i}>{p}</li>)}
        </ul>
        <details className="subfactor-details">
          <summary>What this factor covers</summary>
          <div className="subfactor-list">
            {f.subfactors.map(sf=>(
              <div key={sf.name} className="subfactor-item">
                <span className="subfactor-name">{sf.name}:</span> {sf.desc}
              </div>
            ))}
          </div>
        </details>
      </div>

      <div>
        <div className="options-label">Which best describes what is actually true most of the time?</div>
        <div className="level-options" role="radiogroup" aria-label={f.name+" level"}>
          {LEVELS.map(l=>{
            const selected = value===l.level;
            return (
              <button key={l.level} role="radio" aria-checked={selected} onClick={()=>onScore(l.level)}
                className={`level-option${selected?' selected':''}`}
                style={selected?{borderColor:f.color,background:f.bg}:undefined}>
                <span className="level-option-number" style={{background:selected?f.color:l.color}}>{l.level}</span>
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
      </div>
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

  const allScored   = FACTORS.every(f=>scores[f.id]!==undefined);
  const scoredCount = FACTORS.filter(f=>scores[f.id]!==undefined).length;
  const composite   = allScored ? getComposite(scores) : null;
  const levelMeta   = composite!=null ? getLevelMeta(composite) : null;
  const archetype   = allScored ? getArchetype(scores) : null;
  const sortedF     = allScored ? [...FACTORS].sort((a,b)=>score(scores,b.id)-score(scores,a.id)) : [];
  const priorityF   = allScored ? getPriorityFactor(scores) : null;
  const nextLvl     = levelMeta ? Math.min(levelMeta.level+1,5) : null;
  const isNascent   = archetype==="nascent";
  const roleMeta    = ROLES.find(r=>r.id===role);
  const unsureF     = FACTORS.filter(f=>unsure[f.id]);

  const reset = ()=>{setScores({});setUnsure({});setRole(null);setStep("assess");setPage(0);setSkillTab("hard");setLayer("self");};
  const canNav = (s: string) => s==="assess"||(allScored&&["results","archetype","skills"].includes(s));
  const goTo = (s: string) => { setStep(s); window.scrollTo?.(0,0); };
  const goPage = (p: number) => { setPage(p); window.scrollTo?.(0,0); };

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
      <div className="step-nav">
        {STEP_KEYS.map((s,i)=>(
          <button key={s} onClick={()=>canNav(s)&&goTo(s)}
            className={`step-nav-button${step===s?' active':''}${!canNav(s)?' disabled':''}`}
            disabled={!canNav(s)}>
            <div className="step-nav-number">{i+1}</div>
            {STEP_LABELS[i]}
          </button>
        ))}
      </div>

      {/* ── STEP 1: ASSESS ── */}
      {step==="assess" && (
        <div className="flex-col gap-2xl">
          {/* Page progress */}
          <div className="page-progress" aria-label="Assessment progress">
            <button className={`page-dot intro${page===0?' active':''}`} onClick={()=>goPage(0)}>Start</button>
            {FACTORS.map((f,i)=>{
              const done = scores[f.id]!==undefined;
              return (
                <button key={f.id} onClick={()=>goPage(i+1)}
                  className={`page-dot${page===i+1?' active':''}`}
                  style={{borderColor:page===i+1?f.color:undefined,background:done?f.color:undefined,color:done?"white":undefined}}
                  aria-label={f.name+(done?" (answered)":"")}>
                  {f.short}
                </button>
              );
            })}
          </div>

          {page===0 && (
            <div className="flex-col gap-2xl">
              <div className="intro-card">
                <div className="intro-title">AI-UX Maturity Assessment</div>
                <p className="text-md text-secondary line-height-relaxed">You'll answer one question for each of five factors. Each question asks about a real, recent example, so you can answer it whatever your role. Then pick the description that matches what is <strong>actually true most of the time</strong>, not what you wish were true.</p>
                <p className="text-md text-secondary line-height-relaxed">If you can't see something from where you sit, tick <em>“I'm not sure”</em>. That's useful data, not a failure: when a team takes this together, the gaps between how leaders and practitioners answer are often the most useful finding.</p>
              </div>
              <div>
                <div className="options-label">Answer from where you sit. What best describes your role?</div>
                <div className="role-options">
                  {ROLES.map(r=>(
                    <button key={r.id} onClick={()=>setRole(role===r.id?null:r.id)}
                      className={`role-option${role===r.id?' selected':''}`} aria-pressed={role===r.id}>
                      <span className="role-option-label">{r.label}</span>
                      <span className="role-option-desc">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={()=>goPage(1)} className="btn-primary btn-cta">Start →</button>
            </div>
          )}

          {currentFactor && (
            <>
              <FactorPage factor={currentFactor} index={page-1}
                value={scores[currentFactor.id]} unsure={!!unsure[currentFactor.id]}
                onScore={v=>setScores(s=>({...s,[currentFactor.id]:v}))}
                onUnsure={v=>setUnsure(s=>({...s,[currentFactor.id]:v}))}/>
              <div className="page-nav">
                <button onClick={()=>goPage(page-1)} className="btn-secondary">← Back</button>
                {page<FACTORS.length ? (
                  <button onClick={()=>goPage(page+1)} disabled={scores[currentFactor.id]===undefined} className="btn-primary">
                    {scores[currentFactor.id]===undefined?"Choose a level to continue":"Next factor →"}
                  </button>
                ) : (
                  <button onClick={()=>goTo("results")} disabled={!allScored} className="btn-primary">
                    {allScored?"See my results →":"Answer all 5 factors to continue ("+scoredCount+"/5)"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP 2: RESULTS ── */}
      {step==="results" && allScored && levelMeta && composite!=null && (
        <div className="flex-col gap-2xl">
          <div className="results-grid">
            {/* Radar */}
            <div className="grid-item radar-card">
              <div className="radar-label">Factor profile</div>
              <RadarChart scores={scores}/>
              <div className="flex-col gap-small" style={{width:"100%",marginTop:8}}>
                {sortedF.map(f=>(
                  <div key={f.id} className="radar-item">
                    <div className="radar-dot" style={{background:f.color}}/>
                    <div className="radar-name">{f.name}{unsure[f.id]&&<span className="unsure-mark" title="Marked as not sure"> ?</span>}</div>
                    <div className="radar-scale">{[1,2,3,4,5].map(v=><div key={v} className="scale-dot" style={{background:v<=score(scores,f.id)?f.color:"var(--color-border-tertiary)"}}/>)}</div>
                    <div className="radar-score" style={{color:f.color}}>{scores[f.id]}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Level + calc */}
            <div className="level-calc-section">
              <div className="level-card" style={{borderColor:levelMeta.color,borderWidth:"2px"}}>
                <div className="level-header" style={{color:levelMeta.color}}>Composite level</div>
                <div className="level-score">
                  <span className="level-number" style={{color:levelMeta.color}}>{composite.toFixed(1)}</span>
                  <span className="level-label"> Level {levelMeta.level}</span>
                </div>
                <div className="level-title">{levelMeta.label}</div>
                <div className="level-headline">“{levelMeta.headline}”</div>
                <div className="level-bar">{LEVELS.map(l=><div key={l.level} className="level-indicator" style={{background:l.level===levelMeta.level?levelMeta.color:"var(--color-border-tertiary)"}}/>)}</div>
              </div>
              <div className="calc-table">
                <div className="calc-header">Weighted calculation</div>
                {FACTORS.map(f=>(
                  <div key={f.id} className="calc-row">
                    <span className="calc-label"><span className="calc-dot" style={{background:f.color}}></span>{f.name}</span>
                    <span className="calc-value">{scores[f.id]}×{f.weight}={(score(scores,f.id)*f.weight).toFixed(2)}</span>
                  </div>
                ))}
                <div className="calc-total">
                  <span>Composite</span><span style={{color:levelMeta.color}}>{composite.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Priority gap */}
          {priorityF && (
            <div className="priority-gap">
              <div className="calc-header">Priority gap · highest weighted deficit</div>
              <div className="priority-items">
                {[sortedF[0],priorityF].map((f,idx)=>(
                  <div key={f.id+""+idx} className="priority-item" style={{background:f.bg,borderColor:f.color+"40"}}>
                    <div className="text-xs font-bold uppercase" style={{color:f.color}}>{idx===0?"Leverage":"Priority gap"}</div>
                    <div className="text-base font-bold mt-lg">{f.name}</div>
                    <div className="text-3xl font-bold" style={{color:f.color}}>{scores[f.id]}</div>
                    <div className="text-xs" style={{color:f.textDark}}>{Math.round(f.weight*100)}% weight</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Confidence & evidence */}
          {(roleMeta || unsureF.length>0) && (
            <div className="calc-table">
              <div className="calc-header">Confidence</div>
              {roleMeta && <div className="evidence-row">Answered as: <strong>{roleMeta.label}</strong></div>}
              {unsureF.length>0 && (
                <div className="evidence-row">Marked “not sure”: <strong>{unsureF.map(f=>f.name).join(", ")}</strong>. Check these with colleagues in other roles before acting on them.</div>
              )}
            </div>
          )}
          <button onClick={()=>goTo("archetype")} className="btn-primary">
            See my archetype →
          </button>
        </div>
      )}

      {/* ── STEP 3: ARCHETYPE ── */}
      {step==="archetype" && allScored && levelMeta && archetype && (
        <div className="flex-col gap-2xl">
          <div className="section-header search-result-header">
            <div>
              <div className="calc-header">Composite: Level {levelMeta.level} · {levelMeta.label}</div>
              <div className="level-bar" style={{marginTop:"4px"}}>{LEVELS.map(l=><div key={l.level} className="level-indicator" style={{background:l.level<=levelMeta.level?levelMeta.color:"var(--color-border-tertiary)"}}/>)}</div>
            </div>
          </div>

          {/* Archetype card */}
          {archetype==="nascent" ? (
            <div className="archetype-card">
              <div className="archetype-header">Your profile</div>
              <div className="archetype-icon-container">
                <span className="archetype-icon">{archetypeIconMap["Nascent"]}</span>
              </div>
              <div className="text-2xl font-bold mb-2xl">Nascent — building the foundation</div>
              <div className="text-md">Your scores are uniformly low across all five factors. At this stage, no single archetype applies because no factor stands out as either a leverage point or a vulnerability. Every factor needs investment, but not equally.</div>
              <div className="achievement-box">
                <div className="achievement-label">Where to start</div>
                <div className="achievement-content">Focus on <strong>AI-Native Process</strong> and <strong>AI-UX Strategy</strong> first. Process carries the highest weight (25%), and Strategy is what gets UX into the decisions that shape everything else.</div>
              </div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:8,padding:12}}>
                <div className="achievement-label">First move</div>
                <div className="text-md">Identify one upcoming AI product decision where UX could have been involved earlier. Make a specific, concrete case for inclusion. One upstream win begins the pattern.</div>
              </div>
              <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--color-border-tertiary)"}}>
                <div className="text-md" style={{lineHeight:1.7,color:"var(--color-text-secondary)"}}>All five factors are uniformly low. This is a starting point, not a verdict — and it is more common than most practitioners admit when assessing honestly. The core tension is that when everything is low, it is tempting to try to fix everything at once — which means fixing nothing effectively. The development need is sequencing, not breadth.</div>
              </div>
            </div>
          ) : (
            <div className="archetype-card">
              <div className="archetype-header">Your archetype</div>
              <div className="archetype-icon-container">
                <span className="archetype-icon">
                  {archetypeIconMap[archetype.name as keyof typeof archetypeIconMap] ?? <span className="archetype-glyph">{archetype.icon}</span>}
                </span>
              </div>
              <div className="archetype-details">
                <div>
                  <div className="archetype-name">{archetype.name}</div>
                  <div className="archetype-tension">{archetype.tension}</div>
                </div>
              </div>
              {archetype.high && archetype.low && (
                <div className="archetype-tags">
                  <span className="archetype-tag">High: {FACTORS.find(f=>f.id===archetype.high)?.name}</span>
                  <span className="archetype-tag">Low: {FACTORS.find(f=>f.id===archetype.low)?.name}</span>
                </div>
              )}
              <div className="archetype-content">
                <div className="archetype-box">
                  <div className="archetype-box-title">Core tension</div>
                  <div className="archetype-box-content italic">“{archetype.tension}”</div>
                </div>
                <div className="archetype-box">
                  <div className="archetype-box-title">First move</div>
                  <div className="archetype-box-content italic">{archetype.move}</div>
                </div>
              </div>
              <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--color-border-tertiary)"}}>
                <div className="text-md" style={{lineHeight:1.7,color:"var(--color-text-secondary)"}}>{archetype.description}</div>
              </div>
            </div>
          )}
          <div className="questions-container">
            <div className="questions-header">
              <div className="questions-header-title">Gap analysis questions</div>
            </div>
            {gapQ.map((item,i)=>(
              <div key={i} className="question-item">
                <div className="mb-md">
                  <span className="question-tag" style={{background:item.factor.bg,color:item.factor.textDark}}>{item.q}</span>
                </div>
                <div className="question-text">{item.label}</div>
              </div>
            ))}
          </div>

          <button onClick={()=>goTo("skills")} className="btn-primary">
            See my skills recommendations →
          </button>
        </div>
      )}

      {/* ── STEP 4: SKILLS ── */}
      {step==="skills" && allScored && priorityF && levelMeta && archetype && (
        <div className="flex-col gap-2xl">

          {/* Context strip */}
          <div className="flex-row gap-lg flex-wrap">
            <div className="context-item">
              <div className="context-label">Composite level</div>
              <div className="context-value">Level {levelMeta.level} · {levelMeta.label}</div>
            </div>
            <div className="context-item">
              <div className="context-label">Archetype</div>
              <div className="context-value">{archetype==="nascent"?"Nascent — all factors low":archetype.name}</div>
            </div>
            <div className="context-item">
              <div className="context-label">Priority gap</div>
              <div className="context-value">{priorityF.name} (L{priorityScore} · {Math.round(priorityF.weight*100)}% wt)</div>
            </div>
          </div>

          {/* Explanation */}
          <div className="explanation" style={{borderLeftColor:priorityF.color}}>
            {isNascent
              ? "Priority is determined by weighted deficit. With all factors low, "+priorityF.name+" surfaces first because its "+Math.round(priorityF.weight*100)+"% weight means improving it moves your composite score most. Track 1 shows foundational skills. Track 2 shows the skills for your priority gap factor at your current level and the next, plus the AI Products layer, which applies the Trust Stack to what you ship. The Society layer unlocks at Level 5."
              : "Track 1 targets your archetype's gap dynamic. Track 2 shows the skills for your priority gap factor at your current level and the next, for yourself, your team, and your organization, plus the AI Products layer, which applies the Trust Stack to what you ship."
            }
          </div>

          {/* ── TRACK 1: ARCHETYPE / FOUNDATIONAL ── */}
          <div className="skills-container">
            <div className="skills-header">
              <div className="skills-header-text">
                {isNascent?"Track 1 — Foundational skills (Process & Strategy first)":"Track 1 — Archetype skills"}
              </div>
              <div className="flex-row gap-small">
                {["hard","soft"].map(t=>(
                  <button key={t} onClick={()=>setSkillTab(t)}
                    className={`btn-tab${skillTab===t?' active':''}`}>
                    {t==="hard"?"Hard Skills":"Soft Skills"}
                  </button>
                ))}
              </div>
            </div>
            <div className="skills-content">
              {archSkills.map((sk,i)=>(
                <div key={i} className="skill-item">
                  <div className="skill-number">{i+1}</div>
                  <div>
                    <div className="skill-name">👉 {sk.s}</div>
                    <div className="skill-desc">{sk.w}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── PYRAMID LAYER TABS + TRACK 2 ── */}
          <div className="card" style={{borderColor:"var(--color-border-tertiary)",overflow:"hidden"}}>
            <div className="section-header stretch-default">
              <div className="skills-header-text">Track 2 — Priority gap & layer skills</div>
            </div>

            {/* Tabs */}
            <div className="pyramid-tabs">
              {PYRAMID_LAYERS.map(pl=>{
                const locked = levelMeta.level < pl.minLevel;
                return (
                  <button key={pl.id} onClick={()=>!locked&&setLayer(pl.id)}
                    className={`pyramid-tab${layer===pl.id?' active':''}${locked?' locked':''}`}
                    style={{color:locked?"var(--color-text-tertiary)":layer===pl.id?pl.color:"var(--color-text-secondary)"}}
                    disabled={locked}>
                    {pl.label}
                    {locked&&<div className="pyramid-tab-sublevel">L{pl.minLevel}+</div>}
                  </button>
                );
              })}
            </div>

            {/* Factor layers: Oneself / Teams / Orgs */}
            {isFactorLayer && (
              <div className="pyramid-content" style={{background:"var(--color-background-primary)"}}>
                <div className="track-section">
                  <div className="track-header" style={{color:priorityF.color}}>
                    Current level - Key Skills: {priorityF.name} at L{priorityScore}
                  </div>
                  {currentSkill ? (
                    <>
                      <div className="track-title">👉 {currentSkill.name}</div>
                      <div className="track-desc">{currentSkill.desc}</div>
                    </>
                  ) : <div className="track-desc">No skill data for this combination.</div>}
                </div>
                <div className="track-section">
                  <div className="track-header" style={{color:priorityF.color}}>
                    Next Level - Stretch Skills: {priorityF.name} at Level {Math.min(priorityScore+1,5)}
                  </div>
                  {stretchSkill ? (
                    <>
                      <div className="track-title">👉 {stretchSkill.name}</div>
                      <div className="track-desc">{stretchSkill.desc}</div>
                    </>
                  ) : <div className="track-desc">Already at maximum level for this factor.</div>}
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
                    <div className="horizon-label">The Trust Stack: Reliability → Honesty → Transparency → Agency → Benevolence</div>
                    <div className="horizon-content">{PRODUCT_LAYER.aspiration}</div>
                  </div>
                  <div className="track-section">
                    <div className="track-header" style={{color:"#1E7E4E"}}>Current level - Key Skills: L{levelMeta.level} · {cur.stack}</div>
                    <div className="track-title">👉 {cur.name}</div>
                    <div className="track-desc">{cur.desc}</div>
                  </div>
                  {nxt ? (
                    <div className="track-section">
                      <div className="track-header" style={{color:"#1E7E4E"}}>Next Level - Stretch Skills: L{nextLvl} · {nxt.stack}</div>
                      <div className="track-title">👉 {nxt.name}</div>
                      <div className="track-desc">{nxt.desc}</div>
                    </div>
                  ) : null}
                  {further.length>0 && (
                    <div className="track-section">
                      <div className="track-header" style={{color:"#1E7E4E"}}>Going further</div>
                      {further.map(sk=>(
                        <div key={sk.name} style={{marginBottom:10}}>
                          <div className="track-title">👉 {sk.name}</div>
                          <div className="track-desc">{sk.desc}</div>
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
                  <div className="horizon-label">Horizon unlocked at Level 5</div>
                  <div className="horizon-content">{SOCIETY_LAYER.aspiration}</div>
                </div>
                <div style={{padding:14,borderRadius:"var(--border-radius-md)",borderTop:"0.5px solid #2558C830"}}>
                  <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>👉 {SOCIETY_LAYER.skill.name}</div>
                  <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.7,marginBottom:10}}>{SOCIETY_LAYER.skill.desc}</div>
                  <div style={{fontSize:11,fontWeight:500,color:"#2558C8",textTransform:"uppercase",marginBottom:3}}>NEXT LEVEL - STRETCH SKILLS</div>
                  <div style={{fontSize:15,fontWeight:700,marginBottom:3}}>👉 {SOCIETY_LAYER.skill.stretch.name}</div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.6}}>{SOCIETY_LAYER.skill.stretch.desc}</div>
                </div>
                <div style={{fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--color-text-secondary)"}}>{SOCIETY_LAYER.societalSkills.length} societal capability areas</div>
                {SOCIETY_LAYER.societalSkills.map(sk=>(
                  <div key={sk.category} className="society-item">
                    <div className="society-item-header">
                      <div className="skill-name">👉 {sk.category}</div>
                    </div>
                    <div className="society-item-desc">{sk.desc}</div>
                    <div className="society-item-ref">{sk.ref}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={reset} className="btn-primary">
            ↺ Reset & score again
          </button>
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

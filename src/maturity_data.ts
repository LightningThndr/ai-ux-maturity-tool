// ── TYPES ─────────────────────────────────────────────────────────────────

export type FactorId = "strategy" | "process" | "culture" | "outcomes" | "trust";
export type LayerId = "self" | "teams" | "orgs";

export interface Skill { name: string; desc: string; }
export interface ArchSkill { s: string; w: string; }

export interface Factor {
  id: FactorId;
  name: string;
  short: string;
  weight: number;
  color: string;
  bg: string;
  textDark: string;
  subtext: string;
  question: { headline: string; leadIn: string; probes: string[] };
  subfactors: Skill[];
  // One descriptor per maturity level (the 5×5 hallmark grid, row by row)
  hallmarks: Record<number, string>;
  levelSkills: Record<LayerId, Record<number, Skill>>;
}

export interface Archetype {
  name: string;
  icon: string;
  high?: FactorId;
  low?: FactorId;
  isSiloed?: boolean;
  isBalanced?: boolean;
  tension: string;
  move: string;
  description: string;
  hard: ArchSkill[];
  soft: ArchSkill[];
}

// ── FACTORS ───────────────────────────────────────────────────────────────

export const FACTORS: Factor[] = [
  { id:"strategy", name:"AI-UX Strategy", short:"Strategy", weight:0.20, color:"#153C6A", bg:"rgba(21,60,106,0.08)", textDark:"#153C6A",
    subtext:"UX positioning, decision rights, and resourcing in AI product development.",
    question:{
      headline:"When your company makes an important AI product decision, how early is UX involved, and does it change the outcome?",
      leadIn:"Think about the last 2–3 significant AI decisions you know of: what to build, how much the AI should do on its own, which data or model to use, what to stop.",
      probes:[
        "When did UX first hear about it: at the idea stage, during design, or at build/launch?",
        "Did UX input change the decision, or was it noted and set aside?",
        "Did it start from a user problem (“what do users need?”) or a capability (“what can the model do?”)?"
      ]
    },
    subfactors:[
      {name:"Organizational positioning",desc:"Is UX involved upstream in AI strategy and architecture, with Go/No-Go power to pivot or halt an AI feature?"},
      {name:"Resource allocation",desc:"Are budget, roles, AI tools, access to evals and traces, and time for longitudinal research dedicated to AI-UX work?"},
      {name:"User-centred AI vision",desc:"Is the roadmap driven by “which human problem needs AI?” (UX-pull) rather than “what can this model do?”"},
      {name:"Autonomy & delegation decisions",desc:"Does UX help decide what the AI does on its own, what needs human approval, and what it should never do?"},
      {name:"Foresight & speculative practice",desc:"Does the team use scenarios and speculative design to anticipate the downstream impact of AI features?"}
    ],
    hallmarks:{
      1:"UX hears about AI features at build or launch. The roadmap is capability-push: “what can the model do?”",
      2:"UX is consulted on scoped AI features, and individual advocates push for starting from user problems.",
      3:"UX has documented entry points, shapes scope, and helps set autonomy levels and human-in-the-loop points.",
      4:"UX has Go/No-Go input. Trust risks are reviewed alongside the business case.",
      5:"UX shapes which AI capabilities and business models the organization pursues, and can redirect or stop a feature."
    },
    levelSkills:{
      self:{
        1:{name:"UX value articulation",desc:"Frame UX's AI contribution in the language of risk, trust, and ROI, not design quality."},
        2:{name:"Stakeholder mapping",desc:"Map who controls AI decisions and where UX can step in earlier."},
        3:{name:"Stakeholder influence & narrative",desc:"Frame UX input in terms of risk, impact, and strategic opportunity so it shapes decisions rather than decorating them."},
        4:{name:"Executive risk communication",desc:"Brief leaders on AI trust risks with evidence, specific consequences, and a clear recommendation."},
        5:{name:"AI governance & regulatory fluency",desc:"Translate the EU AI Act and emerging AI rules into concrete design obligations and decision criteria."}
      },
      teams:{
        1:{name:"Quick win identification",desc:"Find low-cost, high-visibility opportunities to demonstrate UX's contribution to AI work."},
        2:{name:"Problem-first AI framing",desc:"Test whether a user problem genuinely needs AI before capability-led ideas reach the roadmap."},
        3:{name:"Autonomy & delegation decisions",desc:"Use a shared framework to decide what the AI does alone, what needs human approval, and what it never does."},
        4:{name:"Strategic foresight & scenarios",desc:"Build scenarios that show how different AI product choices play out for users over time, and bring them into roadmap planning."},
        5:{name:"AI portfolio governance",desc:"Set team criteria for building, pausing, or declining AI features, and apply them consistently."}
      },
      orgs:{
        1:{name:"Resistance recognition",desc:"Diagnose whether barriers to UX involvement are structural, cultural, or resource-based."},
        2:{name:"Coalition building",desc:"Build allies in product, engineering, legal, and data for human-centred AI."},
        3:{name:"Process change design",desc:"Build UX's entry points into the delivery process so involvement doesn't depend on individual advocacy."},
        4:{name:"Resourcing the AI-UX practice",desc:"Secure the roles, AI tools, access to evals and traces, and research time that AI-native UX work requires."},
        5:{name:"Go/No-Go decision rights",desc:"Secure UX authority in AI feature and model review, including the standing to stop a feature."}
      }
    }
  },
  { id:"process", name:"AI-Native Process", short:"Process", weight:0.25, color:"#3C97D4", bg:"rgba(60,151,212,0.10)", textDark:"#1D5F8C",
    subtext:"Research, design, and build methods suited to probabilistic, adaptive, and agentic systems.",
    question:{
      headline:"On your most recent AI feature, what did UX do differently because it was AI?",
      leadIn:"Pick one AI feature you worked on or know well. Compare how it was researched, designed, and tested with a non-AI feature.",
      probes:[
        "Did you design for the moments when the AI is uncertain, wrong, or acting on its own, not just the happy path?",
        "Did you prototype or test with real model outputs rather than ideal mock-ups?",
        "Did UX help define what a “good” output looks like, and check it again after launch?",
        "If the honest answer is “nothing different”, that's important data too."
      ]
    },
    subfactors:[
      {name:"Research evolution",desc:"Do longitudinal studies evaluate trust calibration, mental model drift, and bias impact over time? Are AI-generated synthesis and synthetic users checked against real evidence?"},
      {name:"Design for uncertainty, failure, & autonomy",desc:"Does your design system codify AI-UX patterns like confidence, citations, approvals, interruption, undo, and progress visibility?"},
      {name:"Cross-functional workflows",desc:"Are there documented agreements on when UX enters AI development, what “done” looks like, and who owns quality criteria and decisions at each phase?"},
      {name:"Live-model prototyping",desc:"Do designers prototype with real models and data, treating system prompts and behaviour as design material?"},
      {name:"Evals & quality definition",desc:"Does UX define what a good output is (rubrics, golden examples, real-output reviews), and does that inform release decisions?"},
      {name:"AI-augmented practice",desc:"Does the team research, design, and build with AI, with clear norms for checking AI output and a design system AI tools can read?"}
    ],
    hallmarks:{
      1:"AI features follow the same process as any other feature. Mock-ups show perfect AI output, with no failure or refusal states.",
      2:"Basic fallback states exist. Some prototyping uses live models, and AI is used for synthesis with spot checks.",
      3:"AI trust patterns are in the design system, designers prototype on real models, and UX contributes to eval criteria.",
      4:"UX owns quality criteria in continuous eval loops. Agentic flows have graduated autonomy, and long-term studies inform design.",
      5:"Novel methods study human-agent behaviour. The design system evolves with the models and is readable by AI tools."
    },
    levelSkills:{
      self:{
        1:{name:"AI-augmented workflow basics",desc:"Use AI for synthesis, ideation, and prototyping, and check what it produces against real evidence."},
        2:{name:"Live-model prototyping",desc:"Prototype with real models and data using AI design and coding tools; treat prompts and model behaviour as design material."},
        3:{name:"Longitudinal research methods",desc:"Design studies, including diary studies, that track how trust and mental models change over weeks and months."},
        4:{name:"Evals & output quality judgement",desc:"Write quality rubrics, build golden examples, and review real outputs to find error patterns."},
        5:{name:"Human-agent research methods",desc:"Invent methods for studying emerging human-AI and human-agent behaviour that existing methods miss."}
      },
      teams:{
        1:{name:"Designing beyond the happy path",desc:"Specify what happens when AI output is uncertain, wrong, empty, or slow, not just when it works."},
        2:{name:"Cross-functional working agreements",desc:"Agree when UX enters AI development, what “done” means, and who owns quality criteria and decisions at each phase."},
        3:{name:"Agentic interaction design",desc:"Design approvals, interruption, undo, and progress visibility for AI that acts on the user's behalf."},
        4:{name:"AI trust pattern library",desc:"Codify confidence, citation, approval, refusal, and repair patterns in the design system so every team uses them consistently."},
        5:{name:"Continuous eval loops",desc:"Connect UX-defined quality criteria to release decisions and post-launch review, so quality is checked on every change."}
      },
      orgs:{
        1:{name:"AI tool & verification norms",desc:"Establish approved AI tools and clear rules for checking AI-generated research and design work."},
        2:{name:"Research operations for AI",desc:"Build a shared library of AI behaviour insights, reusable protocols, and eval sets."},
        3:{name:"Design system as AI context",desc:"Make tokens, components, and guidelines readable by AI tools so AI-generated UI stays consistent with the system."},
        4:{name:"Quality infrastructure for design",desc:"Give designers direct access to evals, traces, and quality dashboards, not second-hand reports."},
        5:{name:"AI-native design workflow at scale",desc:"Redesign roles and design-to-code workflows across the organization around AI."}
      }
    }
  },
  { id:"culture", name:"AI Literacy & Culture", short:"Literacy", weight:0.15, color:"#1E8B85", bg:"rgba(30,139,133,0.10)", textDark:"#145E5A",
    subtext:"Shared AI understanding across UX and its partners, and a culture that keeps learning as AI changes.",
    question:{
      headline:"Could your team explain why your AI gave a wrong answer, and do engineers ask for UX's view?",
      leadIn:"This question has two parts: capability and invitation.",
      probes:[
        "Could you discuss model limits, hallucination, context, or evals with an ML engineer?",
        "Do engineers ask for UX's perspective, or does collaboration only happen when UX pushes?",
        "Is learning about AI supported with time, tools, and budget, or done on people's own time?"
      ]
    },
    subfactors:[
      {name:"AI fluency",desc:"Do practitioners understand how models work (context, retrieval, tool use, agents, evals, drift) and how they fail, without needing to become engineers?"},
      {name:"Cross-functional empathy",desc:"Can UX engage meaningfully with data scientists, ML engineers, and AI product managers? Is this reciprocal?"},
      {name:"Psychological safety for uncertainty",desc:"Is the culture comfortable shipping, learning, and adapting, rather than seeking false certainty upfront?"},
      {name:"Continuous learning investment",desc:"Are time and budget given to building skills in agentic interaction design, evals, and model behaviour design?"},
      {name:"Trust steward identity",desc:"Do practitioners see themselves as owning whether the human-AI relationship is trustworthy, not just delivering artifacts?"}
    ],
    hallmarks:{
      1:"AI learning is individual and self-taught. AI tool use is unofficial, and there is no shared vocabulary.",
      2:"There are pockets of self-taught fluency. Approved AI tools and a usage policy exist.",
      3:"UX, product, and engineering share a vocabulary. Designers can read model outputs and traces.",
      4:"Design and ML co-own outcomes. AI-augmented work is the default, with clear norms for checking it.",
      5:"UX helps design organization-wide AI fluency and helps others build it."
    },
    levelSkills:{
      self:{
        1:{name:"AI literacy fundamentals",desc:"Understand context, retrieval, tools, and agents, and the main failure modes: hallucination, sycophancy, and drift."},
        2:{name:"Technical curiosity & rapid learning",desc:"Reach “good enough” on new AI concepts quickly by experimenting and asking engineers."},
        3:{name:"Systems thinking",desc:"Map how design decisions ripple through sociotechnical systems and feedback loops."},
        4:{name:"Cross-disciplinary facilitation",desc:"Lead conversations that involve design, ML, data, and legal, and turn them into decisions."},
        5:{name:"Trust steward leadership",desc:"Own whether the human-AI relationship is trustworthy, and model that ownership for others."}
      },
      teams:{
        1:{name:"AI vocabulary building",desc:"Establish shared terms across UX, product, and engineering, including evals, context, and sycophancy."},
        2:{name:"Cross-functional relationship building",desc:"Build working relationships with ML engineers outside formal project structures."},
        3:{name:"Joint output reviews",desc:"Review real model outputs and traces together as UX and ML, so both disciplines learn from the same evidence."},
        4:{name:"AI literacy program design",desc:"Design AI education tailored to the decisions each role makes."},
        5:{name:"Cross-disciplinary ownership models",desc:"Set up team structures where design, engineering, and data science co-own AI outcomes."}
      },
      orgs:{
        1:{name:"Organizational diagnostic skills",desc:"Assess AI fluency by role, including the EU AI Act Article 4 AI literacy obligation."},
        2:{name:"Change communication",desc:"Explain why UX-led AI change matters in terms each audience cares about."},
        3:{name:"Psychological safety & learning culture",desc:"Build norms that reward experimenting, admitting uncertainty, and learning in public."},
        4:{name:"Distributed leadership development",desc:"Build AI-UX leadership capability across the organization, not just within UX."},
        5:{name:"Organizational design for AI",desc:"Shape structures, incentives, and decision rights for human-centred AI."}
      }
    }
  },
  { id:"outcomes", name:"Outcomes & Measurement", short:"Outcomes", weight:0.20, color:"#4D6E8C", bg:"rgba(77,110,140,0.10)", textDark:"#2F4A63",
    subtext:"Measuring AI success beyond engagement: calibrated trust, output quality, user agency, and long-term wellbeing.",
    question:{
      headline:"How would you know if users trusted your AI too much, or too little?",
      leadIn:"This is a stress test. It doesn't ask whether this has happened; it asks whether your measures would catch it.",
      probes:[
        "Beyond usage and satisfaction, do you track how often users accept, edit, override, or double-check AI output?",
        "If usage went up while users relied on wrong answers, would your dashboards show it?",
        "Can you see whether the AI works equally well for different user groups, and over time?",
        "Who is responsible for noticing?"
      ]
    },
    subfactors:[
      {name:"Calibrated trust & reliance",desc:"Does reliance match actual reliability? Are both under- and over-trust measured through acceptance, edit, override, and verification rates?"},
      {name:"Output quality & value realised",desc:"Is AI output quality measured against UX-defined criteria, and does the AI actually reduce user effort?"},
      {name:"User agency indicators",desc:"Does measurement track whether users feel in control: able to understand, question, and override the AI?"},
      {name:"Longitudinal tracking",desc:"Is the team studying how behaviour, mental models, and trust evolve over weeks and months, including after model updates?"},
      {name:"Bias & equity",desc:"Is every trust and quality metric broken down by user group, language, and device, and acted on?"},
      {name:"Societal & wellbeing impact",desc:"Is there a commitment to measuring broader effects on wellbeing and equity, and whether users gain capability or become dependent?"}
    ],
    hallmarks:{
      1:"Success means shipped and used. There is no measure of output quality or of how much users rely on the AI.",
      2:"Thumbs up/down feedback is collected but rarely acted on. Satisfaction scores stand in for trust.",
      3:"Reliance metrics and UX-defined quality rubrics are tracked.",
      4:"Calibration is measured and broken down by user group. Drift and silent behaviour changes are monitored.",
      5:"Monitoring predicts degradation. Wellbeing, and whether users gain capability or become dependent, are tracked and acted on."
    },
    levelSkills:{
      self:{
        1:{name:"Data interpretation for AI features",desc:"Turn usage, feedback, and override data into design implications."},
        2:{name:"Reliance metrics literacy",desc:"Know what acceptance, edit, override, and verification rates say about trust, and what they don't."},
        3:{name:"Mixed-methods trust research",desc:"Combine behavioural data with interviews and diaries to explain why reliance changes."},
        4:{name:"Impact case-building",desc:"Show what trust-building design changed in retention, support load, and errors."},
        5:{name:"Capability vs dependency research",desc:"Study whether AI makes users more capable over time, or more dependent."}
      },
      teams:{
        1:{name:"Research for calibrated trust",desc:"Check whether users' reliance matches the AI's actual reliability. Both under-trust and over-trust are failures."},
        2:{name:"Output quality rubrics",desc:"Measure AI output quality against UX-defined criteria, not just thumbs up/down."},
        3:{name:"Equity breakdowns",desc:"Break trust and quality metrics down by user group, language, and device; averages hide gaps."},
        4:{name:"Drift & change monitoring",desc:"Track how reliance and quality shift as models update, and flag silent behaviour changes."},
        5:{name:"Predictive experience monitoring",desc:"Anticipate experience degradation before it shows up in satisfaction metrics."}
      },
      orgs:{
        1:{name:"Beyond-engagement case",desc:"Show leaders how usage and satisfaction scores can hide AI failure."},
        2:{name:"Shared AI success metrics",desc:"Agree a definition of AI success, co-owned across functions, that includes trust and output quality."},
        3:{name:"Value realisation tracking",desc:"Check whether AI actually reduces user effort, time, and errors."},
        4:{name:"Impact measurement frameworks",desc:"Track trust, agency, wellbeing, and equity alongside business metrics."},
        5:{name:"Long-term wellbeing & societal impact",desc:"Track how AI products affect users' capability, wellbeing, and equity over years, not quarters."}
      }
    }
  },
  { id:"trust", name:"Trust & Accountability", short:"Trust", weight:0.20, color:"#2E9B6E", bg:"rgba(46,155,110,0.10)", textDark:"#1D6A4A",
    subtext:"Designing AI users can rightly rely on: honest, transparent, steerable, able to recover from mistakes, and on their side.",
    question:{
      headline:"When your AI gets something wrong, what happens for the user, and who designed that moment?",
      leadIn:"Think of a real mistake, refusal, or unexpected AI action in your product.",
      probes:[
        "Could the user tell it was AI, see why it happened, and correct or undo it?",
        "Was that experience designed on purpose, or left to engineering defaults?",
        "Has UX ever pushed to change or stop an AI feature on trust or ethical grounds? Was it heard?",
        "If no example comes to mind, is that because it hasn't happened, or because no one is looking?"
      ]
    },
    subfactors:[
      {name:"Trust by design",desc:"Is a Trust Stack review (reliability, honesty, transparency, agency, benevolence) built into each feature gate?"},
      {name:"Honesty & disclosure",desc:"Is AI identity disclosed persistently, and are hallucination and sycophancy handled by design, with “I don't know” responses and hedged copy?"},
      {name:"Transparency design",desc:"Can users see why the AI did something, what it's based on, and how confident it is?"},
      {name:"Agency & human accountability",desc:"Can users override, approve, and undo? Is there clear human ownership of AI behaviour?"},
      {name:"Failure, refusal & repair",desc:"Are refusals, errors, and corrections designed, with alternatives offered and mistakes acknowledged?"},
      {name:"Stewardship & boundary-setting",desc:"Are data and memory controls clear, manipulative patterns ruled out, and feasible-but-harmful features declined?"}
    ],
    hallmarks:{
      1:"There is no AI disclosure standard and no undo or override. Trust and ethics are raised only after incidents.",
      2:"AI is disclosed on launch surfaces only. Confidence and citation patterns are used inconsistently.",
      3:"Trust is reviewed at each feature gate, and the regulatory baseline is designed in, not bolted on.",
      4:"Design owns the experience of guardrails, refusals, and repair. Memory and data controls are standard.",
      5:"UX helps decide what AI should and shouldn't do. The organization publishes trust patterns and contributes to standards."
    },
    levelSkills:{
      self:{
        1:{name:"Trust Stack fluency",desc:"Evaluate any AI feature across the five layers: reliability, honesty, transparency, agency, and benevolence."},
        2:{name:"Ethical reasoning basics",desc:"Ask who could be harmed, how, and at what scale, before shipping rather than after."},
        3:{name:"Trust copy & honest language",desc:"Write hedged copy, “I don't know” responses, and AI disclosure, and resist sycophantic framing."},
        4:{name:"Failure, refusal & repair design",desc:"Design refusals that offer alternatives, ways to correct the AI, and genuine acknowledgement of errors."},
        5:{name:"Benevolence judgement",desc:"Spot conflicts between user and business interests (e.g. an upsell presented as advice) and argue for the user."}
      },
      teams:{
        1:{name:"Trust review of AI features",desc:"Walk each AI feature through the Trust Stack before it ships."},
        2:{name:"Consequence scanning",desc:"Run a “who could this harm, and how?” ritual at feature scoping."},
        3:{name:"Transparency & agency patterns",desc:"Build in “why this?” explanations, sources, confidence signals, override, and undo."},
        4:{name:"Trust gates in delivery",desc:"Make a Trust Stack review a standard gate, including AI disclosure (EU AI Act Art. 50) and manipulation checks (Art. 5)."},
        5:{name:"Guardrail UX ownership",desc:"Own the user experience of every guardrail, refusal, and incident response."}
      },
      orgs:{
        1:{name:"Regulatory baseline awareness",desc:"Know what EU AI Act Articles 4, 5, and 50 mean for design decisions."},
        2:{name:"Coalition building for trust",desc:"Build allies in legal, compliance, data, and security for trustworthy AI."},
        3:{name:"Data stewardship standards",desc:"Set standards for memory controls, training opt-outs, and data-use disclosure at the point of collection."},
        4:{name:"Human accountability structures",desc:"Establish clear human ownership of AI behaviour, with UX included in incident reviews."},
        5:{name:"AI policy & external accountability",desc:"Lead policy on what AI should and shouldn't do, and support external accountability such as transparency reporting."}
      }
    }
  }
];

export const LEVELS = [
  {level:1,label:"Absent / Reactive",          headline:"AI is someone else's problem."},
  {level:2,label:"Developing / Aware",         headline:"We know AI is different. We're starting to adjust."},
  {level:3,label:"Emerging / Structured",      headline:"We have methods for this. We're building shared ownership."},
  {level:4,label:"Integrated / Holistic",      headline:"Human-centred AI is how we work, not a project name."},
  {level:5,label:"Transformative / Pioneering",headline:"We're creating the playbook others will follow."}
];

export const ROLES = [
  {id:"ic",   label:"Individual contributor", desc:"Answer for what you've seen in your own work."},
  {id:"lead", label:"Team lead / manager",    desc:"Answer for your team and what you see across it."},
  {id:"head", label:"Head of / Director+",    desc:"Answer for the organization as a whole."}
];

// ── HIGHER LAYERS ─────────────────────────────────────────────────────────

export interface ProductSkill extends Skill { stack: string; further?: Skill[]; }

// AI Products layer applies the Trust Stack to what you ship; open at every level.
export const PRODUCT_LAYER = {
  aspiration:"This layer applies the Trust Stack to the AI you ship. Each level builds on the one below: users can only judge whether a product is honest once it is reliable, and only steer it once they can understand it.",
  skills:{
    1:{stack:"Reliability", name:"Honest limits",
       desc:"Disclose what the AI can't do, how fresh its data is, and where it fails, before users rely on it. Prefer graceful degradation over confident failure."},
    2:{stack:"Honesty", name:"Grounded, honest answers",
       desc:"Cite sources, abstain when unsure, separate facts from interpretations, and disclose that users are interacting with AI."},
    3:{stack:"Transparency", name:"Explainable outputs",
       desc:"Offer “why this?” explanations, links to the underlying data, and confidence signals at the moments that matter most."},
    4:{stack:"Agency", name:"Steerable AI",
       desc:"Provide override, approval, undo, and graduated autonomy so users can steer or stop the AI, especially when it acts on their behalf.",
       further:[
         {name:"Human-compatible AI systems design",desc:"Move beyond human-centred design toward human-compatible AI: systems that preserve user agency, adapt without manipulating, and remain legible to the people they serve. Grounded in MIT Media Lab AHA program research on designing AI for human flourishing."},
         {name:"Wellbeing-by-design frameworks",desc:"Apply self-determination theory (autonomy, competence, relatedness) as explicit design criteria, measuring whether the AI system strengthens or erodes these psychological foundations over time."}
       ]},
    5:{stack:"Benevolence", name:"AI on the user's side",
       desc:"Ground every recommendation in the user's own data and goals, make business incentives explicit, and never exploit user vulnerabilities.",
       further:[
         {name:"Longitudinal product impact research",desc:"Design studies that track how AI products affect user capability, autonomy, and wellbeing over months, not just satisfaction at launch. Distinguishes AI that helps users do more from AI that creates dependency."},
         {name:"Cross-product trust pattern libraries",desc:"Develop and publish reusable AI trust patterns (calibration, meaningful override, consent architecture, explanation, repair) that other teams can adopt, multiplying your impact beyond your own products."}
       ]}
  } as Record<number, ProductSkill>
};

export const SOCIETY_LAYER = {
  minLevel:5,
  aspiration:"At Level 5, the UX practitioner becomes a societal change agent, using futures literacy, deep creativity, and mastery of unknown unknowns to design AI that contributes to human flourishing at scale.",
  skill:{
    name:"Futures studies & strategic foresight",
    desc:"Apply structured foresight methodologies (scenario planning, signal scanning, backcasting, cone of futures) to anticipate how AI products interact with society over years and decades. Draws on the World Economic Forum's framing of futures studies as tools for resilience and innovation, and the Unknown Unknowns framework for navigating what we do not yet know we do not know.",
    stretch:{name:"Speculative design for AI",desc:"Use design fiction, provocative prototyping, and what-if scenarios to make visible the societal consequences of AI design decisions before they scale. The goal is to surface unknown unknowns before they become unrecoverable ones."}
  },
  societalSkills:[
    {category:"Creativity amplification",
     desc:"In the AI era, creativity is a defining human advantage. At the societal level, UX practitioners apply problem solving and creativity skills in a manner that influences new ideas and best patterns that scale. New and original ideas that come from thinking outside-the-box via imagination, originality, and expressiveness enable innovation. Apply divergent ideation, conceptual bridging, metaphorical thinking, storytelling, visual problem-solving, and tastemaking (the act of developing and applying vision and intuition to make a product desirable and memorable, rather than just functional).",
     ref:"Grounded in the Creativity Amplification Framework: AI + Execution = Efficiency, but Humans + Imagination = Innovation."},
    {category:"Designing for unknown unknowns",
     desc:"The Rumsfeld Matrix identifies unknown unknowns (things we are not aware of and do not understand) as both the domain of greatest AI risk and the space where genuine innovation lives. UX practitioners develop Anti-Problem Definition, Assumption Reversal, cross-domain pattern transfer, and cultural signal detection to systematically surface what AI cannot, because AI can only recombine what it has been trained on.",
     ref:"Grounded in Angela Pesta's UX Salon Barcelona talk (Sept 2025): designers explore frontiers AI can only navigate once those frontiers are mapped."},
    {category:"Human flourishing metrics",
     desc:"Design measurement frameworks that track whether AI products contribute to human flourishing at population scale, drawing on self-determination theory (autonomy, competence, relatedness), digital wellbeing research, and the MIT Media Lab AHA program framework for assessing AI impact on wisdom, wonder, and wellbeing. Move beyond user satisfaction toward societal health indicators: democratic participation, equity, mental health, and human capability development.",
     ref:"Grounded in MIT MAS.S64 'Designing AI for Human Flourishing' and the 2025 Psychology of Technology Conference on purpose-driven AI."},
    {category:"Public interest AI advocacy",
     desc:"Participate in regulatory consultations and public discourse to shape the rules governing AI design, not just follow them. Treat AI literacy as a public good and design programs that improve societal understanding of AI systems, their capabilities, and their limits.",
     ref:"Grounded in the argument that UX leaders are catalysts for a society that flourishes in the AI era, requiring operation at the intersection of design, governance, and civic responsibility."},
    {category:"Industry standards contribution",
     desc:"Represent your organization in efforts to define responsible AI design standards, and contribute tested trust patterns, evaluation criteria, and methods back to the field.",
     ref:"Standards are where today's best practice becomes tomorrow's baseline; practitioners who help write them shape what every team is held to."},
    {category:"Thought leadership & publication",
     desc:"Develop original frameworks and publish what you learn, through writing, speaking, and open resources, so that practice advances beyond your own organization.",
     ref:"Field-level contribution turns individual expertise into shared knowledge, and builds the external credibility that strengthens internal influence."}
  ]
};

// ── ARCHETYPES ────────────────────────────────────────────────────────────

export const ARCHETYPES: Archetype[] = [
  {name:"The Invisible Expert",icon:"◆",high:"culture",low:"strategy",tension:"Competence without positioning.",move:"Make the risk case for upstream inclusion — use language of risk, not craft.",description:"Your team is genuinely capable. Practitioners understand AI systems, ask good questions in cross-functional rooms, and care deeply about doing this work well. The problem isn't competence — it's that competence isn't translating into organizational influence. UX is consistently downstream from the decisions that matter most. Your team has well-formed opinions about AI architecture, model selection, and product direction that no one formally asks for. You find out about major AI feature decisions after they've already been shaped — during implementation, not ideation. Cross-functional partners respect your craft but don't think to pull UX into upstream conversations. You're executing well on things that shouldn't have been built the way they were.",
   hard:[
    {s:"UX value articulation",w:"Translating findings into business risk and ROI language is the primary currency for gaining upstream access to AI decisions."},
    {s:"Problem-first AI framing",w:"Asking “which user problem needs AI?” before “what can the model do?” gives you a strategic contribution, not just a response to other people's ideas."},
    {s:"Stakeholder mapping",w:"Systematically mapping decision-makers and gatekeepers in AI initiatives is the practical foundation for building upstream access."},
    {s:"Autonomy & delegation decisions",w:"Deciding what the AI does alone, what needs approval, and what it never does is a strategic question your AI fluency equips you to lead, and it gets you invited upstream."}],
   soft:[{s:"Political savvy & org navigation",w:"Understanding unspoken power dynamics — not just formal org charts — separates practitioners who get invited upstream from those who don't."},{s:"Self-promotion without self-promotion",w:"Making your team's work visible through sharing and narrating is a skill. Competence that isn't seen doesn't compound."},{s:"Strategic patience",w:"Gaining a seat at the table is a campaign, not a request. Consistent incremental moves without frustration make the campaign winnable."},{s:"Reading the room",w:"Knowing when to push, when to listen, and when to let others take credit for ideas you seeded is a high-leverage organizational skill."}]},
  {name:"The Compliant Builder",icon:"▲",high:"process",low:"trust",tension:"Efficiency without principle",move:"Add one 'what could go wrong for whom?' conversation at AI feature scoping.",description:"Your team has adapted its methods. You're running the right kinds of studies, building design systems for uncertainty, collaborating cross-functionally, and shipping with reasonable quality. But it's building toward metrics and timelines rather than toward principled outcomes. Trust and ethical considerations arise reactively — when a problem surfaces publicly, not before it ships. You've never had a team-level conversation about whether to not build a specific AI feature on ethical grounds. Failure, refusal, and repair states are an afterthought to the happy path. Transparency and explainability are interaction patterns to implement on request, not principles the team actively advocates for. When trust issues arise, they're treated as edge cases or PR problems.",
   hard:[
    {s:"Trust gates in delivery",w:"Your process is your strength. Adding a Trust Stack review to the gates you already run, including AI disclosure (EU AI Act Art. 50) and manipulation checks (Art. 5), makes trust part of how you ship."},
    {s:"Consequence scanning",w:"A structured participatory technique for identifying intended and unintended consequences of technology. Fast (90 min) and directly applicable to AI feature scoping."},
    {s:"Transparency & agency patterns",w:"Designing “why this?” explanations, sources, confidence signals, override, and undo is a distinct craft that turns transparency from a request into a default."},
    {s:"Failure, refusal & repair design",w:"Fast-shipping teams most often skip the failure path. Designing refusals with alternatives, correction affordances, and honest error acknowledgement is where trust is won or lost."}],
   soft:[{s:"Moral courage in design reviews",w:"Naming an ethical concern clearly, calmly, and specifically without making it a conflict is a rare and high-value skill in fast-moving AI teams."},{s:"Slowing down under velocity pressure",w:"The practitioner who can advocate for a brief ethical pause and frame it as risk management — not obstruction — protects both product and team."},{s:"Reframing trust as product quality",w:"Positioning trust considerations as product quality issues (reliance, retention, legal exposure) rather than moral ones makes advocacy far more effective."},{s:"Constructive dissent",w:"Disagreeing with a direction without becoming the obstacle means offering an alternative, not just a concern. This is a practiced skill."}]},
  {name:"The Advocate Without Infrastructure",icon:"●",high:"trust",low:"process",tension:"Values without consistency",move:"Make one process step non-negotiable for every AI project this quarter.",description:"Your team cares deeply about doing this right. The values are genuine and the ethical instincts are strong. But the practice is inconsistent — trust principles and research intentions don't translate into repeatable process. What actually gets done depends on who's staffed to the project and how much time exists. Your team can articulate what trustworthy AI design looks like but applies it differently project to project. Research methods haven't evolved much beyond traditional usability testing despite the team's awareness that AI requires something different. You advocate for quality criteria, trust research, and bias audits but rarely have the infrastructure to run them consistently. Cross-functional partners see UX as principled but unpredictable.",
   hard:[
    {s:"AI trust pattern library",w:"Codifying when and how to use uncertainty, citation, approval, refusal, and repair patterns creates consistency that currently depends on who is on the project."},
    {s:"Evals & output quality judgement",w:"Turning your principles into written rubrics and golden examples that run on every release is the most repeatable trust infrastructure available."},
    {s:"Research operations for AI",w:"Building reusable research infrastructure — templates, repositories, protocols, eval sets — converts one-off principled research into repeatable organizational practice."},
    {s:"Live-model prototyping",w:"Prototyping with real models and data lets the team see trust problems in actual AI behaviour before building, rather than arguing about them in the abstract."}],
   soft:[{s:"Process discipline under ambiguity",w:"Applying a consistent method even when timelines compress or team composition changes is what converts ethical conviction into organizational reliability."},{s:"Teaching and knowledge transfer",w:"Turning personal ethical practice into team practice requires the ability to explain, model, and coach — not just do."},{s:"Tolerance for imperfect progress",w:"Implementing something imperfect consistently and then improving it is more valuable than perfect thinking that never ships."},{s:"Documenting decisions not just outputs",w:"Recording why ethical choices were made — not just what was designed — builds the institutional memory that makes practice consistent across projects."}]},
  {name:"The Metric-Driven Optimizer",icon:"■",high:"outcomes",low:"trust",tension:"Measuring the wrong things confidently",move:"Add one non-engagement metric (calibrated reliance, override rate) to an active product.",description:"Your team is fluent in measurement and credible with business stakeholders. The risk is that you're measuring the wrong things — confidently. Engagement metrics, satisfaction scores, and task completion rates don't surface the slow-moving harms AI systems can create: eroding trust, degrading user agency, amplifying bias across populations over time. Engagement can rise while users over-rely on wrong answers. Your dashboards are sophisticated and well-maintained but don't include trust calibration, user agency, or equity indicators. You can demonstrate UX ROI clearly but struggle to demonstrate UX risk. When trust issues arise, the team doesn't have a measurement framework that would have surfaced them earlier. Leadership trusts your numbers but those numbers don't capture what's actually happening with users in AI contexts.",
   hard:[
    {s:"Research for calibrated trust",w:"More trust isn't always better. Measuring whether reliance matches the AI's actual reliability, including over-trust, catches the harms engagement metrics hide."},
    {s:"Transparency & agency patterns",w:"You can already measure agency. The gap is designing for it: “why this?” explanations, override, and undo that give users real control."},
    {s:"Equity breakdowns",w:"Breaking every trust and quality metric down by user group, language, and device moves you from aggregate to equity-sensitive analysis. Averages hide gaps."},
    {s:"Benevolence judgement",w:"Knowing when optimisation crosses into manipulation, which the EU AI Act Art. 5 prohibits, requires judgement beyond standard usability metrics."}],
   soft:[{s:"Epistemic humility about data",w:"Knowing what your metrics can and cannot tell you — and being willing to say so in stakeholder conversations — is more valuable than false confidence in a clean dashboard."},{s:"Comfort with qualitative evidence",w:"Genuine respect for what interviews and observations reveal about trust and harm rounds out a powerful quantitative toolkit."},{s:"Redefining success with stakeholders",w:"Changing what gets measured requires negotiating a shared definition of AI product success that includes human impact — not just business metrics."},{s:"Long-term thinking under short-term pressure",w:"Advocating for longitudinal metrics in organizations that report quarterly requires both conviction and skill in framing tradeoffs."}]},
  {name:"The Seat Without the Skills",icon:"◇",high:"strategy",low:"process",tension:"Positioning without updated craft",move:"Run one AI-native research method on an active project alongside your existing approach.",description:"Your team has organizational standing. UX is in the room for AI decisions and is recognized as a legitimate voice in product direction. The problem is that the methods haven't kept pace with the positioning. When UX is called on to evaluate an AI feature or design for uncertainty, the team reaches for traditional tools that weren't built for this. You have a seat at the AI table but sometimes struggle to contribute substantively on questions about model behavior, output quality, or agentic flows. Research is still largely point-in-time — usability testing at launch rather than longitudinal study of how users adapt over time. Design specs for AI features still assume deterministic outputs, creating mismatches when the system behaves probabilistically. Cross-functional partners occasionally question whether UX's input reflects an understanding of how the AI actually works.",
   hard:[
    {s:"AI literacy fundamentals",w:"Practical fluency in context, retrieval, tool use, agents, evals, and failure modes — enough to evaluate AI product decisions without needing to code."},
    {s:"Agentic interaction design",w:"AI that acts on the user's behalf needs distinct patterns — approvals, interruption, undo, progress visibility, handoff — that traditional design systems don't have."},
    {s:"Live-model prototyping",w:"Prototyping with real models and data, and treating prompts and behaviour as design material, gives your strategic input a grounding in how the AI actually behaves."},
    {s:"Evals & output quality judgement",w:"Writing quality rubrics and reviewing real outputs lets you take part credibly in conversations about model quality, where much of AI product direction is now decided."}],
   soft:[{s:"Intellectual humility at the table",w:"Having strategic access while acknowledging knowledge gaps — without losing credibility — requires confidence secure enough to ask basic questions in senior rooms."},{s:"Rapid skill acquisition",w:"Getting to good enough in a new domain quickly through deliberate practice is a meta-skill that determines how fast the gap between positioning and craft closes."},{s:"Curiosity about technical systems",w:"Genuine interest in how AI systems work — not just what they produce — makes the learning sustainable and advances it faster."},{s:"Collaborative learning with engineers",w:"Using cross-functional relationships for learning — asking ML engineers to explain model behavior — accelerates craft development in ways no course can."}]},
  {name:"The Influential but Unguarded",icon:"◈",high:"strategy",low:"trust",tension:"Influence without accountability",move:"Use your strategic positioning to introduce trust and ethical foresight from a position of trust.",description:"Your team has genuine organizational influence over AI product direction. But trust and ethical consideration aren't embedded in how that influence is exercised. The team advocates powerfully for user needs as traditionally understood — usability, clarity, delight — without a systematic framework for identifying when those needs are being served in ways that cause broader harm. Your team has never formally recommended against building an AI feature on ethical grounds — not because no feature has crossed a threshold, but because the threshold hasn't been clearly defined. Trust questions arise informally in the margins of project discussions but don't have a home in the formal process. The team is trusted to advocate for users but interprets 'user needs' narrowly — the direct, stated needs of primary users, not the interests of affected populations. There's no shared language for identifying when a UX-approved feature is also an untrustworthy one.",
   hard:[
    {s:"Trust Stack fluency",w:"A shared vocabulary for reliability, honesty, transparency, agency, and benevolence gives trust a home in the strategy conversations you're already part of."},
    {s:"Stakeholder impact mapping",w:"Expanding user research beyond primary users to include affected populations and downstream communities — bringing a broader human-impact lens to strategic AI decisions."},
    {s:"Human accountability structures",w:"Designing clear human ownership of AI behaviour, review processes, and decision criteria makes AI development accountable. It's a craft, not just a stance."},
    {s:"Benevolence judgement",w:"You're present when user and business interests conflict. Recognising those conflicts, and arguing for the user, is how influence becomes responsible."}],
   soft:[{s:"Using influence proactively for accountability",w:"Practitioners with strategic access can normalize ethical review by including it in conversations they are already in. The soft skill is the willingness to use existing influence for this purpose."},{s:"Holding tension between speed and integrity",w:"The development need is maintaining organizational trust while introducing friction — knowing when and how to slow down without losing the room."},{s:"Expanding the definition of user",w:"Developing genuine concern for affected non-users — vulnerable populations, communities — expands both empathy and accountability."},{s:"Naming the unasked question",w:"In strategy conversations, the ethical question is often the one nobody asked. Surfacing it as a contribution — not a challenge — is a distinct skill."}]},
  {name:"The Informed but Unchanged",icon:"▣",high:"culture",low:"process",tension:"Knowledge without method",move:"Redesign one component of a current research plan to be AI-native.",description:"Your team understands AI. Practitioners have invested in learning how models work and can hold substantive conversations with data scientists. But that understanding hasn't translated into changed practice. The team still conducts research and designs experiences largely the way it always has — point-in-time studies, deterministic design specs, standard usability methods. Team members can explain probabilistic outputs and model drift in conversation but still write design specs that assume fixed, predictable behavior. Research plans reference user trust and adaptation as important considerations but the studies themselves are structured the same way they were before AI. There's a gap between what the team knows about AI and what the team does with that knowledge in practice. The team is curious and intellectually ready for change but hasn't had the structural conditions — time, permission, templates — to operationalize it.",
   hard:[
    {s:"Longitudinal research methods",w:"Calibration studies and diary studies tracking trust over weeks are practical methods for evaluating whether users appropriately rely on AI outputs."},
    {s:"Designing beyond the happy path",w:"Specifying what happens when AI output is uncertain, wrong, empty, or slow converts your understanding of probabilistic systems into design specs that match how they behave."},
    {s:"Live-model prototyping",w:"Prototyping with real models is the quickest way to turn AI knowledge into practice: you see real behaviour and design for it, not for an idealised mock-up."},
    {s:"Evals & output quality judgement",w:"Writing rubrics and reviewing real outputs turns what the team knows about failure modes into a repeatable method."}],
   soft:[{s:"Translating knowledge into action",w:"The gap between understanding and doing is often psychological as much as practical. Building the habit of converting insights into concrete methodological experiments is the key development need."},{s:"Experimentation mindset",w:"Treating every research or design adaptation as a small experiment — with a hypothesis, a method, and a learning — builds iterative practice that knowledge alone cannot create."},{s:"Peer accountability",w:"Committing to one methodological change with a colleague and checking in on it converts individual intention into social accountability."},{s:"Tolerating imperfect first attempts",w:"Practitioners with strong AI literacy often know enough to be self-critical about early AI-native attempts. Shipping the imperfect version and learning from it is the key behavior."}]},
  {name:"The Fluent but Unaccountable",icon:"▤",high:"culture",low:"trust",tension:"Fluency without ethical infrastructure",move:"Walk one current AI feature through the Trust Stack as a team exercise.",description:"Your team understands AI deeply and engages with it fluently. But the team hasn't developed the trust and ethical frameworks to evaluate whether AI capabilities should be deployed in the ways they're technically capable of being deployed. Fluency without accountability mistakes 'can' for 'should' — and in AI, that distinction carries enormous consequences. The team is excited about AI's capabilities and focuses on how to make them work well for users, without systematic attention to whether particular capabilities should be designed for at all. Trust and ethical questions feel like a different domain — interesting, but not UX's responsibility. The team's literacy makes it easier to rationalize complex AI features without rigorously examining the value judgments embedded in those tradeoffs. There's no framework for identifying when a well-designed, technically impressive AI feature creates harm through its very function.",
   hard:[
    {s:"Trust Stack fluency",w:"The five layers — reliability, honesty, transparency, agency, benevolence — work as a heuristic set you can apply in existing design reviews."},
    {s:"Data stewardship standards",w:"Designing memory controls, training opt-outs, consent, and data-use disclosure for AI systems is a growing regulatory and trust requirement under GDPR and the EU AI Act."},
    {s:"Participatory design for AI",w:"Involving diverse user populations — including those most affected by AI failures — in design and evaluation processes converts AI fluency into genuinely inclusive practice."},
    {s:"Trust copy & honest language",w:"Fluent teams know hallucination and sycophancy as model behaviours. Treating them as design problems — hedged copy, “I don't know” responses, honest disclosure — is the next step."}],
   soft:[{s:"Sitting with moral uncertainty",w:"Fluent practitioners are often comfortable with technical uncertainty but less practiced at holding ethical uncertainty — questions that do not resolve into clean answers."},{s:"Asking should we before how do we",w:"The habit of pausing before the execution question to ask the values question starts as a deliberate interruption and becomes instinct through practice."},{s:"Empathy for non-users and future users",w:"Technical fluency can narrow empathy toward people generating usage data. Deliberately expanding concern to include those harmed by AI without appearing in the dataset is a specific development need."},{s:"Intellectual independence from enthusiasm",w:"Practitioners who find AI genuinely exciting can be unconsciously motivated to rationalize rather than evaluate. Noticing when enthusiasm is doing your analysis is a form of critical self-awareness."}]},
  {name:"The Confident Measurer",icon:"◉",high:"outcomes",low:"process",tension:"Measuring without understanding dynamics",move:"Add a longitudinal component to one active AI product's research cadence.",description:"Your team measures well but researches conventionally. You have sophisticated frameworks for defining and tracking UX success and strong credibility with business stakeholders around ROI. What's missing is the research infrastructure to generate the signals that would make those measurements meaningful in an AI context. You're measuring outcomes; you're not yet studying the dynamics — trust, adaptation, behavioral drift — that determine whether those outcomes are telling the truth. Success metrics are well-defined and regularly reviewed but don't include how users' relationship with the AI system evolves over time. Research is conducted at launch and occasionally at major feature updates, but not longitudinally between those points. The team is confident that positive metrics mean positive experiences, without studying whether users understand, trust, or appropriately rely on the AI system. Engagement is up; whether that engagement reflects genuine value or system-induced dependency is unknown.",
   hard:[
    {s:"Longitudinal research methods",w:"Designing studies, including diary studies, that track the same users over weeks or months as they adapt to AI features — capturing how trust, behavior, and mental models evolve rather than measuring a launch snapshot."},
    {s:"Evals & output quality judgement",w:"Writing quality rubrics and reviewing real outputs links model output quality to the UX metrics you already trust, so you can see why a metric moved."},
    {s:"Mixed-methods trust research",w:"Combining quantitative behavioral data with qualitative longitudinal interviews explains not just what users do, but why their relationship with the AI system changes over time."},
    {s:"Continuous eval loops",w:"Connecting quality criteria to every release and post-launch review makes measurement continuous instead of a launch-time event."}],
   soft:[{s:"Curiosity about causation not just correlation",w:"Strong measurement practitioners excel at describing patterns. The development need is the drive to explain those patterns — to ask why the metric moved, not just that it moved."},{s:"Comfort with less certain findings",w:"Longitudinal and qualitative methods produce findings that are rich but less statistically clean. Developing comfort presenting nuanced, directional insights expands methodological range."},{s:"Listening for what metrics do not capture",w:"User interviews regularly surface experiences that dashboards are blind to. Genuinely listening for these rather than filtering them through a metric-first frame is a practice, not just a stance."},{s:"Intellectual partnership with engineers",w:"Understanding how model behavior produces user behavior requires conversation with ML engineers who can explain model dynamics — a relationship skill as much as a technical one."}]},
  {name:"The Analyst Without a Platform",icon:"◍",high:"outcomes",low:"strategy",tension:"Evidence without positioning",move:"Reframe one upcoming research output as a prospective risk brief, not a findings report.",description:"Your team produces rigorous, credible, well-articulated evidence of UX's contribution to product outcomes. And it doesn't reliably change upstream decisions, because UX doesn't have the organizational positioning to be in the room where those decisions happen. You're producing excellent evidence for an audience that isn't making the decisions, or reaching the decision-makers too late to change direction. Research findings are shared widely and appreciated but rarely alter AI product direction at the architecture or strategy level. UX is consulted after key decisions — model selection, data strategy, feature scope — rather than during them. The team sometimes feels like it's documenting what happens rather than shaping what will happen. There's frustration that rigorous evidence isn't translating into influence.",
   hard:[
    {s:"Prospective risk briefing",w:"Reframing research from retrospective reports to forward-looking risk assessments and scenarios — here is what the evidence predicts about the feature currently in planning — changes which conversations UX gets invited into."},
    {s:"Executive risk communication",w:"Crafting one-page, visually clear briefs of complex UX evidence, with specific consequences and a recommendation, for senior stakeholders who will not read full reports."},
    {s:"Shared AI success metrics",w:"Using your evidence to co-define AI success with product and engineering gets UX into planning, because whoever defines success shapes the roadmap."},
    {s:"Workshop facilitation for strategic decisions",w:"Moving from presenting evidence to facilitating the decisions that evidence should inform puts UX in strategy rooms as an active participant, not a supplier of inputs."}],
   soft:[{s:"Reframing from reporter to advisor",w:"The identity shift from the person who has the data to the person whose judgment leaders seek is a soft skill, not a technical one. It requires deliberately positioning each interaction as advisory."},{s:"Proactive relationship building with decision-makers",w:"Evidence reaches decision-makers through relationships as much as through reports. Building informal connections creates the conduit that formal presentations rarely do."},{s:"Confidence in the face of ambiguity",w:"Strategic conversations involve uncertainty. Practitioners comfortable with definitive data often hesitate in these conversations. Developing comfort offering directional judgment builds strategic presence."},{s:"Narrative construction",w:"Evidence without a story rarely moves organizations. Building a compelling narrative arc — problem, consequence, evidence, recommendation — determines whether rigorous research drives decisions."}]},
  {name:"The Ethical Voice Unheard",icon:"◎",high:"trust",low:"strategy",tension:"Conscience without authority",move:"Translate one trust concern into a business risk framing and bring it to a strategic stakeholder.",description:"Your team has strong ethical conviction and genuine concern for user wellbeing, fairness, and transparency. But the team doesn't have the organizational positioning to act on what it sees. Trust concerns are raised and then absorbed by the organization without changing direction — because UX isn't in the room where direction is set. Your team raises concerns about AI features that proceed unchanged — not because the concerns were wrong, but because the team lacks the standing to insist on change. Trust and ethical input is welcomed as a perspective and treated as optional — one voice among many rather than a requirement of good process. There's a sense that the team is documenting harms it cannot prevent. Partners acknowledge UX's perspective but don't experience it as a constraint on what they build.",
   hard:[
    {s:"Executive risk communication",w:"Translating trust concerns into business risk language — liability exposure, user trust erosion, regulatory consequence — is the primary mechanism for making them heard in strategy conversations."},
    {s:"Evidence-based trust advocacy",w:"Grounding trust arguments in user research data, incident case studies, and behavioral evidence — rather than purely in principles — makes the argument harder to dismiss as opinion."},
    {s:"AI governance & regulatory fluency",w:"The EU AI Act creates legal consequences for untrustworthy design. Knowing accurately what applies and when gives your concerns an external authority that internal advocacy often lacks."},
    {s:"Process change design",w:"Building a trust gate into the delivery process means trust no longer depends on winning every argument."}],
   soft:[{s:"Strategic patience with conviction intact",w:"Maintaining conviction while taking a long view — building positioning as a multi-quarter campaign — is a specific emotional and strategic capability that protects against cynicism."},{s:"Finding allies before presenting positions",w:"Ethical concerns that arrive in meetings without prior coalition-building are easier to dismiss. Doing the relational work before the public work changes the dynamic."},{s:"Separating the argument from the relationship",w:"Presenting an ethical concern without damaging the working relationship with the person whose decision you are challenging requires a specific kind of relational intelligence — direct, specific, and non-personal."},{s:"Resilience without resentment",w:"Processing disappointment, learning from unsuccessful advocacy attempts, and trying again with a different approach is a sustainability skill as much as a performance skill."}]},
  {name:"The Principled but Unproven",icon:"◐",high:"trust",low:"outcomes",tension:"Conviction without proof",move:"Build a retrospective evidence case for one trust decision already made.",description:"Your team is ethically sophisticated and deeply committed to trustworthy AI design. What the team lacks is the measurement infrastructure to demonstrate that trustworthy design produces better outcomes — for users and for the business. Principle without proof is conviction that depends entirely on others sharing your values, which is not a reliable organizational strategy. The team advocates for trust-building design decisions but struggles to quantify what those decisions produce in terms that business stakeholders respond to. There's a sense that UX has to choose between doing the right thing and proving ROI. Trust, agency, and user wellbeing are treated as values the team holds rather than outcomes the team measures. Trust arguments are made compellingly but don't build cumulative organizational credibility.",
   hard:[
    {s:"Reliance metrics literacy",w:"Acceptance, edit, override, and verification rates turn trust from a value into a trackable outcome, and show whether users rely on the AI appropriately."},
    {s:"Impact case-building",w:"Building evidence cases for trust decisions already made — showing what changed in reliance, retention, or support volume after a transparency pattern was introduced."},
    {s:"A/B testing for trust design choices",w:"Running controlled experiments comparing trust design variants produces causal evidence that principles alone cannot. Quantifying the benefit closes the proof gap."},
    {s:"Value realisation tracking",w:"Showing whether trustworthy AI actually reduces user effort, time, and errors makes a stronger case than modelled ROI."}],
   soft:[{s:"Learning the language of proof",w:"Reframing measurement as the mechanism for making values matter organizationally is a mindset shift, not a compromise."},{s:"Comfort with data that complicates the story",w:"Trustworthy design sometimes shows ambiguous outcomes in standard metrics before trust effects compound. Comfort presenting mixed results without retreating to pure principle is a mature measurement skill."},{s:"Connecting principles to practitioners' self-interest",w:"Making the case for trust measurement to colleagues requires framing it in terms of what they care about — job security, organizational respect — not just what you care about."},{s:"Publishing and sharing findings",w:"Building an external track record of trust design outcomes through writing or speaking creates credibility that internal advocacy alone does not provide."}]},
  {name:"The Fast Shipper",icon:"➤",high:"process",low:"outcomes",tension:"Velocity without evidence",move:"Before the next AI release, agree one quality rubric and one reliance metric, and check both two weeks after launch.",description:"Your team has adapted quickly. Designers prototype with live models, AI patterns are in the design system, and AI features ship on a regular cadence. What's missing is knowing whether they work. Success means launched. Thumbs up/down feedback is collected but rarely read. No one can say whether users rely on the AI appropriately, whether output quality held up after the last model update, or whether the feature saves anyone time. The team is fast in a way that makes it hard to tell progress from activity.",
   hard:[
    {s:"Output quality rubrics",w:"Defining what a good output looks like before shipping, not after, gives every release a quality bar the team can actually check."},
    {s:"Reliance metrics literacy",w:"Acceptance, edit, override, and verification rates show whether users rely on the AI appropriately, which usage numbers can't tell you."},
    {s:"Drift & change monitoring",w:"Model updates can silently change quality. Tracking reliance and quality across versions catches regressions your release cadence would otherwise hide."},
    {s:"Value realisation tracking",w:"Proving that the AI reduces user effort, time, or errors is what turns shipped features into demonstrated outcomes."}],
   soft:[
    {s:"Defining done as working, not shipped",w:"Making post-launch evidence part of “done” changes what the team optimises for."},
    {s:"Patience for evidence",w:"Letting a feature run long enough to learn from it, before moving on, is a discipline fast teams have to practise deliberately."},
    {s:"Curiosity about what happened next",w:"Going back to features after launch, and asking what users actually did with them, is the habit that closes the loop."},
    {s:"Saying “we don't know yet”",w:"Being honest about unproven impact, instead of reporting output as progress, builds credibility that lasts."}]},
  {name:"The Siloed Pioneer",icon:"★",isSiloed:true,tension:"Individual excellence without system",move:"Spend 90 days systematizing and documenting what your highest factor already demonstrates.",description:"One part of your AI-UX system is genuinely advanced. Someone — a team, a leader, a specific practitioner — has built something real. But it hasn't propagated. The conditions that made the one high factor possible don't exist elsewhere. You have a proof of concept for what good AI-UX practice looks like. You don't yet have a system that reproduces it. There's one project, team, or person consistently held up as 'how we should be doing this.' The advanced practice depends on specific people or relationships, not on structure — if those people left, the capability would leave with them. Progress feels fragile and non-transferable. The rest of the organization looks to the pioneer with admiration but doesn't know how to replicate it.",
   hard:[
    {s:"Practice documentation & playbook design",w:"Converting tacit expertise into explicit, reusable process documentation — the craft of writing playbooks and method guides that others can follow without the pioneer present."},
    {s:"Training & workshop design",w:"Translating what you do instinctively into something teachable — with exercises, examples, and checkpoints — is a distinct skill from the expert practice itself."},
    {s:"Pilot program design",w:"Designing controlled experiments for replicating advanced practice in a second context — with clear success criteria and adaptation mechanisms — converts proof of concept into scalable model."},
    {s:"Codifying expertise for AI tools",w:"Turning the pioneer's judgement into reusable prompts, review skills, eval rubrics, and AI-readable design guidance lets expertise scale without the expert in the room."}],
   soft:[{s:"Letting go of the expert identity",w:"Shifting identity from the person who does it best to the person who builds the system that does it well requires releasing some of the individual-excellence story."},{s:"Teaching with patience for different starting points",w:"Others will not arrive where the pioneer is through the same path. Genuine patience for slower progress and imperfect early attempts is a necessary condition for effective knowledge transfer."},{s:"Building without being the bottleneck",w:"Designing processes and standards that distribute quality without routing everything through the pioneer is the core organizational challenge this archetype faces."},{s:"Recognizing and crediting others' progress",w:"Creating conditions for others to experience success — and ensuring that success is visible and attributed — builds the motivation for others to invest in advancing their own practice."}]},
  {name:"The Balanced Profile",icon:"≈",isBalanced:true,tension:"Balance without momentum",move:"Advance all five factors in parallel — choose one initiative per factor for the next 90 days.",description:"Your factor scores are relatively even — no single factor dramatically outpaces or undermines the others. This is a genuine strength that many organizations never achieve. No one area of your practice is actively sabotaging another, and the system as a whole has a coherent foundation to build from. The organization advances in multiple dimensions simultaneously rather than lurching forward in one area while others stagnate. Cross-functional partners experience UX as consistent. There's no dominant tension pulling in a specific direction; challenges are more about elevation than correction. The composite level is the most meaningful indicator — it reflects the whole system rather than a single outlier.",
   hard:[
    {s:"Agentic interaction design",w:"As AI increasingly acts on users' behalf, balanced practitioners are well-positioned to develop specialist capability in approvals, interruption, undo, and handoff — the interaction paradigms that will define the next five years."},
    {s:"AI tool & verification norms",w:"Using AI to accelerate research, synthesis, and design — with clear norms for checking what it produces — is a maturing practice that balanced profiles can integrate without single-factor gaps."},
    {s:"Design system as AI context",w:"Making tokens, components, and guidelines readable by AI tools keeps AI-generated UI consistent, a growing specialty that organizations are actively investing in."},
    {s:"Strategic communication & thought leadership",w:"Practitioners with no dominant weakness are well-positioned to become thought leaders — synthesizing across disciplines, publishing insights, and contributing to the field."}],
   soft:[{s:"Maintaining momentum without crisis",w:"Balanced practitioners sometimes struggle to sustain development energy without a pressing gap. Building the habit of proactive growth — choosing a direction before one is forced — is the specific development need."},{s:"Choosing depth over continued breadth",w:"At some point, continued generalist investment yields diminishing returns. The soft skill is choosing which factor to develop into a genuine specialty and committing long enough for depth to accumulate."},{s:"Mentoring and field contribution",w:"Practitioners with no acute gaps are often the most available to give back — mentoring, writing, facilitating communities of practice. This is both a development path and a contribution the field needs."},{s:"Resisting the pull of comfortable competence",w:"Balance without ambition becomes stagnation. Deliberately choosing stretch goals — the intimidating method, the difficult stakeholder, the unfamiliar domain — is the key behavior for keeping a balanced profile from plateauing."}]}
];

export const NASCENT_HARD: ArchSkill[] = [
  {s:"UX value articulation",w:"Frame UX's contribution in business risk and ROI language. This is the entry point for gaining any upstream AI decision access."},
  {s:"Stakeholder mapping",w:"Map who controls AI decisions in your organization and where leverage points exist for UX to be included."},
  {s:"AI literacy fundamentals",w:"Understand context, retrieval, tools, and agents, and how AI fails — hallucination, sycophancy, drift. This is now a baseline expectation, and an EU AI Act obligation."},
  {s:"Designing beyond the happy path",w:"Start specifying what happens when AI output is uncertain, wrong, empty, or slow — the moments that decide whether users trust it."}
];
export const NASCENT_SOFT: ArchSkill[] = [
  {s:"Political savvy & org navigation",w:"Understand unspoken power dynamics — not just formal org charts — as the foundation for gaining upstream AI access."},
  {s:"Rapid skill acquisition",w:"Build the habit of getting to good enough in new domains quickly. The pace of AI development makes this a career-critical meta-skill."},
  {s:"Intellectual humility",w:"Be willing to ask basic questions in rooms with more technical expertise — the foundation for cross-functional credibility."},
  {s:"Experimentation mindset",w:"Treat every research or design adaptation as a small experiment with a hypothesis and a learning. This converts awareness into practice."}
];

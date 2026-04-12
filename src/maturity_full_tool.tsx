import { useState } from "react";
import "./maturity_full_tool.css";
import { archetypeIconMap } from "./assets/icons/archetype-icons";

// ── DATA ──────────────────────────────────────────────────────────────────

const FACTORS = [
  { id:"strategy", name:"AI-UX Strategy", weight:0.25, color:"#8d246f", bg:"#EEEDFE", textDark:"#26215C",
    anchor:"When your company makes a major AI product decision, is UX in the room?",
    levelSkills:{
      self:{1:{name:"UX value articulation",desc:"Frame UX's contribution in business risk and ROI language, not design quality."},2:{name:"Stakeholder mapping",desc:"Map who controls AI decisions and where leverage points exist for UX."},3:{name:"Stakeholder influence & narrative",desc:"Frame UX value in the language of risk, impact, and strategic opportunity."},4:{name:"Organizational psychology & influence",desc:"Guide transformation through alliance-building, resistance mapping, and coalition strategy."},5:{name:"AI policy & governance literacy",desc:"Develop working fluency in emerging AI regulation and how it shapes design obligations."}},
      teams:{1:{name:"Quick win identification",desc:"Find low-cost, high-visibility opportunities to demonstrate UX's AI contribution."},2:{name:"Cross-functional working agreements",desc:"Create explicit agreements on when UX enters AI development and who owns what."},3:{name:"Shared success metrics",desc:"Develop measurement frameworks the full cross-functional team co-owns."},4:{name:"Ethics by design integration",desc:"Embed ethical review as a standard generative phase in product development."},5:{name:"AI product governance at team level",desc:"Build team-level frameworks that determine which AI features to build or decline."}},
      orgs:{1:{name:"Resistance recognition",desc:"Identify whether barriers are structural, cultural, or resource-based."},2:{name:"Coalition building",desc:"Cultivate allies in PM, engineering, legal, and ethics for responsible AI."},3:{name:"Process change design",desc:"Institutionalize UX's role rather than requiring constant individual advocacy."},4:{name:"AI governance participation",desc:"Secure UX's seat in ethics committees and model review boards."},5:{name:"Industry standards contribution",desc:"Represent your org in efforts to define responsible AI design standards."}}
    }
  },
  { id:"process", name:"AI-Native Process", weight:0.25, color:"#0c7892", bg:"#E1F5EE", textDark:"#04342C",
    anchor:"When did your team last study how users adapt to an AI feature over time?",
    levelSkills:{
      self:{1:{name:"Prompt engineering basics",desc:"Work fluently with generative AI tools for synthesis, ideation, and prototyping."},2:{name:"AI system mental models",desc:"Build vocabulary for probabilistic outputs, model drift, and hallucination patterns."},3:{name:"Longitudinal research methods",desc:"Design studies that track how trust and mental models evolve over time."},4:{name:"AI evaluation frameworks",desc:"Assess AI outputs for bias, fairness, transparency, and user value alignment."},5:{name:"Novel research methodology development",desc:"Design new methods for studying emergent human-AI behaviors at scale."}},
      teams:{1:{name:"Design for determinism vs. probability",desc:"Adapt design specifications for probabilistic rather than fixed outputs."},2:{name:"Designing for uncertainty states",desc:"Build team fluency in confidence visualization, error states, and fallback experiences."},3:{name:"Adaptive planning methods",desc:"Introduce scenario-based roadmaps and assumption-driven experimentation."},4:{name:"Human-AI collaboration pattern libraries",desc:"Build a design system for AI interaction patterns that evolves with the product."},5:{name:"Human-AI co-design methodology",desc:"Integrate user feedback directly into AI model iteration in real time."}},
      orgs:{1:{name:"Basic AI feature evaluation",desc:"Evaluate AI features for moments where behavior will confuse or erode trust."},2:{name:"AI literacy evangelism",desc:"Raise AI understanding across the organization so teams make better decisions."},3:{name:"Research operations for AI",desc:"Build a living repository of AI behavioral insights and reusable protocols."},4:{name:"Culture of learning design",desc:"Design org practices that sustain continuous learning about AI."},5:{name:"Public accountability practices",desc:"Champion transparency reports, public bias audits, and standards participation."}}
    }
  },
  { id:"culture", name:"AI Literacy & Culture", weight:0.20, color:"#193182", bg:"#FAECE7", textDark:"#4A1B0C",
    anchor:"Can your team engage ML engineers substantively — and are they invited to?",
    levelSkills:{
      self:{1:{name:"AI literacy fundamentals",desc:"Understand training data, model outputs, confidence scores, and failure modes."},2:{name:"Change management principles",desc:"Apply ADKAR, Kotter, and Bridges frameworks to team transformation."},3:{name:"Systems thinking",desc:"Map how design decisions ripple through sociotechnical systems and feedback loops."},4:{name:"Cross-disciplinary facilitation",desc:"Lead multi-stakeholder conversations involving design, engineering, ethics, and data science."},5:{name:"Thought leadership & publication",desc:"Develop original frameworks and contribute to industry discourse publicly."}},
      teams:{1:{name:"AI vocabulary building",desc:"Establish shared terminology across UX, PM, and engineering for AI concepts."},2:{name:"Cross-functional relationship building",desc:"Create working relationships with ML engineers outside formal project structures."},3:{name:"Longitudinal team research",desc:"Run studies tracking how users adapt to AI features over weeks and months."},4:{name:"AI literacy program design",desc:"Design cross-functional education tailored to each role's decision-making needs."},5:{name:"Cross-disciplinary ownership models",desc:"Implement team structures with shared co-ownership of AI product outcomes."}},
      orgs:{1:{name:"Organizational diagnostic skills",desc:"Assess where your org falls on the AI adoption curve and UX maturity spectrum."},2:{name:"Change communication",desc:"Communicate the why of UX-led AI change in ways that land with different audiences."},3:{name:"Organizational change management",desc:"Apply formal change management to UX-led initiatives with stakeholder mapping."},4:{name:"Distributed leadership development",desc:"Build AI-UX leadership capability across the organization, not just within UX."},5:{name:"Organizational design for AI",desc:"Shape team structures, incentives, and decision rights for human-centered AI."}}
    }
  },
  { id:"outcomes", name:"Outcomes & Measurement", weight:0.15, color:"#5F5E5A", bg:"#F1EFE8", textDark:"#2C2C2A",
    anchor:"If your AI optimizes for engagement over wellbeing, would your metrics catch it?",
    levelSkills:{
      self:{1:{name:"Self-assessment & gap awareness",desc:"Map current skills against where the field is heading and identify priority gaps."},2:{name:"Data interpretation skills",desc:"Read and interrogate behavioral analytics and translate them into design implications."},3:{name:"Speculative design practice",desc:"Use scenario planning and design fiction to anticipate downstream AI impacts."},4:{name:"Personal change portfolio",desc:"Document a track record of changes led with evidence of impact, not just artifacts."},5:{name:"Mentorship at scale",desc:"Systematically build AI-UX capability in others through teaching and community building."}},
      teams:{1:{name:"Research for trust",desc:"Measure whether users understand, calibrate, and appropriately rely on AI recommendations."},2:{name:"Participatory AI feature critique",desc:"Establish rituals for asking who could this harm before features ship."},3:{name:"Bias auditing as team practice",desc:"Stress-test AI systems for bias across diverse user populations before and after launch."},4:{name:"Continuous bias monitoring systems",desc:"Implement post-launch processes for detecting experience degradation over time."},5:{name:"Predictive experience monitoring",desc:"Anticipate user experience degradation before it appears in satisfaction metrics."}},
      orgs:{1:{name:"UX value articulation",desc:"Frame UX's contribution in terms of risk reduction, trust, and long-term retention."},2:{name:"AI literacy evangelism",desc:"Raise AI literacy so teams can make better decisions about what and how to measure."},3:{name:"UX maturity advancement strategy",desc:"Build a deliberate multi-factor plan for advancing AI-UX maturity over time."},4:{name:"Impact measurement frameworks",desc:"Track user trust, wellbeing, agency, and equity, not just engagement and conversion."},5:{name:"Long-term societal impact assessment",desc:"Track generational effects of AI systems on human capabilities and social structures."}}
    }
  },
  { id:"ethics", name:"Ethics & Accountability", weight:0.15, color:"#b06407", bg:"#FBEAF0", textDark:"#4B1528",
    anchor:"Has UX ever recommended not building an AI feature on ethical grounds — and was that heard?",
    levelSkills:{
      self:{1:{name:"Growth mindset for uncertainty",desc:"Develop comfort operating without upfront certainty, a defining condition of AI work."},2:{name:"Ethical reasoning basics",desc:"Ask who is harmed, how, and at what scale before shipping, not after."},3:{name:"Systems thinking for ethics",desc:"Trace ethical implications of design decisions across populations and time."},4:{name:"AI evaluation frameworks (ethical)",desc:"Assess AI outputs for bias, fairness, and alignment with user values at scale."},5:{name:"Thought leadership in AI ethics",desc:"Contribute original ethical frameworks to industry discourse."}},
      teams:{1:{name:"Basic AI feature evaluation",desc:"Identify moments where system behavior could discriminate or erode autonomy."},2:{name:"Participatory AI feature critique",desc:"Normalize who could this harm in design process, before not after launch."},3:{name:"Bias auditing as team practice",desc:"Develop team-level processes for identifying and mitigating AI bias."},4:{name:"Ethics by design integration",desc:"Embed ethical review as a standard, generative phase in product development."},5:{name:"AI product governance at team level",desc:"Enable UX to recommend declining AI features that don't meet ethical standards."}},
      orgs:{1:{name:"Resistance recognition",desc:"Identify where org resistance to ethical review is structural, cultural, or resource-based."},2:{name:"Coalition building for ethics",desc:"Build allies in legal, compliance, and leadership for responsible AI."},3:{name:"Organizational change management",desc:"Apply structured change management to introduce ethical AI practices at scale."},4:{name:"AI governance participation",desc:"Ensure UX is embedded in ethics committees and model review decisions."},5:{name:"AI ethics policy development",desc:"Lead development of org AI ethics policies that shape which capabilities are built."}}
    }
  }
];

const LEVELS = [
  {level:1,label:"Absent / Reactive",   headline:"AI is someone else's problem.",                              color:"#C0392B",bg:"#fdf3f2"},
  {level:2,label:"Developing / Aware",  headline:"We know AI is different. We're starting to adjust.",         color:"#D46A1A",bg:"#fdf6ee"},
  {level:3,label:"Emerging / Structured",headline:"We have methods for this. We're building shared ownership.",color:"#B5860D",bg:"#fdfbee"},
  {level:4,label:"Integrated / Holistic",headline:"Human-centered AI is how we work, not a project name.",     color:"#1E7E4E",bg:"#f0fbf5"},
  {level:5,label:"Transformative / Pioneering",headline:"We're creating the playbook others will follow.",      color:"#2558C8",bg:"#f0f4fd"}
];

// Five pyramid layers — AI Products and Society unlock at higher levels
const PYRAMID_LAYERS = [
  {id:"self",     label:"Oneself",            color:"#534AB7", minLevel:1},
  {id:"teams",    label:"UX & Product Teams", color:"#750192", minLevel:1},
  {id:"orgs",     label:"Organizations",      color:"#0c7892", minLevel:1},
  {
    id:"products", label:"AI Products",       color:"#1E7E4E", minLevel:4,
    aspiration:"At Level 4+, your organizational influence shapes the products themselves — designing AI systems that deliver genuine user value, preserve agency, and build trust at scale.",
    skills:{
      4:{name:"Human-compatible AI systems design",
         desc:"Move beyond human-centered design toward human-compatible AI — systems that preserve user agency, adapt without manipulating, and remain legible to the people they serve. Grounded in MIT Media Lab AHA program research on designing AI for human flourishing.",
         stretch:{name:"Wellbeing-by-design frameworks",desc:"Apply self-determination theory (autonomy, competence, relatedness) as explicit design criteria — measuring whether the AI system strengthens or erodes these psychological foundations over time."}},
      5:{name:"Longitudinal product impact research",
         desc:"Design studies that track how AI products affect user capability, autonomy, and wellbeing over months, not just satisfaction at launch. Distinguishes between AI that helps users do more and AI that creates dependency.",
         stretch:{name:"Cross-product ethical pattern libraries",desc:"Develop and publish reusable AI design patterns — trust calibration, meaningful override, consent architecture, explanation design — that other teams can adopt, multiplying your impact beyond your own products."}}
    }
  },
  {
    id:"society",  label:"Society",            color:"#2558C8", minLevel:5,
    aspiration:"At Level 5, the UX practitioner becomes a societal change agent — using futures literacy, deep creativity, and mastery of unknown unknowns to design AI that contributes to human flourishing at scale.",
    skills:{
      5:{name:"👉 Futures studies & strategic foresight",
         desc:"Apply structured foresight methodologies — scenario planning, signal scanning, backcasting, cone of futures — to anticipate how AI products interact with society over years and decades. Draws on the World Economic Forum's framing of futures studies as tools for resilience and innovation, and the Unknown Unknowns framework for navigating what we do not yet know we do not know.",
         stretch:{name:"Speculative design for AI",desc:"Use design fiction, provocative prototyping, and what-if scenarios to make visible the societal consequences of AI design decisions before they scale. The goal is to surface unknown unknowns before they become unrecoverable ones."}}
    },
    societalSkills:[
      {category:<span class="skill-name text-center">👉 Creativity amplification</span>,
       desc:"In the AI era, creativity is a defining human advantage. At the societal level, UX practitioners apply problem solving and creativity skills in a manner that influences new ideas and best patterns that scale. New and original ideas that come from thinking outside-the-box via imagination, originality, and expressiveness, enable innovation. Apply divergent ideation, conceptual bridging, metaphorical thinking, storytelling, visual problem-solving, and tastemaking (the act of developing and applying vision and intuition to make a product desirable and memorable, rather than just functional).",
       ref:"Grounded in the Creativity Amplification Framework: AI + Execution = Efficiency, but Humans + Imagination = Innovation."},
      {category:<span class="skill-name text-center">👉 Designing for unknown unknowns</span>,
       desc:"The Rumsfeld Matrix identifies unknown unknowns — things we are not aware of and do not understand — as both the domain of greatest AI risk and the space where genuine innovation lives. UX practitioners develop Anti-Problem Definition, Assumption Reversal, cross-domain pattern transfer, and cultural signal detection to systematically surface what AI cannot, because AI can only recombine what it has been trained on.",
       ref:"Grounded in Angela Pesta's UX Salon Barcelona (Sept 2025): designers explore frontiers AI can only navigate once those frontiers are mapped."},
      {category:<span class="skill-name text-center">👉 Human flourishing metrics</span>,
       desc:"Design measurement frameworks that track whether AI products contribute to human flourishing at population scale — drawing on self-determination theory (autonomy, competence, relatedness), digital wellbeing research, and the MIT Media Lab AHA program framework for assessing AI impact on wisdom, wonder, and wellbeing. Move beyond user satisfaction toward societal health indicators: democratic participation, equity, mental health, and human capability development.",
       ref:"Grounded in MIT MAS.S64 'Designing AI for Human Flourishing' and the 2025 Psychology of Technology Conference on purpose-driven AI."},
      {category:<span class="skill-name text-center">👉 Public interest AI advocacy</span>,
       desc:"Participate in standards bodies, regulatory consultations, and public discourse to shape the rules governing AI design, not just follow them. Treat AI literacy as a public good and design programs that improve societal understanding of AI systems, their capabilities, and their limits.",
       ref:"Grounded in the argument that UX leaders are catalysts for a society that flourishes in the AI era — requiring operation at the intersection of design, governance, and civic responsibility."}
    ]
  }
];

const ARCHETYPES = [
  {name:"The Invisible Expert",icon:"◆",high:"culture",low:"strategy",tension:"Competence without positioning.",move:"Make the risk case for upstream inclusion — use language of risk, not craft.",description:"Your team is genuinely capable. Practitioners understand AI systems, ask good questions in cross-functional rooms, and care deeply about doing this work well. The problem isn't competence — it's that competence isn't translating into organizational influence. UX is consistently downstream from the decisions that matter most. Your team has well-formed opinions about AI architecture, model selection, and product direction that no one formally asks for. You find out about major AI feature decisions after they've already been shaped — during implementation, not ideation. Cross-functional partners respect your craft but don't think to pull UX into upstream conversations. You're executing well on things that shouldn't have been built the way they were.",hard:[{s:"UX impact storytelling with data",w:"Translating findings into business risk and ROI language is the primary currency for gaining upstream access in 2026."},{s:"AI product strategy frameworks",w:"Tools like opportunity solution trees adapted for AI contexts give you vocabulary to participate in — not just respond to — strategic conversations."},{s:"Stakeholder mapping & influence charting",w:"Systematically mapping decision-makers and gatekeepers in AI initiatives is the practical foundation for building upstream access."},{s:"Executive presentation design",w:"Communicating complex AI-UX tradeoffs to non-design leadership in concise, visually clear formats is increasingly how UX influence is won."}],soft:[{s:"Political savvy & org navigation",w:"Understanding unspoken power dynamics — not just formal org charts — separates practitioners who get invited upstream from those who don't."},{s:"Self-promotion without self-promotion",w:"Making your team's work visible through sharing and narrating is a skill. Competence that isn't seen doesn't compound."},{s:"Strategic patience",w:"Gaining a seat at the table is a campaign, not a request. Consistent incremental moves without frustration make the campaign winnable."},{s:"Reading the room",w:"Knowing when to push, when to listen, and when to let others take credit for ideas you seeded is a high-leverage organizational skill."}]},
  {name:"The Compliant Builder",icon:"▲",high:"process",low:"ethics",tension:"Efficiency without principle",move:"Add one 'what could go wrong for whom?' conversation at AI feature scoping.",description:"Your team has adapted its methods. You're running the right kinds of studies, building design systems for uncertainty, collaborating cross-functionally, and shipping with reasonable quality. But it's building toward metrics and timelines rather than toward principled outcomes. Ethical considerations arise reactively — when a problem surfaces publicly, not before it ships. You've never had a team-level conversation about whether to not build a specific AI feature on ethical grounds. Bias is understood as a technical problem owned by data science or engineering, not a design concern. Transparency and explainability are interaction patterns to implement on request, not principles the team actively advocates for. When ethical issues arise, they're treated as edge cases or PR problems.",hard:[{s:"Consequence Scanning methodology",w:"A structured participatory technique for identifying intended and unintended consequences of technology. Fast (90 min) and directly applicable to AI feature scoping."},{s:"AI bias detection & auditing",w:"Practical tools (Fairlearn, IBM AI Fairness 360, heuristic audits) for identifying bias in model outputs — a now-expected skill in AI product teams."},{s:"Transparency & explainability design patterns",w:"Designing confidence indicators, reasoning disclosure, and user-override flows is a distinct craft. Explainable AI is projected to reach $33B by 2032."},{s:"EU AI Act & regulation literacy",w:"The EU AI Act creates legal obligations that intersect directly with UX design decisions, making designers indispensable to product and legal teams."}],soft:[{s:"Moral courage in design reviews",w:"Naming an ethical concern clearly, calmly, and specifically without making it a conflict is a rare and high-value skill in fast-moving AI teams."},{s:"Slowing down under velocity pressure",w:"The practitioner who can advocate for a brief ethical pause and frame it as risk management — not obstruction — protects both product and team."},{s:"Reframing ethics as design quality",w:"Positioning ethical considerations as product quality issues (trust, retention, legal exposure) rather than moral ones makes advocacy far more effective."},{s:"Constructive dissent",w:"Disagreeing with a direction without becoming the obstacle means offering an alternative, not just a concern. This is a practiced skill."}]},
  {name:"The Advocate Without Infrastructure",icon:"●",high:"ethics",low:"process",tension:"Values without consistency",move:"Make one process step non-negotiable for every AI project this quarter.",description:"Your team cares deeply about doing this right. The values are genuine and the ethical instincts are strong. But the practice is inconsistent — ethical principles and research intentions don't translate into repeatable process. What actually gets done depends on who's staffed to the project and how much time exists. Your team can articulate what responsible AI design looks like but applies it differently project to project. Research methods haven't evolved much beyond traditional usability testing despite the team's awareness that AI requires something different. You advocate for longitudinal trust research and bias audits but rarely have the infrastructure to run them consistently. Cross-functional partners see UX as principled but unpredictable.",hard:[{s:"Longitudinal UX research design",w:"Studies that track how trust and mental models evolve over weeks are the most under-practiced AI-native method and the one most likely to catch slow-moving harms."},{s:"Research operations (ResearchOps)",w:"Building reusable research infrastructure — templates, repositories, protocols — converts one-off ethical research into repeatable organizational practice."},{s:"Adaptive prototyping for AI features",w:"Designing prototypes that simulate probabilistic AI behavior helps teams evaluate ethical implications before building."},{s:"Design system documentation for AI patterns",w:"Writing explicit guidelines for when and how to use uncertainty, error, and explanation patterns creates consistency that currently depends on who is on the project."}],soft:[{s:"Process discipline under ambiguity",w:"Applying a consistent method even when timelines compress or team composition changes is what converts ethical conviction into organizational reliability."},{s:"Teaching and knowledge transfer",w:"Turning personal ethical practice into team practice requires the ability to explain, model, and coach — not just do."},{s:"Tolerance for imperfect progress",w:"Implementing something imperfect consistently and then improving it is more valuable than perfect thinking that never ships."},{s:"Documenting decisions not just outputs",w:"Recording why ethical choices were made — not just what was designed — builds the institutional memory that makes practice consistent across projects."}]},
  {name:"The Metric-Driven Optimizer",icon:"■",high:"outcomes",low:"ethics",tension:"Measuring the wrong things confidently",move:"Add one non-engagement metric (trust, meaningful override rate) to an active product.",description:"Your team is fluent in measurement and credible with business stakeholders. The risk is that you're measuring the wrong things — confidently. Engagement metrics, satisfaction scores, and task completion rates don't surface the slow-moving harms AI systems can create: eroding trust, degrading user agency, amplifying bias across populations over time. Your dashboards are sophisticated and well-maintained but don't include trust calibration, user agency, or equity indicators. You can demonstrate UX ROI clearly but struggle to demonstrate UX risk. When ethical issues arise, the team doesn't have a measurement framework that would have surfaced them earlier. Leadership trusts your numbers but those numbers don't capture what's actually happening with users in AI contexts.",hard:[{s:"Trust measurement frameworks",w:"Methods for measuring user trust calibration — the Jian Trust Scale adapted for AI, task-appropriate reliance measurement, and longitudinal trust tracking."},{s:"User agency & autonomy metrics",w:"Measuring whether users feel in control — including override rate, decision-reversal patterns, and comprehension of system behavior — is an emerging practice with growing tooling support."},{s:"Algorithmic impact assessment",w:"Evaluating how AI outputs affect different demographic groups — before and after launch — moving from aggregate to equity-sensitive analysis."},{s:"Behavioral economics applied to AI",w:"Understanding when AI design nudges behavior and when nudging crosses into manipulation requires behavioral science frameworks beyond standard usability metrics."}],soft:[{s:"Epistemic humility about data",w:"Knowing what your metrics can and cannot tell you — and being willing to say so in stakeholder conversations — is more valuable than false confidence in a clean dashboard."},{s:"Comfort with qualitative evidence",w:"Genuine respect for what interviews and observations reveal about trust and harm rounds out a powerful quantitative toolkit."},{s:"Redefining success with stakeholders",w:"Changing what gets measured requires negotiating a shared definition of AI product success that includes human impact — not just business metrics."},{s:"Long-term thinking under short-term pressure",w:"Advocating for longitudinal metrics in organizations that report quarterly requires both conviction and skill in framing tradeoffs."}]},
  {name:"The Seat Without the Skills",icon:"◇",high:"strategy",low:"process",tension:"Positioning without updated craft",move:"Run one AI-native research method on an active project alongside your existing approach.",description:"Your team has organizational standing. UX is in the room for AI decisions and is recognized as a legitimate voice in product direction. The problem is that the methods haven't kept pace with the positioning. When UX is called on to evaluate an AI feature or design for uncertainty, the team reaches for traditional tools that weren't built for this. You have a seat at the AI table but sometimes struggle to contribute substantively on questions about model behavior, confidence thresholds, or adaptive systems. Research is still largely point-in-time — usability testing at launch rather than longitudinal study of how users adapt over time. Design specs for AI features still assume deterministic outputs, creating mismatches when the system behaves probabilistically. Cross-functional partners occasionally question whether UX's input reflects an understanding of how the AI actually works.",hard:[{s:"ML concepts for designers",w:"Practical fluency in training data, model drift, confidence scores, and hallucination patterns — enough to evaluate AI product decisions without needing to code."},{s:"Conversational & agentic UX design",w:"Designing for AI agents, chatbots, and voice interfaces requires distinct patterns — repair strategies, escalation paths, context management — not present in traditional design systems."},{s:"Prompt engineering for UX workflows",w:"Using generative AI effectively in research synthesis and design critique is a practical productivity skill that also informs how to design interfaces for users prompting AI systems."},{s:"AI-assisted research tools proficiency",w:"Platforms like Dovetail AI, Maze, and Marvin are transforming qualitative research. Practitioners with strategic positioning need hands-on fluency to credibly evaluate and recommend these tools."}],soft:[{s:"Intellectual humility at the table",w:"Having strategic access while acknowledging knowledge gaps — without losing credibility — requires confidence secure enough to ask basic questions in senior rooms."},{s:"Rapid skill acquisition",w:"Getting to good enough in a new domain quickly through deliberate practice is a meta-skill that determines how fast the gap between positioning and craft closes."},{s:"Curiosity about technical systems",w:"Genuine interest in how AI systems work — not just what they produce — makes the learning sustainable and advances it faster."},{s:"Collaborative learning with engineers",w:"Using cross-functional relationships for learning — asking ML engineers to explain model behavior — accelerates craft development in ways no course can."}]},
  {name:"The Influential but Unguarded",icon:"◈",high:"strategy",low:"ethics",tension:"Influence without accountability",move:"Use your strategic positioning to introduce ethical foresight from a position of trust.",description:"Your team has genuine organizational influence over AI product direction. But ethical consideration isn't embedded in how that influence is exercised. The team advocates powerfully for user needs as traditionally understood — usability, clarity, delight — without a systematic framework for identifying when those needs are being served in ways that cause broader harm. Your team has never formally recommended against building an AI feature on ethical grounds — not because no feature has crossed a threshold, but because the threshold hasn't been clearly defined. Ethical questions arise informally in the margins of project discussions but don't have a home in the formal process. The team is trusted to advocate for users but interprets 'user needs' narrowly — the direct, stated needs of primary users, not the interests of affected populations. There's no shared language for identifying when a UX-approved feature is also an ethically questionable one.",hard:[{s:"Ethics by Design frameworks",w:"Structured methodologies (Value Sensitive Design, Responsible AI by Design) for embedding ethical evaluation into the upstream strategic conversations this archetype already participates in."},{s:"Stakeholder impact mapping",w:"Expanding user research beyond primary users to include affected populations and downstream communities — bringing a broader human-impact lens to strategic AI decisions."},{s:"AI governance design",w:"Designing review processes, accountability frameworks, and decision criteria that make AI development accountable is a craft, not just a stance."},{s:"Risk communication to leadership",w:"Translating complex ethical risks into evidence-based leadership briefings with specific consequences and recommended actions makes strategic influence responsible."}],soft:[{s:"Using influence proactively for accountability",w:"Practitioners with strategic access can normalize ethical review by including it in conversations they are already in. The soft skill is the willingness to use existing influence for this purpose."},{s:"Holding tension between speed and integrity",w:"The development need is maintaining organizational trust while introducing friction — knowing when and how to slow down without losing the room."},{s:"Expanding the definition of user",w:"Developing genuine concern for affected non-users — vulnerable populations, communities — expands both empathy and accountability."},{s:"Naming the unasked question",w:"In strategy conversations, the ethical question is often the one nobody asked. Surfacing it as a contribution — not a challenge — is a distinct skill."}]},
  {name:"The Informed but Unchanged",icon:"▣",high:"culture",low:"process",tension:"Knowledge without method",move:"Redesign one component of a current research plan to be AI-native.",description:"Your team understands AI. Practitioners have invested in learning how models work and can hold substantive conversations with data scientists. But that understanding hasn't translated into changed practice. The team still conducts research and designs experiences largely the way it always has — point-in-time studies, deterministic design specs, standard usability methods. Team members can explain probabilistic outputs and model drift in conversation but still write design specs that assume fixed, predictable behavior. Research plans reference user trust and adaptation as important considerations but the studies themselves are structured the same way they were before AI. There's a gap between what the team knows about AI and what the team does with that knowledge in practice. The team is curious and intellectually ready for change but hasn't had the structural conditions — time, permission, templates — to operationalize it.",hard:[{s:"Trust & reliability UX research methods",w:"Calibration studies, think-aloud with AI features, and longitudinal diary studies tracking trust evolution — practical methods for evaluating whether users appropriately trust AI outputs."},{s:"Uncertainty visualization design",w:"Communicating confidence levels, model variability, and ambiguity in ways that inform rather than confuse users is a distinct, teachable craft increasingly valued as AI features proliferate."},{s:"Speculative design & design fiction",w:"Using prototypes to explore future AI scenarios before building them converts AI literacy into design foresight — one of the fastest-growing methodologies in AI product teams."},{s:"Assumption mapping for AI features",w:"Identifying and documenting assumptions embedded in AI feature design before they become expensive mistakes is a key method for adaptive planning."}],soft:[{s:"Translating knowledge into action",w:"The gap between understanding and doing is often psychological as much as practical. Building the habit of converting insights into concrete methodological experiments is the key development need."},{s:"Experimentation mindset",w:"Treating every research or design adaptation as a small experiment — with a hypothesis, a method, and a learning — builds iterative practice that knowledge alone cannot create."},{s:"Peer accountability",w:"Committing to one methodological change with a colleague and checking in on it converts individual intention into social accountability."},{s:"Tolerating imperfect first attempts",w:"Practitioners with strong AI literacy often know enough to be self-critical about early AI-native attempts. Shipping the imperfect version and learning from it is the key behavior."}]},
  {name:"The Fluent but Unaccountable",icon:"▤",high:"culture",low:"ethics",tension:"Fluency without ethical infrastructure",move:"Run Consequence Scanning on one current AI feature as a team exercise.",description:"Your team understands AI deeply and engages with it fluently. But the team hasn't developed the ethical frameworks to evaluate whether AI capabilities should be deployed in the ways they're technically capable of being deployed. Fluency without ethics mistakes 'can' for 'should' — and in AI, that distinction carries enormous consequences. The team is excited about AI's capabilities and focuses on how to make them work well for users, without systematic attention to whether particular capabilities should be designed for at all. Ethical questions feel like a different domain — interesting, but not UX's responsibility. The team's literacy makes it easier to rationalize complex AI features without rigorously examining the value judgments embedded in those tradeoffs. There's no framework for identifying when a well-designed, technically impressive AI feature creates harm through its very function.",hard:[{s:"Ethical heuristics for AI evaluation",w:"Adapted evaluation frameworks — extending Nielsen's heuristics to include transparency, user agency, bias risk, and consent — applicable in existing design review workflows."},{s:"Consent & data transparency design",w:"Designing consent flows, data disclosure patterns, and permission architectures for AI systems — a growing regulatory and trust requirement under GDPR and the EU AI Act."},{s:"Participatory design for AI",w:"Involving diverse user populations — including those most affected by AI bias — in design and evaluation processes converts AI fluency into genuinely inclusive practice."},{s:"Bias taxonomy & detection patterns",w:"Understanding how different types of bias manifest in AI systems — and which design decisions create or mitigate each."}],soft:[{s:"Sitting with moral uncertainty",w:"Fluent practitioners are often comfortable with technical uncertainty but less practiced at holding ethical uncertainty — questions that do not resolve into clean answers."},{s:"Asking should we before how do we",w:"The habit of pausing before the execution question to ask the values question starts as a deliberate interruption and becomes instinct through practice."},{s:"Empathy for non-users and future users",w:"Technical fluency can narrow empathy toward people generating usage data. Deliberately expanding concern to include those harmed by AI without appearing in the dataset is a specific development need."},{s:"Intellectual independence from enthusiasm",w:"Practitioners who find AI genuinely exciting can be unconsciously motivated to rationalize rather than evaluate. Noticing when enthusiasm is doing your analysis is a form of critical self-awareness."}]},
  {name:"The Confident Measurer",icon:"◉",high:"outcomes",low:"process",tension:"Measuring without understanding dynamics",move:"Add a longitudinal component to one active AI product's research cadence.",description:"Your team measures well but researches conventionally. You have sophisticated frameworks for defining and tracking UX success and strong credibility with business stakeholders around ROI. What's missing is the research infrastructure to generate the signals that would make those measurements meaningful in an AI context. You're measuring outcomes; you're not yet studying the dynamics — trust, adaptation, behavioral drift — that determine whether those outcomes are telling the truth. Success metrics are well-defined and regularly reviewed but don't include how users' relationship with the AI system evolves over time. Research is conducted at launch and occasionally at major feature updates, but not longitudinally between those points. The team is confident that positive metrics mean positive experiences, without studying whether users understand, trust, or appropriately rely on the AI system. Engagement is up; whether that engagement reflects genuine value or system-induced dependency is unknown.",hard:[{s:"Longitudinal research design",w:"Designing studies that track the same users over weeks or months as they adapt to AI features — capturing how trust, behavior, and mental models evolve rather than measuring a launch snapshot."},{s:"Behavioral analytics for AI features",w:"Reading model performance dashboards alongside UX metrics — understanding how changes in model behavior surface in user behavior data, and vice versa."},{s:"Mixed-methods research integration",w:"Combining quantitative behavioral data with qualitative longitudinal interviews to explain not just what users do, but why their relationship with the AI system changes over time."},{s:"Diary study methods",w:"Participants document their experience with an AI feature over time, capturing trust-building, frustration, and behavioral change that one-time studies miss."}],soft:[{s:"Curiosity about causation not just correlation",w:"Strong measurement practitioners excel at describing patterns. The development need is the drive to explain those patterns — to ask why the metric moved, not just that it moved."},{s:"Comfort with less certain findings",w:"Longitudinal and qualitative methods produce findings that are rich but less statistically clean. Developing comfort presenting nuanced, directional insights expands methodological range."},{s:"Listening for what metrics do not capture",w:"User interviews regularly surface experiences that dashboards are blind to. Genuinely listening for these rather than filtering them through a metric-first frame is a practice, not just a stance."},{s:"Intellectual partnership with engineers",w:"Understanding how model behavior produces user behavior requires conversation with ML engineers who can explain model dynamics — a relationship skill as much as a technical one."}]},
  {name:"The Analyst Without a Platform",icon:"◍",high:"outcomes",low:"strategy",tension:"Evidence without positioning",move:"Reframe one upcoming research output as a prospective risk brief, not a findings report.",description:"Your team produces rigorous, credible, well-articulated evidence of UX's contribution to product outcomes. And it doesn't reliably change upstream decisions, because UX doesn't have the organizational positioning to be in the room where those decisions happen. You're producing excellent evidence for an audience that isn't making the decisions, or reaching the decision-makers too late to change direction. Research findings are shared widely and appreciated but rarely alter AI product direction at the architecture or strategy level. UX is consulted after key decisions — model selection, data strategy, feature scope — rather than during them. The team sometimes feels like it's documenting what happens rather than shaping what will happen. There's frustration that rigorous evidence isn't translating into influence.",hard:[{s:"Prospective risk briefing",w:"Reframing research from retrospective reports to forward-looking risk assessments — here is what the evidence predicts about the feature currently in planning — changes which conversations UX gets invited into."},{s:"Executive communication design",w:"Crafting one-page, visually clear summaries of complex UX evidence for senior stakeholders who will not read full reports. Design judgment applied to communication is as valued as design judgment applied to products."},{s:"Scenario planning & futures research",w:"Using evidence to build plausible future scenarios — showing leadership what different AI product trajectories look like for users — repositions UX as a foresight function, not a reporting function."},{s:"Workshop facilitation for strategic decisions",w:"Moving from presenting evidence to facilitating the decisions that evidence should inform puts UX in strategy rooms as an active participant, not a supplier of inputs."}],soft:[{s:"Reframing from reporter to advisor",w:"The identity shift from the person who has the data to the person whose judgment leaders seek is a soft skill, not a technical one. It requires deliberately positioning each interaction as advisory."},{s:"Proactive relationship building with decision-makers",w:"Evidence reaches decision-makers through relationships as much as through reports. Building informal connections creates the conduit that formal presentations rarely do."},{s:"Confidence in the face of ambiguity",w:"Strategic conversations involve uncertainty. Practitioners comfortable with definitive data often hesitate in these conversations. Developing comfort offering directional judgment builds strategic presence."},{s:"Narrative construction",w:"Evidence without a story rarely moves organizations. Building a compelling narrative arc — problem, consequence, evidence, recommendation — determines whether rigorous research drives decisions."}]},
  {name:"The Ethical Voice Unheard",icon:"◎",high:"ethics",low:"strategy",tension:"Conscience without authority",move:"Translate one ethical concern into a business risk framing and bring it to a strategic stakeholder.",description:"Your team has strong ethical conviction and genuine concern for user wellbeing, fairness, and transparency. But the team doesn't have the organizational positioning to act on what it sees. Ethical concerns are raised and then absorbed by the organization without changing direction — because UX isn't in the room where direction is set. Your team raises ethical concerns about AI features that proceed unchanged — not because the concerns were wrong, but because the team lacks the standing to insist on change. Ethical input is welcomed as a perspective and treated as optional — one voice among many rather than a requirement of good process. There's a sense that the team is documenting harms it cannot prevent. Partners acknowledge UX's ethical perspective but don't experience it as a constraint on what they build.",hard:[{s:"Risk framing for business audiences",w:"Translating ethical concerns into business risk language — liability exposure, user trust erosion, regulatory consequence — is the primary mechanism for making ethical arguments heard in strategy conversations."},{s:"Evidence-based ethics advocacy",w:"Grounding ethical arguments in user research data, incident case studies, and behavioral evidence — rather than purely in principles — makes the argument harder to dismiss as opinion."},{s:"Regulatory landscape literacy",w:"The EU AI Act and emerging AI laws create legal consequences for ethically problematic design decisions. Knowing this landscape gives ethical concerns an external authority that internal advocacy often lacks."},{s:"Change management for ethics programs",w:"Applying ADKAR or Kotter frameworks to introducing ethical AI practices — with stakeholder mapping, adoption planning, and reinforcement strategy — converts advocacy into program design."}],soft:[{s:"Strategic patience with conviction intact",w:"Maintaining conviction while taking a long view — building positioning as a multi-quarter campaign — is a specific emotional and strategic capability that protects against cynicism."},{s:"Finding allies before presenting positions",w:"Ethical concerns that arrive in meetings without prior coalition-building are easier to dismiss. Doing the relational work before the public work changes the dynamic."},{s:"Separating the argument from the relationship",w:"Presenting an ethical concern without damaging the working relationship with the person whose decision you are challenging requires a specific kind of relational intelligence — direct, specific, and non-personal."},{s:"Resilience without resentment",w:"Processing disappointment, learning from unsuccessful advocacy attempts, and trying again with a different approach is a sustainability skill as much as a performance skill."}]},
  {name:"The Principled but Unproven",icon:"◐",high:"ethics",low:"outcomes",tension:"Conviction without proof",move:"Build a retrospective evidence case for one ethical decision already made.",description:"Your team is ethically sophisticated and deeply committed to responsible AI design. What the team lacks is the measurement infrastructure to demonstrate that ethical design produces better outcomes — for users and for the business. Principle without proof is conviction that depends entirely on others sharing your values, which is not a reliable organizational strategy. The team advocates for ethical design decisions but struggles to quantify what those decisions produce in terms that business stakeholders respond to. There's a sense that UX has to choose between doing the right thing and proving ROI. Trust, agency, and user wellbeing are treated as values the team holds rather than outcomes the team measures. Ethical arguments are made compellingly but don't build cumulative organizational credibility.",hard:[{s:"Trust & wellbeing measurement methods",w:"Practical tools for quantifying what ethical design produces: trust scores, user agency indicators, wellbeing-adjusted satisfaction measures — converting principles into trackable outcomes."},{s:"Retrospective impact analysis",w:"Building evidence cases for ethical decisions already made — showing what changed in trust, retention, or support volume after a transparency pattern was introduced."},{s:"A/B testing for ethical design choices",w:"Running controlled experiments comparing ethical design variants produces causal evidence that principles alone cannot. Quantifying the benefit closes the proof gap."},{s:"UX ROI frameworks for ethical features",w:"Methods for calculating the business return on trust-building design decisions — reduced churn, lower support cost, avoided regulatory fine — translate principled choices into investment cases."}],soft:[{s:"Learning the language of proof",w:"Reframing measurement as the mechanism for making values matter organizationally is a mindset shift, not a compromise."},{s:"Comfort with data that complicates the story",w:"Ethical design sometimes shows ambiguous outcomes in standard metrics before trust effects compound. Comfort presenting mixed results without retreating to pure principle is a mature measurement skill."},{s:"Connecting principles to practitioners self-interest",w:"Making the case for ethical measurement to colleagues requires framing it in terms of what they care about — job security, organizational respect — not just what you care about."},{s:"Publishing and sharing findings",w:"Building an external track record of ethical design outcomes through writing or speaking creates credibility that internal advocacy alone does not provide."}]},
  {name:"The Siloed Pioneer",icon:"★",isSiloed:true,tension:"Individual excellence without system",move:"Spend 90 days systematizing and documenting what your highest factor already demonstrates.",description:"One part of your AI-UX system is genuinely advanced. Someone — a team, a leader, a specific practitioner — has built something real. But it hasn't propagated. The conditions that made the one high factor possible don't exist elsewhere. You have a proof of concept for what good AI-UX practice looks like. You don't yet have a system that reproduces it. There's one project, team, or person consistently held up as 'how we should be doing this.' The advanced practice depends on specific people or relationships, not on structure — if those people left, the capability would leave with them. Progress feels fragile and non-transferable. The rest of the organization looks to the pioneer with admiration but doesn't know how to replicate it.",hard:[{s:"Practice documentation & playbook design",w:"Converting tacit expertise into explicit, reusable process documentation — the craft of writing playbooks and method guides that others can follow without the pioneer present."},{s:"Training & workshop design",w:"Translating what you do instinctively into something teachable — with exercises, examples, and checkpoints — is a distinct skill from the expert practice itself."},{s:"Pilot program design",w:"Designing controlled experiments for replicating advanced practice in a second context — with clear success criteria and adaptation mechanisms — converts proof of concept into scalable model."},{s:"Design systems thinking",w:"Viewing the organization's AI-UX practice as a system to be designed — with inputs, processes, feedback loops, and governance — is the mental model shift that enables scaling."}],soft:[{s:"Letting go of the expert identity",w:"Shifting identity from the person who does it best to the person who builds the system that does it well requires releasing some of the individual-excellence story."},{s:"Teaching with patience for different starting points",w:"Others will not arrive where the pioneer is through the same path. Genuine patience for slower progress and imperfect early attempts is a necessary condition for effective knowledge transfer."},{s:"Building without being the bottleneck",w:"Designing processes and standards that distribute quality without routing everything through the pioneer is the core organizational challenge this archetype faces."},{s:"Recognizing and crediting others progress",w:"Creating conditions for others to experience success — and ensuring that success is visible and attributed — builds the motivation for others to invest in advancing their own practice."}]},
  {name:"The Balanced Profile",icon:"≈",isBalanced:true,tension:"Balance without momentum",move:"Advance all five factors in parallel — choose one initiative per factor for the next 90 days.",description:"Your factor scores are relatively even — no single factor dramatically outpaces or undermines the others. This is a genuine strength that many organizations never achieve. No one area of your practice is actively sabotaging another, and the system as a whole has a coherent foundation to build from. The organization advances in multiple dimensions simultaneously rather than lurching forward in one area while others stagnate. Cross-functional partners experience UX as consistent. There's no dominant tension pulling in a specific direction; challenges are more about elevation than correction. The composite level is the most meaningful indicator — it reflects the whole system rather than a single outlier.",hard:[{s:"Multimodal & agentic UX design",w:"With AI agents and ambient computing accelerating in 2026, balanced practitioners are well-positioned to develop specialist capability in the emerging interaction paradigms that will define the next five years."},{s:"AI-augmented research workflows",w:"Using AI tools (Dovetail AI, Marvin, Maze) to accelerate synthesis and insight generation — while maintaining human direction and verification — is a maturing practice that balanced profiles can integrate without single-factor gaps."},{s:"Design systems for AI components",w:"Building and governing design systems that include AI-specific components — uncertainty visualization, feedback mechanisms, explanation patterns — is a growing specialty that organizations are actively investing in."},{s:"Strategic communication & thought leadership",w:"Practitioners with no dominant weakness are well-positioned to become thought leaders — synthesizing across disciplines, publishing insights, and contributing to the field."}],soft:[{s:"Maintaining momentum without crisis",w:"Balanced practitioners sometimes struggle to sustain development energy without a pressing gap. Building the habit of proactive growth — choosing a direction before one is forced — is the specific development need."},{s:"Choosing depth over continued breadth",w:"At some point, continued generalist investment yields diminishing returns. The soft skill is choosing which factor to develop into a genuine specialty and committing long enough for depth to accumulate."},{s:"Mentoring and field contribution",w:"Practitioners with no acute gaps are often the most available to give back — mentoring, writing, facilitating communities of practice. This is both a development path and a contribution the field needs."},{s:"Resisting the pull of comfortable competence",w:"Balance without ambition becomes stagnation. Deliberately choosing stretch goals — the intimidating method, the difficult stakeholder, the unfamiliar domain — is the key behavior for keeping a balanced profile from plateauing."}]}
];

const NASCENT_HARD = [
  {s:"UX value articulation",w:"Frame UX's contribution in business risk and ROI language. This is the entry point for gaining any upstream AI decision access."},
  {s:"Stakeholder mapping",w:"Map who controls AI decisions in your organization and where leverage points exist for UX to be included."},
  {s:"Prompt engineering basics",w:"Build practical fluency with generative AI tools for synthesis, ideation, and rapid prototyping — now a baseline expectation."},
  {s:"Designing for uncertainty states",w:"Start building team fluency in how to handle AI's probabilistic outputs in design specifications and prototypes."}
];
const NASCENT_SOFT = [
  {s:"Political savvy & org navigation",w:"Understand unspoken power dynamics — not just formal org charts — as the foundation for gaining upstream AI access."},
  {s:"Rapid skill acquisition",w:"Build the habit of getting to good enough in new domains quickly. The pace of AI development makes this a career-critical meta-skill."},
  {s:"Intellectual humility",w:"Be willing to ask basic questions in rooms with more technical expertise — the foundation for cross-functional credibility."},
  {s:"Experimentation mindset",w:"Treat every research or design adaptation as a small experiment with a hypothesis and a learning. This converts awareness into practice."}
];

// ── HELPERS ───────────────────────────────────────────────────────────────

function getComposite(scores) {
  return FACTORS.reduce((s,f) => s + (scores[f.id]||0)*f.weight, 0);
}
function getLevelMeta(c) {
  return LEVELS.find(l => c < l.level + 0.75) || LEVELS[4];
}
function getPriorityFactor(scores) {
  return FACTORS.reduce((best,f) => {
    const d = (5-(scores[f.id]||0))*f.weight;
    const bd = (5-(scores[best.id]||0))*best.weight;
    return d > bd ? f : best;
  });
}
function getArchetype(scores) {
  const composite = getComposite(scores);
  const ids = FACTORS.map(f=>f.id);
  const maxF = ids.reduce((a,b)=>(scores[a]||0)>=(scores[b]||0)?a:b);
  const minF = ids.reduce((a,b)=>(scores[a]||5)<=(scores[b]||5)?a:b);
  const gap = (scores[maxF]||0)-(scores[minF]||0);
  const highCount = ids.filter(id=>(scores[id]||0)>=3.5).length;
  const lowCount  = ids.filter(id=>(scores[id]||0)<=2.5).length;
  if (composite <= 1.74 && gap < 1.5) return {arch:"nascent", maxF, minF};
  if (highCount===1 && lowCount>=3)    return {arch:ARCHETYPES[12], maxF, minF};
  if (gap < 1.5)                       return {arch:ARCHETYPES[13], maxF, minF};
  const found = ARCHETYPES.find(a=>!a.isSiloed&&!a.isBalanced&&a.high===maxF&&a.low===minF)
    || ARCHETYPES.find(a=>!a.isSiloed&&!a.isBalanced&&a.high===maxF)
    || ARCHETYPES.find(a=>!a.isSiloed&&!a.isBalanced&&a.low===minF)
    || ARCHETYPES[13];
  return {arch:found, maxF, minF};
}

function RadarChart({scores}) {
  const cx=120,cy=120,r=85,n=FACTORS.length;
  const ang=FACTORS.map((_,i)=>(Math.PI*2*i)/n-Math.PI/2);
  const pt=(a,v)=>[cx+r*(v/5)*Math.cos(a),cy+r*(v/5)*Math.sin(a)];
  const shorts=["Strategy","Process","Literacy","Outcomes","Ethics"];
  return (
    <svg viewBox="0 0 240 240" className="radar-svg">
      {[1,2,3,4,5].map(lv=><polygon key={lv} points={FACTORS.map((_,i)=>pt(ang[i],lv).join(",")).join(" ")} fill="none" stroke="#e2e8f0" strokeWidth={lv===5?1.2:0.6}/>)}
      {FACTORS.map((_,i)=>{const [x,y]=pt(ang[i],5);return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth={0.6}/>;  })}
      <polygon points={FACTORS.map((f,i)=>pt(ang[i],scores[f.id]||0).join(",")).join(" ")} fill="rgba(83,74,183,0.12)" stroke="#534AB7" strokeWidth={1.8}/>
      {FACTORS.map((f,i)=>{const [x,y]=pt(ang[i],scores[f.id]||0);return <circle key={f.id} cx={x} cy={y} r={4.5} fill={f.color} stroke="white" strokeWidth={1.2}/>;  })}
      {FACTORS.map((f,i)=>{const [lx,ly]=pt(ang[i],5.8);const a=lx<cx-8?"end":lx>cx+8?"start":"middle";return <text key={f.id} x={lx} y={ly+3} textAnchor={a} fontSize={8} fill={f.color} fontWeight="500">{shorts[i]}</text>;})}
    </svg>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────

const STEP_KEYS   = ["score","results","archetype","skills"];
const STEP_LABELS = ["Score","Results","Archetype","Skills"];

export default function App() {
  const [scores,    setScores]    = useState({});
  const [step,      setStep]      = useState("score");
  const [skillTab,  setSkillTab]  = useState("hard");
  const [layer,     setLayer]     = useState("self");

  const allScored   = FACTORS.every(f=>scores[f.id]!==undefined);
  const composite   = allScored ? getComposite(scores) : null;
  const levelMeta   = composite!=null ? getLevelMeta(composite) : null;
  const {arch:archetype, maxF} = allScored ? getArchetype(scores) : {arch:null,maxF:null};
  const sortedF     = allScored ? [...FACTORS].sort((a,b)=>(scores[b.id]||0)-(scores[a.id]||0)) : [];
  const priorityF   = allScored ? getPriorityFactor(scores) : null;
  const nextLvl     = levelMeta ? Math.min(levelMeta.level+1,5) : null;
  const nextLvlMeta = nextLvl   ? LEVELS[nextLvl-1] : null;
  const isNascent   = archetype==="nascent";

  const reset = ()=>{setScores({});setStep("score");setSkillTab("hard");setLayer("self");};
  const canNav = s => s==="score"||(allScored&&["results","archetype","skills"].includes(s));

  const activeLayer = PYRAMID_LAYERS.find(pl=>pl.id===layer);
  const isHigherLayer = activeLayer?.aspiration;

  const currentSkill = priorityF && activeLayer && !isHigherLayer
    ? priorityF.levelSkills[layer]?.[scores[priorityF.id]] : null;
  const stretchSkill = priorityF && activeLayer && !isHigherLayer && nextLvl
    ? priorityF.levelSkills[layer]?.[Math.min(scores[priorityF.id]+1,5)] : null;

  const archSkills = !isNascent && archetype && typeof archetype==="object"
    ? (skillTab==="hard" ? archetype.hard : archetype.soft)
    : (skillTab==="hard" ? NASCENT_HARD   : NASCENT_SOFT);

  // Gap analysis questions — computed as plain array before JSX
  let gapQ = [];
  if (allScored && priorityF && levelMeta) {
    if (isNascent) {
      gapQ = [
        {q:"Priority",   label:"AI-UX Strategy and Process carry the most weight. What is one AI product decision in the next 90 days where UX should be involved earlier?",               factor:FACTORS[0]},
        {q:"Risk",       label:"What specifically gets worse for users, your team, or the organization if all five factors stay at Level 1 for the next 12 months?",                        factor:FACTORS[0]},
        {q:"First step", label:"What is one concrete action — within your control, doable in two weeks — that starts to move Strategy or Process forward?",                                factor:FACTORS[1]}
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
          <button key={s} onClick={()=>canNav(s)&&setStep(s)}
            className={`step-nav-button${step===s?' active':''}${!canNav(s)?' disabled':''}${i<3?' border-right':''}`}
            disabled={!canNav(s)}>
            <div className="step-nav-number">{i+1}</div>
            {STEP_LABELS[i]}
          </button>
        ))}
      </div>

      {/* ── STEP 1: SCORE ── */}
      {step==="score" && (
        <div>
          <p className="text-md text-secondary instructions-text">Rate your organization on each factor (1=low, 5=high). Answer what is actually true most of the time — not what you wish were true.</p>
          <div className="flex-col mb-4xl gap-md">
            {FACTORS.map(f=>(
              <div key={f.id} className="factor-item">
                <div className="factor-header">
                  <div className="factor-dot" style={{background:f.color}}/>
                  <div className="factor-info">
                  <div className="factor-info-header">{f.name} <span className="factor-weight-label">({Math.round(f.weight*100)}% weight)</span></div>
                    <div className="factor-anchor">"{ f.anchor}"</div>
                  </div>
                  <div className="factor-score" style={{color:scores[f.id]?f.color:"var(--color-text-tertiary)"}}>{scores[f.id]||"–"}</div>
                </div>
                <div className="score-controls-row">
                  <span className="score-label-left">Low</span>
                  {[1,2,3,4,5].map(v=>(
                    <button key={v} onClick={()=>setScores(s=>({...s,[f.id]:v}))}
                      className="btn-score"
                      style={{background:scores[f.id]===v?f.color:"var(--color-background-primary)",color:scores[f.id]===v?"white":"var(--color-text-secondary)"}}>{v}</button>
                  ))}
                  <span className="score-label-right">High</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>setStep("results")} disabled={!allScored} className="btn-primary btn-cta">
            {allScored?"See my results →":"Score all 5 factors to continue ("+Object.keys(scores).length+"/5)"}
          </button>
        </div>
      )}

      {/* ── STEP 2: RESULTS ── */}
      {step==="results" && allScored && levelMeta && (
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
                    <div className="radar-name">{f.name}</div>
                    <div className="radar-scale">{[1,2,3,4,5].map(v=><div key={v} className="scale-dot" style={{background:v<=scores[f.id]?f.color:"var(--color-border-tertiary)"}}/>)}</div>
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
                <div className="level-headline">" {levelMeta.headline}"</div>
                <div className="level-bar">{LEVELS.map(l=><div key={l.level} className="level-indicator" style={{background:l.level===levelMeta.level?levelMeta.color:"var(--color-border-tertiary)"}}/>)}</div>
              </div>
              <div className="calc-table">
                <div className="calc-header">Weighted calculation</div>
                {FACTORS.map(f=>(
                  <div key={f.id} className="calc-row">
                    <span className="calc-label"><span className="calc-dot" style={{background:f.color}}></span>{f.name}</span>
                    <span className="calc-value">{scores[f.id]}×{f.weight}={( scores[f.id]*f.weight).toFixed(2)}</span>
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
          <button onClick={()=>setStep("archetype")} className="btn-primary">
            See my archetype →
          </button>
        </div>
      )}

      {/* ── STEP 3: ARCHETYPE ── */}
      {step==="archetype" && allScored && levelMeta && (
        <div className="flex-col gap-2xl">
          <div className="section-header search-result-header">
            <div>
              <div className="calc-header">Composite: Level {levelMeta.level} · {levelMeta.label}</div>
              <div className="level-bar" style={{marginTop:"4px"}}>{LEVELS.map(l=><div key={l.level} className="level-indicator" style={{background:l.level<=levelMeta.level?levelMeta.color:"var(--color-border-tertiary)"}}/>)}</div>

            </div>
          </div>

          {/* Archetype card */}
          {isNascent ? (
            <div className="archetype-card">
              <div className="archetype-header">Your profile</div>
              <div className="text-2xl font-bold mb-2xl">Nascent — building the foundation</div>
              <div className="text-md">Your scores are uniformly low across all five factors. At this stage, no single archetype applies because no factor stands out as either a leverage point or a vulnerability. Every factor needs investment, but not equally.</div>
              <div className="achievement-box">
                <div className="achievement-label">Where to start</div>
                <div className="achievement-content">Focus on <strong>AI-UX Strategy</strong> and <strong>AI-Native Process</strong> first — they carry the highest weights (25% each) and act as multipliers for everything else.</div>
              </div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:8,padding:12}}>
                <div className="achievement-label">First move</div>
                <div className="text-md" s>Identify one upcoming AI product decision where UX could have been involved earlier. Make a specific, concrete case for inclusion. One upstream win begins the pattern.</div>
              </div>
              <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--color-border-tertiary)"}}>
                <div className="text-md" style={{lineHeight:1.7,color:"var(--color-text-secondary)"}}>All five factors are uniformly low. This is a starting point, not a verdict — and it is more common than most practitioners admit when assessing honestly. At this stage, no single archetype applies because no factor stands out as either a leverage point or a vulnerability. Every factor needs investment, but not equally. The core tension is that when everything is low, it is tempting to try to fix everything at once — which means fixing nothing effectively. The development need is sequencing, not breadth. Your first move should identify one upcoming AI product decision where UX could have been involved earlier and make a specific, concrete case for inclusion.</div>
              </div>
            </div>
          ) : (
            <div className="archetype-card">
              <div className="archetype-header">Your archetype</div>
              <div className="archetype-icon-container">
                <span className="archetype-icon">{archetypeIconMap[archetype.name]}</span>
              </div>
              <div className="archetype-details">
                <div>
                  <div className="archetype-name">{archetype.name}</div>
                  <div className="archetype-tension">{archetype.tension}</div>
                </div>
              </div>
              {!archetype.isSiloed && !archetype.isBalanced && (
                <div className="archetype-tags">
                  <span className="archetype-tag">High: {FACTORS.find(f=>f.id===archetype.high)?.name}</span>
                  <span className="archetype-tag">Low: {FACTORS.find(f=>f.id===archetype.low)?.name}</span>
                </div>
              )}
              <div className="archetype-content">
                <div className="archetype-box">
                  <div className="archetype-box-title">Core tension</div>
                  <div className="archetype-box-content italic">" {archetype.tension}"</div>
                </div>
                <div className="archetype-box">
                  <div className="archetype-box-title">First move</div>
                  <div className="archetype-box-content italic">{archetype.move}</div>
                </div>
              </div>
              {archetype.description && (
                <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--color-border-tertiary)"}}>
                  <div className="text-md" style={{lineHeight:1.7,color:"var(--color-text-secondary)"}}>{archetype.description}</div>
                </div>
              )}
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

          <button onClick={()=>setStep("skills")} className="btn-primary">
            See my skills recommendations →
          </button>
        </div>
      )}

      {/* ── STEP 4: SKILLS ── */}
      {step==="skills" && allScored && priorityF && levelMeta && (
        <div className="flex-col gap-2xl">

          {/* Context strip */}
          <div className="flex-row gap-lg flex-wrap">
            <div className="context-item" >
              <div className="context-label">Composite level</div>
              <div className="context-value">Level {levelMeta.level} · {levelMeta.label}</div>
            </div>
            <div className="context-item" >
              <div className="text-xs uppercase">Archetype</div>
              <div className="context-value">{isNascent?"Nascent — all factors low":archetype.name}</div>
            </div>
            <div className="context-item" >
              <div className="context-label">Priority gap</div>
              <div className="context-value">{priorityF.name} (L{scores[priorityF.id]} · {Math.round(priorityF.weight*100)}% wt)</div>
            </div>
          </div>

          {/* Explanation */}
          <div className="explanation" style={{borderLeftColor:priorityF.color}}>
            {isNascent
              ? "Priority is determined by weighted deficit. With all factors at L1, "+priorityF.name+" surfaces first because its "+Math.round(priorityF.weight*100)+"% weight means improving it moves your composite score most. Track 1 shows foundational skills; Tracks 2 & 3 reinforce and stretch from there. AI Products and Society layers unlock as you advance."
              : "Here are your recommended skills to develop. Track 1 targets your archetype's gap dynamic. Track 2 reinforces and stretches your priority gap factor. "
            }
          </div>

          {/* ── TRACK 1: ARCHETYPE / FOUNDATIONAL ── */}
          <div className="skills-container">
            <div className="skills-header">
              <div>
                <div className="skills-header-text">
                  {isNascent?"Track 1 — Foundational skills (Strategy & Process first)":"Track 1 — Archetype skills"}
                </div>
                
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

          {/* ── PYRAMID LAYER TABS + TRACKS 2 & 3 ── */}
          <div className="card" style={{borderColor:"var(--color-border-tertiary)",overflow:"hidden"}}>
            <div className="section-header stretch-default">
              <div className="skills-header-text">TRACK 2 PRIORITY GAP FACTOR SKILLS </div>
            </div>

            {/* Tabs */}
            <div className="pyramid-tabs">
              {PYRAMID_LAYERS.map((pl,i)=>{
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

            {/* Standard layers: Oneself / Teams / Orgs */}
            {!isHigherLayer && priorityF && (
              <div className="pyramid-content" style={{background:"var(--color-background-primary)"}}>
                {/* Track 2 */}
                <div className="track-section">
                  <div className="track-header" style={{color:priorityF.color}}>
                    Current level - Key Skills: {priorityF.name} at L{scores[priorityF.id]}
                  </div>
                  {currentSkill ? (
                    <>
                      <div className="track-title">👉 {currentSkill.name}</div>
                      <div className="track-desc">{currentSkill.desc}</div>
                      
                    </>
                    ) : <div className="track-desc">No skill data for this combination.</div>}
                </div>
                {/* Track 3 */}
                {nextLvlMeta && (
                  <div className="track-section">
                    <div className="track-header" style={{color:priorityF.color}}>
                      Next Level - Stretch Skills: {priorityF.name} at Level {nextLvl}
                    </div>
                    {stretchSkill ? (
                      <>
                        <div>
                          <div className="track-title">👉 {stretchSkill.name}</div>
                        </div>
                        <div className="track-desc">{stretchSkill.desc}</div>
                      </>
                    ) : <div className="track-desc">Already at maximum level for this factor.</div>}
                  </div>
                )}
              </div>
            )}

            {/* AI Products layer */}
            {layer==="products" && isHigherLayer && (
              <div className="pyramid-content">
                <div className="horizon-box">
                  <div className="horizon-label">Horizon unlocked at Level 4</div>
                  <div className="horizon-content">{activeLayer.aspiration}</div>
                </div>
                {[4,5].filter(l=>l<=levelMeta.level).map(l=>{
                  const sk=activeLayer.skills[l];
                  return sk?(
                    <div key={l} style={{padding:14,borderRadius:"var(--border-radius-md)",borderTop:"0.5px solid #1E7E4E30"}}>
                      <div style={{gap:8,marginBottom:6}}>
                        <div style={{fontSize:15,alignItems:"center",fontWeight:700}}>👉 {sk.name}</div>
                      </div>
                      <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.7,marginBottom:10}}>{sk.desc}</div>
                      <div>
                        <div style={{fontSize:11,fontWeight:500,color:"#1E7E4E",textTransform:"uppercase",marginBottom:3}}>NEXT LEVEL - STRETCH SKILLS</div>
                        <div style={{fontSize:15,fontWeight:700,marginBottom:3}}>👉 {sk.stretch.name}</div>
                        <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.6}}>{sk.stretch.desc}</div>
                      </div>
                    </div>
                  ):null;
                })}
              </div>
            )}

            {/* Society layer */}
            {layer==="society" && isHigherLayer && (
              <div className="pyramid-content">
                <div className="horizon-box">
                  <div className="horizon-label">Horizon unlocked at Level 5</div>
                  <div className="horizon-content">{activeLayer.aspiration}</div>
                </div>
                {activeLayer.skills[5]&&(
                  <div style={{padding:14,borderRadius:"var(--border-radius-md)",borderTop:"0.5px solid #2558C830"}}>
                    <div style={{gap:8,alignItems:"center",marginBottom:6}}>
                      <div style={{fontSize:15,fontWeight:700}}>{activeLayer.skills[5].name}</div>
                    </div>
                    <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.7,marginBottom:10}}>{activeLayer.skills[5].desc}</div>
                    <div>
                      <div style={{fontSize:11,fontWeight:500,color:"#2558C8",textTransform:"uppercase",marginBottom:3}}>NEXT LEVEL - STRETCH SKILLS</div>
                      <div style={{fontSize:15,fontWeight:700,marginBottom:3}}>👉 {activeLayer.skills[5].stretch.name}</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.6}}>{activeLayer.skills[5].stretch.desc}</div>
                    </div>
                  </div>
                )}
                <div style={{fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--color-text-secondary)"}}>Four societal capability areas</div>
                {activeLayer.societalSkills.map((sk,i)=>(
                  <div key={i} style={{padding:"12px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)"}}>
                    <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:5}}>
                      <span style={{fontSize:16,color:"#2558C8",flexShrink:0}}>{sk.icon}</span>
                      <div style={{fontSize:14,fontWeight:500}}>{sk.category}</div>
                    </div>
                    <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.7,marginBottom:6}}>{sk.desc}</div>
                    <div style={{fontSize:12,color:"#2558C8",fontStyle:"italic",lineHeight:1.5,paddingTop:6,borderTop:"0.5px solid var(--color-border-tertiary)"}}>{sk.ref}</div>
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
    </div>
  );
}

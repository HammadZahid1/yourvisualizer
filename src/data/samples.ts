export interface SampleText {
  id: string;
  category: string;
  title: string;
  description: string;
  text: string;
}

/** Original fictional sample content. No copyrighted or copied material. */
export const SAMPLES: SampleText[] = [
  {
    id: 'technology',
    category: 'Technology',
    title: 'The Quiet Network',
    description: 'Devices, signals, and the infrastructure we rarely notice.',
    text: `Every morning the city wakes through a quiet network of signals. Sensors measure the pulse of traffic, routers trade packets, and small devices report their state to systems that never sleep. The network is not a single machine but a conversation between thousands of independent parts. Each node follows simple rules, yet the pattern that emerges is remarkably complex.\n\nEngineers describe the network as resilient because no single failure can silence it. When one path fails, data finds another. When a sensor drifts, neighbouring sensors correct the reading. The system learns from routine and reacts to surprise. Its intelligence is distributed, not centralized, and that distinction shapes everything about how it is designed and maintained.`,
  },
  {
    id: 'artificial-intelligence',
    category: 'Artificial Intelligence',
    title: 'A Machine Learns to Notice',
    description: 'A measured, non-mystical look at pattern learning.',
    text: `A learning system does not understand a photograph the way a person does. It notices statistical structure: edges, colours, repeated shapes, and the company they keep. During training, the model adjusts millions of small numerical weights so that its predictions gradually align with examples it has been shown. The process is mathematical, iterative, and surprisingly brittle.\n\nWhat we call recognition is really a compact summary of past examples. When the system encounters a familiar pattern, its internal activations settle into a configuration that has worked before. When the pattern is strange, that same machinery may produce a confident mistake. Researchers study these failures carefully, because the boundary between useful generalization and subtle error is where the real work begins.`,
  },
  {
    id: 'space',
    category: 'Space Exploration',
    title: 'Beyond the Inner Dark',
    description: 'A fictional account of a deep-space observation mission.',
    text: `The probe travelled for eleven years before it turned its instruments toward the distant belt. Communications were slow; a simple acknowledgement took hours to cross the void. The crew on Earth learned to plan each command as a careful argument, because a mistaken instruction could cost months of travel. Silence became a normal working condition rather than an emergency.\n\nWhen the images finally arrived, they showed a landscape of dust and shadow, shaped by impacts too old to date precisely. Scientists compared the new readings with earlier surveys, searching for patterns in the scattered light. Every measurement added a small piece to a story that would never be complete. Exploration, they reminded each other, is mostly the patient accumulation of partial answers.`,
  },
  {
    id: 'robotics',
    category: 'Robotics',
    title: 'The Laboratory Arm',
    description: 'Motion, feedback, and calibration in a small robotics lab.',
    text: `The arm moved with a caution that looked almost deliberate. In truth it was following a loop of feedback: measure position, compare with target, apply correction, measure again. Each cycle took milliseconds, and hundreds of cycles composed a single smooth gesture. The engineers called the movement graceful, though grace was not a property the controller possessed.\n\nCalibration was the daily ritual. A drift of two degrees in a joint could ruin an entire experiment, so the team checked sensors before every run. They recorded temperature, load, and vibration, then fed those readings into a model that predicted how the machine would behave under stress. Precision, in this laboratory, was less about perfect hardware than about honest measurement and repeated adjustment.`,
  },
  {
    id: 'science',
    category: 'Scientific Research',
    title: 'Notes from a Long Experiment',
    description: 'Uncertainty, replication, and the habits of careful inquiry.',
    text: `The experiment began with a question small enough to test and large enough to matter. Would the treatment change the rate at which the cultures recovered? For six months the team repeated the same procedure, varying only the conditions they believed were relevant. They wrote everything down, including the days when nothing appeared to happen.\n\nResults were uneven. Some trials showed a clear effect, others showed almost none. Rather than discard the awkward cases, the researchers examined them closely. A difference in temperature, a delayed measurement, a contaminated sample — each possible explanation became a new hypothesis to check. Science advanced not through a single dramatic answer but through the slow discipline of ruling out convincing mistakes.`,
  },
  {
    id: 'creative',
    category: 'Creative Writing',
    title: 'The Map of Small Streets',
    description: 'A lyrical fragment about memory and place.',
    text: `I remember the city in fragments: a blue door, a window with a cracked pane, the smell of rain on warm stone. Memory does not keep streets in order. It keeps moments, and the moments arrange themselves by feeling rather than distance. A corner visited once can feel closer than a road travelled every day.\n\nIn the old neighbourhood, the alleys were narrow enough that neighbours could speak across them without raising their voices. Lanterns flickered above the steps, and the evening air carried the sound of distant kitchens. Years later, I still carry that map of small streets, though the buildings have changed and the names have been replaced. What remains is the pattern: where I felt expected, where I felt lost, and where the light happened to fall.`,
  },
];

export const DEFAULT_SAMPLE = SAMPLES[0]!;

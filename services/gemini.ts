import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import { StudyGuide, QuizSession } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Simple retry wrapper for API calls to handle transient network/server errors
async function withRetry<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.warn("Gemini API call failed, retrying...", error);
      // Exponential backoff: 1500ms, then 3000ms
      await new Promise(resolve => setTimeout(resolve, 1500 * (3 - retries)));
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
}

// Mock data generator for when API key is not available
const generateMockMedicalContent = (topic: string): StudyGuide => {
  return {
    topic: topic,
    overview: `${topic} is a fundamental concept in medical education. This comprehensive guide covers the essential anatomy, physiology, and clinical applications. Whether you're preparing for board exams or deepening your clinical knowledge, this module bridges foundational science with real-world clinical practice.`,
    sections: [
      {
        title: "Anatomy & Structure",
        foundational: `• Basic embryological origin and development\n• Gross anatomical landmarks and relationships\n• Surface anatomy and clinical landmarks\n• Normal anatomical variations\n• Structural components and their functions\n• Blood supply and innervation patterns\n• Relationships to adjacent structures`,
        clinical: `• Common pathologies affecting this structure\n• Clinical presentations and symptoms\n• Diagnostic approaches and imaging findings\n• Treatment considerations\n• Prognosis and complications\n• Clinical correlations with anatomy\n• Risk factors and prevention strategies`,
        mermaidChart: `graph TD\n    A["Structure Overview"] --> B["Anatomy"]\n    A --> C["Physiology"]\n    B --> D["Clinical Relevance"]\n    C --> D\n    D --> E["Treatment Approach"]`,
        keyPoints: [
          "Key Point 1: This is an essential anatomical landmark with significant clinical importance",
          "Key Point 2: Understanding the normal anatomy is crucial for identifying pathology",
          "Key Point 3: Clinical examination must correlate with anatomical knowledge"
        ],
        mnemonics: [
          "Use the memory aid: Anatomy Always Applies in Clinical examination"
        ],
        matchingPairs: [
          { term: "Structure A", definition: "Primary component with specific function" },
          { term: "Structure B", definition: "Adjacent anatomy providing support" },
          { term: "Clinical Finding", definition: "Pathological sign associated with disease" }
        ]
      },
      {
        title: "Physiology & Function",
        foundational: `• Normal physiological mechanisms\n• Homeostatic regulation\n• Neural and hormonal control\n• Functional relationships\n• Normal ranges and parameters\n• Regulatory feedback systems\n• Integration with other systems`,
        clinical: `• Dysfunction and pathophysiology\n• Compensatory mechanisms\n• Failure modes\n• Clinical symptoms and signs\n• Diagnostic testing\n• Therapeutic interventions\n• Outcome monitoring`,
        mermaidChart: `graph TD\n    A["Normal Function"] --> B["Regulation"]\n    B --> C["Homeostasis"]\n    C --> D["System Integration"]\n    D --> E["Clinical Outcomes"]`,
        keyPoints: [
          "Key Point 1: Physiological understanding explains clinical presentations",
          "Key Point 2: Regulatory mechanisms maintain normal function",
          "Key Point 3: Pathophysiology underlies all disease states"
        ],
        mnemonics: [
          "Function Follows Form - understand anatomy to predict physiology"
        ],
        matchingPairs: [
          { term: "Normal Value", definition: "Expected physiological parameter" },
          { term: "Abnormal State", definition: "Deviation from homeostasis" },
          { term: "Compensation", definition: "Body's response to maintain function" }
        ]
      },
      {
        title: "Clinical Application",
        foundational: `• Common disease entities\n• Epidemiology and risk factors\n• Predisposing conditions\n• Pathogenesis overview\n• Natural history\n• Classification systems\n• Staging and grading`,
        clinical: `• Clinical presentation patterns\n• Diagnostic workup strategy\n• Differential diagnosis\n• Evidence-based management\n• Pharmacological interventions\n• Surgical options\n• Follow-up and monitoring protocols`,
        mermaidChart: `graph TD\n    A["Patient Presentation"] --> B["History & Exam"]\n    B --> C["Investigations"]\n    C --> D["Diagnosis"]\n    D --> E["Treatment Plan"]`,
        keyPoints: [
          "Key Point 1: Early recognition improves outcomes",
          "Key Point 2: Management depends on disease severity",
          "Key Point 3: Long-term follow-up prevents complications"
        ],
        mnemonics: [
          "Clinical Pearl: Always consider the patient's presentation in context"
        ],
        matchingPairs: [
          { term: "Symptom", definition: "Subjective complaint from patient" },
          { term: "Sign", definition: "Objective finding on examination" },
          { term: "Syndrome", definition: "Collection of related findings" }
        ]
      }
    ],
    relatedTopics: ["Advanced Clinical Topics", "System-Based Integration"]
  };
};

const generateMockQuizQuestions = (topic: string, difficulty: 'Easy' | 'Medium' | 'Hard'): QuizSession => {
  const easyQuestions = [
    {
      question: `What is the primary function of structures related to ${topic}?`,
      options: ["Option A - Correct function", "Option B - Incorrect", "Option C - Incorrect", "Option D - Incorrect"],
      correctAnswer: 0,
      explanation: "This is the correct answer because it accurately describes the primary physiological function. Understanding this basic function is essential for clinical practice."
    },
    {
      question: `Which of the following is a normal anatomical finding in ${topic}?`,
      options: ["Finding A - Normal", "Finding B - Abnormal", "Finding C - Abnormal", "Finding D - Abnormal"],
      correctAnswer: 0,
      explanation: "This finding is within normal range. Being able to distinguish normal anatomy from pathology is crucial for interpreting clinical findings."
    }
  ];

  const mediumQuestions = [
    {
      question: `A 45-year-old patient presents with symptoms related to ${topic}. What is the most likely diagnosis based on the clinical presentation?`,
      options: ["Condition A - Most likely", "Condition B - Less likely", "Condition C - Rare", "Condition D - Very rare"],
      correctAnswer: 0,
      explanation: "Given the clinical presentation and epidemiology, this is the most common diagnosis. Understanding disease prevalence is important for clinical reasoning."
    },
    {
      question: `Which imaging modality is most sensitive for detecting pathology in ${topic}?`,
      options: ["Modality A - Most sensitive", "Modality B - Less sensitive", "Modality C - Not useful", "Modality D - Contraindicated"],
      correctAnswer: 0,
      explanation: "This modality provides the best visualization and highest sensitivity for detecting abnormalities. Choosing appropriate diagnostic tests improves patient care."
    }
  ];

  const hardQuestions = [
    {
      question: `A 52-year-old with complex medical history presents with atypical presentation of ${topic} pathology. Which finding would most distinguish this from other similar conditions?`,
      options: ["Finding A - Distinguishing", "Finding B - Common to multiple", "Finding C - Non-specific", "Finding D - Artifact"],
      correctAnswer: 0,
      explanation: "This finding is pathognomonic and distinguishes this condition from other similar entities. Higher-level reasoning requires recognizing subtle differentiating features."
    },
    {
      question: `What is the most important mechanism for preventing complications in ${topic} disease management?`,
      options: ["Strategy A - Most important", "Strategy B - Secondary", "Strategy C - Tertiary", "Strategy D - Not proven"],
      correctAnswer: 0,
      explanation: "This prevention strategy addresses the underlying pathophysiology and prevents the most significant complications. Evidence-based medicine emphasizes early intervention."
    }
  ];

  const baseQuestions = difficulty === 'Easy' ? easyQuestions : difficulty === 'Medium' ? mediumQuestions : hardQuestions;

  return {
    questions: [
      baseQuestions[0],
      baseQuestions[1],
      {
        question: `How would you manage a patient with ${topic} according to current clinical guidelines?`,
        options: ["Approach A - Standard care", "Approach B - Alternative", "Approach C - Outdated", "Approach D - Contraindicated"],
        correctAnswer: 0,
        explanation: "This represents current evidence-based practice. Staying updated with clinical guidelines ensures optimal patient outcomes."
      },
      {
        question: `What is the expected prognosis with appropriate management of ${topic} pathology?`,
        options: ["Prognosis A - Good outcome", "Prognosis B - Fair outcome", "Prognosis C - Poor outcome", "Prognosis D - Unpredictable"],
        correctAnswer: 0,
        explanation: "With appropriate management, most patients have favorable outcomes. Patient counseling about realistic expectations improves satisfaction."
      },
      {
        question: `Which complication of ${topic} is most common and clinically significant?`,
        options: ["Complication A - Most significant", "Complication B - Less common", "Complication C - Rare", "Complication D - Very rare"],
        correctAnswer: 0,
        explanation: "Recognizing common complications allows for proactive prevention and early detection, improving overall patient outcomes."
      }
    ]
  };
};

export const createChatSession = (topic: string): Chat => {
  const ai = getAiClient();
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are an expert medical tutor helping a student study "${topic}". 
      Your goal is to explain complex concepts simply, provide analogies, and answer questions accurately.
      Use the Google Search tool to find up-to-date information, clinical guidelines, or recent papers if the user asks about them or if standard knowledge might be outdated.
      Always cite your sources if you use the search tool.
      If the user asks for images, describe them vividly or explain that you can generate diagrams in the main study view, but for now, you can provide detailed text explanations and search links.`,
      tools: [{ googleSearch: {} }],
    },
  });
};

export const generateMedicalContent = async (topic: string): Promise<StudyGuide> => {
  const ai = getAiClient();

  // If no API key, use mock data
  if (!ai) {
    console.log("API key not available, using mock data");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
    return generateMockMedicalContent(topic);
  }

  // Structured output focused on Clinical Anatomy and Retention
  // Update: Explicitly requested flowcharts and bullet points to reduce density.
  const prompt = `
    Create a high-yield Clinical Anatomy and Medical review guide for: "${topic}".

    The goal is to help doctors maximize retention of complex anatomical and physiological concepts by bridging "Basic Science" with "Clinical Relevance".
    Avoid dense walls of text. Use bullet points or short paragraphs where possible.

    For each sub-section (e.g., if topic is Heart: Coronary Blood Supply, Valves, Conduction System), provide:
    1. Foundational: Detailed anatomy, embryology, or physiology (First Year level). **CRITICAL:** Include Surface Anatomy & Landmarks.
    2. Clinical: The "Third Year" application. What goes wrong? (e.g., specific infarct territories, nerve palsies).
    3. Mermaid Chart: A visual flowchart (graph TD) to represent the flow, pathway, or hierarchy. **IMPORTANT:** Enclose all text inside node brackets [] with double quotes. Example: A["Left (L)"] --> B["Right (R)"].
    4. Key Points: 2-3 rapid-fire facts.
    5. Mnemonics: A specific memory aid.
    6. Matching Pairs: 3-4 pairs for active recall.

    Also provide a brief, high-level overview of the topic and 2 "Next Step" related topics for a predictive study pathway.
  `;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class medical educator specializing in Gross Anatomy and Clinical Pathology. Your goal is to make complex topics 'stick' using high-yield facts, visual flowcharts (Mermaid.js), and active recall games.",
        responseMimeType: "application/json",
        temperature: 0.4, // Reduced temperature for stability
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            overview: { type: Type.STRING },
            relatedTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Predictive Pathway: Suggest 2 related topics the student should study next."
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  foundational: { type: Type.STRING },
                  clinical: { type: Type.STRING },
                  mermaidChart: {
                    type: Type.STRING,
                    description: "Mermaid.js graph syntax (e.g. 'graph TD; A[\"Start\"]-->B[\"End\"]'). Use double quotes for node text."
                  },
                  keyPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  mnemonics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of memory aids or acronyms"
                  },
                  matchingPairs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING }
                      },
                      required: ["term", "definition"]
                    }
                  }
                },
                required: ["title", "foundational", "clinical", "mermaidChart", "keyPoints", "mnemonics", "matchingPairs"]
              }
            }
          },
          required: ["topic", "overview", "sections", "relatedTopics"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Failed to generate content");
    }

    return JSON.parse(response.text) as StudyGuide;
  });
};

export const generateQuizQuestions = async (topic: string, difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'): Promise<QuizSession> => {
  const ai = getAiClient();
  
  const prompt = `Generate 5 USMLE Step 1/Step 2 CK style clinical vignette questions regarding: ${topic}. 
  Difficulty Level: ${difficulty}.
  
  Focus on:
  1. Clinical anatomy correlations.
  2. Differentiating similar pathologies.
  3. ${difficulty === 'Hard' ? 'Third-order reasoning and obscure presentations' : 'Foundational concepts'}.
  `;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "List of 4 or 5 potential answers"
                  },
                  correctAnswer: { 
                    type: Type.INTEGER, 
                    description: "Zero-based index of the correct option" 
                  },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Failed to generate quiz");
    }

    return JSON.parse(response.text) as QuizSession;
  });
};

export const generateAnatomyImage = async (topic: string, section: string): Promise<string> => {
  const ai = getAiClient();
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Detailed medical anatomical diagram of ${section} in the context of ${topic}. Clean, professional textbook style illustration. White background. Clearly labeled structures. High resolution, educational.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated");
  });
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const ai = getAiClient();
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });
    
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  });
}

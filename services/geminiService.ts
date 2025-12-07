import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Model Constants
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Creates a chat session for a student.
 * System instructions ensure the AI acts as a helpful tutor.
 */
export const createStudentChat = (): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `Ты — дружелюбный и терпеливый репетитор ИИ для школьников и студентов. 
      Твоя цель — объяснять сложные темы простым языком, приводить аналогии и помогать с решением задач.
      Не давай прямых ответов на домашнее задание сразу — вместо этого направляй ученика к решению наводящими вопросами.
      В конце объяснения всегда предлагай небольшое проверочное задание, чтобы закрепить материал.`,
    },
  });
};

/**
 * Generates a structured lesson plan for teachers.
 */
export const generateLessonPlan = async (topic: string, grade: string, duration: string): Promise<string> => {
  const prompt = `Составь подробный план урока для учителя.
  Тема: ${topic}
  Класс/Уровень: ${grade}
  Продолжительность: ${duration}
  
  Структура ответа (используй Markdown):
  1. Цели урока
  2. Необходимые материалы
  3. План урока (с таймингом)
  4. Ключевые вопросы для обсуждения
  5. Домашнее задание
  
  Будь креативным и предложи интерактивные активности.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Не удалось сгенерировать план урока.";
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    return "Произошла ошибка при генерации. Пожалуйста, проверьте API ключ.";
  }
};

/**
 * Generates a quiz/test for teachers.
 */
export const generateQuiz = async (topic: string, difficulty: string, count: number): Promise<string> => {
  const prompt = `Создай тест по теме "${topic}".
  Сложность: ${difficulty}
  Количество вопросов: ${count}
  
  Формат вывода (Markdown):
  ### Вопрос N
  Текст вопроса...
  - [ ] Вариант A
  - [ ] Вариант B
  - [ ] Вариант C
  - [ ] Вариант D
  
  (В конце добавь блок "Ответы" с правильными вариантами и кратким пояснением).`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Не удалось сгенерировать тест.";
  } catch (error) {
    console.error("Error generating quiz:", error);
    return "Произошла ошибка при генерации.";
  }
};
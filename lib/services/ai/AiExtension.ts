/**
 * AI System Extension Points
 * Preparing for Round 7 Implementation
 * Reference: 07_AI_System.md
 */

export interface AiRecommendationContext {
  userId: string;
  recentSearches?: string[];
  lastBookingId?: string;
  timeOfDay: string;
}

export interface AiSnackRecommendation {
  snackId: string;
  confidenceScore: number;
  reasoning: string;
}

/**
 * STUB: Will be implemented in Round 7 using Gemini API.
 */
export async function getPersonalizedSnackRecommendations(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: AiRecommendationContext
): Promise<AiSnackRecommendation[]> {
  console.log('[AI] Extension Point Triggered. Implementation pending Round 7.');
  // Return empty recommendations for now
  return [];
}

/**
 * STUB: Will be implemented in Round 7 using Dialogflow CX / Vertex AI.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function processSupportQuery(_userId: string, _query: string): Promise<string> {
  console.log('[AI] Support query received. Implementation pending Round 7.');
  return "I'm sorry, our AI assistant is currently undergoing upgrades. Please check back later.";
}

// src/modules/ai-chat/helpers/chat-bot.helper.ts
import Replicate from 'replicate';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbeddingService } from '../services/embedding.service';

export interface ChatBotConfig {
  systemPrompt: string;
  maxTokens: number;
  minTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  stopSequences: string[];
  lengthPenalty: number;
  presencePenalty: number;
  seed?: number;
  maxNewTokens: number;
  minNewTokens: number;
  logPerformanceMetrics: boolean;
}

export const DEFAULT_CHATBOT_CONFIG: ChatBotConfig = {
systemPrompt: `
You are AIMS (Asset Inventory Management System), an AI assistant specialized in asset management.

Purpose:
Answer questions strictly related to asset management, including assets, issuance, maintenance, disposal, and related operational data.

Guidelines:

1. Retrieval-Augmented Generation (RAG):
- Always query the database first to retrieve relevant information.
- Use relational links between entities when answering questions (e.g., asset -> custodian -> department).
- If a field references another entity, fetch the related data and present it in context.
- Only respond based on actual retrieved data; do not assume, fabricate, or guess.

2. Response Style:
- Provide concise, factual answers.
- Avoid unnecessary commentary, greetings, or lengthy explanations.
- Use professional but conversational language.

3. Identity Questions:
- If asked about your name or identity, respond: "I am AIMS, the Asset Inventory Management System assistant."

4. Out-of-Scope Questions:
- If asked anything unrelated to asset management (except your identity), respond exactly with:
  "Sorry, I could not answer that question. I'm an AI smart assistant chatbot for asset management purposes only."

5. Data Handling & Context Understanding:
- Only use information retrieved from the database or provided context.
- Clearly indicate if information is missing or unavailable ("Not Applicable" or "Unknown").
- When retrieving relational data, include relevant connected fields (e.g., show custodian name, department, and contact if querying an asset).
- Convert all database field names to human-readable text:
  - snake_case → Title Case
  - Remove technical prefixes/suffixes
  - Present data in clear, understandable terms
- Never expose raw database values, technical field names, or undefined/null values in responses.
`,
  maxTokens: 1024,
  minTokens: 0,
  temperature: 0.5,
  topP: 0.85,
  topK: 50,
  stopSequences: [],
  lengthPenalty: 1.0,
  presencePenalty: 0.0,
  seed: undefined,
  maxNewTokens: 512,
  minNewTokens: 0,
  logPerformanceMetrics: true,
};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatBotResponse {
  content: string;
  metadata: {
    tokensUsed?: number;
    modelUsed: string;
    timestamp: Date;
    performance?: any;
  };
}

@Injectable()
export class ChatBotHelper {
  private replicate: Replicate;
  private model: `${string}/${string}` | `${string}/${string}:${string}`;
  private config: ChatBotConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly embeddingService: EmbeddingService, 
  ) {
    const apiToken = this.configService.get<string>('REPLICATE_API_TOKEN');
    const model =
      this.configService.get<string>(
        'MODEL',
        'meta/meta-llama-3-8b-instruct',
      ) || 'meta/meta-llama-3-8b-instruct';

    this.replicate = new Replicate({ auth: apiToken });
    this.model = model as `${string}/${string}`;
    this.config = { ...DEFAULT_CHATBOT_CONFIG };


    this.embeddingService.initialize({
      dimensions: 384,
      useNormalization: true,
      useStemming: true,
    });
  }

  /**
   * Build conversation prompt with full conversation history for context awareness
   */
  private buildPromptWithHistory(messages: ChatMessage[]): string {
    const systemMessage =
      messages.find((m) => m.role === 'system')?.content ||
      this.config.systemPrompt;

    // Build full conversation context
    const conversationHistory = messages
      .filter((m) => m.role !== 'system')
      .map((m) => {
        const role = m.role === 'user' ? 'user' : 'assistant';
        return `<|start_header_id|>${role}<|end_header_id|>\n\n${m.content}<|eot_id|>`;
      })
      .join('');

    return `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemMessage}<|eot_id|>${conversationHistory}<|start_header_id|>assistant<|end_header_id|>\n\n`;
  }

  /**
   * Send a chat message and get complete response from Replicate
   */
  async chat(
    messages: ChatMessage[],
    options: Partial<ChatBotConfig> = {},
  ): Promise<ChatBotResponse> {
    const startTime = Date.now();
    const mergedConfig = { ...this.config, ...options };

    try {
      const prompt = this.buildPromptWithHistory(messages);

      const input: any = {
        prompt: prompt,
        max_tokens: mergedConfig.maxTokens,
        min_tokens: mergedConfig.minTokens,
        temperature: mergedConfig.temperature,
        top_p: mergedConfig.topP,
        top_k: mergedConfig.topK,
        length_penalty: mergedConfig.lengthPenalty,
        presence_penalty: mergedConfig.presencePenalty,
      };

      if (mergedConfig.seed) {
        input.seed = mergedConfig.seed;
      }

      const output = await this.replicate.run(this.model, { input });

      // Collect full response
      let fullResponse = '';
      for await (const chunk of output as any) {
        if (typeof chunk === 'string') {
          fullResponse += chunk;
        }
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        content: fullResponse.trim(),
        metadata: {
          modelUsed: this.model,
          timestamp: new Date(),
          ...(this.config.logPerformanceMetrics && {
            performance: {
              responseTimeMs: responseTime,
              tokensUsed: this.estimateTokens(fullResponse),
            },
          }),
        },
      };
    } catch (error) {
      throw new Error(`Replicate API error: ${error.message}`);
    }
  }

  /**
   * Generate a dynamic title for a chat session based on the first message
   */
  async generateSessionTitle(firstMessage: string): Promise<string> {
    try {
      const titlePrompt: ChatMessage[] = [
        {
          role: 'system',
          content:
            "You are a helpful assistant that creates short, descriptive titles (3-6 words) for chat conversations based on the user's first message. Only respond with the title, nothing else.",
        },
        {
          role: 'user',
          content: `Generate a short, descriptive title for a chat that starts with: "${firstMessage}"`,
        },
      ];

      const response = await this.chat(titlePrompt, {
        maxTokens: 50,
        temperature: 0.7,
      });

      // Clean and truncate the title
      let title = response.content
        .trim()
        .replace(/^["']|["']$/g, '') // Remove quotes
        .replace(/^Title:\s*/i, '') // Remove "Title:" prefix
        .substring(0, 100); // Max 100 chars

      return title || 'New Chat';
    } catch (error) {
      console.error('Failed to generate title:', error);
      return 'New Chat';
    }
  }

  /**
   * Simple token estimation (rough approximation)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }

  /**
   * Generate embeddings using custom algorithm (NO EXTERNAL API)
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      return await this.embeddingService.generateEmbedding(text);
    } catch (error) {
      throw new Error(`Embedding generation error: ${error.message}`);
    }
  }

  /**
   * Find similar messages using embeddings
   */
  async findSimilarMessages(
    queryText: string,
    existingEmbeddings: Array<{
      id: string;
      embedding: number[];
      content: string;
    }>,
    topK: number = 5,
  ): Promise<Array<{ id: string; content: string; similarity: number }>> {
    const queryEmbedding = await this.generateEmbedding(queryText);
    return this.embeddingService.findMostSimilar(
      queryEmbedding,
      existingEmbeddings,
      topK,
    );
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ChatBotConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ChatBotConfig {
    return { ...this.config };
  }
}

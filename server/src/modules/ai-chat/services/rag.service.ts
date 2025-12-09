// Enhanced RAG Service with SQL Planning and Multi-Step Reasoning

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChatBotHelper } from '../helpers/chat-bot.helper';
import { DataSourceConfig } from '../rag/interfaces/rag-config.interface';

export interface QueryResult {
  context: string;
  sources: Array<{
    table: string;
    id: number;
    data: any;
    relevance: number;
  }>;
}

@Injectable()
export class RAGService {
  private dataSources: Map<string, DataSourceConfig> = new Map();

  constructor(
    private readonly dataSource: DataSource,
    private readonly chatBotHelper: ChatBotHelper,
  ) {}

  registerDataSource(config: DataSourceConfig): void {
    this.dataSources.set(config.name, config);
  }

  getDataSources(): DataSourceConfig[] {
    return Array.from(this.dataSources.values());
  }

  async query(userQuery: string, topK: number = 5): Promise<QueryResult> {
    // Step 1: Classify intent with reasoning
    const intent = await this.classifyIntent(userQuery);

    // Step 2: Select relevant sources
    const relevantSources = this.selectRelevantSources(intent);

    if (relevantSources.length === 0) {
      console.warn('WARNING: No relevant sources selected!');
      return {
        context: 'No relevant data sources found for this query.',
        sources: [],
      };
    }

    // Step 3: Plan SQL queries (NEW STEP)
    await this.planAllSQLQueries(relevantSources, intent);

    // Step 4: Execute queries
    const results = await this.executeQueries(relevantSources, intent);

    // Step 5: Format context
    const context = this.formatContext(results);

    return {
      context,
      sources: results,
    };
  }

  /**
   * NEW METHOD: Plan SQL queries for all sources before execution
   * This helps the AI think through the query logic step-by-step
   */
  private async planAllSQLQueries(
    sources: DataSourceConfig[],
    intent: any,
  ): Promise<void> {
    for (const source of sources) {
      await this.planSQLQuery(source, intent);
    }
  }

  /**
   * NEW METHOD: Plan individual SQL query with AI reasoning
   */
  private async planSQLQuery(
    source: DataSourceConfig,
    intent: any,
  ): Promise<string> {
    const prompt = [
      {
        role: 'system' as const,
        content: `You are an expert SQL query planner for asset management systems. 
Your task is to **plan a SQL query step-by-step** based on the provided schema and user intent. 

TABLE INFORMATION:
- Table name: ${source.tableName}
- Table alias: ${source.name}
- Available fields: ${source.fields.join(', ')}
- Queryable/filterable fields: ${source.queryableFields.join(', ')}

USER INTENT:
- Query type: ${intent.intent}
- Requested filters: ${JSON.stringify(intent.filters || {})}
- Requested fields: ${JSON.stringify(intent.fields || [])}

TASK:
Step-by-step, determine how to construct the SQL query:

1. SELECT clause:
   - List exactly which fields should be selected.
   - If it is a count query, use COUNT(*) only.

2. WHERE clause:
   - Include only filters using queryable fields.
   - Show the condition format clearly.

3. Aggregations:
   - Specify if COUNT, SUM, AVG, or other aggregations are required.

4. LIMIT clause:
   - Specify the number of records if applicable.

5. ORDER BY clause:
   - Specify sorting fields and order if applicable.

RULES:
- Use only "Available fields" in SELECT.
- Filter only on "Queryable/filterable fields".
- Follow standard SQL syntax conventions.
- Respond **only with the step-by-step plan**, do not generate the final SQL yet.`,
      },
      {
        role: 'user' as const,
        content: `Plan the SQL query for: ${source.tableName}`,
      },
    ];

    try {
      const response = await this.chatBotHelper.chat(prompt, {
        temperature: 0.2,
        maxTokens: 600, // Generous tokens for planning
      });

      return response.content;
    } catch (error) {
      console.error(
        `SQL planning failed for ${source.tableName}:`,
        error.message,
      );
      return 'Planning failed - will use default query strategy';
    }
  }

  /**
   * Enhanced intent classification with multi-step reasoning
   */
  private async classifyIntent(query: string): Promise<any> {
    const sources = Array.from(this.dataSources.values());

    const analysisPrompt = [
      {
        role: 'system' as const,
        content: `You are an expert query analyzer for systems with multiple data sources. 
Your task is to **analyze the user's question step-by-step** to determine the intent, relevant sources, filters, and requested fields.

AVAILABLE DATA SOURCES:
${sources
  .map(
    (s) =>
      `- ${s.name}: ${s.customDescription || s.tableName}\n  Queryable fields: ${s.queryableFields.join(', ')}`,
  )
  .join('\n\n')}

ANALYSIS STEPS:

Step 1: UNDERSTAND THE QUESTION
- Determine exactly what the user is asking for.
- Identify key concepts and entities mentioned.

Step 2: IDENTIFY DATA SOURCES
- Determine which table(s) contain the requested information.
- Decide if multiple tables need to be joined.

Step 3: DETERMINE QUERY TYPE
- count: User wants quantity/number (e.g., "how many", "count")
- list: User wants multiple records (e.g., "show", "list", "what are")
- detail: User wants specific record details (e.g., "find specific", "details of")
- aggregate: User wants calculations (e.g., sum, average, min, max)

Step 4: EXTRACT FILTERS
- Identify conditions mentioned in natural language (status, date, type, etc.)
- Map them to queryable fields only
- Ignore any field not listed as queryable

Step 5: IDENTIFY REQUESTED FIELDS
- List the fields the user wants returned
- If none are specified, default to all available fields from the selected sources

OUTPUT FORMAT:
After your analysis, provide JSON in **this exact format**:

{
  "intent": "count|list|detail|aggregate",
  "entities": ["source_name"],
  "filters": {"field": "value"},
  "fields": ["field1", "field2"]
}

INSTRUCTIONS:
1. First show your **step-by-step reasoning** clearly.
2. Then output only the **JSON** in the exact format above.
3. Use only queryable fields listed for each source.
4. Be precise and conservative in mapping natural language to fields.`,
      },
      {
        role: 'user' as const,
        content: query,
      },
    ];

    try {
      const response = await this.chatBotHelper.chat(analysisPrompt, {
        temperature: 0.1,
        maxTokens: 1200, // More tokens for thorough reasoning
      });

      console.log('AI Response:', response.content);

      // Extract JSON from response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate parsed intent
      if (!parsed.intent || !parsed.entities) {
        throw new Error('Invalid intent structure');
      }

      return parsed;
    } catch (error) {
      console.error('Intent classification failed:', error.message);

      // Enhanced fallback with better keyword detection
      return this.fallbackIntentClassification(query, sources);
    }
  }

  /**
   * Enhanced fallback intent classification
   */
  private fallbackIntentClassification(query: string, sources: any[]): any {
    const lowerQuery = query.toLowerCase();
    let intent = 'list';
    let entities: string[] = []; // allow any entity
    let filters: any = {};

    // Detect intent type
    if (
      lowerQuery.includes('how many') ||
      lowerQuery.includes('count') ||
      lowerQuery.includes('total')
    ) {
      intent = 'count';
    } else if (
      lowerQuery.includes('show me') ||
      lowerQuery.includes('list all')
    ) {
      intent = 'list';
    } else if (
      lowerQuery.includes('find') ||
      lowerQuery.includes('get details')
    ) {
      intent = 'detail';
    }

    // Detect entity
    for (const source of sources) {
      if (
        lowerQuery.includes(source.name) ||
        lowerQuery.includes(source.tableName)
      ) {
        entities = [source.name];
        break;
      }
    }

    // Detect common filters
    if (
      lowerQuery.includes('draft') ||
      lowerQuery.includes('unverified') ||
      lowerQuery.includes('not verified')
    ) {
      filters.isDraft = true;
      filters.isVerified = false;
    }
    if (lowerQuery.includes('verified')) {
      filters.isVerified = true;
    }
    if (lowerQuery.includes('approved')) {
      filters.isApproved = true;
    }
    if (lowerQuery.includes('available')) {
      filters.status = 'Available';
    }

    const fallback = {
      intent,
      entities,
      filters,
      fields: [],
    };

    return fallback;
  }

  private selectRelevantSources(intent: any): DataSourceConfig[] {
    if (!intent.entities || intent.entities.length === 0) {
      console.warn('No entities in intent, selecting all sources');
      return Array.from(this.dataSources.values());
    }

    const sources = intent.entities
      .map((name: string) => this.dataSources.get(name))
      .filter(Boolean) as DataSourceConfig[];

    if (sources.length === 0) {
      console.warn('No matching sources found, falling back to all');
      return Array.from(this.dataSources.values());
    }

    return sources;
  }

  private async executeQueries(
    sources: DataSourceConfig[],
    intent: any,
  ): Promise<any[]> {
    const results: any[] = [];

    for (const source of sources) {
      try {
        const repo = this.dataSource.getRepository(source.entity);
        const queryBuilder = repo.createQueryBuilder(source.name);

        // Track which relations have been joined
        const joinedRelations = new Set<string>();

        source.fields.forEach((field) => {
          if (field.includes('.')) {
            const [relation, relField] = field.split('.');

            // Only join each relation once
            if (!joinedRelations.has(relation)) {
              queryBuilder.leftJoinAndSelect(
                `${source.name}.${relation}`,
                relation,
              );
              joinedRelations.add(relation);
            }
            queryBuilder.addSelect(`${relation}.${relField}`);
          } else {
            queryBuilder.addSelect(`${source.name}.${field}`);
          }
        });

        // Apply filters
        const appliedFilters = this.applyFilters(
          queryBuilder,
          source,
          intent.filters,
        );

        console.log(
          `Applied ${appliedFilters} filter(s) to ${source.tableName}`,
        );

        if (appliedFilters === 0) {
          console.warn(`No valid filters applied to ${source.tableName}`);
        }

        // Execute based on intent
        if (intent.intent === 'count') {
          console.log(`📊 Executing COUNT query on ${source.tableName}`);
          const count = await queryBuilder.getCount();

          results.push({
            table: source.tableName,
            id: 0,
            data: {
              count,
              type: intent.filters?.status || 'total',
              tableName: source.tableName,
            },
            relevance: 1.0,
          });
        } else {
          const limit = intent.intent === 'detail' ? 1 : 10;
          const entities = await queryBuilder.limit(limit).getMany();

          results.push(
            ...entities.map((entity: any) => ({
              table: source.tableName,
              id: entity.id,
              data: entity,
              relevance: 1.0,
            })),
          );
        }
      } catch (error) {
        console.error(`Error querying ${source.tableName}:`, error.message);
      }
    }

    return results;
  }

  private applyFilters(
    queryBuilder: any,
    source: DataSourceConfig,
    filters: any,
  ): number {
    if (!filters || Object.keys(filters).length === 0) {
      return 0;
    }

    let appliedCount = 0;

    Object.entries(filters).forEach(([key, value]) => {
      if (source.queryableFields.includes(key)) {
        if (Array.isArray(value)) {
          queryBuilder.andWhere(`${source.name}.${key} IN (:...${key})`, {
            [key]: value,
          });
        } else {
          queryBuilder.andWhere(`${source.name}.${key} = :${key}`, {
            [key]: value,
          });
        }
        appliedCount++;
      } else {
        console.warn(`Skipped non-queryable field: ${key}`);
      }
    });

    return appliedCount;
  }

  private formatContext(results: any[]): string {
    if (!results || results.length === 0) {
      return 'No data found in the database.';
    }

    // Recursive helper to flatten nested objects
    const flattenValue = (val: any, depth: number = 0): string => {
      // Prevent infinite recursion
      if (depth > 10) return '[max depth reached]';

      if (val === null || val === undefined) return 'null';

      // Handle primitives
      if (typeof val !== 'object') return String(val);

      // Handle Date objects
      if (val instanceof Date) return val.toISOString();

      // Handle arrays
      if (Array.isArray(val)) {
        if (val.length === 0) return '[]';
        return val.map((item) => flattenValue(item, depth + 1)).join(', ');
      }

      // Handle objects - flatten all keys recursively
      const entries = Object.entries(val);
      if (entries.length === 0) return '{}';

      return entries
        .map(([k, v]) => `${k}: ${flattenValue(v, depth + 1)}`)
        .join(', ');
    };

    const formatted = results
      .map((result, idx) => {
        // Handle missing or null data
        if (!result || !result.data) {
          return `[${idx + 1}] ${result?.table || 'unknown'}: no data`;
        }

        const data = result.data;

        // Handle count/aggregate results
        if (data.count !== undefined) {
          return `${data.tableName || result.table}: ${data.count} ${data.type || ''} records`;
        }

        // Handle flat or nested data
        const entries = Object.entries(data);

        // Filter out metadata fields
        const filteredEntries = entries.filter(
          ([key]) =>
            !['id', 'createdAt', 'updatedAt', 'deletedAt'].includes(key),
        );

        // If no fields remain after filtering, show all fields
        const fieldsToShow =
          filteredEntries.length > 0 ? filteredEntries : entries;

        if (fieldsToShow.length === 0) {
          return `[${idx + 1}] ${result.table}: (empty)`;
        }

        const fields = fieldsToShow
          .map(([key, val]) => `${key}: ${flattenValue(val)}`)
          .join(', ');

        return `[${idx + 1}] ${result.table}: ${fields}`;
      })
      .join('\n\n');

    return formatted;
  }
}

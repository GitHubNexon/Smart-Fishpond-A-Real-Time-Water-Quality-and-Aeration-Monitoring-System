// src/modules/ai-chat/services/aims-rag.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { RAGService } from './rag.service';

@Injectable()
export class AIMSRagService implements OnModuleInit {
  private readonly AIMS_KEYWORDS = {
    asset: ['asset', 'assets', 'equipment', 'item', 'items', 'property'],
    draft: ['draft', 'drafts', 'unverified', 'pending', 'incomplete'],
    verified: ['verified', 'verified', 'checked', 'confirmed'],
    approved: ['approved', 'authorized', 'accepted'],
    available: ['available', 'ready', 'free', 'unused'],
    issued: ['issued', 'assigned', 'allocated', 'distributed'],
    repair: ['repair', 'broken', 'damaged', 'maintenance', 'fixing'],
    disposal: ['disposal', 'dispose', 'scrap', 'retire', 'discarded'],
    count: ['how many', 'count', 'number of', 'total', 'quantity'],
    list: ['list', 'show', 'display', 'what are', 'give me'],
    find: ['find', 'search', 'locate', 'get', 'fetch'],
    employee: [
      'employee',
      'staff',
      'personnel',
      'worker',
      'who',
      'under',
      'reports to',
      'assets of',
      'assets assigned to',
    ],
    custodian: [
      'custodian',
      'owner',
      'responsible',
      'in charge',
      'assigned to',
      'who has',
      'who is using',
    ],
  };

  constructor(private readonly ragService: RAGService) {}

  onModuleInit() {
    this.registerAIMSDataSources();
  }

  private registerAIMSDataSources(): void {
    // ASSETS TABLE
    this.ragService.registerDataSource({
      name: 'assets',
      entity: 'Assets',
      tableName: 'assets',
      fields: [
        'id',
        'assetNo',
        'assetName',
        'assetDescription',
        'manufacturer',
        'acquisitionCost',
        'currentQuantity',
        'acquisitionDate',
        'warrantyDate',
        'purchaseOrderNo',
        'supplier',
        'acquisitionType',
        'invoiceNo',
        'isVerified',
        'isApproved',
        'isDraft',
        'verifiedAt',
        'approvedAt',
      ],
      queryableFields: [
        'assetNo',
        'assetName',
        'isVerified',
        'isApproved',
        'isDraft',
        'acquisitionType',
        'manufacturer',
      ],
      customDescription: `Master asset records with verification status.`,
    });

    // ASSET INVENTORY TABLE - ENHANCED FOR CUSTODIAN QUERIES
    this.ragService.registerDataSource({
      name: 'inventories',
      entity: 'AssetInventory',
      tableName: 'assets_inventory',
      fields: [
        'id',
        'inventoryNo',
        'qrCode',
        'barCode',
        'rfidTag',
        'location',
        'status',
        'isDraft',
        // Custodian relationship fields - CRITICAL FOR CUSTODIAN QUERIES
        'custodian.id',
        'custodian.firstName',
        'custodian.middleName',
        'custodian.lastName',
        'custodian.employeeId',
        'custodian.email',
        'custodian.position',
        'custodian.department',
        'custodian.contactNumber',
        // Asset relationship for context
        'asset.id',
        'asset.assetNo',
        'asset.assetName',
        'asset.assetDescription',
      ],
      queryableFields: [
        'inventoryNo',
        'status',
        'location',
        'isDraft',
        'qrCode',
        'barCode',
        'rfidTag',
      ],
      customDescription: `Individual inventory items with full custodian and asset details.
        Use this table when user asks about:
        - Specific inventory numbers (ASSET-XXXX-INV-X)
        - Who is in charge / custodian queries
        - Current holder of an item
        - Item location and status`,
    });

    // EMPLOYEES TABLE
    this.ragService.registerDataSource({
      name: 'employees',
      entity: 'Employee',
      tableName: 'employees',
      fields: [
        'employeeId',
        'firstName',
        'middleName',
        'lastName',
        'email',
        'contactNumber',
        'position',
        'department',
        'isVerified',
        // Related issued assets
        'issuedAsset.id',
        'issuedAsset.inventoryNo',
        'issuedAsset.asset.assetNo',
        'issuedAsset.asset.assetName',
        'issuedAsset.asset.assetDescription',
        'issuedAsset.status',
        'issuedAsset.location',
      ],
      queryableFields: [
        'employeeId',
        'firstName',
        'lastName',
        'email',
        'position',
        'department',
        'issuedAsset.inventoryNo',
        'issuedAsset.status',
        'issuedAsset.asset.assetName',
      ],
      customDescription: `Employee records with related issued assets.
    Use this table when the user asks about:
    - Employee info
    - Assets assigned to a specific employee
    - Contact info or position/department`,
    });

    // OTHER TABLES...
    this.ragService.registerDataSource({
      name: 'transactions',
      entity: 'AssetTransactions',
      tableName: 'asset_transactions',
      fields: [
        'id',
        'transactionNo',
        'parNo',
        'transactionType',
        'fromStatus',
        'toStatus',
        'approvalStatus',
        'transactionDate',
        'approvedAt',
        'rejectedAt',
        'remarks',
        'reason',
        'isActive',
      ],
      queryableFields: [
        'transactionNo',
        'parNo',
        'transactionType',
        'approvalStatus',
        'fromStatus',
        'toStatus',
        'isActive',
      ],
      customDescription: `Transaction history for asset movements.`,
    });

    this.ragService.registerDataSource({
      name: 'depreciation',
      entity: 'AssetDepreciation',
      tableName: 'asset_depreciation',
      fields: [
        'id',
        'usefulLife',
        'usefulLifeUnit',
        'salvageValue',
        'firstDepreciationDate',
        'lastDepreciationDate',
        'frequency',
        'depreciationMethod',
        'isVerified',
        'verifiedAt',
      ],
      queryableFields: [
        'depreciationMethod',
        'frequency',
        'isVerified',
        'usefulLifeUnit',
      ],
      customDescription: `Depreciation configuration per asset.`,
    });

    this.ragService.registerDataSource({
      name: 'depreciation_records',
      entity: 'DepreciationRecord',
      tableName: 'depreciation_record',
      fields: [
        'id',
        'year',
        'month',
        'depreciationDate',
        'depreciationAmount',
        'netBookValue',
        'accumulatedDepreciation',
      ],
      queryableFields: ['year', 'month'],
      customDescription: `Monthly depreciation records.`,
    });
  }

  async queryAIMS(userQuery: string): Promise<string> {
    try {
      const enhancedQuery = this.enhanceQueryWithDomainKnowledge(userQuery);
      const result = await this.ragService.query(enhancedQuery);
      const enrichedContext = this.enrichContextWithAIMSKnowledge(
        result.context,
        userQuery,
      );
      return enrichedContext;
    } catch (error) {
      console.error('AIMS RAG Error:', error);
      return 'Error retrieving data from the database.';
    }
  }

  /**
   * ENHANCED: Better inventory number extraction and custodian detection
   */
  private enhanceQueryWithDomainKnowledge(query: string): string {
    const lowerQuery = query.toLowerCase();
    let enhanced = query;
    const hints: string[] = [];

    // ===== IMPROVED INVENTORY NUMBER EXTRACTION =====
    // Match patterns like: ASSET-0199-INV-1, ASSET-123-INV-5, etc.
    const invPatterns = [
      /ASSET-\d+-INV-\d+/gi, // ASSET-0199-INV-1
      /ASSET\d+-INV-\d+/gi, // ASSET0199-INV-1
      /INV-\d+/gi, // INV-1
      /inventory[:\s]+(\S+)/gi, // inventory: XXXXX
    ];

    for (const pattern of invPatterns) {
      const matches = query.match(pattern);
      if (matches && matches.length > 0) {
        const inventoryNo = matches[0].toUpperCase();
        hints.push(`MUST filter by exact inventoryNo = "${inventoryNo}"`);
        hints.push(`Table: assets_inventory (inventories)`);
        break;
      }
    }

    // ===== CUSTODIAN / EMPLOYEE QUERY DETECTION =====
    const isCustodianQuery = this.containsAny(
      lowerQuery,
      this.AIMS_KEYWORDS.custodian,
    );
    const isEmployeeQuery = this.containsAny(
      lowerQuery,
      this.AIMS_KEYWORDS.employee,
    );
    const isCountQuery = this.containsAny(lowerQuery, this.AIMS_KEYWORDS.count);
    // Asset count held by employee
    if (isEmployeeQuery && isCustodianQuery && isCountQuery) {
      hints.push('Intent: COUNT of assets held by an employee');
      hints.push('Table: employees with issuedAsset relationship');
      hints.push(
        'Return fields: employeeId, firstName, lastName, issuedAsset, issuedAsset.asset.assetName',
      );
    }

    // ===== CUSTODIAN QUERY DETECTION =====
    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.custodian)) {
      hints.push(
        'MUST return custodian full details: firstName, lastName, employeeId, department, position, email, contactNumber',
      );
      hints.push('Table: assets_inventory with custodian join');
      hints.push('Intent: DETAIL (single record)');
    }

    // Status filters
    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.draft)) {
      hints.push('Filter: isDraft = true');
    }
    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.verified)) {
      hints.push('Filter: isVerified = true');
    }
    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.approved)) {
      hints.push('Filter: isApproved = true');
    }

    // Inventory status
    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.available)) {
      hints.push('Filter: status = "Available"');
    }
    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.issued)) {
      hints.push('Filter: status = "Issued"');
    }
    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.repair)) {
      hints.push('Filter: status = "For-Repair"');
    }

    // Count vs list detection
    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.count)) {
      hints.push('Intent: COUNT');
    } else if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.list)) {
      hints.push('Intent: LIST');
    } else if (
      this.containsAny(lowerQuery, ['who', 'custodian', 'in charge'])
    ) {
      hints.push('Intent: DETAIL');
    }

    if (hints.length > 0) {
      enhanced = `${query}\n\n Query Analysis:\n${hints.join('\n')}`;
    }

    return enhanced;
  }

  private containsAny(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
  }

  private enrichContextWithAIMSKnowledge(
    context: string,
    originalQuery: string,
  ): string {
    if (!context || context === 'No data found in the database.') {
      return this.generateHelpfulNoDataMessage(originalQuery);
    }

    let enriched = context;
    const lowerQuery = originalQuery.toLowerCase();

    // Add contextual notes
    if (lowerQuery.includes('draft')) {
      enriched += '\n\n💡 Note: Draft = isDraft=true (not yet verified)';
    }
    if (lowerQuery.includes('verified')) {
      enriched += '\n\n💡 Note: Verified = isVerified=true (checked by staff)';
    }
    if (lowerQuery.includes('approved')) {
      enriched +=
        '\n\n💡 Note: Approved = isApproved=true (authorized by management)';
    }
    if (lowerQuery.includes('custodian')) {
      enriched +=
        '\n\n💡 Note: Custodian = Current employee assigned to this item';
    }

    return enriched;
  }

  private generateHelpfulNoDataMessage(query: string): string {
    const lowerQuery = query.toLowerCase();

    // Check if inventory number was mentioned
    const invMatch = query.match(/ASSET-\d+-INV-\d+/i);
    if (invMatch) {
      return `No inventory item found with number "${invMatch[0]}". Please verify the inventory number is correct.`;
    }

    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.custodian)) {
      return 'No custodian information found. The item may not be issued yet, or the inventory number may be incorrect.';
    }

    if (this.containsAny(lowerQuery, this.AIMS_KEYWORDS.draft)) {
      return 'No draft assets found. All assets may already be verified.';
    }

    return 'No data found matching your query. Try asking about: specific inventory numbers, custodian details, asset status, or total counts.';
  }

  async getAIMSStatistics(): Promise<any> {
    return {
      message: 'Statistics endpoint - implement as needed',
    };
  }

  getDomainKeywords(): typeof this.AIMS_KEYWORDS {
    return this.AIMS_KEYWORDS;
  }
}

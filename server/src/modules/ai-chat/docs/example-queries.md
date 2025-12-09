# Example Queries This Will Now Handle

---

## ASSETS QUERIES

* **How many assets are verified?**
  `SELECT COUNT(*) FROM assets WHERE isVerified = true`

* **Show me approved assets**
  `SELECT * FROM assets WHERE isApproved = true LIMIT 10`

* **Tell me about asset AST-001**
  `SELECT * FROM assets WHERE assetNo = 'AST-001'`

* **How many assets are in draft status?**
  `SELECT COUNT(*) FROM assets WHERE isDraft = true`

---

## INVENTORY QUERIES

* **How many inventories are available for issuance?**
  `SELECT COUNT(*) FROM assets_inventory WHERE status = 'Available'`

* **Show me inventories that are For-Issuance**
  `SELECT * FROM assets_inventory WHERE status = 'For-Issuance'`

* **Tell me about inventory INV-12345**
  `SELECT * FROM assets_inventory WHERE inventoryNo = 'INV-12345'`

* **How many items are currently issued?**
  `SELECT COUNT(*) FROM assets_inventory WHERE status = 'Issued'`

* **List inventories under repair**
  `SELECT * FROM assets_inventory WHERE status = 'For-Repair'`

---

## TRANSACTION QUERIES

* **How many pending issuances do we have?**

  ```sql
  SELECT COUNT(*) FROM asset_transactions 
  WHERE transactionType = 'request_issuance' AND approvalStatus = 'pending';
  ```

* **Show me approved transactions today**

  ```sql
  SELECT * FROM asset_transactions 
  WHERE approvalStatus = 'approved' AND DATE(transactionDate) = CURRENT_DATE;
  ```

* **Tell me about transaction TXN-001**
  `SELECT * FROM asset_transactions WHERE transactionNo = 'TXN-001';`

* **How many repair requests are pending?**

  ```sql
  SELECT COUNT(*) FROM asset_transactions 
  WHERE transactionType = 'request_repair' AND approvalStatus = 'pending';
  ```

---

## DEPRECIATION QUERIES

* **How many assets have verified depreciation?**
  `SELECT COUNT(*) FROM asset_depreciation WHERE isVerified = true;`

* **Show me depreciation records for 2024**
  `SELECT * FROM depreciation_record WHERE year = '2024';`

---

# Query Flow Explanation

### Example:

**User asks:** *"How many inventories are available for issuance?"*

1. **STEP 1:** User query → `AiChatService`
   └ Calls: `aimsRagService.queryAIMS(query)`

2. **STEP 2:** `AIMSRagService` → `RAGService`
   └ Calls: `ragService.query(query)`

3. **STEP 3:** `RAGService` analyzes query
   └ Uses LLM to understand:

   ```json
   {
     "intent": "count",
     "entities": ["inventories"],
     "filters": { "status": "Available" }
   }
   ```

4. **STEP 4:** `RAGService` builds SQL
   `SELECT COUNT(*) FROM assets_inventory WHERE status = 'Available';`

5. **STEP 5:** Executes query → Returns: `23`

6. **STEP 6:** Formats context
   `Count: 23 Available records in assets_inventory`

7. **STEP 7:** Returns to AI Chat Service
   AI responds: *"There are 23 inventories available for issuance."*

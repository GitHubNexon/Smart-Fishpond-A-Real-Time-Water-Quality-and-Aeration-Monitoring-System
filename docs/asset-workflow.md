```text
Workflow Summary

Create Asset (isDraft: true) → Can update freely
Generate Inventory → Creates inventory items while in draft
Finalize Asset (isDraft: false) → Locks editing, ready for verification
Verify Asset (isVerified: true) → First approval level
Approve Asset (isApproved: true) → Final approval level

The asset can only be updated when isDraft === true and !isVerified && !isApproved.

```
```
inventory status 'text marking'

New-Available = no assets life cycle history

Available = it has already assets life cycle history Available for issuance 
For-Issuance = it Reserver to employee for Verification or Approval (Reserver Status) can be cancelled (Mark as Available again)
Issued = has been issued to employee

Returned = returned to custodian either for issuance again or disposals, repairs, 
  - Returned-To-Custodian = return in Custodian or Asset Warehouse 
  - Returned-For-Disposal = returned for Disposal
  - Returned-For-Repair = returned for Repair
  
For-Transfer Only that are New-Available or Available are allowed to be transfered (Reserver Status) can be cancelled (Mark as Available again)
Transfered = transfer to another location or warehouse

For-Disposal = for disposal of asset need's to be returned if come from employee, (Reserver Status) can be cancelled (Mark as Available again)

Disposed =  the asset has been Disposed (marked as disposed and no longer to be available)

Lost = has been lost or missing ? For Report of Lost (marked as lost and no longer to be available)

Stolen = has been Stolen For Report of Stolen (marked as stolen and no longer to be available)

For-Repair = if come from employee it needs to be return if not then mark as reserved to be repaired (Reserver Status) can be cancelled (Mark as Available again)

Repaired = has been repaired (can be marked as Available again for another issuance)
```

```
fix OneToOne issues for duplication add conditional Logic

User and Employee
Asset and Asset Depreciation

```
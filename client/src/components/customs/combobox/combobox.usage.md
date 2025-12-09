// src/components/customs/combobox/combobox.usage.md

# ComboBox Usage

The `ComboBox` component is a flexible, searchable dropdown built with `shadcn/ui`.

### Basic Example
```tsx
<ComboBox
  label="Select Role"
  options={data}
  value={selected}
  onSelect={setSelected}
  placeholder="Choose a role"
/>
```

### Multi Select Example
```tsx
<ComboBox
  label="Select Roles"
  options={data}
  value={selectedRoles}
  onSelect={setSelectedRoles}
  isMulti
  searchKey={["role", "description"]}
  placeholder="Choose multiple roles"
  isClearable
/>
```

### With Icon and Custom Position
```tsx
import { FaUserShield } from "react-icons/fa"

<ComboBox
  label="User Role"
  options={data}
  value={selected}
  onSelect={setSelected}
  searchKey={["role"]}
  placeholder="Search roles"
  icon={<FaUserShield />}
  popoverPosition="top"
/>
```

### Loading State
```tsx
<ComboBox
  label="Roles"
  loading={true}
  options={[]}
  searchKey={["role"]}
/>
```
# PatchService Usage Guide

The `PatchService` provides a reusable way to update entities while automatically handling:

* `updatedAt` timestamp (via `@UpdateDateColumn`)
* `version` increment (via `@VersionColumn`)
* Optional relations
* Validation for `patchBy` field
* Detecting if no fields were actually updated and throwing an error

It is generic and can be used with **any entity**: `User`, `Employee`, `Inventory`, etc.

---

## 1. Inject PatchService in a service

```ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly patchService: PatchService<User>
  ) {}

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<{ old_data: Partial<User>; new_data: User }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({ where: { username: updateUserDto.username } });
      if (existingUser) throw new ConflictException('Username already exists');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
      if (existingUser) throw new ConflictException('Email already exists');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashingService.hash(updateUserDto.password);
    }

    // Call PatchService directly for validation, merge, and save
    return this.patchService.patch(this.userRepository, id, updateUserDto, {
      patchBy: 'id',
      title: 'Profile Update',
      description: `User ${id} updated`,
      relations: ['user_logs', 'user_session', 'user_signatories']
    });
  }
}
```

---

## 2. Using PatchService with other entities

For example, `Employee` or `Inventory` entities:

```ts
@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly patchService: PatchService<Employee>
  ) {}

  async updateEmployee(empId: string, updateDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOne({ where: { id: empId } });
    if (!employee) throw new NotFoundException('Employee not found');

    return this.patchService.patch(this.employeeRepository, empId, updateDto, {
      patchBy: 'id',
      title: 'Employee Update',
      description: `Employee ${empId} updated`,
      relations: ['employee_logs', 'employee_department']
    });
  }
}
```

---

## 3. Controller Example

```ts
@Patch('update/:id')
async updateEntity(@Param('id') id: string, @Body() updateDto: UpdateDto) {
  const updated = await this.myService.updateEntity(id, updateDto);
  return {
    status: 'success',
    message: 'Entity updated successfully',
    data: updated,
  };
}
```

---

## 4. Notes

* `patchBy`: The column used to find the record (e.g., `id`, `username`). Throws an error at runtime if the field doesn't exist.
* `relations`: Optional array of relations to load and update. Default `[]`.
* `updateDto`: Partial fields to update. Only fields provided will be merged into the entity.
* Throws `BadRequestException` if no fields were actually changed.
* Works with any TypeORM entity that has `@UpdateDateColumn` and `@VersionColumn`.
* If the entity or relation doesn't exist, `PatchService` will throw `NotFoundException` or `BadRequestException`.

This pattern allows **reusable, safe patching logic** across modules without duplicating update code or manually checking for changes.

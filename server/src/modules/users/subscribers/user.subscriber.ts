import {
  EventSubscriber,
  EntitySubscriberInterface,
  RemoveEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Session } from 'src/modules/auth/entities/session.entity';
import { DataSource } from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(private dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  /** Trigger before soft delete */
  async beforeSoftRemove(event: RemoveEvent<User>) {
    const sessionRepo = event.manager.getRepository(Session);
    if (event.entity?.id) {
      await sessionRepo.delete({ user: { id: event.entity.id } });
    }
  }

  /** Also trigger before hard delete  */
  async beforeRemove(event: RemoveEvent<User>) {
    const sessionRepo = event.manager.getRepository(Session);
    if (event.entity?.id) {
      await sessionRepo.delete({ user: { id: event.entity.id } });
    }
  }
}

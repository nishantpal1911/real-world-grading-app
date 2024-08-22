import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Course } from 'src/entity/Course';
import { User } from 'src/entity/User';
import { UserRole } from 'src/types';

@Entity()
export class CourseEnrollment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ManyToOne(() => User, (user) => user.courses)
  user: User;

  @ManyToOne(() => Course, (course) => course.members)
  course: Course;

  constructor(props?: Partial<CourseEnrollment>) {
    super();
    if (props) {
      Object.assign(this, props);
    }
  }
}

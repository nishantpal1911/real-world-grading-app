import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ManyToOne } from 'typeorm';

import { UserRole } from '../types';

import { User } from './User';
import { Course } from './Course';

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

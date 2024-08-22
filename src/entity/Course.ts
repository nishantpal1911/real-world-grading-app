import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CourseEnrollment } from 'src/entity/CourseEnrollment';
import { Test } from 'src/entity/Test';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  courseDetails?: string;

  @OneToMany(() => CourseEnrollment, (enrollment) => enrollment.course, { onDelete: 'CASCADE' })
  members: CourseEnrollment[];

  @OneToMany(() => Test, (test) => test.course)
  tests: Test[];

  constructor(props?: Partial<Course>) {
    super();
    if (props) {
      Object.assign(this, props);
    }
  }
}

import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';

import { Token } from './Token';
import { CourseEnrollment } from './CourseEnrollment';
import { TestResult } from './TestResult';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ type: 'jsonb', nullable: true })
  social?: object;

  @OneToMany(() => Token, (token) => token.user, { onDelete: 'CASCADE' })
  tokens: Token[];

  @OneToMany(() => CourseEnrollment, (course) => course.user)
  courses: CourseEnrollment[];

  @OneToMany(() => TestResult, (testResult) => testResult.student)
  testResults: TestResult[];

  @OneToMany(() => TestResult, (testResult) => testResult.gradedBy)
  testGraded: TestResult[];

  constructor(props?: Partial<User>) {
    super();
    if (props) {
      Object.assign(this, props);
    }
  }
}

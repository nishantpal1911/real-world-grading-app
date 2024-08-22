import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Test } from 'src/entity/Test';
import { User } from 'src/entity/User';

@Entity()
export class TestResult extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  result: number;

  @ManyToOne(() => Test, (test) => test.testResults)
  test: Test;

  @ManyToOne(() => User, (student) => student.testResults)
  student: User;

  @ManyToOne(() => User, (student) => student.testGraded)
  gradedBy: User;

  constructor(props?: Partial<TestResult>) {
    super();
    if (props) {
      Object.assign(this, props);
    }
  }
}

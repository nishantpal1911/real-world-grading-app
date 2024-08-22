import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Course } from './Course';
import { TestResult } from './TestResult';

@Entity()
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Course, (course) => course.tests)
  course: Course;

  @OneToMany(() => TestResult, (testResult) => testResult.test)
  testResults: TestResult[];

  constructor(props?: Partial<Test>) {
    super();
    if (props) {
      Object.assign(this, props);
    }
  }
}

// model Test {
//   id Int @id @default(autoincrement())
//   date DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   name String

//   courseId Int
//   course Course @relation(fields: [courseId], references: [id])

//   testResults TestResult[]
// }

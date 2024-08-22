import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/entity/User';
import { TokenType } from 'src/types';

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column({ nullable: true })
  emailToken?: string;

  @Column({ default: true })
  valid: boolean;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.tokens, { cascade: ['insert'], eager: true })
  @JoinColumn()
  user: User;

  constructor(props?: Partial<Token>) {
    super();
    if (props) {
      Object.assign(this, props);
    }
  }
}

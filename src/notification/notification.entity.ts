import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
  })
  topic: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
  })
  body: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imageUrl: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  data: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @ManyToOne(() => User, (user) => user.notification, {
    nullable: true,
  })
  user: User;
}

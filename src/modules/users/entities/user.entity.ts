import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity('users') // Nome da tabela no banco
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'user' })
  role: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

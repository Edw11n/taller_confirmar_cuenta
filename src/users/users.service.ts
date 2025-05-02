import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ActivationCode } from '../auth/entities/activation-code.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private repo: Repository<User>,
    @InjectRepository(ActivationCode)
    private codesRepo: Repository<ActivationCode>
  ) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(user: Partial<User>) {
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }

  async findActivationCodes(userId: number) {
    return this.codesRepo
    .createQueryBuilder('code')
    .leftJoin('code.user', 'user')
    .where('user.id = :userId', { userId })
    .select(['code.id', 'code.code', 'code.dateCreated', 'code.expiration', 'code.used']).getMany();
  }  
}

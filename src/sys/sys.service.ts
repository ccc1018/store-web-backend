import { Injectable } from '@nestjs/common';

@Injectable()
export class SysService {
  findAll() {
    return `This action returns all sys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sy`;
  }
}

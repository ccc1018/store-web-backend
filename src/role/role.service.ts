import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  create(createRoleDto: CreateRoleDto) {
    console.log(`Created role: ${JSON.stringify(createRoleDto)}`);
    return `Created role:`;
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    console.log(`Updated #${id} with ${JSON.stringify(updateRoleDto)}`);
    return `Updated`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
@Injectable()
export class RedisService {
  @Inject("NEST_REDIS")
  private client: RedisClientType;

  getClient(): RedisClientType {
    return this.client;
  }
  async get(redisKey: string): Promise<string | null> {
    return await this.client.get(redisKey)
  }
  async set(redisKey: string, value: string | number, seconds?: number): Promise<string | null> {
    const options = seconds ? { EX: seconds } : {}
    return await this.client.set(redisKey, value, options)
  }
  async hGetAll(redisKey: string): Promise<Record<string, string> | null> {
    if (!redisKey) return null;
    return await this.client.hGetAll(redisKey);
  }
  async del(redisKey: string): Promise<number> {
    return await this.client.del(redisKey)
  }
}

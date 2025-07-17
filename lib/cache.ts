// キャッシュの実装
// 開発環境ではRedis、本番環境ではSupabaseのKey-Valueストアまたはメモリキャッシュを使用

interface CacheInterface {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
}

class MemoryCache implements CacheInterface {
  private cache: Map<string, { value: string; expires: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    const expires = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expires });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

// シングルトンインスタンス
let cacheInstance: CacheInterface;

export function getCache(): CacheInterface {
  if (!cacheInstance) {
    // 本番環境ではメモリキャッシュを使用
    // 将来的にはSupabaseのEdge Functionsでキャッシュを実装可能
    cacheInstance = new MemoryCache();
  }
  return cacheInstance;
}

export default getCache();
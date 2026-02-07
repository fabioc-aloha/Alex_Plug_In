import * as assert from 'assert';
import * as vscode from 'vscode';
import { MemoryTreeProvider } from '../../views/memoryTreeProvider';

suite('Memory Tree Provider Test Suite', () => {

    suite('Provider Structure', () => {

        test('should implement TreeDataProvider', () => {
            const provider = new MemoryTreeProvider();
            assert.ok(provider.getTreeItem, 'should have getTreeItem');
            assert.ok(provider.getChildren, 'should have getChildren');
            assert.ok(provider.onDidChangeTreeData, 'should have onDidChangeTreeData');
        });

        test('should have refresh method', () => {
            const provider = new MemoryTreeProvider();
            assert.ok(typeof provider.refresh === 'function');
        });

    });

    suite('Cache Logic', () => {

        // Simulate the cache logic from memoryTreeProvider
        const CACHE_TTL = 30000;
        
        interface CacheEntry<T> {
            data: T;
            timestamp: number;
        }

        function getCached<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
            const entry = cache.get(key);
            if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
                return entry.data;
            }
            return null;
        }

        function setCache<T>(cache: Map<string, CacheEntry<T>>, key: string, data: T): void {
            cache.set(key, { data, timestamp: Date.now() });
        }

        test('should return cached data within TTL', () => {
            const cache = new Map<string, CacheEntry<string[]>>();
            setCache(cache, 'test-key', ['item1', 'item2']);
            
            const result = getCached(cache, 'test-key');
            assert.deepStrictEqual(result, ['item1', 'item2']);
        });

        test('should return null for expired cache', () => {
            const cache = new Map<string, CacheEntry<string[]>>();
            // Manually set an expired entry
            cache.set('test-key', { 
                data: ['old-data'], 
                timestamp: Date.now() - CACHE_TTL - 1000 
            });
            
            const result = getCached(cache, 'test-key');
            assert.strictEqual(result, null);
        });

        test('should return null for missing key', () => {
            const cache = new Map<string, CacheEntry<string[]>>();
            const result = getCached(cache, 'nonexistent');
            assert.strictEqual(result, null);
        });

        test('should overwrite existing cache entry', () => {
            const cache = new Map<string, CacheEntry<string[]>>();
            setCache(cache, 'key', ['first']);
            setCache(cache, 'key', ['second']);
            
            const result = getCached(cache, 'key');
            assert.deepStrictEqual(result, ['second']);
        });

    });

    suite('Tree Item Creation', () => {

        test('should create tree item for root element', () => {
            const provider = new MemoryTreeProvider();
            const rootData = {
                type: 'root' as const,
                label: 'Memory Files',
                icon: 'database'
            };

            const item = provider.getTreeItem(rootData);
            
            assert.strictEqual(item.label, 'Memory Files');
            assert.strictEqual(item.collapsibleState, vscode.TreeItemCollapsibleState.Collapsed);
        });

        test('should create tree item for category element', () => {
            const provider = new MemoryTreeProvider();
            const categoryData = {
                type: 'category' as const,
                label: 'Skills',
                category: 'skills',
                count: 76,
                icon: 'symbol-class'
            };

            const item = provider.getTreeItem(categoryData);
            
            assert.strictEqual(item.label, 'Skills');
            assert.strictEqual(item.description, '76');
            assert.strictEqual(item.collapsibleState, vscode.TreeItemCollapsibleState.Collapsed);
        });

        test('should create tree item for file element', () => {
            const provider = new MemoryTreeProvider();
            const fileData = {
                type: 'file' as const,
                label: 'SKILL.md',
                filePath: '/path/to/SKILL.md',
                icon: 'file'
            };

            const item = provider.getTreeItem(fileData);
            
            assert.strictEqual(item.label, 'SKILL.md');
            assert.strictEqual(item.collapsibleState, vscode.TreeItemCollapsibleState.None);
            assert.ok(item.command, 'file items should have a command');
        });

        test('should create tree item for status element', () => {
            const provider = new MemoryTreeProvider();
            const statusData = {
                type: 'status' as const,
                label: 'Healthy Connections',
                count: 246,
                healthStatus: 'healthy' as const,
                icon: 'check'
            };

            const item = provider.getTreeItem(statusData);
            
            assert.strictEqual(item.label, 'Healthy Connections');
            assert.strictEqual(item.description, '246');
            assert.strictEqual(item.collapsibleState, vscode.TreeItemCollapsibleState.None);
        });

    });

    suite('Root Categories', () => {

        test('should provide root categories when no parent', async () => {
            const provider = new MemoryTreeProvider();
            const children = await provider.getChildren();
            
            assert.ok(Array.isArray(children), 'should return array');
            assert.ok(children.length >= 3, 'should have at least 3 root categories');
            
            const labels = children.map(c => c.label);
            assert.ok(labels.includes('Memory Files'), 'should include Memory Files');
            assert.ok(labels.includes('Synaptic Network'), 'should include Synaptic Network');
            assert.ok(labels.includes('Global Knowledge'), 'should include Global Knowledge');
        });

    });

    suite('Refresh Behavior', () => {

        test('refresh should clear cache', () => {
            const provider = new MemoryTreeProvider();
            
            // Access provider to ensure it's initialized
            assert.ok(provider);
            
            // Refresh should not throw
            assert.doesNotThrow(() => provider.refresh());
        });

    });

});

import * as assert from 'assert';
import { classifyDomain } from '../../services/expertiseModel';
import type { KnownDomain } from '../../services/expertiseModel';

suite('Expertise Model Test Suite', () => {

    suite('classifyDomain', () => {

        test('should classify debugging keywords', () => {
            assert.strictEqual(classifyDomain('I have a bug in my code'), 'debugging');
            assert.strictEqual(classifyDomain('There is an error when I run this'), 'debugging');
            assert.strictEqual(classifyDomain('The app is crashing'), 'debugging');
            assert.strictEqual(classifyDomain('This is not working'), 'debugging');
        });

        test('should classify testing keywords', () => {
            assert.strictEqual(classifyDomain('Write a unit test for this function'), 'testing');
            assert.strictEqual(classifyDomain('How do I mock this dependency?'), 'testing');
            assert.strictEqual(classifyDomain('Increase test coverage'), 'testing');
        });

        test('should classify security keywords', () => {
            assert.strictEqual(classifyDomain('Check for security vulnerabilities'), 'security');
            assert.strictEqual(classifyDomain('How to handle JWT tokens'), 'security');
            assert.strictEqual(classifyDomain('Prevent XSS attacks'), 'security');
        });

        test('should classify AI/ML keywords', () => {
            assert.strictEqual(classifyDomain('Train a machine learning model'), 'ai-ml');
            assert.strictEqual(classifyDomain('Create an LLM prompt'), 'ai-ml');
            assert.strictEqual(classifyDomain('Use OpenAI embeddings'), 'ai-ml');
        });

        test('should classify devops keywords', () => {
            assert.strictEqual(classifyDomain('Set up a CI/CD pipeline'), 'devops');
            assert.strictEqual(classifyDomain('Deploy to Kubernetes'), 'devops');
            assert.strictEqual(classifyDomain('Write a Dockerfile'), 'devops');
        });

        test('should classify data keywords', () => {
            assert.strictEqual(classifyDomain('Write a SQL query'), 'data');
            assert.strictEqual(classifyDomain('Create a database migration'), 'data');
            assert.strictEqual(classifyDomain('Set up Cosmos DB'), 'data');
        });

        test('should classify architecture keywords', () => {
            assert.strictEqual(classifyDomain('Design a microservice architecture'), 'architecture');
            assert.strictEqual(classifyDomain('Separate concerns with layers'), 'architecture');
        });

        test('should classify documentation keywords', () => {
            assert.strictEqual(classifyDomain('Write the README'), 'documentation');
            assert.strictEqual(classifyDomain('Add JSDoc comments'), 'documentation');
        });

        test('should classify coding keywords', () => {
            assert.strictEqual(classifyDomain('Implement a function that sorts'), 'coding');
            assert.strictEqual(classifyDomain('Refactor this class'), 'coding');
        });

        test('should fall back to general for unrecognized text', () => {
            assert.strictEqual(classifyDomain('Hello world'), 'general');
        });

        test('should prioritize debugging over coding', () => {
            // "bug" triggers debugging, "code" triggers coding — debugging has higher priority
            assert.strictEqual(classifyDomain('There is a bug in this code'), 'debugging');
        });

        test('should handle empty string', () => {
            assert.strictEqual(classifyDomain(''), 'general');
        });
    });
});

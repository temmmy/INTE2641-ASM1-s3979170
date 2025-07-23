/**
 * Problem 1: Hash Functions - Entry Point
 * 
 * Demonstrates cryptographic hash function properties including:
 * - Avalanche effect through minimal input modifications
 * - Pre-image resistance through brute-force attempts
 * - Educational analysis connecting theory to implementation
 */

import { HashFunctionCLI } from './hash-functions';

/**
 * Runs the complete Problem 1 demonstration
 */
export async function runProblem1Demo(): Promise<void> {
    console.log('🔐 PROBLEM 1: HASH FUNCTIONS');
    console.log('============================\n');
    
    const cli = new HashFunctionCLI();
    await cli.run();
}

// Export for external usage
export { HashFunctionDemo, HashFunctionCLI } from './hash-functions';

// Allow direct execution
if (require.main === module) {
    runProblem1Demo().catch((error) => {
        console.error('❌ Problem 1 demo error:', error);
        process.exit(1);
    });
}
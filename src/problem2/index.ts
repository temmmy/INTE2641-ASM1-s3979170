/**
 * Problem 2: Merkle Trees - Entry Point
 * 
 * Demonstrates Merkle tree operations including:
 * - Tree construction from transaction data
 * - Merkle proof generation for transaction verification
 * - Proof verification enabling SPV functionality
 */

import { MerkleTreeCLI } from './merkle-trees';

/**
 * Runs the complete Problem 2 demonstration
 */
export async function runProblem2Demo(): Promise<void> {
    console.log('🌳 PROBLEM 2: MERKLE TREES');
    console.log('==========================\n');
    
    const cli = new MerkleTreeCLI();
    await cli.run();
}

// Export for external usage
export { MerkleTreeDemo, MerkleTreeCLI } from './merkle-trees';

// Allow direct execution
if (require.main === module) {
    runProblem2Demo().catch((error) => {
        console.error('❌ Problem 2 demo error:', error);
        process.exit(1);
    });
}
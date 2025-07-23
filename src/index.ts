#!/usr/bin/env node

/**
 * INTE264 Assignment 1: Core Blockchain Components
 * Main entry point for Problem 1: Hash Functions demonstration
 * 
 * This file serves as the main executable for demonstrating cryptographic
 * hash function properties as required by Assignment 1, Problem 1.
 * 
 * Author: Student
 * Course: INTE264 - Blockchain Technology Fundamentals
 */

import { HashFunctionCLI } from './problem1-hash-functions';
import { MerkleTreeCLI } from './problem2-merkle-trees';

/**
 * Main application entry point
 * Executes demonstrations for implemented problems:
 * - Problem 1: Hash Functions (avalanche effect, pre-image resistance)
 * - Problem 2: Merkle Trees (construction, proof generation, verification)
 */
async function main(): Promise<void> {
    try {
        console.log('🎓 INTE264 Assignment 1 - Core Blockchain Components');
        console.log('====================================================\n');
        
        // Problem 1: Hash Functions Demonstration
        console.log('🔐 PROBLEM 1: HASH FUNCTIONS');
        console.log('============================\n');
        
        const hashCLI = new HashFunctionCLI();
        await hashCLI.run();
        
        console.log('\n' + '='.repeat(80) + '\n');
        
        // Problem 2: Merkle Trees Demonstration
        console.log('🌳 PROBLEM 2: MERKLE TREES');
        console.log('==========================\n');
        
        const merkleCLI = new MerkleTreeCLI();
        await merkleCLI.run();
        
        console.log('\n' + '='.repeat(80) + '\n');
        
        console.log('✅ ALL DEMONSTRATIONS COMPLETED SUCCESSFULLY!');
        console.log('📖 Written analyses available in:');
        console.log('   • src/problem1-analysis.md - Hash Functions analysis');
        console.log('   • src/problem2-analysis.md - Merkle Trees analysis');
        console.log('\n🎯 Both problems demonstrate fundamental blockchain cryptographic components');
        console.log('💡 These implementations show the mathematical foundations of blockchain security');
        
    } catch (error) {
        console.error('❌ Error during demonstration:', error);
        console.error('Please check your environment and try again.');
        process.exit(1);
    }
}

// Execute if this file is run directly
if (require.main === module) {
    main().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

export { main };
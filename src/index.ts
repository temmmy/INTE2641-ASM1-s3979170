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

/**
 * Main application entry point
 * Executes the complete hash function demonstration including:
 * - Avalanche effect demonstration
 * - Pre-image resistance testing
 * - Educational analysis and explanations
 */
async function main(): Promise<void> {
    try {
        console.log('🎓 INTE264 Assignment 1 - Problem 1: Hash Functions');
        console.log('===================================================\n');
        
        // Initialize and run the hash function demonstration
        const cli = new HashFunctionCLI();
        await cli.run();
        
        console.log('\n✅ Demonstration completed successfully!');
        console.log('📖 Please refer to the written analysis document for theoretical explanations.');
        
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
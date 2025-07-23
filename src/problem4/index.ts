// INTE2641 - Blockchain Technology Fundamentals
// Assignment 1: Crypto Data (Individual)
// Problem 4: Simulating Basic Timestamping in a Chain-of-Blocks
// Entry Point Module

import { BlockchainTimestampingCLI } from './blockchain-timestamping';

/**
 * Entry point for Problem 4 demonstration
 * Runs the interactive blockchain timestamping demonstration
 */
export async function runProblem4Demo(): Promise<void> {
    const cli = new BlockchainTimestampingCLI();
    await cli.run();
}

// Allow direct execution of this module
if (require.main === module) {
    runProblem4Demo().catch((error) => {
        console.error('Error running Problem 4 demo:', error);
        process.exit(1);
    });
}
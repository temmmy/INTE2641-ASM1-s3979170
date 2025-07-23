/**
 * Problem 3: Digital Signatures - Entry Point
 * 
 * Demonstrates Public Key Cryptography and digital signature operations:
 * - RSA and ECDSA key pair generation with multiple key sizes
 * - Message signing using private keys with SHA-256 hashing
 * - Signature verification using public keys with tamper detection
 * - Educational analysis of PKC principles and blockchain applications
 */

import { DigitalSignatureCLI } from './digital-signatures';

/**
 * Runs the complete Problem 3 demonstration
 */
export async function runProblem3Demo(): Promise<void> {
    console.log('🔐 PROBLEM 3: DIGITAL SIGNATURES');
    console.log('================================\n');
    
    const cli = new DigitalSignatureCLI();
    await cli.run();
}

// Export for external usage
export { DigitalSignatureDemo, DigitalSignatureCLI } from './digital-signatures';

// Allow direct execution
if (require.main === module) {
    runProblem3Demo().catch((error) => {
        console.error('❌ Problem 3 demo error:', error);
        process.exit(1);
    });
}
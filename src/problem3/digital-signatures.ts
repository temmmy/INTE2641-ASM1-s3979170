// INTE2641 - Blockchain Technology Fundamentals
// Assignment 1: Crypto Data (Individual)
// Problem 3: Digital Signatures
// Author: Nguyen Chi Nghia
// Student ID: s3979170

import {
  generateKeyPairSync,
  sign,
  verify,
  createHash,
  KeyPairSyncResult,
} from "crypto";
import { performance } from "perf_hooks";

/**
 * Represents a cryptographic key pair for digital signatures
 */
interface KeyPair {
  /** Public key in PEM format for signature verification */
  publicKey: string;
  /** Private key in PEM format for message signing */
  privateKey: string;
  /** Algorithm used for key generation */
  algorithm: string;
  /** Key size in bits */
  keySize: number;
  /** Timestamp when keys were generated */
  generatedAt: Date;
}

/**
 * Represents a digital signature with associated metadata
 */
interface DigitalSignature {
  /** The original message that was signed */
  message: string;
  /** Hash of the message (before signing) */
  messageHash: string;
  /** The digital signature in hexadecimal format */
  signature: string;
  /** Algorithm used for signing */
  algorithm: string;
  /** Hash algorithm used for message hashing */
  hashAlgorithm: string;
  /** Timestamp when signature was created */
  signedAt: Date;
  /** Size of signature in bytes */
  signatureSize: number;
}

/**
 * Result of signature verification process
 */
interface VerificationResult {
  /** Whether the signature is valid */
  isValid: boolean;
  /** The message that was verified */
  message: string;
  /** Algorithm used for verification */
  algorithm: string;
  /** Time taken for verification in milliseconds */
  verificationTime: number;
  /** Any error message if verification failed */
  errorMessage?: string;
}

/**
 * DigitalSignatureDemo - Comprehensive implementation of digital signature operations
 *
 * This class implements solutions for Problem 3 of INTE264 Assignment 1, demonstrating:
 * 1. Public-private key pair generation using RSA and ECC algorithms
 * 2. Digital signature creation using private keys
 * 3. Signature verification using public keys
 * 4. Educational analysis of PKC security properties
 *
 * Supports both RSA and ECDSA (Elliptic Curve Digital Signature Algorithm) for
 * comprehensive demonstration of modern cryptographic signature schemes.
 */
export class DigitalSignatureDemo {
  private currentKeyPair: KeyPair | null = null;
  private readonly supportedAlgorithms = ["rsa", "ec"] as const;
  private readonly hashAlgorithm: string = "sha256";

  constructor() {
    console.log("🔐 Digital Signature Implementation and Demonstration");
    console.log("===================================================");
    console.log("Supported Algorithms: RSA, ECDSA (Elliptic Curve)");
    console.log(`Hash Algorithm: ${this.hashAlgorithm.toUpperCase()}\n`);
  }

  /**
   * Problem 3A.i: Generates a public-private key pair
   *
   * Creates a cryptographic key pair using either RSA or ECDSA algorithms.
   * The implementation demonstrates modern public key cryptography with
   * industry-standard key sizes and security parameters.
   *
   * @param algorithm - 'rsa' for RSA or 'ec' for Elliptic Curve
   * @param keySize - Key size (2048, 3072, 4096 for RSA; 256, 384, 521 for EC)
   * @returns Generated key pair with metadata
   */
  public generateKeyPair(
    algorithm: "rsa" | "ec" = "rsa",
    keySize: number = 2048
  ): KeyPair {
    console.log("🔑 PROBLEM 3A.i: PUBLIC-PRIVATE KEY PAIR GENERATION");
    console.log("===================================================\n");

    const startTime = performance.now();

    console.log(`🎯 Generating ${algorithm.toUpperCase()} key pair...`);
    console.log(
      `📏 Key size: ${keySize} ${algorithm === "rsa" ? "bits" : "bits (curve)"}`
    );
    console.log(`⏱️  Generation started at: ${new Date().toISOString()}\n`);

    let keyPairResult: KeyPairSyncResult<string, string>;

    try {
      if (algorithm === "rsa") {
        // Generate RSA key pair
        keyPairResult = generateKeyPairSync("rsa", {
          modulusLength: keySize,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });
      } else {
        // Generate ECDSA key pair
        let namedCurve: string;
        switch (keySize) {
          case 256:
            namedCurve = "secp256k1"; // Bitcoin curve
            break;
          case 384:
            namedCurve = "secp384r1";
            break;
          case 521:
            namedCurve = "secp521r1";
            break;
          default:
            namedCurve = "secp256k1";
            keySize = 256;
        }

        keyPairResult = generateKeyPairSync("ec", {
          namedCurve,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });

        console.log(`📈 Using curve: ${namedCurve}`);
      }

      const endTime = performance.now();
      const generationTime = (endTime - startTime).toFixed(2);

      // Create key pair object with metadata
      const keyPair: KeyPair = {
        publicKey: keyPairResult.publicKey,
        privateKey: keyPairResult.privateKey,
        algorithm,
        keySize,
        generatedAt: new Date(),
      };

      // Store for later use
      this.currentKeyPair = keyPair;

      console.log("✅ Key Pair Generation Complete!");
      console.log(`⏱️  Generation time: ${generationTime} ms`);
      console.log(`🔓 Public key size: ${keyPair.publicKey.length} characters`);
      console.log(
        `🔐 Private key size: ${keyPair.privateKey.length} characters\n`
      );

      // Display key information (first and last few characters for security)
      this.displayKeyInformation(keyPair);

      // Educational analysis
      this.explainKeyGeneration(keyPair, parseFloat(generationTime));

      return keyPair;
    } catch (error) {
      console.error(`❌ Key generation failed: ${error}`);
      throw new Error(
        `Failed to generate ${algorithm.toUpperCase()} key pair: ${error}`
      );
    }
  }

  /**
   * Displays key information in a secure manner (partial display)
   * @param keyPair - The key pair to display information about
   */
  private displayKeyInformation(keyPair: KeyPair): void {
    console.log("🔍 KEY PAIR INFORMATION:");
    console.log("========================");

    console.log("🔓 Public Key (PEM format):");
    const publicLines = keyPair.publicKey.split("\n");
    console.log(`   ${publicLines[0]}`); // Header
    console.log(`   ${publicLines[1].substring(0, 40)}...`); // First line of key data
    console.log(`   ... [${publicLines.length - 3} more lines] ...`);
    console.log(`   ${publicLines[publicLines.length - 2]}`); // Footer

    console.log("\n🔐 Private Key (PEM format):");
    const privateLines = keyPair.privateKey.split("\n");
    console.log(`   ${privateLines[0]}`); // Header
    console.log(
      `   ${privateLines[1].substring(0, 20)}... [REDACTED FOR SECURITY]`
    );
    console.log(`   ... [${privateLines.length - 3} more lines] ...`);
    console.log(`   ${privateLines[privateLines.length - 2]}`); // Footer

    console.log(`\n📊 Key Specifications:`);
    console.log(`   • Algorithm: ${keyPair.algorithm.toUpperCase()}`);
    console.log(`   • Key Size: ${keyPair.keySize} bits`);
    console.log(`   • Generated: ${keyPair.generatedAt.toISOString()}`);
    console.log(`   • Format: PEM (Privacy-Enhanced Mail)`);

    if (keyPair.algorithm === "rsa") {
      console.log(
        `   • Security Level: ~${Math.floor(keyPair.keySize / 8)} bits`
      );
    } else {
      console.log(
        `   • Security Level: ~${keyPair.keySize / 2} bits (ECC efficiency)`
      );
    }
  }

  /**
   * Provides educational explanation of key generation process
   * @param keyPair - Generated key pair
   * @param generationTime - Time taken for generation
   */
  private explainKeyGeneration(keyPair: KeyPair, generationTime: number): void {
    console.log("\n🎓 KEY GENERATION ANALYSIS:");
    console.log("===========================");

    if (keyPair.algorithm === "rsa") {
      console.log("🔢 RSA Key Generation Process:");
      console.log("   1. Generate two large prime numbers (p, q)");
      console.log("   2. Compute modulus n = p × q");
      console.log("   3. Calculate Euler's totient φ(n) = (p-1)(q-1)");
      console.log("   4. Choose public exponent e (commonly 65537)");
      console.log("   5. Calculate private exponent d ≡ e⁻¹ (mod φ(n))");
      console.log("   6. Public key: (n, e), Private key: (n, d)");

      console.log(`\n🛡️  RSA Security Properties:`);
      console.log(`   • Security based on integer factorization problem`);
      console.log(
        `   • ${keyPair.keySize}-bit key provides ~${Math.floor(
          keyPair.keySize / 8
        )} bits of security`
      );
      console.log(`   • Quantum vulnerable (Shor's algorithm)`);
    } else {
      console.log("📈 ECDSA Key Generation Process:");
      console.log("   1. Select elliptic curve and generator point G");
      console.log("   2. Generate random private key d (scalar)");
      console.log(
        "   3. Calculate public key Q = d × G (point multiplication)"
      );
      console.log("   4. Private key: d, Public key: Q");

      console.log(`\n🛡️  ECDSA Security Properties:`);
      console.log(
        `   • Security based on elliptic curve discrete logarithm problem`
      );
      console.log(
        `   • ${keyPair.keySize}-bit key provides ~${
          keyPair.keySize / 2
        } bits of security`
      );
      console.log(
        `   • More efficient than RSA (smaller keys, faster operations)`
      );
      console.log(`   • Quantum vulnerable (Shor's algorithm variant)`);
    }

    console.log(`\n⚡ Performance Analysis:`);
    console.log(`   • Generation time: ${generationTime} ms`);
    console.log(
      `   • Key material size: ${
        keyPair.publicKey.length + keyPair.privateKey.length
      } bytes`
    );
    console.log(`   • Recommended for: ${this.getRecommendedUseCase(keyPair)}`);
  }

  /**
   * Gets recommended use case based on key parameters
   * @param keyPair - The key pair to analyze
   * @returns Recommended use case description
   */
  private getRecommendedUseCase(keyPair: KeyPair): string {
    if (keyPair.algorithm === "rsa") {
      if (keyPair.keySize >= 4096)
        return "High-security applications, long-term storage";
      if (keyPair.keySize >= 3072)
        return "General enterprise use, compliance requirements";
      return "Standard applications, typical blockchain use";
    } else {
      if (keyPair.keySize >= 521) return "Maximum security applications";
      if (keyPair.keySize >= 384)
        return "High-security enterprise applications";
      return "Blockchain applications, cryptocurrency (Bitcoin-compatible)";
    }
  }

  /**
   * Problem 3A.ii: Signs a message using the private key
   *
   * Creates a digital signature by:
   * 1. Hashing the message using SHA-256
   * 2. Signing the hash with the private key
   * 3. Returning the signature with metadata
   *
   * @param message - The message to sign
   * @param keyPair - Key pair to use (uses current if not provided)
   * @returns Digital signature with metadata
   */
  public signMessage(message: string, keyPair?: KeyPair): DigitalSignature {
    console.log("\n📝 PROBLEM 3A.ii: MESSAGE SIGNING PROCESS");
    console.log("=========================================\n");

    const useKeyPair = keyPair || this.currentKeyPair;
    if (!useKeyPair) {
      throw new Error("No key pair available. Generate keys first.");
    }

    const startTime = performance.now();

    console.log(`📋 Message to sign: "${message}"`);
    console.log(`🔐 Using ${useKeyPair.algorithm.toUpperCase()} private key`);
    console.log(`📏 Key size: ${useKeyPair.keySize} bits\n`);

    try {
      // Step 1: Hash the message
      console.log("🔨 Step 1: Hashing the message");
      const messageHash = createHash(this.hashAlgorithm)
        .update(message, "utf8")
        .digest("hex");
      console.log(
        `   Message hash (${this.hashAlgorithm.toUpperCase()}): ${messageHash.substring(
          0,
          32
        )}...`
      );

      // Step 2: Sign the hash
      console.log("\n🔏 Step 2: Creating digital signature");
      const signatureBuffer = sign(
        this.hashAlgorithm,
        Buffer.from(message, "utf8"),
        {
          key: useKeyPair.privateKey,
          padding: useKeyPair.algorithm === "rsa" ? undefined : undefined, // Let Node.js choose optimal padding
        }
      );

      const signature = signatureBuffer.toString("hex");
      const endTime = performance.now();
      const signingTime = (endTime - startTime).toFixed(3);

      // Create signature object
      const digitalSignature: DigitalSignature = {
        message,
        messageHash,
        signature,
        algorithm: useKeyPair.algorithm,
        hashAlgorithm: this.hashAlgorithm,
        signedAt: new Date(),
        signatureSize: signatureBuffer.length,
      };

      console.log("✅ Digital Signature Created!");
      console.log(`⏱️  Signing time: ${signingTime} ms`);
      console.log(`📊 Signature size: ${digitalSignature.signatureSize} bytes`);
      console.log(
        `🔏 Signature (hex): ${signature.substring(
          0,
          32
        )}...${signature.substring(signature.length - 16)}\n`
      );

      // Display signature information
      this.displaySignatureInformation(digitalSignature);

      // Educational analysis
      this.explainSigningProcess(digitalSignature, parseFloat(signingTime));

      return digitalSignature;
    } catch (error) {
      console.error(`❌ Message signing failed: ${error}`);
      throw new Error(`Failed to sign message: ${error}`);
    }
  }

  /**
   * Displays comprehensive signature information
   * @param signature - The digital signature to display
   */
  private displaySignatureInformation(signature: DigitalSignature): void {
    console.log("🔍 DIGITAL SIGNATURE INFORMATION:");
    console.log("=================================");

    console.log(`📋 Original Message: "${signature.message}"`);
    console.log(`🔢 Message Hash: ${signature.messageHash}`);
    console.log(`🔏 Signature: ${signature.signature.substring(0, 64)}...`);
    console.log(
      `              ...${signature.signature.substring(
        signature.signature.length - 32
      )}`
    );

    console.log(`\n📊 Signature Metadata:`);
    console.log(`   • Algorithm: ${signature.algorithm.toUpperCase()}`);
    console.log(
      `   • Hash Algorithm: ${signature.hashAlgorithm.toUpperCase()}`
    );
    console.log(`   • Signature Size: ${signature.signatureSize} bytes`);
    console.log(`   • Created: ${signature.signedAt.toISOString()}`);

    const compressionRatio = (
      signature.signature.length /
      2 /
      signature.message.length
    ).toFixed(2);
    console.log(`   • Size Ratio: ${compressionRatio}x message length`);
  }

  /**
   * Provides educational explanation of the signing process
   * @param signature - The created signature
   * @param signingTime - Time taken for signing
   */
  private explainSigningProcess(
    signature: DigitalSignature,
    signingTime: number
  ): void {
    console.log("\n🎓 SIGNING PROCESS ANALYSIS:");
    console.log("============================");

    console.log("🔄 Digital Signature Creation Steps:");
    console.log("   1. Message Preprocessing: Convert message to bytes");
    console.log(
      `   2. Cryptographic Hashing: Apply ${signature.hashAlgorithm.toUpperCase()} to message`
    );
    console.log("   3. Private Key Operation: Sign hash with private key");
    console.log("   4. Encoding: Convert signature to hexadecimal format");

    if (signature.algorithm === "rsa") {
      console.log("\n🔢 RSA Signing Mathematics:");
      console.log("   • S = H(m)^d mod n");
      console.log(
        "   • S = signature, H(m) = message hash, d = private exponent, n = modulus"
      );
      console.log("   • Uses PKCS#1 v1.5 or PSS padding for security");
    } else {
      console.log("\n📈 ECDSA Signing Mathematics:");
      console.log("   • Generate random k, compute r = (k×G).x mod n");
      console.log("   • Compute s = k⁻¹(H(m) + r×d) mod n");
      console.log(
        "   • Signature = (r, s), where d = private key, G = generator"
      );
    }

    console.log(`\n🔒 Security Properties Achieved:`);
    console.log(
      "   • Authentication: Proves message origin (private key holder)"
    );
    console.log("   • Integrity: Detects any message modification");
    console.log("   • Non-repudiation: Signer cannot deny creating signature");
    console.log(
      "   • Unforgeable: Cannot create valid signature without private key"
    );

    console.log(`\n⚡ Performance Metrics:`);
    console.log(`   • Signing time: ${signingTime} ms`);
    console.log(
      `   • Throughput: ~${(1000 / signingTime).toFixed(0)} signatures/second`
    );
    console.log(
      `   • Overhead: ${signature.signatureSize} bytes per signature`
    );
  }

  /**
   * Verifies a digital signature against the original message using public key
   *
   * This function demonstrates the verification process that enables
   * anyone with the public key to verify message authenticity and integrity.
   *
   * @param signature - The digital signature to verify
   * @param publicKey - Public key for verification
   * @returns Verification result with detailed information
   */
  public verifySignature(
    signature: DigitalSignature,
    publicKey?: string
  ): VerificationResult {
    console.log("\n🔐 PROBLEM 3A.ii: SIGNATURE VERIFICATION PROCESS");
    console.log("================================================\n");

    const usePublicKey = publicKey || this.currentKeyPair?.publicKey;
    if (!usePublicKey) {
      throw new Error("No public key available for verification");
    }

    const startTime = performance.now();

    console.log(`🔍 Verifying signature for: "${signature.message}"`);
    console.log(`🔓 Using ${signature.algorithm.toUpperCase()} public key`);
    console.log(
      `🔏 Signature to verify: ${signature.signature.substring(
        0,
        32
      )}...${signature.signature.substring(signature.signature.length - 16)}\n`
    );

    try {
      // Step 1: Reconstruct message hash
      console.log("🔨 Step 1: Reconstructing message hash");
      const reconstructedHash = createHash(signature.hashAlgorithm)
        .update(signature.message, "utf8")
        .digest("hex");
      console.log(
        `   Reconstructed hash: ${reconstructedHash.substring(0, 32)}...`
      );
      console.log(
        `   Original hash:      ${signature.messageHash.substring(0, 32)}...`
      );

      const hashesMatch = reconstructedHash === signature.messageHash;
      console.log(
        `   Hash consistency: ${hashesMatch ? "✅ Match" : "❌ Mismatch"}`
      );

      // Step 2: Verify signature
      console.log("\n🔓 Step 2: Verifying digital signature");
      const signatureBuffer = Buffer.from(signature.signature, "hex");

      const isValid = verify(
        signature.hashAlgorithm,
        Buffer.from(signature.message, "utf8"),
        {
          key: usePublicKey,
          padding: signature.algorithm === "rsa" ? undefined : undefined,
        },
        signatureBuffer
      );

      const endTime = performance.now();
      const verificationTime = endTime - startTime;

      const result: VerificationResult = {
        isValid: isValid && hashesMatch,
        message: signature.message,
        algorithm: signature.algorithm,
        verificationTime,
        errorMessage: !hashesMatch ? "Hash mismatch detected" : undefined,
      };

      console.log("📊 VERIFICATION RESULTS:");
      console.log("========================");
      console.log(
        `🔍 Signature validity: ${result.isValid ? "✅ VALID" : "❌ INVALID"}`
      );
      console.log(`⏱️  Verification time: ${verificationTime.toFixed(3)} ms`);
      console.log(
        `🔢 Hash verification: ${hashesMatch ? "✅ Passed" : "❌ Failed"}`
      );
      console.log(
        `🔐 Cryptographic verification: ${isValid ? "✅ Passed" : "❌ Failed"}`
      );

      if (result.isValid) {
        console.log("\n🎉 SUCCESS: Signature verification passed!");
        console.log(`   ✓ Message authenticity confirmed`);
        console.log(`   ✓ Message integrity verified`);
        console.log(
          `   ✓ Signature was created with corresponding private key`
        );
        console.log(`   ✓ No tampering detected`);
      } else {
        console.log("\n❌ FAILURE: Signature verification failed!");
        if (!hashesMatch) {
          console.log(`   ✗ Message may have been modified`);
        }
        if (!isValid) {
          console.log(`   ✗ Signature does not match public key`);
          console.log(`   ✗ Either wrong key or signature was forged`);
        }
      }

      // Educational analysis
      this.explainVerificationProcess(result, signature);

      return result;
    } catch (error) {
      const errorResult: VerificationResult = {
        isValid: false,
        message: signature.message,
        algorithm: signature.algorithm,
        verificationTime: performance.now() - startTime,
        errorMessage: `Verification error: ${error}`,
      };

      console.error(`❌ Verification failed: ${error}`);
      return errorResult;
    }
  }

  /**
   * Provides educational explanation of the verification process
   * @param result - Verification result
   * @param signature - Original signature being verified
   */
  private explainVerificationProcess(
    result: VerificationResult,
    signature: DigitalSignature
  ): void {
    console.log("\n🎓 VERIFICATION PROCESS ANALYSIS:");
    console.log("=================================");

    console.log("🔄 Digital Signature Verification Steps:");
    console.log("   1. Hash Reconstruction: Recompute message hash");
    console.log("   2. Hash Comparison: Verify hash consistency");
    console.log("   3. Cryptographic Verification: Apply public key operation");
    console.log("   4. Result Analysis: Determine signature validity");

    if (signature.algorithm === "rsa") {
      console.log("\n🔢 RSA Verification Mathematics:");
      console.log("   • V = S^e mod n");
      console.log("   • Compare V with H(m)");
      console.log(
        "   • V = verification result, S = signature, e = public exponent"
      );
      console.log("   • Valid if V equals the padded message hash");
    } else {
      console.log("\n📈 ECDSA Verification Mathematics:");
      console.log("   • u₁ = H(m) × s⁻¹ mod n, u₂ = r × s⁻¹ mod n");
      console.log("   • P = u₁×G + u₂×Q (where Q is public key)");
      console.log("   • Valid if P.x ≡ r (mod n)");
    }

    console.log(`\n🔒 Security Guarantees:`);
    if (result.isValid) {
      console.log("   ✅ Message Authentication: Confirms sender identity");
      console.log("   ✅ Data Integrity: Message hasn't been tampered with");
      console.log("   ✅ Non-repudiation: Sender cannot deny signing");
      console.log("   ✅ Cryptographic Proof: Mathematically verifiable");
    } else {
      console.log("   ❌ Authentication Failed: Cannot confirm sender");
      console.log("   ❌ Integrity Compromised: Message may be modified");
      console.log("   ❌ Signature Invalid: Cryptographic verification failed");
    }

    console.log(`\n⚡ Performance Analysis:`);
    console.log(
      `   • Verification time: ${result.verificationTime.toFixed(3)} ms`
    );
    console.log(
      `   • Throughput: ~${(1000 / result.verificationTime).toFixed(
        0
      )} verifications/second`
    );
    console.log(`   • Public operation: Generally faster than signing`);

    if (signature.algorithm === "ec") {
      console.log("   • ECDSA: Faster verification than RSA");
    } else {
      console.log("   • RSA: Simple modular exponentiation");
    }
  }

  /**
   * Comprehensive demonstration of all digital signature operations
   * @param message - Message to demonstrate with
   * @param algorithm - Algorithm to use ('rsa' or 'ec')
   * @param keySize - Key size for demonstration
   */
  public runCompleteDemo(
    message: string = "Hello, Blockchain World!",
    algorithm: "rsa" | "ec" = "rsa",
    keySize: number = 2048
  ): void {
    console.log("🚀 COMPLETE DIGITAL SIGNATURE DEMONSTRATION");
    console.log("==========================================\n");

    try {
      // Step 1: Generate key pair
      const keyPair = this.generateKeyPair(algorithm, keySize);

      console.log("\n" + "=".repeat(80) + "\n");

      // Step 2: Sign the message
      const signature = this.signMessage(message, keyPair);

      console.log("\n" + "=".repeat(80) + "\n");

      // Step 3: Verify the signature
      const verificationResult = this.verifySignature(
        signature,
        keyPair.publicKey
      );

      console.log("\n" + "=".repeat(80) + "\n");

      // Step 4: Demonstrate invalid signature detection
      console.log("🧪 TAMPER DETECTION DEMONSTRATION");
      console.log("=================================\n");

      // Create a tampered message
      const tamperedMessage = message + " (TAMPERED)";
      console.log(`🔧 Testing with tampered message: "${tamperedMessage}"`);

      const tamperedSignature: DigitalSignature = {
        ...signature,
        message: tamperedMessage,
      };

      const tamperedResult = this.verifySignature(
        tamperedSignature,
        keyPair.publicKey
      );

      console.log("\n📊 DEMONSTRATION SUMMARY:");
      console.log("========================");
      console.log(
        `✅ Key Generation: ${keyPair.algorithm.toUpperCase()} ${
          keyPair.keySize
        }-bit`
      );
      console.log(
        `✅ Message Signing: ${signature.signatureSize} bytes signature`
      );
      console.log(
        `✅ Valid Signature Verification: ${
          verificationResult.isValid ? "PASSED" : "FAILED"
        }`
      );
      console.log(
        `✅ Tamper Detection: ${
          !tamperedResult.isValid ? "PASSED" : "FAILED"
        } (tampered message rejected)`
      );

      console.log("\n🎯 DEMONSTRATION COMPLETE");
      console.log(
        "All digital signature operations have been successfully demonstrated."
      );
      console.log(
        "See the written analysis for detailed explanations of PKC principles.\n"
      );
    } catch (error) {
      console.error(`❌ Demo error: ${error}`);
    }
  }

  /**
   * Gets the current key pair (if any)
   * @returns Current key pair or null
   */
  public getCurrentKeyPair(): KeyPair | null {
    return this.currentKeyPair;
  }

  /**
   * Clears the current key pair (for security)
   */
  public clearKeyPair(): void {
    this.currentKeyPair = null;
    console.log("🧹 Key pair cleared from memory");
  }

  /**
   * Validates message input for signing
   * @param message - Message to validate
   * @returns True if valid, false otherwise
   */
  public static validateMessage(message: string): boolean {
    if (typeof message !== "string") {
      console.log("❌ Message must be a string");
      return false;
    }

    if (message.length === 0) {
      console.log("❌ Cannot sign empty message");
      return false;
    }

    if (message.length > 10000) {
      console.log("⚠️  Warning: Very long message (>10KB)");
    }

    return true;
  }
}

/**
 * Interactive CLI interface for digital signature demonstration
 * Provides user-friendly interface for testing signature operations
 */
export class DigitalSignatureCLI {
  private demo: DigitalSignatureDemo;

  constructor() {
    this.demo = new DigitalSignatureDemo();
  }

  /**
   * Runs the interactive digital signature demonstration
   */
  public async run(): Promise<void> {
    console.log("📝 INTERACTIVE DIGITAL SIGNATURE DEMONSTRATION");
    console.log("==============================================\n");

    // Sample message for demonstration
    const sampleMessage =
      "This is a blockchain transaction: Nikita sends 100000 BTC to Sean";

    console.log("📋 Using sample message for demonstration:");
    console.log(`   "${sampleMessage}"`);
    console.log(
      "(In interactive mode, you would be prompted to enter your own message)\n"
    );

    // Validate message before processing
    if (!DigitalSignatureDemo.validateMessage(sampleMessage)) {
      console.log("❌ Invalid message provided");
      return;
    }

    console.log("🎯 Algorithm Selection: Using RSA 2048-bit for demonstration");
    console.log("(In interactive mode, you would choose RSA or ECDSA)\n");

    // Run the complete demonstration
    this.demo.runCompleteDemo(sampleMessage, "rsa", 2048);

    console.log("💡 NEXT STEPS:");
    console.log("• Review the written analysis (Problem 3B) for PKC theory");
    console.log("• Try running with different algorithms (RSA vs ECDSA)");
    console.log("• Experiment with different key sizes for security analysis");
    console.log("• Consider blockchain applications of digital signatures");

    // Clean up keys for security
    this.demo.clearKeyPair();
  }
}

// Export for use in other modules and testing
export default DigitalSignatureDemo;

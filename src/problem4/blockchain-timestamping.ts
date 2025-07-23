// INTE2641 - Blockchain Technology Fundamentals
// Assignment 1: Crypto Data (Individual)
// Problem 4: Simulating Basic Timestamping in a Chain-of-Blocks
// Author: Nguyen Chi Nghia
// Student ID: s3979170

import { createHash } from "crypto";
import { performance } from "perf_hooks";

/**
 * Represents a single block in the blockchain
 * Contains all essential fields for a basic blockchain implementation
 */
interface Block {
  /** Unique identifier for this block */
  blockId: number;
  /** Unix timestamp when the block was created */
  timestamp: number;
  /** Human-readable timestamp string */
  timestampReadable: string;
  /** Data/transactions stored in this block */
  data: string;
  /** Hash of the previous block in the chain */
  previousHash: string;
  /** Current block's hash (calculated from all other fields) */
  currentHash: string;
  /** Nonce value used for mining/proof-of-work (simplified) */
  nonce: number;
  /** Size of the block data in bytes */
  blockSize: number;
}

/**
 * Represents the complete blockchain with metadata
 */
interface Blockchain {
  /** Array of all blocks in the chain */
  blocks: Block[];
  /** Total number of blocks in the chain */
  length: number;
  /** Hash of the genesis block */
  genesisHash: string;
  /** Hash of the latest block */
  latestHash: string;
  /** Timestamp when the blockchain was created */
  createdAt: number;
  /** Average time between block creation in milliseconds */
  averageBlockTime: number;
}

/**
 * Validation result for blockchain integrity
 */
interface ValidationResult {
  /** Whether the entire blockchain is valid */
  isValid: boolean;
  /** Number of blocks validated */
  blocksValidated: number;
  /** Any validation errors found */
  errors: string[];
  /** Time taken for validation in milliseconds */
  validationTime: number;
  /** Additional validation details */
  details: {
    hashConsistency: boolean;
    chainConsistency: boolean;
    timestampConsistency: boolean;
  };
}

/**
 * BlockchainTimestampingDemo - Comprehensive implementation of basic blockchain with timestamping
 *
 * This class implements solutions for Problem 4 of INTE264 Assignment 1, demonstrating:
 * 1. Block data structure with essential blockchain fields
 * 2. Chain-of-blocks simulation with proper linking and timestamping
 * 3. Blockchain integrity validation and analysis
 *
 * The implementation shows how timestamping provides immutable ordering and
 * how the chain structure ensures data integrity through cryptographic hashing.
 */
export class BlockchainTimestampingDemo {
  private readonly hashAlgorithm: string = "sha256";
  private blockchain: Blockchain | null = null;
  private readonly miningDelay: number = 1000; // 1 second delay between blocks

  constructor() {
    console.log("⛓️  Blockchain Timestamping Simulation");
    console.log("=====================================");
    console.log(`Hash Algorithm: ${this.hashAlgorithm.toUpperCase()}`);
    console.log(`Block Mining Delay: ${this.miningDelay}ms\n`);
  }

  /**
   * Computes SHA-256 hash of the input string
   * @param input - The string to hash
   * @returns Hexadecimal representation of the hash
   */
  private computeHash(input: string): string {
    return createHash(this.hashAlgorithm).update(input, "utf8").digest("hex");
  }

  /**
   * Calculates the hash for a block based on all its fields except currentHash
   * @param block - Block to calculate hash for
   * @returns The calculated hash
   */
  private calculateBlockHash(block: Omit<Block, "currentHash">): string {
    const blockString = `${block.blockId}${block.timestamp}${block.data}${block.previousHash}${block.nonce}`;
    return this.computeHash(blockString);
  }

  /**
   * Creates a formatted timestamp string from Unix timestamp
   * @param timestamp - Unix timestamp in milliseconds
   * @returns Human-readable timestamp string
   */
  private formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }

  /**
   * Simulates a delay to represent block mining time
   * @param delayMs - Delay in milliseconds
   * @returns Promise that resolves after the delay
   */
  private async simulateBlockMining(delayMs: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }

  /**
   * Problem 4A.i: Creates a block data structure
   *
   * This function defines and demonstrates the essential components of a blockchain block:
   * - Block ID for unique identification
   * - Timestamp for chronological ordering
   * - Data field for storing information/transactions
   * - Previous hash for chain linking
   * - Current hash for block integrity
   * - Nonce for proof-of-work simulation
   *
   * @param blockId - Unique identifier for the block
   * @param data - Data/transactions to store in the block
   * @param previousHash - Hash of the previous block
   * @param nonce - Nonce value for mining simulation
   * @returns Completed block with all fields populated
   */
  public createBlock(
    blockId: number,
    data: string,
    previousHash: string,
    nonce: number = 0
  ): Block {
    console.log(`🔨 PROBLEM 4A.i: CREATING BLOCK ${blockId}`);
    console.log("=======================================\n");

    const timestamp = Date.now();
    const timestampReadable = this.formatTimestamp(timestamp);

    console.log(`📋 Block Information:`);
    console.log(`   • Block ID: ${blockId}`);
    console.log(`   • Timestamp: ${timestamp} (${timestampReadable})`);
    console.log(`   • Data: "${data}"`);
    console.log(`   • Previous Hash: ${previousHash.substring(0, 16)}...`);
    console.log(`   • Nonce: ${nonce}`);

    // Create block without hash first
    const blockWithoutHash: Omit<Block, "currentHash"> = {
      blockId,
      timestamp,
      timestampReadable,
      data,
      previousHash,
      nonce,
      blockSize: Buffer.from(data, 'utf8').length,
    };

    // Calculate the block hash
    const currentHash = this.calculateBlockHash(blockWithoutHash);

    // Complete block with hash
    const block: Block = {
      ...blockWithoutHash,
      currentHash,
    };

    console.log(`\n🔐 Cryptographic Details:`);
    console.log(`   • Block Size: ${block.blockSize} bytes`);
    console.log(`   • Current Hash: ${currentHash}`);
    console.log(`   • Hash Input: "${blockId}${timestamp}${data}${previousHash}${nonce}"`);

    console.log(`\n✅ Block ${blockId} created successfully!`);
    this.explainBlockStructure(block);

    return block;
  }

  /**
   * Provides educational explanation of block structure
   * @param block - The block to explain
   */
  private explainBlockStructure(block: Block): void {
    console.log(`\n🎓 BLOCK STRUCTURE ANALYSIS:`);
    console.log(`============================`);

    console.log(`📊 Essential Fields:`);
    console.log(`   • Block ID: Unique identifier for ordering and reference`);
    console.log(`   • Timestamp: Immutable time record for chronological ordering`);
    console.log(`   • Data: The actual information/transactions being stored`);
    console.log(`   • Previous Hash: Links to previous block, creating the chain`);
    console.log(`   • Current Hash: Cryptographic fingerprint of this block`);
    console.log(`   • Nonce: Number used once, enables proof-of-work mining`);

    console.log(`\n🔒 Security Properties:`);
    console.log(`   • Immutability: Any change breaks the hash chain`);
    console.log(`   • Integrity: Hash ensures data hasn't been tampered with`);
    console.log(`   • Transparency: All fields are verifiable and auditable`);
    console.log(`   • Chronological Order: Timestamps provide verifiable sequence`);

    console.log(`\n⚡ Blockchain Benefits:`);
    console.log(`   • Decentralization: No single point of control`);
    console.log(`   • Consensus: Network agrees on valid chain`);
    console.log(`   • Auditability: Complete transaction history`);
    console.log(`   • Resistance: Extremely difficult to alter historical data`);
  }

  /**
   * Problem 4A.ii: Simulates chain-of-blocks with timestamping
   *
   * This function creates a complete blockchain by:
   * 1. Creating a genesis block (first block)
   * 2. Adding subsequent blocks with proper linking
   * 3. Implementing timestamping for chronological ordering
   * 4. Simulating mining delays between blocks
   * 5. Maintaining chain integrity through hash linking
   *
   * @param blockDataArray - Array of data for each block
   * @returns Complete blockchain with all blocks linked
   */
  public async createBlockchain(blockDataArray: string[]): Promise<Blockchain> {
    console.log(`\n⛓️  PROBLEM 4A.ii: CHAIN-OF-BLOCKS SIMULATION`);
    console.log("=============================================\n");

    if (blockDataArray.length === 0) {
      throw new Error("Cannot create blockchain with no data");
    }

    const startTime = performance.now();
    const blocks: Block[] = [];

    console.log(`🚀 Initializing blockchain with ${blockDataArray.length} blocks...`);
    console.log(`⏱️  Mining delay: ${this.miningDelay}ms between blocks\n`);

    // Create genesis block (first block)
    console.log(`🌟 Creating Genesis Block (Block 0):`);
    const genesisBlock = this.createBlock(
      0,
      blockDataArray[0],
      "0000000000000000000000000000000000000000000000000000000000000000", // Genesis previous hash
      0
    );
    blocks.push(genesisBlock);

    console.log(`\n${"=".repeat(60)}\n`);

    // Add delay after genesis block
    if (blockDataArray.length > 1) {
      console.log(`⏳ Mining delay: Waiting ${this.miningDelay}ms before next block...\n`);
      await this.simulateBlockMining(this.miningDelay);
    }

    // Create subsequent blocks
    for (let i = 1; i < blockDataArray.length; i++) {
      console.log(`⛏️  Mining Block ${i}:`);
      
      const previousBlock = blocks[i - 1];
      const newBlock = this.createBlock(
        i,
        blockDataArray[i],
        previousBlock.currentHash,
        i // Simple nonce progression
      );

      blocks.push(newBlock);

      // Display chain linking information
      console.log(`\n🔗 Chain Linking:`);
      console.log(`   Previous Block Hash: ${previousBlock.currentHash.substring(0, 32)}...`);
      console.log(`   Current Block Hash:  ${newBlock.currentHash.substring(0, 32)}...`);
      console.log(`   Time Since Previous: ${newBlock.timestamp - previousBlock.timestamp}ms`);

      console.log(`\n${"=".repeat(60)}\n`);

      // Add mining delay (except for the last block)
      if (i < blockDataArray.length - 1) {
        console.log(`⏳ Mining delay: Waiting ${this.miningDelay}ms before next block...\n`);
        await this.simulateBlockMining(this.miningDelay);
      }
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Calculate average block time
    const totalBlockTime = blocks.length > 1 
      ? blocks[blocks.length - 1].timestamp - blocks[0].timestamp 
      : 0;
    const averageBlockTime = blocks.length > 1 
      ? totalBlockTime / (blocks.length - 1)
      : 0;

    // Create blockchain object
    const blockchain: Blockchain = {
      blocks,
      length: blocks.length,
      genesisHash: blocks[0].currentHash,
      latestHash: blocks[blocks.length - 1].currentHash,
      createdAt: blocks[0].timestamp,
      averageBlockTime,
    };

    this.blockchain = blockchain;

    console.log(`✅ BLOCKCHAIN CREATION COMPLETE!`);
    console.log(`==================================`);
    console.log(`📊 Blockchain Statistics:`);
    console.log(`   • Total Blocks: ${blockchain.length}`);
    console.log(`   • Genesis Hash: ${blockchain.genesisHash.substring(0, 32)}...`);
    console.log(`   • Latest Hash: ${blockchain.latestHash.substring(0, 32)}...`);
    console.log(`   • Total Creation Time: ${totalTime.toFixed(2)}ms`);
    console.log(`   • Average Block Time: ${averageBlockTime.toFixed(2)}ms`);
    console.log(`   • Chain Span: ${totalBlockTime}ms`);

    this.displayBlockchainStructure(blockchain);
    this.explainTimestamping(blockchain);

    return blockchain;
  }

  /**
   * Displays a visual representation of the blockchain structure
   * @param blockchain - The blockchain to visualize
   */
  private displayBlockchainStructure(blockchain: Blockchain): void {
    console.log(`\n🎨 BLOCKCHAIN VISUALIZATION:`);
    console.log("============================");

    blockchain.blocks.forEach((block, index) => {
      const isGenesis = index === 0;
      const connector = isGenesis ? "" : " ↑";
      
      console.log(`${connector}`);
      console.log(`┌─ Block ${block.blockId} ${isGenesis ? "(Genesis)" : ""}`);
      console.log(`│  Timestamp: ${block.timestampReadable}`);
      console.log(`│  Data: "${block.data}"`);
      console.log(`│  Hash: ${block.currentHash.substring(0, 16)}...`);
      console.log(`│  Prev: ${block.previousHash.substring(0, 16)}...`);
      console.log(`└─ Nonce: ${block.nonce}`);
      
      if (index < blockchain.blocks.length - 1) {
        console.log(`   │`);
        console.log(`   │ (linked by hash)`);
      }
    });
  }

  /**
   * Provides educational explanation of timestamping in blockchain
   * @param blockchain - The blockchain to analyze
   */
  private explainTimestamping(blockchain: Blockchain): void {
    console.log(`\n🎓 TIMESTAMPING ANALYSIS:`);
    console.log("=========================");

    console.log(`📅 Timestamp Properties:`);
    console.log(`   • Immutable Ordering: Blocks cannot be reordered without breaking hashes`);
    console.log(`   • Verifiable Sequence: Each timestamp must be >= previous timestamp`);
    console.log(`   • Audit Trail: Complete chronological history of all data`);
    console.log(`   • Consensus Time: Network agrees on block creation order`);

    console.log(`\n⛓️  Chain Properties:`);
    console.log(`   • Hash Linking: Each block references previous block's hash`);
    console.log(`   • Integrity: Changing any block breaks all subsequent hashes`);
    console.log(`   • Cumulative Security: Longer chains are exponentially harder to fake`);
    console.log(`   • Distributed Consensus: Multiple nodes validate the same chain`);

    if (blockchain.blocks.length > 1) {
      console.log(`\n📊 Timing Statistics:`);
      const timeDeltas = blockchain.blocks.slice(1).map((block, index) => 
        block.timestamp - blockchain.blocks[index].timestamp
      );
      const minDelta = Math.min(...timeDeltas);
      const maxDelta = Math.max(...timeDeltas);
      
      console.log(`   • Shortest Block Time: ${minDelta}ms`);
      console.log(`   • Longest Block Time: ${maxDelta}ms`);
      console.log(`   • Average Block Time: ${blockchain.averageBlockTime.toFixed(2)}ms`);
      console.log(`   • Time Variance: ${(maxDelta - minDelta)}ms`);
    }

    console.log(`\n🔒 Security Implications:`);
    console.log(`   • Tamper Evidence: Any modification is immediately detectable`);
    console.log(`   • Historical Integrity: Past data cannot be silently changed`);
    console.log(`   • Chronological Proof: Timestamps provide verifiable ordering`);
    console.log(`   • Consensus Validation: Network validates both data and timing`);
  }

  /**
   * Validates the integrity of the blockchain
   * @param blockchain - The blockchain to validate (uses current if not provided)
   * @returns Detailed validation result
   */
  public validateBlockchain(blockchain?: Blockchain): ValidationResult {
    console.log(`\n🔍 BLOCKCHAIN VALIDATION`);
    console.log("========================\n");

    const targetBlockchain = blockchain || this.blockchain;
    if (!targetBlockchain) {
      throw new Error("No blockchain available for validation");
    }

    const startTime = performance.now();
    const errors: string[] = [];
    let hashConsistency = true;
    let chainConsistency = true;
    let timestampConsistency = true;

    console.log(`🔎 Validating blockchain with ${targetBlockchain.blocks.length} blocks...`);

    // Validate each block
    targetBlockchain.blocks.forEach((block, index) => {
      console.log(`\n📋 Validating Block ${block.blockId}:`);

      // 1. Hash consistency validation
      const recalculatedHash = this.calculateBlockHash({
        blockId: block.blockId,
        timestamp: block.timestamp,
        timestampReadable: block.timestampReadable,
        data: block.data,
        previousHash: block.previousHash,
        nonce: block.nonce,
        blockSize: block.blockSize,
      });

      if (recalculatedHash !== block.currentHash) {
        const error = `Block ${block.blockId}: Hash mismatch. Expected: ${recalculatedHash}, Found: ${block.currentHash}`;
        errors.push(error);
        hashConsistency = false;
        console.log(`   ❌ Hash validation: FAILED`);
        console.log(`      Expected: ${recalculatedHash.substring(0, 32)}...`);
        console.log(`      Found:    ${block.currentHash.substring(0, 32)}...`);
      } else {
        console.log(`   ✅ Hash validation: PASSED`);
      }

      // 2. Chain consistency validation (except genesis block)
      if (index > 0) {
        const previousBlock = targetBlockchain.blocks[index - 1];
        if (block.previousHash !== previousBlock.currentHash) {
          const error = `Block ${block.blockId}: Previous hash mismatch. Expected: ${previousBlock.currentHash}, Found: ${block.previousHash}`;
          errors.push(error);
          chainConsistency = false;
          console.log(`   ❌ Chain linking: FAILED`);
          console.log(`      Expected: ${previousBlock.currentHash.substring(0, 32)}...`);
          console.log(`      Found:    ${block.previousHash.substring(0, 32)}...`);
        } else {
          console.log(`   ✅ Chain linking: PASSED`);
        }

        // 3. Timestamp consistency validation
        if (block.timestamp < previousBlock.timestamp) {
          const error = `Block ${block.blockId}: Timestamp ${block.timestamp} is before previous block timestamp ${previousBlock.timestamp}`;
          errors.push(error);
          timestampConsistency = false;
          console.log(`   ❌ Timestamp order: FAILED`);
          console.log(`      Current: ${block.timestampReadable}`);
          console.log(`      Previous: ${previousBlock.timestampReadable}`);
        } else {
          console.log(`   ✅ Timestamp order: PASSED`);
        }
      } else {
        console.log(`   ✅ Genesis block: PASSED`);
      }

      // 4. Block ID sequence validation
      if (block.blockId !== index) {
        const error = `Block ${block.blockId}: Block ID should be ${index}`;
        errors.push(error);
        console.log(`   ❌ Block ID sequence: FAILED (expected ${index}, found ${block.blockId})`);
      } else {
        console.log(`   ✅ Block ID sequence: PASSED`);
      }
    });

    const endTime = performance.now();
    const validationTime = endTime - startTime;

    const result: ValidationResult = {
      isValid: errors.length === 0,
      blocksValidated: targetBlockchain.blocks.length,
      errors,
      validationTime,
      details: {
        hashConsistency,
        chainConsistency,
        timestampConsistency,
      },
    };

    console.log(`\n📊 VALIDATION RESULTS:`);
    console.log("=====================");
    console.log(`🔍 Overall Status: ${result.isValid ? "✅ VALID" : "❌ INVALID"}`);
    console.log(`📋 Blocks Validated: ${result.blocksValidated}`);
    console.log(`⏱️  Validation Time: ${validationTime.toFixed(3)}ms`);
    console.log(`🔐 Hash Consistency: ${hashConsistency ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`⛓️  Chain Consistency: ${chainConsistency ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`📅 Timestamp Consistency: ${timestampConsistency ? "✅ PASS" : "❌ FAIL"}`);

    if (errors.length > 0) {
      console.log(`\n❌ Validation Errors (${errors.length}):`);
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log(`\n🎉 SUCCESS: Blockchain integrity verified!`);
      console.log(`   • All blocks have valid hashes`);
      console.log(`   • Chain linking is correct`);
      console.log(`   • Timestamps are properly ordered`);
      console.log(`   • Block sequence is valid`);
    }

    this.explainValidationProcess(result);

    return result;
  }

  /**
   * Provides educational explanation of the validation process
   * @param result - Validation result to explain
   */
  private explainValidationProcess(result: ValidationResult): void {
    console.log(`\n🎓 VALIDATION PROCESS EXPLANATION:`);
    console.log("==================================");

    console.log(`🔍 Validation Steps:`);
    console.log(`   1. Hash Verification: Recalculate each block's hash`);
    console.log(`   2. Chain Verification: Ensure each block links to previous`);
    console.log(`   3. Timestamp Verification: Check chronological ordering`);
    console.log(`   4. Sequence Verification: Validate block ID progression`);

    console.log(`\n🛡️  Security Properties Verified:`);
    console.log(`   • Data Integrity: No block data has been tampered with`);
    console.log(`   • Chain Integrity: All blocks are properly linked`);
    console.log(`   • Chronological Integrity: Time ordering is maintained`);
    console.log(`   • Structural Integrity: Block sequence is valid`);

    if (result.isValid) {
      console.log(`\n✅ Blockchain Security Guarantees:`);
      console.log(`   • Immutability: Data cannot be changed without detection`);
      console.log(`   • Verifiability: Anyone can validate the entire chain`);
      console.log(`   • Transparency: All transactions are auditable`);
      console.log(`   • Consensus: Network can agree on valid state`);
    } else {
      console.log(`\n⚠️  Security Breaches Detected:`);
      console.log(`   • Chain integrity may be compromised`);
      console.log(`   • Data may have been tampered with`);
      console.log(`   • Chronological ordering may be invalid`);
      console.log(`   • Blockchain should be rejected by network`);
    }

    console.log(`\n⚡ Real-World Applications:`);
    console.log(`   • Cryptocurrency: Prevents double-spending attacks`);
    console.log(`   • Supply Chain: Ensures product authenticity`);
    console.log(`   • Document Timestamping: Proves when documents existed`);
    console.log(`   • Audit Trails: Immutable record of business transactions`);
  }

  /**
   * Comprehensive demonstration of all blockchain operations
   * @param blockDataArray - Array of data for each block
   */
  public async runCompleteDemo(blockDataArray: string[]): Promise<void> {
    console.log("🚀 COMPLETE BLOCKCHAIN TIMESTAMPING DEMONSTRATION");
    console.log("===============================================\n");

    try {
      // Step 1: Create the blockchain
      const blockchain = await this.createBlockchain(blockDataArray);

      console.log("\n" + "=".repeat(80) + "\n");

      // Step 2: Validate the blockchain
      const validationResult = this.validateBlockchain(blockchain);

      console.log("\n" + "=".repeat(80) + "\n");

      // Step 3: Demonstrate tampering detection
      console.log("🧪 TAMPERING DETECTION DEMONSTRATION");
      console.log("===================================\n");

      // Create a copy and tamper with it
      const tamperedBlockchain: Blockchain = JSON.parse(JSON.stringify(blockchain));
      tamperedBlockchain.blocks[1].data = "TAMPERED DATA - This should be detected!";

      console.log(`🔧 Tampering with Block 1 data...`);
      console.log(`   Original: "${blockchain.blocks[1].data}"`);
      console.log(`   Tampered: "${tamperedBlockchain.blocks[1].data}"`);

      console.log(`\n🔍 Validating tampered blockchain...`);
      const tamperedResult = this.validateBlockchain(tamperedBlockchain);

      console.log(`\n📊 DEMONSTRATION SUMMARY:`);
      console.log("========================");
      console.log(`✅ Blockchain Creation: ${blockchain.length} blocks created`);
      console.log(`✅ Original Validation: ${validationResult.isValid ? "PASSED" : "FAILED"}`);
      console.log(`✅ Tampering Detection: ${!tamperedResult.isValid ? "PASSED" : "FAILED"} (tampered blockchain rejected)`);
      console.log(`📊 Performance: ${validationResult.validationTime.toFixed(2)}ms validation time`);

      console.log(`\n🎯 DEMONSTRATION COMPLETE`);
      console.log("All blockchain timestamping operations have been successfully demonstrated.");
      console.log("See the written analysis for detailed explanations of blockchain concepts.\n");

    } catch (error) {
      console.error(`❌ Demo error: ${error}`);
    }
  }

  /**
   * Gets the current blockchain (for external access)
   * @returns The current blockchain, or null if not created
   */
  public getBlockchain(): Blockchain | null {
    return this.blockchain;
  }

  /**
   * Validates that block data is suitable for blockchain creation
   * @param blockDataArray - Data to validate
   * @returns True if valid, false otherwise
   */
  public static validateBlockData(blockDataArray: string[]): boolean {
    if (!Array.isArray(blockDataArray)) {
      console.log("❌ Block data must be an array");
      return false;
    }

    if (blockDataArray.length === 0) {
      console.log("❌ Cannot create blockchain with no data");
      return false;
    }

    if (blockDataArray.length > 1000) {
      console.log("⚠️  Warning: Large blockchain may take significant time to create");
    }

    // Check for reasonable data sizes
    const oversizedBlocks = blockDataArray.filter(data => data.length > 10000);
    if (oversizedBlocks.length > 0) {
      console.log(`⚠️  Warning: ${oversizedBlocks.length} blocks exceed 10KB in size`);
    }

    return true;
  }
}

/**
 * Interactive CLI interface for blockchain timestamping demonstration
 * Provides a user-friendly interface for testing blockchain operations
 */
export class BlockchainTimestampingCLI {
  private demo: BlockchainTimestampingDemo;

  constructor() {
    this.demo = new BlockchainTimestampingDemo();
  }

  /**
   * Runs the interactive blockchain timestamping demonstration
   */
  public async run(): Promise<void> {
    console.log("📝 INTERACTIVE BLOCKCHAIN TIMESTAMPING DEMONSTRATION");
    console.log("==================================================\n");

    // Sample blockchain data for demonstration
    const sampleBlockData = [
      "Genesis Block: Initial blockchain state",
      "Block 1: Nikita sends 100 BTC to Sean",
      "Block 2: Sean sends 50 BTC to Minh", 
      "Block 3: Minh sends 25 BTC to Kiet",
      "Block 4: Kiet sends 10 BTC to Pibot",
      "Block 5: System backup completed successfully"
    ];

    console.log("🎲 Using sample blockchain data:");
    sampleBlockData.forEach((data, index) => {
      console.log(`   Block ${index}: "${data}"`);
    });
    console.log("\n(In interactive mode, you would be prompted to enter your own data)\n");

    // Validate data before processing
    if (!BlockchainTimestampingDemo.validateBlockData(sampleBlockData)) {
      console.log("❌ Invalid block data provided");
      return;
    }

    // Run the complete demonstration
    await this.demo.runCompleteDemo(sampleBlockData);

    console.log("💡 NEXT STEPS:");
    console.log("• Review the written analysis (Problem 4B) for theoretical explanations");
    console.log("• Try running with different numbers of blocks and data");
    console.log("• Experiment with different mining delays");
    console.log("• Consider how this relates to real blockchain networks like Bitcoin");
  }
}

// Export for use in other modules and testing
export default BlockchainTimestampingDemo;
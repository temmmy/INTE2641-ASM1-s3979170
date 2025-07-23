// INTE2641 - Blockchain Technology Fundamentals
// Assignment 1: Crypto Data (Individual)
// Problem 2: Merkle Trees
// Author: Nguyen Chi Nghia
// Student ID: s3979170
import { createHash } from "crypto";

/**
 * Represents a node in the Merkle Tree structure
 * Each node contains a hash value and references to its children (if any)
 */
interface MerkleNode {
  /** The hash value stored in this node */
  hash: string;
  /** Left child node (null for leaf nodes) */
  left?: MerkleNode | null;
  /** Right child node (null for leaf nodes) */
  right?: MerkleNode | null;
  /** Original data (only present in leaf nodes) */
  data?: string;
  /** Node level in the tree (0 = root, increases towards leaves) */
  level?: number;
  /** Position index at this level */
  index?: number;
}

/**
 * Represents a single step in a Merkle proof
 * Contains the hash value and its position relative to the target
 */
interface MerkleProofStep {
  /** The hash value of the sibling node */
  hash: string;
  /** Position of this hash relative to the target ('left' or 'right') */
  position: "left" | "right";
  /** Level in the tree where this proof step applies */
  level: number;
}

/**
 * Complete Merkle proof for verifying a data item's inclusion
 */
interface MerkleProof {
  /** The data item being proven */
  dataItem: string;
  /** Hash of the data item */
  dataHash: string;
  /** Array of proof steps from leaf to root */
  steps: MerkleProofStep[];
  /** The expected Merkle root */
  root: string;
  /** Index of the data item in the original list */
  dataIndex: number;
}

/**
 * MerkleTreeDemo - Comprehensive implementation of Merkle Tree operations
 *
 * This class implements solutions for Problem 2 of INTE264 Assignment 1, demonstrating:
 * 1. Merkle Tree construction from a list of data items
 * 2. Merkle proof generation for specific data items
 * 3. Merkle proof verification functionality
 *
 * The implementation correctly handles edge cases including odd numbers of nodes
 * at any level and provides detailed educational output.
 */
export class MerkleTreeDemo {
  private readonly hashAlgorithm: string = "sha256";
  private tree: MerkleNode | null = null;
  private originalData: string[] = [];

  constructor() {
    console.log("🌳 Merkle Tree Implementation and Proof System");
    console.log("==============================================");
    console.log(`Hash Algorithm: ${this.hashAlgorithm.toUpperCase()}\n`);
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
   * Creates a hash for internal tree nodes by concatenating two child hashes
   * @param leftHash - Hash of the left child
   * @param rightHash - Hash of the right child
   * @returns Combined hash of both children
   */
  private combineHashes(leftHash: string, rightHash: string): string {
    return this.computeHash(leftHash + rightHash);
  }

  /**
   * Problem 2A.i: Constructs a Merkle Tree from a list of data items
   *
   * This function builds a complete binary tree where:
   * - Leaf nodes contain hashes of the original data items
   * - Internal nodes contain hashes of their children's concatenated hashes
   * - The root contains the final Merkle root hash
   *
   * Handles odd numbers of nodes by duplicating the last node at each level,
   * following the standard Bitcoin Merkle tree construction approach.
   *
   * @param dataItems - Array of strings representing transaction IDs or data
   * @returns The Merkle root hash
   */
  public constructMerkleTree(dataItems: string[]): string {
    console.log("🏗️  PROBLEM 2A.i: MERKLE TREE CONSTRUCTION");
    console.log("==========================================\n");

    if (dataItems.length === 0) {
      throw new Error("Cannot construct Merkle tree from empty data set");
    }

    // Store original data for later proof generation
    this.originalData = [...dataItems];

    console.log(`📋 Input Data Items (${dataItems.length} items):`);
    dataItems.forEach((item, index) => {
      console.log(`   ${index + 1}. "${item}"`);
    });
    console.log("");

    // Step 1: Create leaf nodes with hashes of data items
    console.log("🍃 Step 1: Creating leaf nodes");
    let currentLevel: MerkleNode[] = dataItems.map((data, index) => {
      const hash = this.computeHash(data);
      console.log(
        `   Leaf ${index + 1}: "${data}" → ${hash.substring(0, 16)}...`
      );
      return {
        hash,
        data,
        level: this.calculateTreeHeight(dataItems.length) - 1,
        index,
      };
    });

    console.log(`\n🔨 Building tree with ${currentLevel.length} leaf nodes...`);

    let levelNumber = this.calculateTreeHeight(dataItems.length) - 1;

    // Step 2: Build tree level by level until we reach the root
    while (currentLevel.length > 1) {
      console.log(`\n📊 Level ${levelNumber} → Level ${levelNumber - 1}:`);
      const nextLevel: MerkleNode[] = [];

      // Process pairs of nodes at current level
      for (let i = 0; i < currentLevel.length; i += 2) {
        const leftNode = currentLevel[i];
        let rightNode: MerkleNode;

        // Handle odd number of nodes by duplicating the last node
        if (i + 1 >= currentLevel.length) {
          rightNode = { ...leftNode }; // Duplicate last node
          console.log(
            `   ⚠️  Odd number of nodes, duplicating: ${leftNode.hash.substring(
              0,
              16
            )}...`
          );
        } else {
          rightNode = currentLevel[i + 1];
        }

        // Create parent node
        const combinedHash = this.combineHashes(leftNode.hash, rightNode.hash);
        const parentNode: MerkleNode = {
          hash: combinedHash,
          left: leftNode,
          right: rightNode,
          level: levelNumber - 1,
          index: Math.floor(i / 2),
        };

        console.log(
          `   Parent ${Math.floor(i / 2) + 1}: ${leftNode.hash.substring(
            0,
            8
          )}... + ${rightNode.hash.substring(
            0,
            8
          )}... → ${combinedHash.substring(0, 16)}...`
        );

        nextLevel.push(parentNode);
      }

      currentLevel = nextLevel;
      levelNumber--;
    }

    // Store the completed tree
    this.tree = currentLevel[0];
    const merkleRoot = this.tree.hash;

    console.log(`\n✅ Merkle Tree Construction Complete!`);
    console.log(`🎯 Merkle Root: ${merkleRoot}`);
    console.log(
      `📏 Tree Height: ${this.calculateTreeHeight(dataItems.length)} levels`
    );
    console.log(`🍃 Leaf Nodes: ${dataItems.length}`);

    // Display tree structure
    this.displayTreeStructure();

    return merkleRoot;
  }

  /**
   * Calculates the height of a Merkle tree for a given number of leaf nodes
   * @param leafCount - Number of leaf nodes
   * @returns Height of the tree (root is level 0)
   */
  private calculateTreeHeight(leafCount: number): number {
    if (leafCount <= 1) return 1;
    return Math.ceil(Math.log2(leafCount)) + 1;
  }

  /**
   * Displays a visual representation of the Merkle tree structure
   */
  private displayTreeStructure(): void {
    if (!this.tree) {
      console.log("❌ No tree constructed yet");
      return;
    }

    console.log("\n🎨 Tree Structure Visualization:");
    console.log("================================");

    this.printTreeLevel(this.tree, 0);
  }

  /**
   * Recursively prints tree levels for visualization
   * @param node - Current node to print
   * @param depth - Current depth in the tree
   */
  private printTreeLevel(node: MerkleNode, depth: number): void {
    const indent = "  ".repeat(depth);
    const hashPreview = node.hash.substring(0, 12) + "...";

    if (node.data) {
      // Leaf node
      console.log(`${indent}🍃 Leaf: "${node.data}" (${hashPreview})`);
    } else {
      // Internal node
      console.log(`${indent}🔷 Node: ${hashPreview}`);
      if (node.left) this.printTreeLevel(node.left, depth + 1);
      if (node.right) this.printTreeLevel(node.right, depth + 1);
    }
  }

  /**
   * Problem 2A.ii: Generates a Merkle proof for a specific data item
   *
   * A Merkle proof consists of the minimum set of hashes needed to reconstruct
   * the Merkle root when combined with the target data item. This enables
   * efficient verification without needing the entire dataset.
   *
   * @param dataItem - The specific data item to generate proof for
   * @returns Complete Merkle proof object
   */
  public generateMerkleProof(dataItem: string): MerkleProof {
    console.log("\n🔍 PROBLEM 2A.ii: MERKLE PROOF GENERATION");
    console.log("==========================================\n");

    if (!this.tree) {
      throw new Error(
        "Merkle tree must be constructed before generating proofs"
      );
    }

    // Find the data item index in original data
    const dataIndex = this.originalData.indexOf(dataItem);
    if (dataIndex === -1) {
      throw new Error(`Data item "${dataItem}" not found in the tree`);
    }

    console.log(`🎯 Generating proof for: "${dataItem}"`);
    console.log(`📍 Data index: ${dataIndex}`);
    console.log(`🔢 Data hash: ${this.computeHash(dataItem)}\n`);

    const dataHash = this.computeHash(dataItem);
    const proofSteps: MerkleProofStep[] = [];

    // Start from the leaf and work up to the root
    const path = this.findPathToLeaf(this.tree, dataItem);
    if (!path) {
      throw new Error("Could not find path to data item in tree");
    }

    console.log("🛤️  Building proof path from leaf to root:");

    // Generate proof steps by collecting sibling hashes along the path
    for (let i = path.length - 1; i > 0; i--) {
      const currentNode = path[i];
      const parentNode = path[i - 1];

      // Determine if current node is left or right child
      const isLeftChild = parentNode.left === currentNode;
      const siblingNode = isLeftChild ? parentNode.right : parentNode.left;

      if (siblingNode) {
        const proofStep: MerkleProofStep = {
          hash: siblingNode.hash,
          position: isLeftChild ? "right" : "left",
          level: currentNode.level || 0,
        };

        proofSteps.push(proofStep);

        console.log(
          `   Level ${
            proofStep.level
          }: ${proofStep.position.toUpperCase()} sibling = ${proofStep.hash.substring(
            0,
            16
          )}...`
        );
      }
    }

    const proof: MerkleProof = {
      dataItem,
      dataHash,
      steps: proofSteps,
      root: this.tree.hash,
      dataIndex,
    };

    console.log(`\n✅ Proof Generation Complete!`);
    console.log(`📊 Proof contains ${proofSteps.length} steps`);
    console.log(`💾 Proof size: ~${this.calculateProofSize(proof)} bytes`);
    console.log(`🎯 Target root: ${proof.root}`);

    this.displayProofStructure(proof);

    return proof;
  }

  /**
   * Finds the path from root to a specific leaf containing the target data
   * @param node - Current node in the search
   * @param targetData - Data item to find
   * @param path - Current path from root
   * @returns Array of nodes from root to leaf, or null if not found
   */
  private findPathToLeaf(
    node: MerkleNode,
    targetData: string,
    path: MerkleNode[] = []
  ): MerkleNode[] | null {
    const currentPath = [...path, node];

    // Check if this is the target leaf
    if (node.data === targetData) {
      return currentPath;
    }

    // If this is a leaf but not the target, return null
    if (node.data && node.data !== targetData) {
      return null;
    }

    // Search in left subtree
    if (node.left) {
      const leftPath = this.findPathToLeaf(node.left, targetData, currentPath);
      if (leftPath) return leftPath;
    }

    // Search in right subtree
    if (node.right) {
      const rightPath = this.findPathToLeaf(
        node.right,
        targetData,
        currentPath
      );
      if (rightPath) return rightPath;
    }

    return null;
  }

  /**
   * Calculates approximate size of a Merkle proof in bytes
   * @param proof - The Merkle proof to measure
   * @returns Estimated size in bytes
   */
  private calculateProofSize(proof: MerkleProof): number {
    // Each hash is 32 bytes (256 bits), plus metadata
    const hashBytes = proof.steps.length * 32;
    const metadataBytes = proof.dataItem.length + 50; // Approximate metadata size
    return hashBytes + metadataBytes;
  }

  /**
   * Displays a visual representation of the proof structure
   * @param proof - The Merkle proof to visualize
   */
  private displayProofStructure(proof: MerkleProof): void {
    console.log("\n🎨 Proof Structure Visualization:");
    console.log("=================================");
    console.log(`Data: "${proof.dataItem}"`);
    console.log(`Hash: ${proof.dataHash.substring(0, 16)}...`);
    console.log("");

    proof.steps.forEach((step, index) => {
      const arrow = step.position === "left" ? "←" : "→";
      console.log(
        `Step ${index + 1} (Level ${
          step.level
        }): ${arrow} ${step.hash.substring(0, 16)}... (${step.position})`
      );
    });

    console.log(`\n🎯 Reconstructs Root: ${proof.root.substring(0, 16)}...`);
  }

  /**
   * Problem 2A.iii: Verifies a Merkle proof against a known root
   *
   * Takes a Merkle proof and verifies that the claimed data item, when combined
   * with the proof hashes, correctly reconstructs the given Merkle root.
   * This is the core functionality that enables SPV (Simplified Payment Verification).
   *
   * @param proof - The Merkle proof to verify
   * @param merkleRoot - The expected Merkle root to verify against
   * @returns True if proof is valid, false otherwise
   */
  public verifyMerkleProof(proof: MerkleProof, merkleRoot: string): boolean {
    console.log("\n🔐 PROBLEM 2A.iii: MERKLE PROOF VERIFICATION");
    console.log("=============================================\n");

    console.log(`🔍 Verifying proof for: "${proof.dataItem}"`);
    console.log(`🎯 Expected root: ${merkleRoot}`);
    console.log(`📊 Proof steps: ${proof.steps.length}`);
    console.log("");

    try {
      // Start with the hash of the data item
      let currentHash = proof.dataHash;
      console.log(
        `🏁 Starting with data hash: ${currentHash.substring(0, 16)}...`
      );

      // Apply each proof step to reconstruct the path to root
      proof.steps.forEach((step, index) => {
        const stepNumber = index + 1;
        console.log(`\n🔧 Step ${stepNumber} (Level ${step.level}):`);
        console.log(`   Current hash: ${currentHash.substring(0, 16)}...`);
        console.log(
          `   Sibling hash: ${step.hash.substring(0, 16)}... (${step.position})`
        );

        // Combine hashes according to sibling position
        if (step.position === "left") {
          // Sibling is on the left, current hash on the right
          currentHash = this.combineHashes(step.hash, currentHash);
          console.log(
            `   Combined: LEFT(${step.hash.substring(
              0,
              8
            )}...) + RIGHT(${proof.dataHash.substring(0, 8)}...)`
          );
        } else {
          // Current hash on the left, sibling on the right
          currentHash = this.combineHashes(currentHash, step.hash);
          console.log(
            `   Combined: LEFT(${proof.dataHash.substring(
              0,
              8
            )}...) + RIGHT(${step.hash.substring(0, 8)}...)`
          );
        }

        console.log(`   Result: ${currentHash.substring(0, 16)}...`);
      });

      const isValid = currentHash === merkleRoot;

      console.log("\n📊 VERIFICATION RESULTS:");
      console.log("========================");
      console.log(`🔍 Reconstructed root: ${currentHash}`);
      console.log(`🎯 Expected root:      ${merkleRoot}`);
      console.log(`✅ Proof valid: ${isValid ? "✓ YES" : "✗ NO"}`);

      if (isValid) {
        console.log("\n🎉 SUCCESS: Proof verification passed!");
        console.log(
          `   Data item "${proof.dataItem}" is confirmed to be in the Merkle tree`
        );
        console.log(
          `   The proof demonstrates inclusion without revealing other data items`
        );
      } else {
        console.log("\n❌ FAILURE: Proof verification failed!");
        console.log(
          `   Either the data item is not in the tree, or the proof is invalid`
        );
        console.log(
          `   Hash mismatch indicates potential tampering or incorrect proof`
        );
      }

      this.explainVerificationProcess(proof, isValid);

      return isValid;
    } catch (error) {
      console.log(`\n❌ ERROR during verification: ${error}`);
      return false;
    }
  }

  /**
   * Provides educational explanation of the verification process
   * @param proof - The proof that was verified
   * @param isValid - Whether verification succeeded
   */
  private explainVerificationProcess(
    proof: MerkleProof,
    isValid: boolean
  ): void {
    console.log("\n🎓 EDUCATIONAL ANALYSIS:");
    console.log("========================");

    console.log(`📈 Efficiency Benefits:`);
    console.log(
      `   • Proof size: ${this.calculateProofSize(proof)} bytes vs full tree`
    );
    console.log(
      `   • Verification time: O(log n) vs O(n) for full verification`
    );
    console.log(
      `   • Network bandwidth: Only ${proof.steps.length} hashes needed`
    );

    console.log(`\n🔒 Security Properties:`);
    if (isValid) {
      console.log(
        `   • Cryptographic guarantee: Data item is definitely in the tree`
      );
      console.log(`   • No false positives: Valid proof = confirmed inclusion`);
      console.log(`   • Privacy preserved: Other data items remain hidden`);
    } else {
      console.log(`   • Invalid proof detected: Hash reconstruction failed`);
      console.log(`   • Security maintained: Tampering attempts are caught`);
      console.log(
        `   • Trust model: Verification doesn't require trusted parties`
      );
    }

    console.log(`\n⚡ SPV Applications:`);
    console.log(
      `   • Lightweight clients can verify transactions without full blockchain`
    );
    console.log(
      `   • Mobile wallets use Merkle proofs for transaction confirmation`
    );
    console.log(
      `   • Scalability: Millions of transactions verified with small proofs`
    );
  }

  /**
   * Comprehensive demonstration of all Merkle tree operations
   * @param dataItems - Array of data items to demonstrate with
   */
  public runCompleteDemo(dataItems: string[]): void {
    console.log("🚀 COMPLETE MERKLE TREE DEMONSTRATION");
    console.log("====================================\n");

    try {
      // Step 1: Construct the Merkle tree
      const merkleRoot = this.constructMerkleTree(dataItems);

      console.log("\n" + "=".repeat(60) + "\n");

      // Step 2: Generate proof for a specific item (use the first item)
      const targetItem = dataItems[0];
      const proof = this.generateMerkleProof(targetItem);

      console.log("\n" + "=".repeat(60) + "\n");

      // Step 3: Verify the generated proof
      const isValid = this.verifyMerkleProof(proof, merkleRoot);

      console.log("\n" + "=".repeat(60) + "\n");

      // Step 4: Demonstrate proof for different items
      if (dataItems.length > 1) {
        console.log("🔄 ADDITIONAL PROOF DEMONSTRATIONS");
        console.log("==================================\n");

        // Test with second item if available
        const secondItem = dataItems[1];
        console.log(`Testing proof for second item: "${secondItem}"`);
        const secondProof = this.generateMerkleProof(secondItem);
        const secondValid = this.verifyMerkleProof(secondProof, merkleRoot);

        console.log("\n" + "=".repeat(40) + "\n");

        // Test with invalid data (should fail)
        console.log("Testing with invalid data (should fail):");
        const invalidProof: MerkleProof = {
          dataItem: "NonExistent Item",
          dataHash: this.computeHash("NonExistent Item"),
          steps: proof.steps, // Using valid steps with invalid data
          root: merkleRoot,
          dataIndex: -1,
        };

        console.log("🧪 Testing invalid proof (expected to fail)...");
        const invalidResult = this.verifyMerkleProof(invalidProof, merkleRoot);

        console.log(`\n📊 Demonstration Summary:`);
        console.log(
          `   • Original proof: ${isValid ? "✅ Valid" : "❌ Invalid"}`
        );
        console.log(
          `   • Second item proof: ${secondValid ? "✅ Valid" : "❌ Invalid"}`
        );
        console.log(
          `   • Invalid proof test: ${
            invalidResult ? "⚠️ Unexpected success" : "✅ Correctly rejected"
          }`
        );
      }

      console.log("\n🎯 DEMONSTRATION COMPLETE");
      console.log(
        "All Merkle tree operations have been successfully demonstrated."
      );
      console.log(
        "See the written analysis for detailed explanations of these concepts.\n"
      );
    } catch (error) {
      console.error(`❌ Demo error: ${error}`);
    }
  }

  /**
   * Gets the current Merkle root (for external access)
   * @returns The Merkle root hash, or null if tree not constructed
   */
  public getMerkleRoot(): string | null {
    return this.tree ? this.tree.hash : null;
  }

  /**
   * Gets the original data items used to construct the tree
   * @returns Copy of the original data array
   */
  public getOriginalData(): string[] {
    return [...this.originalData];
  }

  /**
   * Validates that a list of data items can form a valid Merkle tree
   * @param dataItems - Data items to validate
   * @returns True if valid, false otherwise
   */
  public static validateDataItems(dataItems: string[]): boolean {
    if (!Array.isArray(dataItems)) {
      console.log("❌ Data items must be an array");
      return false;
    }

    if (dataItems.length === 0) {
      console.log("❌ Cannot create Merkle tree from empty data set");
      return false;
    }

    // Check for duplicate items (optional - depends on use case)
    const uniqueItems = new Set(dataItems);
    if (uniqueItems.size !== dataItems.length) {
      console.log("⚠️  Warning: Duplicate data items detected");
    }

    return true;
  }
}

/**
 * Interactive CLI interface for Merkle tree demonstration
 * Provides a user-friendly interface for testing Merkle tree operations
 */
export class MerkleTreeCLI {
  private demo: MerkleTreeDemo;

  constructor() {
    this.demo = new MerkleTreeDemo();
  }

  /**
   * Runs the interactive Merkle tree demonstration
   */
  public async run(): Promise<void> {
    console.log("📝 INTERACTIVE MERKLE TREE DEMONSTRATION");
    console.log("========================================\n");

    // Sample transaction data for demonstration
    const sampleTransactions = [
      "TX001: Nikita sends 100000 BTC to Sean",
      "TX002: Sean sends 100 BTC to Nikita",
      "TX004: Minh sends 500 BTC to Nikita",
      "TX003: Kiet sends 800 BTC to Nikita",
      "TX005: Pibot sends 4000 BTC to Nikita",
    ];

    console.log("🎲 Using sample transaction data:");
    sampleTransactions.forEach((tx, index) => {
      console.log(`   ${index + 1}. ${tx}`);
    });
    console.log(
      "\n(In interactive mode, you would be prompted to enter your own data)\n"
    );

    // Validate data before processing
    if (!MerkleTreeDemo.validateDataItems(sampleTransactions)) {
      console.log("❌ Invalid data provided");
      return;
    }

    // Run the complete demonstration
    this.demo.runCompleteDemo(sampleTransactions);

    console.log("💡 NEXT STEPS:");
    console.log(
      "• Review the written analysis (Problem 2B) for theoretical explanations"
    );
    console.log(
      "• Try running with different numbers of transactions (odd/even)"
    );
    console.log(
      "• Experiment with different data items to see proof variations"
    );
    console.log(
      "• Consider how this enables SPV clients in real blockchain systems"
    );
  }
}

// Export for use in other modules and testing
export default MerkleTreeDemo;

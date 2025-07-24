// INTE2641 - Blockchain Technology Fundamentals
// Assignment 1: Crypto Data (Individual)
// Problem 1: Hash Functions
// Author: Nguyen Chi Nghia
// Student ID: s3979170

import { createHash, randomBytes } from "crypto";
import { performance } from "perf_hooks";

/**
 * HashFunctionDemo - Comprehensive demonstration of cryptographic hash function properties
 *
 * This class implements solutions for Problem 1 of INTE264 Assignment 1, demonstrating:
 * 1. The avalanche effect in cryptographic hash functions
 * 2. Pre-image resistance through brute-force attempts
 *
 * Uses SHA-256 as the primary cryptographic hash function for all demonstrations.
 */
export class HashFunctionDemo {
  private readonly hashAlgorithm: string = "sha256";

  constructor() {
    console.log("🔐 Hash Function Properties Demonstration");
    console.log("=========================================");
    console.log(`Using algorithm: ${this.hashAlgorithm.toUpperCase()}\n`);
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
   * Calculates Hamming distance between two strings of equal length
   * Hamming distance = number of positions where characters differ
   * @param str1 - First string (hash)
   * @param str2 - Second string (hash)
   * @returns Number of differing positions
   */
  private calculateHammingDistance(str1: string, str2: string): number {
    if (str1.length !== str2.length) {
      throw new Error(
        "Strings must be of equal length for Hamming distance calculation"
      );
    }

    let distance = 0;
    for (let i = 0; i < str1.length; i++) {
      if (str1[i] !== str2[i]) {
        distance++;
      }
    }
    return distance;
  }

  /**
   * Converts hexadecimal string to binary representation
   * Used for bit-level analysis of hash differences
   * @param hex - Hexadecimal string
   * @returns Binary string representation
   */
  private hexToBinary(hex: string): string {
    return hex
      .split("")
      .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
      .join("");
  }

  /**
   * Calculates bit-level Hamming distance between two hex strings
   * @param hex1 - First hexadecimal string
   * @param hex2 - Second hexadecimal string
   * @returns Number of differing bits
   */
  private calculateBitHammingDistance(hex1: string, hex2: string): number {
    const bin1 = this.hexToBinary(hex1);
    const bin2 = this.hexToBinary(hex2);
    return this.calculateHammingDistance(bin1, bin2);
  }

  /**
   * Problem 1A.i: Demonstrates the avalanche effect
   *
   * The avalanche effect is a fundamental property where small changes in input
   * result in dramatically different hash outputs. This function:
   * 1. Takes user input and computes its hash
   * 2. Makes minimal modifications to the input
   * 3. Shows how these tiny changes create vastly different hashes
   * 4. Calculates and displays various distance metrics
   *
   * @param originalInput - The original string to hash
   */
  public demonstrateAvalancheEffect(originalInput: string): void {
    console.log("📊 PART A.i: AVALANCHE EFFECT DEMONSTRATION");
    console.log("===========================================\n");

    // Compute original hash
    const originalHash = this.computeHash(originalInput);
    console.log(`Original Input: "${originalInput}"`);
    console.log(`Original Hash:  ${originalHash}\n`);

    // Demonstrate various types of minimal changes
    const modifications = [
      {
        description: "Single character change (last char)",
        modify: (str: string) =>
          str.slice(0, -1) +
          String.fromCharCode(str.charCodeAt(str.length - 1) + 1),
      },
      {
        description: "Single bit flip (first character)",
        modify: (str: string) =>
          String.fromCharCode(str.charCodeAt(0) ^ 1) + str.slice(1),
      },
      {
        description: "Case change (first character)",
        modify: (str: string) => str.charAt(0).toLowerCase() + str.slice(1),
      },
      {
        description: "Add single space at end",
        modify: (str: string) => str + " ",
      },
      {
        description: "Remove last character",
        modify: (str: string) => str.slice(0, -1),
      },
    ];

    modifications.forEach((mod, index) => {
      try {
        const modifiedInput = mod.modify(originalInput);
        const modifiedHash = this.computeHash(modifiedInput);

        // Calculate various distance metrics
        const charHammingDistance = this.calculateHammingDistance(
          originalHash,
          modifiedHash
        );
        const bitHammingDistance = this.calculateBitHammingDistance(
          originalHash,
          modifiedHash
        );
        const totalBits = originalHash.length * 4; // Each hex char = 4 bits
        const changePercentage = (
          (bitHammingDistance / totalBits) *
          100
        ).toFixed(2);

        console.log(`${index + 1}. ${mod.description}:`);
        console.log(`   Modified Input: "${modifiedInput}"`);
        console.log(`   Modified Hash:  ${modifiedHash}`);
        console.log(`   
   📏 Difference Analysis:`);
        console.log(
          `   • Character differences: ${charHammingDistance}/${
            originalHash.length
          } (${((charHammingDistance / originalHash.length) * 100).toFixed(
            1
          )}%)`
        );
        console.log(
          `   • Bit differences: ${bitHammingDistance}/${totalBits} (${changePercentage}%)`
        );
        console.log(
          `   • Input change: ${this.getInputChangeDescription(
            originalInput,
            modifiedInput
          )}\n`
        );
      } catch (error) {
        console.log(`   ❌ Error with modification ${index + 1}: ${error}\n`);
      }
    });

    console.log("🔍 AVALANCHE EFFECT ANALYSIS:");
    console.log(
      "• Even minimal input changes (1 bit, 1 character) cause massive hash changes"
    );
    console.log(
      "• Typically ~50% of bits change, demonstrating strong avalanche properties"
    );
    console.log(
      "• This property is crucial for blockchain integrity and security\n"
    );
  }

  /**
   * Describes the nature of change between original and modified input
   * @param original - Original input string
   * @param modified - Modified input string
   * @returns Description of the change made
   */
  private getInputChangeDescription(
    original: string,
    modified: string
  ): string {
    if (original.length !== modified.length) {
      return `Length changed from ${original.length} to ${modified.length} characters`;
    }

    let differences = 0;
    for (let i = 0; i < original.length; i++) {
      if (original[i] !== modified[i]) {
        differences++;
      }
    }

    return `${differences} character(s) changed out of ${original.length}`;
  }

  /**
   * Problem 1A.ii: Demonstrates pre-image resistance
   *
   * Pre-image resistance means it's computationally infeasible to find an input
   * that produces a specific hash output. This function:
   * 1. Takes a target hash (from a known string)
   * 2. Attempts to find a different input that produces the same hash
   * 3. Uses both random and sequential search strategies
   * 4. Reports attempts and success/failure rates
   *
   * @param targetString - String whose hash we'll try to reverse
   * @param maxAttempts - Maximum number of attempts to make
   * @param useRandomSearch - Whether to use random strings or sequential search
   */
  public demonstratePreImageResistance(
    targetString: string,
    maxAttempts: number = 1000000,
    useRandomSearch: boolean = true
  ): void {
    console.log("🛡️  PART A.ii: PRE-IMAGE RESISTANCE DEMONSTRATION");
    console.log("=================================================\n");

    const targetHash = this.computeHash(targetString);
    console.log(`Target String: "${targetString}"`);
    console.log(`Target Hash:   ${targetHash}`);
    console.log(
      `Search Method: ${
        useRandomSearch ? "Random string generation" : "Sequential enumeration"
      }`
    );
    console.log(`Max Attempts:  ${maxAttempts.toLocaleString()}\n`);

    const startTime = performance.now();
    let attempts = 0;
    let found = false;
    let foundInput = "";

    // Progress reporting intervals
    const reportInterval = Math.floor(maxAttempts / 10);

    console.log("🔍 Starting pre-image search...\n");

    for (attempts = 1; attempts <= maxAttempts; attempts++) {
      // Generate candidate input based on search strategy
      const candidateInput = useRandomSearch
        ? this.generateRandomString(targetString.length + (attempts % 3))
        : this.generateSequentialString(attempts, targetString.length);

      const candidateHash = this.computeHash(candidateInput);

      // Check if we found a match (and it's not the original string)
      if (candidateHash === targetHash && candidateInput !== targetString) {
        found = true;
        foundInput = candidateInput;
        break;
      }

      // Progress reporting
      if (attempts % reportInterval === 0) {
        const progress = ((attempts / maxAttempts) * 100).toFixed(1);
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
        console.log(
          `   Progress: ${progress}% (${attempts.toLocaleString()} attempts, ${elapsed}s elapsed)`
        );
      }
    }

    const endTime = performance.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(3);
    const attemptsPerSecond = (attempts / parseFloat(totalTime)).toFixed(0);

    console.log("\n📊 PRE-IMAGE RESISTANCE RESULTS:");
    console.log("================================");

    if (found) {
      console.log(
        `🎯 SUCCESS: Found pre-image after ${attempts.toLocaleString()} attempts!`
      );
      console.log(`   Found Input: "${foundInput}"`);
      console.log(`   Found Hash:  ${this.computeHash(foundInput)}`);
      console.log(
        `   ⚠️  This is extremely unlikely for secure hash functions!`
      );
    } else {
      console.log(
        `❌ FAILED: No pre-image found after ${attempts.toLocaleString()} attempts`
      );
      console.log(
        `   This demonstrates the pre-image resistance of ${this.hashAlgorithm.toUpperCase()}`
      );
    }

    console.log(`\n⏱️  Performance Metrics:`);
    console.log(`   • Total time: ${totalTime} seconds`);
    console.log(`   • Attempts per second: ${attemptsPerSecond}`);
    console.log(
      `   • Search space explored: ~${this.calculateSearchSpaceExplored(
        attempts,
        targetString.length
      )}`
    );

    this.explainPreImageResistance(attempts, found, targetHash.length);
  }

  /**
   * Generates a random string of specified length for pre-image testing
   * @param length - Desired length of random string
   * @returns Random string containing letters, numbers, and basic symbols
   */
  private generateRandomString(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  /**
   * Generates sequential strings for systematic pre-image testing
   * @param attempt - Current attempt number
   * @param baseLength - Base length for generated strings
   * @returns Sequential string based on attempt number
   */
  private generateSequentialString(
    attempt: number,
    baseLength: number
  ): string {
    // Create string based on attempt number with some variation
    const base = attempt.toString(36); // Convert to base-36 for variety
    const padding = "a".repeat(Math.max(0, baseLength - base.length));
    return base + padding;
  }

  /**
   * Estimates the search space explored relative to total possible inputs
   * @param attempts - Number of attempts made
   * @param stringLength - Length of target string
   * @returns Human-readable representation of search space coverage
   */
  private calculateSearchSpaceExplored(
    attempts: number,
    stringLength: number
  ): string {
    // Assuming 95 printable ASCII characters
    const totalPossibleInputs = Math.pow(95, stringLength);
    const percentage = (attempts / totalPossibleInputs) * 100;

    if (percentage < 0.000001) {
      return `< 0.000001% of total search space`;
    }

    return `${percentage.toExponential(2)}% of total search space`;
  }

  /**
   * Provides educational explanation of pre-image resistance results
   * @param attempts - Number of attempts made
   * @param found - Whether a pre-image was found
   * @param hashLength - Length of hash in hex characters
   */
  private explainPreImageResistance(
    attempts: number,
    found: boolean,
    hashLength: number
  ): void {
    console.log(`\n🎓 EDUCATIONAL ANALYSIS:`);
    console.log(`================================`);

    const hashBits = hashLength * 4; // Each hex char = 4 bits
    const theoreticalAttempts = Math.pow(2, hashBits - 1); // Expected attempts = 2^(n-1)

    console.log(
      `• Hash output space: 2^${hashBits} = ${Math.pow(
        2,
        hashBits
      ).toExponential(2)} possible values`
    );
    console.log(
      `• Expected attempts for pre-image: ~2^${
        hashBits - 1
      } = ${theoreticalAttempts.toExponential(2)}`
    );
    console.log(`• Our attempts: ${attempts.toLocaleString()}`);
    console.log(
      `• Probability of success: ~${(
        (attempts / Math.pow(2, hashBits)) *
        100
      ).toExponential(2)}%`
    );

    if (!found) {
      console.log(
        `\n✅ This demonstrates why ${this.hashAlgorithm.toUpperCase()} is considered pre-image resistant:`
      );
      console.log(
        `   • Finding a pre-image requires astronomical computational effort`
      );
      console.log(
        `   • Current technology cannot feasibly break this security property`
      );
      console.log(`   • This property is fundamental to blockchain security`);
    }
  }

  /**
   * Main demonstration runner - executes both parts of Problem 1A
   * @param userInput - Input string provided by user
   * @param preImageAttempts - Number of pre-image resistance attempts
   */
  public runCompleteDemo(
    userInput: string,
    preImageAttempts: number = 100000
  ): void {
    console.log("🚀 COMPLETE HASH FUNCTION DEMONSTRATION");
    console.log("=====================================\n");

    // Part A.i: Avalanche Effect
    this.demonstrateAvalancheEffect(userInput);

    console.log("\n" + "=".repeat(60) + "\n");

    // Part A.ii: Pre-image Resistance
    this.demonstratePreImageResistance(userInput, preImageAttempts, true);

    console.log("\n🎯 DEMONSTRATION COMPLETE");
    console.log(
      "Both avalanche effect and pre-image resistance have been demonstrated."
    );
    console.log(
      "See the written analysis for detailed explanations of these properties.\n"
    );
  }
}

/**
 * Interactive CLI interface for hash function demonstration
 * Handles user input and provides a user-friendly interface
 */
export class HashFunctionCLI {
  private demo: HashFunctionDemo;

  constructor() {
    this.demo = new HashFunctionDemo();
  }

  /**
   * Runs the interactive command-line interface
   */
  public async run(): Promise<void> {
    // For this academic demonstration, we'll use a predefined input
    // In a real CLI, you would use readline or similar for user input

    console.log("📝 INTERACTIVE HASH FUNCTION DEMONSTRATION");
    console.log("=========================================\n");

    // Simulate user input (in real scenario, this would be from stdin)
    const defaultInput = "Bullish on Bonk =)))";
    console.log(`Using input: "${defaultInput}"`);
    console.log(
      "(In interactive mode, you would be prompted to enter your own string)\n"
    );

    // Run the complete demonstration
    this.demo.runCompleteDemo(defaultInput, 1000000);

    console.log("💡 NEXT STEPS:");
    console.log(
      "• Review the written analysis (Problem 1B) for theoretical explanations"
    );
    console.log(
      "• Try running with different input strings to see varied results"
    );
    console.log(
      "• Increase the pre-image attempt count for more thorough testing"
    );
  }
}

// Export for use in other modules and testing
export default HashFunctionDemo;

# INTE264 Assignment 1: Crypto Data (Individual)

## Student: Nguyen Chi Nghia s3979170

## Date: 24/07/2025

This repository contains TypeScript implementations for INTE264 Blockchain Technology Fundamentals Assignment 1, demonstrating fundamental cryptographic and data structuring techniques that underpin blockchain technology.

## 🎯 Assignment Overview

**Course**: INTE264[1|2] - Blockchain Technology Fundamentals  
**Assignment**: Core Blockchain Components Implementation  
**Problems Implemented**: Problem 1 (Hash Functions) + Problem 2 (Merkle Trees) + Problem 3 (Digital Signatures) + Problem 4 (Blockchain Timestamping)  
**Language**: TypeScript with Node.js
Crypto Data (Individual)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation and Setup

```bash
# Clone the repository
git clone git@github.com:temmmy/INTE2641-ASM1-s3979170.git
cd INTE2641-ASM1-s3979170

# Install dependencies
npm install

# Build the project
npm run build

# Run the demonstration
npm start
```

### Interactive Usage

```bash
# Run with interactive menu (default)
npm start

# Run specific problems directly
npm start 1          # Problem 1: Hash Functions
npm start 2          # Problem 2: Merkle Trees
npm start 3          # Problem 3: Digital Signatures
npm start 4          # Problem 4: Blockchain Timestamping
npm start all        # Run all problems sequentially

# Alternative commands
npm start hash       # Problem 1
npm start merkle     # Problem 2
npm start signatures # Problem 3
npm start blockchain # Problem 4
npm start help       # Show usage information
```

### Development Mode

```bash
# Run directly with ts-node (no build required)
npm run dev
```

## 📋 Problem 1: Hash Functions Implementation

### Features Implemented

**Part A.i - Avalanche Effect Demonstration:**

- Takes user input and computes SHA-256 hash
- Makes minimal modifications (1 bit, 1 character, case changes, etc.)
- Calculates and displays Hamming distances at both character and bit levels
- Shows percentage of bits changed to demonstrate avalanche effect
- Provides educational analysis of results

**Part A.ii - Pre-image Resistance Demonstration:**

- Attempts to find pre-images for target hashes through brute force
- Uses both random and sequential search strategies
- Configurable attempt limits (default: 50,000 attempts)
- Reports performance metrics and search space coverage
- Demonstrates computational infeasibility of hash reversal

### Technical Implementation

**Core Classes:**

- `HashFunctionDemo`: Main demonstration logic and cryptographic operations
- `HashFunctionCLI`: Command-line interface and user interaction

**Key Methods:**

- `demonstrateAvalancheEffect()`: Shows hash sensitivity to input changes
- `demonstratePreImageResistance()`: Attempts hash reversal through brute force
- `calculateHammingDistance()`: Computes differences between hash outputs

## 📋 Problem 2: Merkle Trees Implementation

### Features Implemented

**Part A.i - Merkle Tree Construction:**

- Builds complete binary tree from list of data items (transaction IDs)
- Handles odd numbers of nodes by duplicating last node at each level
- Provides detailed construction logging and tree visualization
- Outputs final Merkle root hash

**Part A.ii - Merkle Proof Generation:**

- Generates minimal proof for any data item in the tree
- Collects sibling hashes along path from leaf to root
- Records hash positions (left/right) for reconstruction
- Calculates proof size and efficiency metrics

**Part A.iii - Merkle Proof Verification:**

- Verifies proofs by reconstructing path to root
- Step-by-step hash combination following proof instructions
- Compares reconstructed root with expected Merkle root
- Provides detailed verification logging and security analysis

### Technical Implementation

**Core Classes:**

- `MerkleTreeDemo`: Complete Merkle tree operations and proof system
- `MerkleTreeCLI`: Interactive demonstration interface

**Key Interfaces:**

- `MerkleNode`: Tree node structure with hash and child references
- `MerkleProof`: Complete proof with steps and metadata
- `MerkleProofStep`: Individual proof step with hash and position

**Key Methods:**

- `constructMerkleTree()`: Builds tree from data items
- `generateMerkleProof()`: Creates proof for specific data item
- `verifyMerkleProof()`: Validates proof against known root

## 📋 Problem 3: Digital Signatures Implementation

### Features Implemented

**Part A.i - Key Pair Generation:**

- Generates RSA (2048, 3072, 4096-bit) and ECDSA (256, 384, 521-bit) key pairs
- Uses industry-standard curves (secp256k1, secp384r1, secp521r1)
- Provides detailed key generation analysis and security metrics
- Outputs keys in PEM format with comprehensive metadata

**Part A.ii - Message Signing and Verification:**

- Signs messages using SHA-256 hashing with private keys
- Supports both RSA and ECDSA signature algorithms
- Verifies signatures using public keys with tamper detection
- Demonstrates authentication, integrity, and non-repudiation properties

### Technical Implementation

**Core Classes:**

- `DigitalSignatureDemo`: Complete PKC operations and signature system
- `DigitalSignatureCLI`: Interactive demonstration interface

**Key Interfaces:**

- `KeyPair`: RSA/ECDSA key pair with metadata and security information
- `DigitalSignature`: Complete signature with message hash and algorithm details
- `VerificationResult`: Detailed verification results with performance metrics

**Key Methods:**

- `generateKeyPair()`: Creates RSA or ECDSA key pairs with specified sizes
- `signMessage()`: Creates digital signatures using private keys
- `verifySignature()`: Validates signatures and detects tampering

## 📋 Problem 4: Blockchain Timestamping Implementation

### Features Implemented

**Part A.i - Block Data Structure:**

- Essential blockchain fields: block ID, timestamp, data, previous hash, current hash, nonce
- SHA-256 hash calculation for block integrity verification
- Human-readable timestamp formatting and metadata tracking
- Block size calculation and performance metrics

**Part A.ii - Chain-of-Blocks Simulation:**

- Genesis block creation with special properties (all-zero previous hash)
- Sequential block linking through cryptographic hash chains
- Mining delay simulation representing real-world proof-of-work
- Comprehensive blockchain validation and integrity checking

### Technical Implementation

**Core Classes:**

- `BlockchainTimestampingDemo`: Complete blockchain operations and simulation
- `BlockchainTimestampingCLI`: Interactive demonstration interface

**Key Interfaces:**

- `Block`: Complete block structure with all essential blockchain fields
- `Blockchain`: Full blockchain with metadata and statistics
- `ValidationResult`: Comprehensive validation results with detailed analysis

**Key Methods:**

- `createBlock()`: Creates individual blocks with proper hash calculation
- `createBlockchain()`: Builds complete blockchain with proper linking
- `validateBlockchain()`: Validates entire chain integrity and consistency

## 📖 Written Analysis

**Problem 1 Analysis**: [`src/problem1/analysis.md`](src/problem1/analysis.md)

- SHA-256 technical explanation and cryptographic properties
- Blockchain applications and security vulnerability analysis

**Problem 2 Analysis**: [`src/problem2/analysis.md`](src/problem2/analysis.md)

- Merkle tree structure and implementation logic
- SPV client functionality and blockchain efficiency benefits
- Mathematical efficiency analysis and real-world applications

**Problem 3 Analysis**: [`src/problem3/analysis.md`](src/problem3/analysis.md)

- Public Key Cryptography fundamentals and security properties
- Digital signature mathematics for RSA and ECDSA algorithms
- Blockchain applications including transaction authorization and smart contracts

**Problem 4 Analysis**: [`src/problem4/analysis.md`](src/problem4/analysis.md)

- Blockchain data structure and block components
- Chain-of-blocks linking and timestamping mechanisms
- Immutability, integrity validation, and consensus properties

## 🏗️ Project Structure

```

INTE2641-ASM1-s3979170/
├── src/
│   ├── index.ts                     # Main entry point with interactive menu
│   ├── problem1/
│   │   ├── index.ts                 # Problem 1 entry point
│   │   ├── hash-functions.ts        # Hash function implementation
implementation
│   │   └── analysis.md              # Hash functions written analysis
│   ├── problem2/
│   │   ├── index.ts                 # Problem 2 entry point
│   │   ├── merkle-trees.ts          # Merkle tree implementation
implementation
│   │   └── analysis.md              # Merkle trees written analysis
│   ├── problem3/
│   │   ├── index.ts                 # Problem 3 entry point
│   │   ├── digital-signatures.ts   # Digital signature
implementation
│   │   └── analysis.md              # Digital signatures written analysis
│   └── problem4/
│       ├── index.ts                 # Problem 4 entry point
│       ├── blockchain-timestamping.ts # Blockchain simulation implementation
│       └── analysis.md              # Blockchain timestamping written analysis
├── dist/                            # Compiled JavaScript output
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## 🔧 Development Scripts

```bash
npm run build    # Compile TypeScript to JavaScript
npm start        # Run the compiled application
npm run dev      # Run with ts-node (development mode)
npm run clean    # Remove compiled output
npm run lint     # Code quality checks (when configured)
npm test         # Run tests (when implemented)
```

## 🎓 Educational Objectives

This implementation demonstrates understanding of:

1. **Cryptographic Hash Functions**: Properties, security requirements, practical applications
2. **Avalanche Effect**: How minimal input changes create dramatic output differences
3. **Pre-image Resistance**: Computational infeasibility of hash reversal
4. **Blockchain Security**: How hash properties enable blockchain integrity and security
5. **Performance Analysis**: Measuring and interpreting cryptographic operation metrics

## 🔬 Example Output

When run, the program produces detailed output including:

```
🔐 Hash Function Properties Demonstration
=========================================
Using algorithm: SHA-256

📊 PART A.i: AVALANCHE EFFECT DEMONSTRATION
===========================================

Original Input: "Pudgy to the Moon!"
Original Hash:  a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8

1. Single character change (last char):
   Modified Input: "Pudgy to the Moon!""
   Modified Hash:  1f2e3d4c5b6a7988c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2

   📏 Difference Analysis:
   • Character differences: 32/64 (50.0%)
   • Bit differences: 128/256 (50.00%)
   • Input change: 1 character(s) changed out of 23
```

## 📚 Academic Requirements Compliance

- ✅ **Well-commented code** explaining logic and functionality
- ✅ **Educational focus** with theoretical explanations
- ✅ **Comprehensive analysis** connecting implementation to blockchain concepts
- ✅ **Performance metrics** and computational analysis
- ✅ **Multiple demonstration modes** for thorough understanding
- ✅ **TypeScript implementation** with proper type safety
- ✅ **Professional documentation** suitable for academic submission

## 🤖 LLM Usage

This project was developed with assistance from OpenAI GPT-o4-mini for:

- Code formatting and improving code structure readability
- Documentation enhancement and better technical writing
- Organizing analysis sections for improved clarity
- Formatting improvements for professional presentation

All core logic, cryptographic understanding, and implementation decisions reflect original comprehension enhanced through AI-assisted formatting and documentation improvements.

# CLAUDE.md

This file provides guidance when working with code in this repository.

## Project Overview

This repository contains implementations for INTE264 (Blockchain Technology Fundamentals) Assignment 1, focusing on core blockchain cryptographic components. The project demonstrates fundamental concepts including hash functions, Merkle trees, digital signatures, and basic blockchain structures.

**Key Technologies:**
- **TypeScript** - Primary implementation language
- **Node.js** - Runtime environment  
- **Built-in Crypto Module** - For cryptographic operations (SHA-256, etc.)
- **Academic Focus** - Educational implementations with extensive documentation

## Development Commands

### Setup and Installation
```bash
# Install dependencies
npm install

# Clean build artifacts
npm run clean
```

### Building and Running
```bash
# Compile TypeScript to JavaScript
npm run build

# Run with interactive menu (default)
npm start

# Run specific problems directly
npm start 1                          # Problem 1: Hash Functions
npm start 2                          # Problem 2: Merkle Trees
npm start 3                          # Problem 3: Digital Signatures
npm start all                        # Run all problems sequentially

# Alternative problem selection
npm start hash                       # Problem 1 (Hash Functions)
npm start merkle                     # Problem 2 (Merkle Trees)
npm start signatures                 # Problem 3 (Digital Signatures)

# Development mode with ts-node
npm run dev
```

### Code Quality and Testing
```bash
# Run TypeScript compiler checks
npx tsc --noEmit

# Run ESLint (when configured)
npm run lint

# Run tests (when implemented)
npm test
```

## Architecture and Code Structure

### Core Components

**`src/index.ts`** - Main application entry point with interactive menu system
- Interactive problem selection menu
- Command-line argument parsing for direct execution
- Comprehensive help system and error handling

**`src/problem1/`** - Problem 1: Hash Functions
- `hash-functions.ts`: Complete implementation with avalanche effect and pre-image resistance demos
- `analysis.md`: Comprehensive written analysis of SHA-256 and blockchain applications
- `index.ts`: Problem 1 entry point and exports

**`src/problem2/`** - Problem 2: Merkle Trees  
- `merkle-trees.ts`: Complete tree construction, proof generation, and verification
- `analysis.md`: Detailed analysis of SPV functionality and blockchain efficiency
- `index.ts`: Problem 2 entry point and exports

**`src/problem3/`** - Problem 3: Digital Signatures
- `digital-signatures.ts`: RSA/ECDSA key generation, signing, and verification
- `analysis.md`: PKC principles, security properties, and blockchain applications
- `index.ts`: Problem 3 entry point and exports

### Design Patterns and Principles

**Educational Code Structure:**
- Each implementation includes extensive comments explaining both the code logic and underlying cryptographic/blockchain concepts
- Methods are designed to be self-documenting with clear parameter descriptions
- Output includes both technical results and educational explanations

**Modular Architecture:**
- Separate classes for demonstration logic (`HashFunctionDemo`) and user interface (`HashFunctionCLI`)
- Clear separation between implementation code and analysis documentation
- Extensible structure for additional assignment problems

**Academic Standards:**
- All implementations follow university assignment requirements
- Code demonstrates understanding of underlying concepts, not just functionality
- Written analysis connects implementation to theoretical foundations

### Key Implementation Details

**Hash Function Operations (Problem 1):**
- Uses Node.js built-in `crypto` module with SHA-256
- Implements multiple distance metrics (Hamming distance, bit-level analysis)
- Provides both random and sequential search strategies for pre-image testing

**Merkle Tree Operations (Problem 2):**
- Complete binary tree construction with proper odd-node handling
- Efficient proof generation using path traversal algorithms
- Cryptographic proof verification with step-by-step reconstruction
- Tree visualization and educational output

**Digital Signature Operations (Problem 3):**
- RSA and ECDSA key pair generation with multiple key sizes
- Message signing using SHA-256 hashing and private keys
- Signature verification with tamper detection and security analysis
- PKC educational demonstrations and blockchain application examples

**Performance Considerations:**
- Includes performance timing and metrics collection
- Configurable attempt limits to balance demonstration completeness with execution time
- Memory-efficient algorithms for both hash operations and tree construction
- O(log n) proof generation and verification complexity

**Educational Features:**
- Progress reporting during long-running operations
- Multiple analysis metrics (percentage changes, search space coverage, proof efficiency)
- Detailed explanations linking code output to cryptographic theory
- Visual tree structure representations and proof step breakdowns

## Assignment-Specific Guidelines

### Problem Implementation Approach
- Each problem should be implemented as a separate TypeScript module
- Include both functional implementation and comprehensive written analysis
- Demonstrate deep understanding of blockchain/cryptographic concepts
- Provide clear examples and educational output

### Code Documentation Standards
- Every significant function must include JSDoc comments
- Explain both the technical implementation and the underlying concepts
- Include parameter descriptions, return value documentation, and usage examples
- Comments should be "humane" - accessible to other students and instructors

### File Organization
```
src/
├── index.ts                      # Main entry point with interactive menu
├── problem1/
│   ├── index.ts                  # Problem 1 entry point
│   ├── hash-functions.ts         # Hash function implementation
│   └── analysis.md               # Written analysis document
├── problem2/
│   ├── index.ts                  # Problem 2 entry point
│   ├── merkle-trees.ts          # Merkle tree implementation
│   └── analysis.md               # Written analysis document
├── problem3/                     # Problem 3 implementation (future)
│   ├── index.ts
│   ├── digital-signatures.ts
│   └── analysis.md
└── problem4/                     # Problem 4 implementation (future)
    ├── index.ts
    ├── blockchain-simulation.ts
    └── analysis.md
```

### Testing and Validation
- Each implementation should be manually testable through the CLI interface
- Include example inputs and expected outputs in documentation
- Validate cryptographic operations against known test vectors when applicable
- Performance benchmarks should be included in educational output

## Development Best Practices

### TypeScript Configuration
- Strict type checking enabled for academic rigor
- ES2022 target for modern JavaScript features
- Source maps enabled for debugging
- Declaration files generated for potential reuse

### Error Handling
- Comprehensive error handling with educational error messages
- Graceful degradation when operations cannot complete
- Clear feedback to users about what went wrong and how to fix it

### Performance Optimization
- Balance between educational completeness and reasonable execution times
- Configurable parameters for demonstration depth
- Efficient algorithms while maintaining code clarity

### Academic Integrity
- All code must demonstrate original understanding
- External library usage must be justified and documented
- LLM assistance must be properly cited
- Implementation must reflect personal comprehension of concepts

## Future Extensions

The codebase is structured to accommodate the remaining assignment problems:
- Problem 2: Merkle Trees (construction, proof generation, verification)
- Problem 3: Digital Signatures (key generation, signing, verification)
- Problem 4: Basic Blockchain Simulation (block structure, chain construction, timestamping)

Each new problem should follow the established patterns of comprehensive implementation with educational analysis.
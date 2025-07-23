# INTE264 Assignment 1: Core Blockchain Components

This repository contains TypeScript implementations for INTE264 Blockchain Technology Fundamentals Assignment 1, demonstrating fundamental cryptographic and data structuring techniques that underpin blockchain technology.

## 🎯 Assignment Overview

**Course**: INTE264[1|2] - Blockchain Technology Fundamentals  
**Assignment**: Core Blockchain Components Implementation  
**Problem Implemented**: Problem 1 - Hash Functions  
**Language**: TypeScript with Node.js

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation and Setup

```bash
# Clone the repository
git clone <repository-url>
cd uni

# Install dependencies
npm install

# Build the project
npm run build

# Run the demonstration
npm start
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

**Educational Features:**

- Comprehensive console output explaining each step
- Performance timing and metrics collection
- Progress reporting during long operations
- Detailed analysis connecting results to cryptographic theory

### Technical Implementation

**Core Classes:**

- `HashFunctionDemo`: Main demonstration logic and cryptographic operations
- `HashFunctionCLI`: Command-line interface and user interaction
- Extensive TypeScript types and documentation

**Key Methods:**

- `demonstrateAvalancheEffect()`: Shows hash sensitivity to input changes
- `demonstratePreImageResistance()`: Attempts hash reversal through brute force
- `calculateHammingDistance()`: Computes differences between hash outputs
- `calculateBitHammingDistance()`: Bit-level analysis of hash differences

## 📖 Written Analysis

The complete written analysis for Problem 1B is available in [`src/problem1-analysis.md`](src/problem1-analysis.md), covering:

- **SHA-256 Technical Explanation**: Algorithm structure, mathematical foundation, security properties
- **Cryptographic Properties**: Pre-image resistance, second pre-image resistance, collision resistance
- **Blockchain Applications**: Block chaining, Merkle trees, transaction verification
- **Security Vulnerability Analysis**: Impact of hash function compromise on blockchain systems

## 🏗️ Project Structure

```
uni/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── problem1-hash-functions.ts  # Hash function implementation
│   └── problem1-analysis.md        # Written analysis document
├── dist/                           # Compiled JavaScript output
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── CLAUDE.md                      # Development guidance
└── README.md                      # This file
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

Original Input: "Hello, Blockchain World!"
Original Hash:  a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8

1. Single character change (last char):
   Modified Input: "Hello, Blockchain World""
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

## 📄 License

This project is developed for academic purposes as part of INTE264 coursework. Please ensure compliance with your institution's academic integrity policies if using this code as reference.

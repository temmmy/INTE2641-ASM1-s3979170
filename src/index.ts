#!/usr/bin/env node

/**
 * INTE264 Assignment 1: Core Blockchain Components
 * Main entry point with interactive problem selection
 * 
 * This file serves as the main executable providing an interactive menu
 * for selecting and running demonstrations of different blockchain problems.
 * 
 * Author: Student
 * Course: INTE264 - Blockchain Technology Fundamentals
 */

import { runProblem1Demo } from './problem1';
import { runProblem2Demo } from './problem2';
import { runProblem3Demo } from './problem3';
import * as readline from 'readline';

/**
 * Available problem demonstrations
 */
interface ProblemOption {
    id: string;
    title: string;
    description: string;
    runner: () => Promise<void>;
    analysisFile: string;
}

const PROBLEMS: ProblemOption[] = [
    {
        id: '1',
        title: 'Hash Functions',
        description: 'Cryptographic hash properties: avalanche effect & pre-image resistance',
        runner: runProblem1Demo,
        analysisFile: 'src/problem1/analysis.md'
    },
    {
        id: '2',
        title: 'Merkle Trees',
        description: 'Tree construction, proof generation & verification for SPV',
        runner: runProblem2Demo,
        analysisFile: 'src/problem2/analysis.md'
    },
    {
        id: '3',
        title: 'Digital Signatures',
        description: 'PKC key generation, message signing & verification with RSA/ECDSA',
        runner: runProblem3Demo,
        analysisFile: 'src/problem3/analysis.md'
    }
];

/**
 * Creates a readline interface for user input
 */
function createReadlineInterface(): readline.Interface {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

/**
 * Prompts user for input and returns their response
 * @param question - The question to ask the user
 * @param rl - Readline interface
 * @returns Promise resolving to user's input
 */
function askQuestion(question: string, rl: readline.Interface): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Displays the main menu with available problem options
 */
function displayMenu(): void {
    console.log('🎓 INTE264 Assignment 1 - Core Blockchain Components');
    console.log('====================================================\n');
    
    console.log('📋 Available Problem Demonstrations:\n');
    
    PROBLEMS.forEach((problem) => {
        console.log(`${problem.id}. ${problem.title}`);
        console.log(`   ${problem.description}`);
        console.log(`   📖 Analysis: ${problem.analysisFile}\n`);
    });
    
    console.log('a. Run All Problems (Sequential)');
    console.log('q. Quit\n');
}

/**
 * Runs a specific problem demonstration
 * @param problemId - ID of the problem to run
 */
async function runProblem(problemId: string): Promise<boolean> {
    const problem = PROBLEMS.find(p => p.id === problemId);
    
    if (!problem) {
        console.log(`❌ Invalid problem ID: ${problemId}`);
        return false;
    }
    
    try {
        console.clear();
        console.log(`🚀 Starting ${problem.title} Demonstration\n`);
        
        await problem.runner();
        
        console.log('\n' + '='.repeat(60));
        console.log(`✅ ${problem.title} demonstration completed!`);
        console.log(`📖 For detailed analysis, see: ${problem.analysisFile}`);
        
        return true;
    } catch (error) {
        console.error(`❌ Error running ${problem.title}:`, error);
        return false;
    }
}

/**
 * Runs all problem demonstrations sequentially
 */
async function runAllProblems(): Promise<void> {
    console.clear();
    console.log('🚀 Running All Problem Demonstrations\n');
    
    for (let i = 0; i < PROBLEMS.length; i++) {
        const problem = PROBLEMS[i];
        
        console.log(`\n${'='.repeat(80)}`);
        console.log(`📍 Problem ${i + 1}/${PROBLEMS.length}: ${problem.title}`);
        console.log('='.repeat(80) + '\n');
        
        await problem.runner();
        
        // Add pause between problems (except for the last one)
        if (i < PROBLEMS.length - 1) {
            console.log('\n' + '⏸️  Press Enter to continue to the next problem...');
            await new Promise(resolve => {
                const rl = createReadlineInterface();
                rl.question('', () => {
                    rl.close();
                    resolve(void 0);
                });
            });
        }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('🎉 ALL DEMONSTRATIONS COMPLETED SUCCESSFULLY!');
    console.log('\n📚 Written Analyses Available:');
    PROBLEMS.forEach(problem => {
        console.log(`   • ${problem.analysisFile} - ${problem.title}`);
    });
    console.log('\n💡 These implementations demonstrate core blockchain cryptographic foundations');
}

/**
 * Displays help information about the available options
 */
function displayHelp(): void {
    console.log('\n📖 HELP - Available Commands:');
    console.log('============================');
    console.log('1, 2    - Run specific problem demonstration');
    console.log('a       - Run all problems sequentially');
    console.log('h       - Show this help message');
    console.log('q       - Quit the application');
    console.log('');
    console.log('💡 Each problem includes:');
    console.log('   • Interactive demonstration with educational output');
    console.log('   • Performance metrics and analysis');
    console.log('   • Written theoretical analysis document');
    console.log('');
}

/**
 * Main interactive menu loop
 */
async function runInteractiveMenu(): Promise<void> {
    const rl = createReadlineInterface();
    
    try {
        while (true) {
            console.clear();
            displayMenu();
            
            const choice = await askQuestion('🎯 Select an option (1, 2, 3, a, h for help, q to quit): ', rl);
            
            switch (choice.toLowerCase()) {
                case '1':
                case '2':
                case '3':
                    const success = await runProblem(choice);
                    if (success) {
                        console.log('\n⏸️  Press Enter to return to main menu...');
                        await askQuestion('', rl);
                    } else {
                        console.log('\n⏸️  Press Enter to continue...');
                        await askQuestion('', rl);
                    }
                    break;
                    
                case 'a':
                case 'all':
                    await runAllProblems();
                    console.log('\n⏸️  Press Enter to return to main menu...');
                    await askQuestion('', rl);
                    break;
                    
                case 'h':
                case 'help':
                    displayHelp();
                    console.log('⏸️  Press Enter to continue...');
                    await askQuestion('', rl);
                    break;
                    
                case 'q':
                case 'quit':
                case 'exit':
                    console.log('\n👋 Thank you for exploring blockchain fundamentals!');
                    console.log('📚 Don\'t forget to review the written analyses for complete understanding.');
                    return;
                    
                default:
                    console.log(`\n❌ Invalid choice: "${choice}". Please select 1, 2, 3, a, h, or q.`);
                    console.log('⏸️  Press Enter to continue...');
                    await askQuestion('', rl);
                    break;
            }
        }
    } finally {
        rl.close();
    }
}

/**
 * Main application entry point
 * Handles command-line arguments and starts appropriate mode
 */
async function main(): Promise<void> {
    try {
        // Check for command-line arguments
        const args = process.argv.slice(2);
        
        if (args.length > 0) {
            const command = args[0].toLowerCase();
            
            switch (command) {
                case '1':
                case 'problem1':
                case 'hash':
                    await runProblem('1');
                    break;
                    
                case '2':
                case 'problem2':
                case 'merkle':
                    await runProblem('2');
                    break;
                    
                case '3':
                case 'problem3':
                case 'signatures':
                case 'crypto':
                    await runProblem('3');
                    break;
                    
                case 'all':
                    await runAllProblems();
                    break;
                    
                case 'help':
                case '--help':
                case '-h':
                    console.log('🎓 INTE264 Assignment 1 - Usage');
                    console.log('===============================');
                    console.log('');
                    console.log('Interactive mode (default):');
                    console.log('  npm start                    # Show interactive menu');
                    console.log('  npm run dev                  # Development mode with menu');
                    console.log('');
                    console.log('Direct execution:');
                    console.log('  npm start 1                  # Run Problem 1 (Hash Functions)');
                    console.log('  npm start 2                  # Run Problem 2 (Merkle Trees)');
                    console.log('  npm start 3                  # Run Problem 3 (Digital Signatures)');
                    console.log('  npm start all                # Run all problems');
                    console.log('');
                    console.log('Alternative commands:');
                    console.log('  npm start problem1           # Run Problem 1');
                    console.log('  npm start hash               # Run Problem 1');
                    console.log('  npm start problem2           # Run Problem 2');
                    console.log('  npm start merkle             # Run Problem 2');
                    console.log('  npm start problem3           # Run Problem 3');
                    console.log('  npm start signatures         # Run Problem 3');
                    console.log('');
                    break;
                    
                default:
                    console.log(`❌ Unknown command: ${command}`);
                    console.log('💡 Use "npm start help" for usage information');
                    process.exit(1);
            }
        } else {
            // No arguments - run interactive menu
            await runInteractiveMenu();
        }
        
    } catch (error) {
        console.error('❌ Application error:', error);
        console.error('💡 Try running with "npm start help" for usage information');
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
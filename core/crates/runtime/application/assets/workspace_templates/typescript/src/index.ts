// Operit TypeScript project
console.log('🚀 Welcome to the Operit TypeScript project!');
console.log('='.repeat(50));
console.log('This is a TypeScript project template, you can:');
console.log('  ✨ Write type-safe TypeScript code');
console.log('  📦 Manage dependencies with pnpm');
console.log('  🔄 Compile live with tsc watch');
console.log('='.repeat(50));

// Interface example
interface User {
  name: string;
  age: number;
}

// Sample code
const greeting: string = "Hello from Operit!";
console.log(`\n${greeting}\n`);

// Type-safe object
const user: User = {
  name: "Operit User",
  age: 25
};
console.log(`User info: ${user.name}, age: ${user.age}`);

// Array example
const numbers: number[] = [1, 2, 3, 4, 5];
const sum: number = numbers.reduce((acc, num) => acc + num, 0);
console.log(`The sum of array [${numbers}] is: ${sum}`);

console.log('\n✅ Program ran successfully!');
console.log('💡 Tip: after editing src/index.ts, run pnpm build to recompile');

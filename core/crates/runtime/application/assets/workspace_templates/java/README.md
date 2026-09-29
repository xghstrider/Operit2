# Operit Java Project

This is a Java project template built with standard Gradle.

## Project Structure

```
operit-java-project/
├── build.gradle.kts          # Gradle build configuration
├── settings.gradle.kts       # Gradle project settings
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/operit/app/
│   │   │       ├── Main.java           # Main program entry point
│   │   │       └── Calculator.java     # Sample class
│   │   └── resources/
│   │       └── application.properties  # Configuration file
│   └── test/
│       └── java/
│           └── com/operit/app/
│               └── CalculatorTest.java # Unit tests
└── .gitignore                # Git ignore file
```

## Quick Start

### 1️⃣ Install dependencies (first use)
Go to **Terminal → Environment Setup** and install the following tools:
- ✅ OpenJDK 17
- ✅ Gradle

### 2️⃣ Initialize the project
1. Click the **"🔧 Initialize Gradle Wrapper"** button
   - This generates the `gradlew` and `gradle/` directories
   - The first run automatically downloads Gradle 8.5

### 3️⃣ Build and run
- **Build the project**: Click "🔨 Build Project"
- **Run the program**: Click "▶️ Run Program"
- **Run the tests**: Click "🧪 Run Tests"
- **Package the JAR**: Click "📦 Package JAR"
- **Clean the build**: Click "🧹 Clean Build"

### Manual commands
```bash
# Using the Gradle Wrapper (recommended)
./gradlew build
./gradlew run
./gradlew test

# Or use gradle directly
gradle build
gradle run
```

### Build an executable JAR
```bash
./gradlew jar
java -jar build/libs/operit-java-project-1.0.0.jar
```

## Features

✅ **Standard Gradle project structure**  
✅ **Java 17** support  
✅ **JUnit 5** unit testing framework  
✅ **Package management** - Maven Central + Aliyun mirror  
✅ **Fat JAR** - executable JAR including all dependencies

## Adding Dependencies

Add dependencies in `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.google.guava:guava:32.1.2-jre")
    implementation("com.google.code.gson:gson:2.10.1")
}
```

## Customization

- Edit `build.gradle.kts` to change the build configuration
- Add new Java classes in `src/main/java`
- Add unit tests in `src/test/java`
- Edit `.operit/config.json` to customize Operit commands

Happy Coding! ☕

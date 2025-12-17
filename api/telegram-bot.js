const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { initializeApp } = require('firebase/app');
const { getFunctions, httpsCallable } = require('firebase/functions');

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not set. Please check your environment variables.');
  // For Vercel, don't exit, just log
}

const bot = new TelegramBot(token);

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Function to send a joke
const sendJoke = async (chatId) => {
  try {
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode');
    const joke = response.data;
    if (joke.type === 'twopart') {
      await bot.sendMessage(chatId, `${joke.setup}\n${joke.delivery}`);
    } else {
      await bot.sendMessage(chatId, joke.joke);
    }
  } catch (error) {
    console.error('Error sending joke:', error);
    bot.sendMessage(chatId, 'Sorry, I could not fetch a joke at this time.').catch(console.error);
  }
};

// Function to send a photo
const sendPhoto = async (chatId) => {
    const photoUrl = 'https://picsum.photos/400/300';
    try {
        await bot.sendPhoto(chatId, photoUrl, { caption: "Here's a random photo for you!" });
    } catch (error) {
        console.error('Error sending photo:', error);
        bot.sendMessage(chatId, 'Sorry, I could not fetch a photo at this time.').catch(console.error);
    }
};

// Course content
const courses = {
    html: {
        title: "HTML Fundamentals",
        lessons: [
            {
                title: "Introduction to HTML",
                content: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using markup.\n\nKey points:\n• HTML elements are the building blocks of HTML pages\n• Elements are represented by tags\n• Tags usually come in pairs: opening and closing tags"
            },
            {
                title: "HTML Document Structure",
                content: "Every HTML document should have a basic structure:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Page Title</title>\n</head>\n<body>\n    <h1>My First Heading</h1>\n    <p>My first paragraph.</p>\n</body>\n</html>\n```\n\n• <!DOCTYPE html> declares the document type\n• <html> is the root element\n• <head> contains meta information\n• <body> contains the visible page content"
            },
            {
                title: "Common HTML Elements",
                content: "Essential HTML elements you should know:\n\nHeadings: <h1> to <h6>\nParagraphs: <p>\nLinks: <a href=\"url\">Link text</a>\nImages: <img src=\"image.jpg\" alt=\"description\">\nLists: <ul><li>Item</li></ul>\nDivisions: <div>\nSpans: <span>"
            },
            {
                title: "Forms and Input",
                content: "HTML forms collect user input:\n\n```html\n<form action=\"/submit\" method=\"post\">\n    <input type=\"text\" name=\"username\" placeholder=\"Enter username\">\n    <input type=\"email\" name=\"email\" placeholder=\"Enter email\">\n    <input type=\"submit\" value=\"Submit\">\n</form>\n```\n\nInput types: text, email, password, number, date, etc."
            },
            {
                title: "Semantic HTML",
                content: "Semantic elements clearly describe their meaning:\n\n<header> - Defines a header\n<nav> - Defines navigation links\n<main> - Defines the main content\n<section> - Defines a section\n<article> - Defines independent content\n<aside> - Defines content aside from the main content\n<footer> - Defines a footer"
            }
        ]
    },
    css: {
        title: "CSS Styling",
        lessons: [
            {
                title: "Introduction to CSS",
                content: "CSS (Cascading Style Sheets) is used to describe the presentation of a document written in HTML. It controls layout, colors, fonts, and more.\n\nWays to add CSS:\n1. Inline: <tag style=\"property:value;\">\n2. Internal: <style> in <head>\n3. External: <link rel=\"stylesheet\" href=\"style.css\">"
            },
            {
                title: "CSS Selectors",
                content: "CSS selectors target HTML elements:\n\n• Element selector: p { color: blue; }\n• Class selector: .classname { color: red; }\n• ID selector: #idname { color: green; }\n• Universal selector: * { margin: 0; }\n• Descendant selector: div p { font-size: 14px; }\n• Child selector: div > p { font-weight: bold; }"
            },
            {
                title: "CSS Box Model",
                content: "Every HTML element is a rectangular box:\n\n• Content: The actual content\n• Padding: Space around content\n• Border: Line around padding\n• Margin: Space outside border\n\n```css\n.box {\n    width: 200px;\n    padding: 20px;\n    border: 2px solid black;\n    margin: 10px;\n}\n```"
            },
            {
                title: "CSS Layout",
                content: "Common layout techniques:\n\nFlexbox:\n```css\n.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n```\n\nGrid:\n```css\n.grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n}\n```\n\nPositioning: static, relative, absolute, fixed, sticky"
            },
            {
                title: "Responsive Design",
                content: "Make websites work on all devices:\n\nMedia queries:\n```css\n@media (max-width: 768px) {\n    .container {\n        flex-direction: column;\n    }\n}\n```\n\nFlexible units: %, em, rem, vw, vh\n\nFlexible images: img { max-width: 100%; height: auto; }"
            }
        ]
    },
    js: {
        title: "JavaScript Basics",
        lessons: [
            {
                title: "Introduction to JavaScript",
                content: "JavaScript is a programming language that makes web pages interactive. It runs in the browser and can manipulate HTML and CSS.\n\nWays to add JavaScript:\n1. Inline: <script> code here </script>\n2. External: <script src=\"script.js\"></script>\n3. Event handlers: onclick=\"function()\""
            },
            {
                title: "Variables and Data Types",
                content: "JavaScript variables store data:\n\n```javascript\nlet name = \"John\"; // String\nlet age = 25; // Number\nconst isStudent = true; // Boolean\nlet hobbies = [\"reading\", \"coding\"]; // Array\nlet person = { name: \"John\", age: 25 }; // Object\n```\n\nVariable declarations: var, let, const"
            },
            {
                title: "Functions",
                content: "Functions are reusable blocks of code:\n\n```javascript\nfunction greet(name) {\n    return \"Hello, \" + name + \"!\";\n}\n\n// Arrow function\nconst greet = (name) => \"Hello, \" + name + \"!\";\n\n// Function call\nconsole.log(greet(\"John\"));\n```\n\nFunctions can take parameters and return values."
            },
            {
                title: "DOM Manipulation",
                content: "JavaScript can change HTML content:\n\n```javascript\n// Get element by ID\ndocument.getElementById(\"demo\").innerHTML = \"Hello World!\";\n\n// Get elements by class\ndocument.getElementsByClassName(\"myClass\")[0].style.color = \"red\";\n\n// Add event listener\ndocument.getElementById(\"btn\").addEventListener(\"click\", function() {\n    alert(\"Button clicked!\");\n});\n```"
            },
            {
                title: "Control Flow",
                content: "Control the flow of your program:\n\nIf-else statements:\n```javascript\nif (age >= 18) {\n    console.log(\"Adult\");\n} else {\n    console.log(\"Minor\");\n}\n```\n\nLoops:\n```javascript\nfor (let i = 0; i < 5; i++) {\n    console.log(i);\n}\n\nwhile (condition) {\n    // code\n}\n```"
            }
        ]
    },
    python: {
        title: "Python Programming",
        lessons: [
            {
                title: "Introduction to Python",
                content: "Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used for web development, data science, AI, and automation.\n\nKey features:\n• Easy to learn syntax\n• Cross-platform compatibility\n• Large standard library\n• Dynamic typing\n• Interpreted language"
            },
            {
                title: "Python Basics",
                content: "Basic Python concepts:\n\nVariables and data types:\n```python\nname = \"John\"  # String\nage = 25        # Integer\nheight = 5.9    # Float\nis_student = True  # Boolean\n```\n\nPrint statements:\n```python\nprint(\"Hello, World!\")\nprint(f\"My name is {name} and I'm {age} years old\")\n```"
            },
            {
                title: "Control Flow",
                content: "Control structures in Python:\n\nIf-else statements:\n```python\nif age >= 18:\n    print(\"Adult\")\nelse:\n    print(\"Minor\")\n```\n\nLoops:\n```python\nfor i in range(5):\n    print(i)\n\nwhile condition:\n    # code\n```\n\nList comprehensions:\n```python\nsquares = [x**2 for x in range(10)]\n```"
            },
            {
                title: "Functions and Modules",
                content: "Functions in Python:\n\n```python\ndef greet(name):\n    return f\"Hello, {name}!\"\n\n# Function call\nmessage = greet(\"Alice\")\nprint(message)\n```\n\nModules:\n```python\nimport math\nprint(math.sqrt(16))  # Output: 4.0\n\nfrom datetime import datetime\nnow = datetime.now()\n```"
            },
            {
                title: "Data Structures",
                content: "Python's built-in data structures:\n\nLists:\n```python\nfruits = [\"apple\", \"banana\", \"orange\"]\nfruits.append(\"grape\")\nprint(fruits[0])  # apple\n```\n\nDictionaries:\n```python\nperson = {\"name\": \"John\", \"age\": 30}\nprint(person[\"name\"])\n```\n\nTuples and Sets:\n```python\ncoordinates = (10, 20)  # Tuple\nunique_numbers = {1, 2, 3, 3}  # Set\n```"
            }
        ]
    },
    java: {
        title: "Java Programming",
        lessons: [
            {
                title: "Introduction to Java",
                content: "Java is a high-level, object-oriented programming language known for its 'write once, run anywhere' philosophy. It's used for enterprise applications, Android development, and large-scale systems.\n\nKey features:\n• Object-oriented programming\n• Platform independence\n• Strong typing\n• Automatic memory management\n• Rich API"
            },
            {
                title: "Java Basics",
                content: "Basic Java syntax:\n\n```java\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}\n```\n\nVariables and data types:\n```java\nint age = 25;\ndouble price = 19.99;\nString name = \"John\";\nboolean isStudent = true;\n```"
            },
            {
                title: "Object-Oriented Programming",
                content: "OOP concepts in Java:\n\nClasses and Objects:\n```java\npublic class Car {\n    String model;\n    int year;\n    \n    public Car(String model, int year) {\n        this.model = model;\n        this.year = year;\n    }\n    \n    public void drive() {\n        System.out.println(\"Driving \" + model);\n    }\n}\n```\n\nInheritance, Encapsulation, Polymorphism, Abstraction"
            },
            {
                title: "Control Flow and Arrays",
                content: "Control structures:\n\n```java\nif (age >= 18) {\n    System.out.println(\"Adult\");\n} else {\n    System.out.println(\"Minor\");\n}\n\nfor (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}\n```\n\nArrays:\n```java\nint[] numbers = {1, 2, 3, 4, 5};\nString[] names = new String[3];\nnames[0] = \"John\";\n```"
            },
            {
                title: "Exception Handling",
                content: "Java exception handling:\n\n```java\ntry {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println(\"Cannot divide by zero\");\n} finally {\n    System.out.println(\"This always executes\");\n}\n```\n\nCommon exceptions: NullPointerException, ArrayIndexOutOfBoundsException, IOException"
            }
        ]
    },
    cpp: {
        title: "C++ Programming",
        lessons: [
            {
                title: "Introduction to C++",
                content: "C++ is a powerful, high-performance programming language that extends C with object-oriented features. It's used for system programming, game development, and performance-critical applications.\n\nKey features:\n• Object-oriented programming\n• High performance\n• Memory management control\n• Rich standard library\n• Backward compatibility with C"
            },
            {
                title: "C++ Basics",
                content: "Basic C++ syntax:\n\n```cpp\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}\n```\n\nVariables and data types:\n```cpp\nint age = 25;\ndouble price = 19.99;\nstd::string name = \"John\";\nbool isStudent = true;\n```"
            },
            {
                title: "Functions and Pointers",
                content: "Functions in C++:\n\n```cpp\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int result = add(5, 3);\n    std::cout << result << std::endl;\n}\n```\n\nPointers:\n```cpp\nint x = 10;\nint* ptr = &x;  // Pointer to x\nstd::cout << *ptr << std::endl;  // Dereference\n```"
            },
            {
                title: "Classes and Objects",
                content: "OOP in C++:\n\n```cpp\nclass Car {\nprivate:\n    std::string model;\n    int year;\n    \npublic:\n    Car(std::string m, int y) : model(m), year(y) {}\n    \n    void drive() {\n        std::cout << \"Driving \" << model << std::endl;\n    }\n};\n\nint main() {\n    Car myCar(\"Toyota\", 2020);\n    myCar.drive();\n}\n```"
            },
            {
                title: "Memory Management",
                content: "Memory management in C++:\n\n```cpp\n// Dynamic memory allocation\nint* ptr = new int(10);\nstd::cout << *ptr << std::endl;\ndelete ptr;  // Free memory\n\n// Smart pointers (C++11+)\n#include <memory>\nstd::unique_ptr<int> smartPtr = std::make_unique<int>(10);\n```\n\nRAII (Resource Acquisition Is Initialization) principle"
            }
        ]
    },
    sql: {
        title: "SQL Database Programming",
        lessons: [
            {
                title: "Introduction to SQL",
                content: "SQL (Structured Query Language) is the standard language for managing relational databases. It's used to store, retrieve, and manipulate data in databases.\n\nKey concepts:\n• Relational databases\n• Tables, rows, and columns\n• Primary keys and foreign keys\n• CRUD operations (Create, Read, Update, Delete)\n• Data relationships"
            },
            {
                title: "Basic SQL Queries",
                content: "Fundamental SQL commands:\n\nSELECT - Retrieve data:\n```sql\nSELECT * FROM users;\nSELECT name, email FROM users WHERE age > 18;\n```\n\nINSERT - Add new data:\n```sql\nINSERT INTO users (name, email, age) VALUES ('John', 'john@example.com', 25);\n```\n\nUPDATE - Modify existing data:\n```sql\nUPDATE users SET age = 26 WHERE id = 1;\n```"
            },
            {
                title: "Database Design",
                content: "Database design principles:\n\nCreating tables:\n```sql\nCREATE TABLE users (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE,\n    age INT,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n```\n\nRelationships:\n• One-to-One\n• One-to-Many\n• Many-to-Many\n\nNormalization forms (1NF, 2NF, 3NF)"
            },
            {
                title: "Advanced Queries",
                content: "Complex SQL operations:\n\nJOINs:\n```sql\nSELECT users.name, orders.total\nFROM users\nINNER JOIN orders ON users.id = orders.user_id;\n```\n\nAggregations:\n```sql\nSELECT COUNT(*), AVG(salary), MAX(salary)\nFROM employees\nGROUP BY department;\n```\n\nSubqueries:\n```sql\nSELECT name FROM users\nWHERE id IN (SELECT user_id FROM orders WHERE total > 100);\n```"
            },
            {
                title: "Database Administration",
                content: "Database management tasks:\n\nIndexes for performance:\n```sql\nCREATE INDEX idx_user_email ON users(email);\n```\n\nViews:\n```sql\nCREATE VIEW active_users AS\nSELECT * FROM users WHERE last_login > '2023-01-01';\n```\n\nBackup and recovery, security, optimization"
            }
        ]
    },
    php: {
        title: "PHP Web Development",
        lessons: [
            {
                title: "Introduction to PHP",
                content: "PHP is a server-side scripting language designed for web development. It's widely used for creating dynamic web pages and web applications.\n\nKey features:\n• Server-side scripting\n• HTML embedding\n• Cross-platform\n• Large community\n• Easy database integration"
            },
            {
                title: "PHP Basics",
                content: "Basic PHP syntax:\n\n```php\n<?php\n    echo \"Hello, World!\";\n    // This is a comment\n?>\n```\n\nVariables and data types:\n```php\n$name = \"John\";  // String\n$age = 25;        // Integer\n$price = 19.99;   // Float\n$isStudent = true; // Boolean\n$fruits = array(\"apple\", \"banana\"); // Array\n```"
            },
            {
                title: "Control Structures",
                content: "PHP control flow:\n\n```php\nif ($age >= 18) {\n    echo \"Adult\";\n} else {\n    echo \"Minor\";\n}\n\nfor ($i = 0; $i < 5; $i++) {\n    echo $i . \"<br>\";\n}\n\nforeach ($fruits as $fruit) {\n    echo $fruit . \"<br>\";\n}\n```"
            },
            {
                title: "Functions and Forms",
                content: "PHP functions:\n\n```php\nfunction greet($name) {\n    return \"Hello, \" . $name . \"!\";\n}\n\necho greet(\"Alice\");\n```\n\nHandling forms:\n```php\nif ($_SERVER[\"REQUEST_METHOD\"] == \"POST\") {\n    $name = $_POST['name'];\n    echo \"Hello, \" . htmlspecialchars($name);\n}\n```"
            },
            {
                title: "Database Integration",
                content: "PHP with MySQL:\n\n```php\n$conn = mysqli_connect(\"localhost\", \"user\", \"password\", \"database\");\n\nif ($conn) {\n    $sql = \"SELECT * FROM users\";\n    $result = mysqli_query($conn, $sql);\n    \n    while ($row = mysqli_fetch_assoc($result)) {\n        echo $row['name'] . \"<br>\";\n    }\n    \n    mysqli_close($conn);\n}\n```\n\nPDO for database abstraction"
            }
        ]
    },
    ruby: {
        title: "Ruby Programming",
        lessons: [
            {
                title: "Introduction to Ruby",
                content: "Ruby is a dynamic, object-oriented programming language known for its elegant syntax and focus on developer happiness. It's popular for web development with Ruby on Rails.\n\nKey features:\n• Pure object-oriented\n• Dynamic typing\n• Duck typing\n• Blocks and iterators\n• Metaprogramming capabilities"
            },
            {
                title: "Ruby Basics",
                content: "Basic Ruby syntax:\n\n```ruby\nputs \"Hello, World!\"\n# This is a comment\n```\n\nVariables and data types:\n```ruby\nname = \"John\"      # String\nage = 25            # Integer\nprice = 19.99       # Float\nis_student = true   # Boolean\nfruits = [\"apple\", \"banana\"]  # Array\n```"
            },
            {
                title: "Control Flow and Methods",
                content: "Ruby control structures:\n\n```ruby\nif age >= 18\n  puts \"Adult\"\nelse\n  puts \"Minor\"\nend\n\nfor i in 0..4\n  puts i\nend\n\nfruits.each do |fruit|\n  puts fruit\nend\n```\n\nMethods:\n```ruby\ndef greet(name)\n  \"Hello, #{name}!\"\nend\n\nputs greet(\"Alice\")\n```"
            },
            {
                title: "Object-Oriented Ruby",
                content: "OOP in Ruby:\n\n```ruby\nclass Person\n  attr_accessor :name, :age\n  \n  def initialize(name, age)\n    @name = name\n    @age = age\n  end\n  \n  def greet\n    \"Hello, I'm #{@name} and I'm #{@age} years old\"\n  end\nend\n\nperson = Person.new(\"John\", 25)\nputs person.greet\n```\n\nEverything is an object in Ruby"
            },
            {
                title: "Ruby Gems and Rails",
                content: "Ruby ecosystem:\n\nGems (libraries):\n```ruby\n# In Gemfile\n gem 'rails'\n gem 'devise'\n\n# In code\nrequire 'date'\nputs Date.today\n```\n\nRuby on Rails:\n• MVC framework\n• Convention over configuration\n• RESTful routing\n• Active Record ORM\n• Scaffolding"
            }
        ]
    }
};

// User progress tracking (in-memory, would use database in production)
const userProgress = new Map();

// User code storage (in-memory, would use database in production)
const userCode = new Map();

// Function to send course menu
const sendCourseMenu = async (chatId) => {
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '💻 HTML', callback_data: 'course_html' },
                    { text: '🎨 CSS', callback_data: 'course_css' },
                    { text: '⚡ JS', callback_data: 'course_js' }
                ],
                [
                    { text: '🐍 Python', callback_data: 'course_python' },
                    { text: '☕ Java', callback_data: 'course_java' },
                    { text: '⚙️ C++', callback_data: 'course_cpp' }
                ],
                [
                    { text: '🗄️ SQL', callback_data: 'course_sql' },
                    { text: '🐘 PHP', callback_data: 'course_php' },
                    { text: '💎 Ruby', callback_data: 'course_ruby' }
                ],
                [
                    { text: '🎮 Code Playground', callback_data: 'playground' },
                    { text: '📊 My Progress', callback_data: 'progress' }
                ],
                [
                    { text: '🌐 Visit Connectonic', url: 'https://www.connectonic.live' }
                ]
            ]
        }
    };
    await bot.sendMessage(chatId, '🎓 **Programming Courses**\n\nChoose a course to start learning:\n\n🌐 **Web Development:**\n• 💻 HTML - Web structure\n• 🎨 CSS - Styling & layouts\n• ⚡ JavaScript - Interactive programming\n\n💻 **Programming Languages:**\n• 🐍 Python - General purpose\n• ☕ Java - Enterprise development\n• ⚙️ C++ - System programming\n\n🛠️ **Specialized:**\n• 🗄️ SQL - Database management\n• 🐘 PHP - Server-side scripting\n• 💎 Ruby - Web applications\n\n🎮 **Practice:** Code Playground\n📊 **Track:** Your learning progress\n\n🌐 **Visit our website:** https://www.connectonic.live', opts);
};

// Function to send lesson
const sendLesson = async (chatId, course, lessonIndex) => {
    const courseData = courses[course];
    if (!courseData) {
        await bot.sendMessage(chatId, 'Course not found.');
        return;
    }
    if (lessonIndex >= courseData.lessons.length) {
        await bot.sendMessage(chatId, 'Lesson not found.');
        return;
    }

    const lesson = courseData.lessons[lessonIndex];
    const userId = chatId.toString();
    const progress = userProgress.get(userId) || {};
    progress[course] = lessonIndex;
    userProgress.set(userId, progress);

    const totalLessons = courseData.lessons.length;
    const progressText = `📖 Lesson ${lessonIndex + 1}/${totalLessons}`;

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: lessonIndex > 0 ? '⬅️ Previous' : '🏠 Menu', callback_data: lessonIndex > 0 ? `lesson_${course}_${lessonIndex - 1}` : 'menu' },
                    { text: lessonIndex < totalLessons - 1 ? 'Next ➡️' : '✅ Complete', callback_data: lessonIndex < totalLessons - 1 ? `lesson_${course}_${lessonIndex + 1}` : 'menu' }
                ]
            ]
        }
    };

    await bot.sendMessage(chatId, `${progressText}\n\n📚 ${courseData.title}\n\n🎯 ${lesson.title}\n\n${lesson.content}`, opts);
};

// Function to send progress
const sendProgress = async (chatId) => {
    const userId = chatId.toString();
    const progress = userProgress.get(userId) || {};

    let progressMessage = '📊 Your Learning Progress:\n\n';

    const courseEmojis = {
        html: '💻',
        css: '🎨',
        js: '⚡',
        python: '🐍',
        java: '☕',
        cpp: '⚙️',
        sql: '🗄️',
        php: '🐘',
        ruby: '💎'
    };

    Object.keys(courses).forEach(course => {
        const courseData = courses[course];
        const completedLessons = progress[course] !== undefined ? progress[course] + 1 : 0;
        const totalLessons = courseData.lessons.length;
        const percentage = Math.round((completedLessons / totalLessons) * 100);
        const emoji = courseEmojis[course] || '📚';

        progressMessage += `${emoji} ${courseData.title}: ${completedLessons}/${totalLessons} lessons (${percentage}%)\n`;
    });

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🏠 Back to Courses', callback_data: 'menu' }]
            ]
        }
    };

    await bot.sendMessage(chatId, progressMessage, opts);
};

// Function to send code playground menu
const sendPlaygroundMenu = async (chatId) => {
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '💻 HTML Playground', callback_data: 'playground_html' },
                    { text: '🎨 CSS Playground', callback_data: 'playground_css' }
                ],
                [
                    { text: '⚡ JS Playground', callback_data: 'playground_js' },
                    { text: '🌐 Full Stack', callback_data: 'playground_full' }
                ],
                [
                    { text: '🏆 Coding Challenges', callback_data: 'challenges' },
                    { text: '🏠 Back to Menu', callback_data: 'menu' }
                ]
            ]
        }
    };

    await bot.sendMessage(chatId, '🎮 **Code Playground**\n\nPractice coding with live preview!\n\nChoose a playground:\n\n💻 **HTML Playground** - Practice HTML markup\n🎨 **CSS Playground** - Style your creations\n⚡ **JS Playground** - Run JavaScript code\n🌐 **Full Stack** - HTML + CSS + JS together\n🏆 **Coding Challenges** - Test your skills', opts);
};

// Function to start code playground
const startPlayground = async (chatId, type) => {
    const userId = chatId.toString();

    // Initialize user code storage
    if (!userCode.has(userId)) {
        userCode.set(userId, {
            html: '<h1>Hello World!</h1>\n<p>Welcome to the HTML playground!</p>',
            css: 'body {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n    text-align: center;\n    padding: 20px;\n}\n\nh1 {\n    color: #333;\n}',
            js: 'console.log("Hello from JavaScript!");\n\n// Try changing this code!\nalert("Welcome to JS Playground!");',
            full_html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Webpage</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>This is my first webpage.</p>\n    <button onclick="changeText()">Click me!</button>\n    \n    <script>\n        function changeText() {\n            document.querySelector("h1").textContent = "You clicked the button!";\n        }\n    </script>\n</body>\n</html>',
            full_css: '',
            full_js: ''
        });
    }

    const userCodes = userCode.get(userId);

    let message = '';
    let keyboard = [];

    switch (type) {
        case 'html':
            message = `💻 **HTML Playground**\n\nYour current HTML code:\n\n\`\`\`html\n${userCodes.html}\n\`\`\`\n\nSend me new HTML code to update and preview!`;
            keyboard = [
                [{ text: '🔄 Reset Code', callback_data: 'reset_html' }],
                [{ text: '👀 Preview', callback_data: 'preview_html' }, { text: '⬅️ Back', callback_data: 'playground' }]
            ];
            break;

        case 'css':
            message = `🎨 **CSS Playground**\n\nYour current CSS code:\n\n\`\`\`css\n${userCodes.css}\n\`\`\`\n\nSend me new CSS code to update and preview!`;
            keyboard = [
                [{ text: '🔄 Reset Code', callback_data: 'reset_css' }],
                [{ text: '👀 Preview', callback_data: 'preview_css' }, { text: '⬅️ Back', callback_data: 'playground' }]
            ];
            break;

        case 'js':
            message = `⚡ **JavaScript Playground**\n\nYour current JS code:\n\n\`\`\`javascript\n${userCodes.js}\n\`\`\`\n\nSend me new JavaScript code to run!`;
            keyboard = [
                [{ text: '🔄 Reset Code', callback_data: 'reset_js' }],
                [{ text: '▶️ Run Code', callback_data: 'run_js' }, { text: '⬅️ Back', callback_data: 'playground' }]
            ];
            break;

        case 'full':
            message = `🌐 **Full Stack Playground**\n\nYour current code:\n\n**HTML:**\n\`\`\`html\n${userCodes.full_html}\n\`\`\`\n\n**CSS:**\n\`\`\`css\n${userCodes.full_css}\n\`\`\`\n\n**JavaScript:**\n\`\`\`javascript\n${userCodes.full_js}\n\`\`\`\n\nSend me code in format:\n/html [code]\n/css [code]\n/js [code]`;
            keyboard = [
                [{ text: '🔄 Reset All', callback_data: 'reset_full' }],
                [{ text: '👀 Preview Page', callback_data: 'preview_full' }, { text: '⬅️ Back', callback_data: 'playground' }]
            ];
            break;
    }

    const opts = {
        reply_markup: {
            inline_keyboard: keyboard
        },
        parse_mode: 'Markdown'
    };

    await bot.sendMessage(chatId, message, opts);
};

// Function to handle code execution
const executeCode = async (chatId, code, type) => {
    try {
        let result = '';

        switch (type) {
            case 'js':
                // For JavaScript, we'll simulate execution by showing what the code does
                if (code.includes('console.log')) {
                    const logMatch = code.match(/console\.log\(['"](.*?)['"]\)/);
                    if (logMatch) {
                        result = `📝 Console Output: ${logMatch[1]}`;
                    }
                }
                if (code.includes('alert')) {
                    const alertMatch = code.match(/alert\(['"](.*?)['"]\)/);
                    if (alertMatch) {
                        result += `\n🚨 Alert: ${alertMatch[1]}`;
                    }
                }
                if (!result) {
                    result = '✅ Code executed successfully! (No console output or alerts detected)';
                }
                break;

            case 'html':
                result = '✅ HTML code updated! Use 👀 Preview to see the result.';
                break;

            case 'css':
                result = '✅ CSS code updated! Use 👀 Preview to see the styling.';
                break;
        }

        await bot.sendMessage(chatId, `🎯 **Code Execution Result:**\n\n${result}`);
    } catch (error) {
        await bot.sendMessage(chatId, `❌ **Error:** ${error.message}`);
    }
};

// Function to generate preview
const generatePreview = async (chatId, type) => {
    const userId = chatId.toString();
    const userCodes = userCode.get(userId);

    let previewMessage = '';

    switch (type) {
        case 'html':
            previewMessage = `🌐 **HTML Preview:**\n\n${userCodes.html}\n\n💡 *This HTML would render as a webpage with the above structure.*`;
            break;

        case 'css':
            previewMessage = `🎨 **CSS Preview:**\n\nThe CSS code:\n\`\`\`css\n${userCodes.css}\n\`\`\`\n\n💡 *This CSS would style webpage elements with the above rules.*`;
            break;

        case 'full':
            previewMessage = `🌐 **Full Stack Preview:**\n\n**Rendered Page:**\n${userCodes.full_html}\n\n**Styling Applied:**\n${userCodes.full_css || 'No CSS applied'}\n\n**JavaScript:**\n${userCodes.full_js || 'No JavaScript added'}`;
            break;
    }

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '✏️ Edit Code', callback_data: `playground_${type}` }],
                [{ text: '⬅️ Back to Playground', callback_data: 'playground' }]
            ]
        },
        parse_mode: 'Markdown'
    };

    await bot.sendMessage(chatId, previewMessage, opts);
};

// Handle incoming updates from Telegram
module.exports = async (req, res) => {
  try {
    console.log('Received request:', req.method, req.url);

    if (req.method !== 'POST') {
      console.log('Method not allowed:', req.method);
      return res.status(405).send('Method Not Allowed');
    }

    const update = req.body;
    if (!update) {
      console.log('No update received');
      return res.status(200).send('No update received');
    }

    console.log('Processing update:', JSON.stringify(update, null, 2));

    // Process messages
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text;

      console.log('Processing message from chat:', chatId, 'text:', text);

      if (text) {
        if (text === '/start') {
        const opts = {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🎓 Learn Programming', callback_data: 'learn' },
                { text: 'Get a Joke', callback_data: 'get_joke' }
              ],
              [
                { text: 'Get a Photo', callback_data: 'get_photo' },
                { text: 'Help', callback_data: 'help' }
              ]
            ]
          }
        };
        await bot.sendMessage(chatId, '🤖 Welcome to the Connect.world Bot!\n\nChoose an option to get started:\n\n🎮 **Try Code Playground** - Practice coding live!\n🌐 **Visit our website:** https://www.connectonic.live', opts);
      } else if (text === '/help') {
        await bot.sendMessage(chatId, 'Available commands:\n/start - Start the bot\n/learn - Start learning programming\n/playground - Practice coding\n/ai [question] - Ask AI a question\n/help - Show this help message\n/joke - Get a random joke\n/photo - Get a random photo\n\nCode commands:\n/html [code] - Update HTML\n/css [code] - Update CSS\n/js [code] - Run JavaScript');
      } else if (text === '/learn' || text === '/courses') {
        await sendCourseMenu(chatId);
      } else if (text === '/playground') {
        await sendPlaygroundMenu(chatId);
      } else if (text.startsWith('/html ')) {
        const code = text.substring(6).trim();
        const userId = chatId.toString();
        const userCodes = userCode.get(userId) || {};
        userCodes.html = code;
        userCode.set(userId, userCodes);
        await bot.sendMessage(chatId, '✅ HTML code updated! Use the playground to preview.');
      } else if (text.startsWith('/css ')) {
        const code = text.substring(5).trim();
        const userId = chatId.toString();
        const userCodes = userCode.get(userId) || {};
        userCodes.css = code;
        userCode.set(userId, userCodes);
        await bot.sendMessage(chatId, '✅ CSS code updated! Use the playground to preview.');
      } else if (text.startsWith('/js ')) {
        const code = text.substring(4).trim();
        const userId = chatId.toString();
        const userCodes = userCode.get(userId) || {};
        userCodes.js = code;
        userCode.set(userId, userCodes);
        await executeCode(chatId, code, 'js');
      } else if (text === '/joke') {
        await sendJoke(chatId);
      } else if (text === '/photo') {
        await sendPhoto(chatId);
      } else if (text.startsWith('/ai ')) {
        const query = text.substring(4).trim();
        if (query) {
          try {
            const askQuestion = httpsCallable(functions, 'askQuestion');
            const result = await askQuestion(query);
            await bot.sendMessage(chatId, `🤖 AI Response:\n\n${result.data}`);
          } catch (error) {
            console.error('AI Error:', error);
            await bot.sendMessage(chatId, 'Sorry, I could not generate a response at this time.');
          }
        } else {
          await bot.sendMessage(chatId, 'Please provide a message after /ai. Example: /ai What is the capital of France?');
        }
      } else if (text.toLowerCase().includes('hello')) {
        await bot.sendMessage(chatId, 'Hello there! 👋\n\nType /learn to start learning programming, /ai [question] for AI responses, or /playground to practice coding!');
      } else {
        await bot.sendMessage(chatId, `I'm not sure what you mean. Try /help for available commands.`);
      }
    } else if (msg.photo) {
      const photoId = msg.photo[msg.photo.length - 1].file_id;
      await bot.sendPhoto(chatId, photoId, { caption: 'Nice photo! 📸 Here it is back.' });
    }
  } else if (update.callback_query) {
    const callbackQuery = update.callback_query;
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    await bot.answerCallbackQuery(callbackQuery.id); // Acknowledge the callback query

    if (data === 'learn' || data === 'menu') {
      await sendCourseMenu(chatId);
    } else if (data === 'help') {
      await bot.sendMessage(chatId, 'Available commands:\n/start - Start the bot\n/learn - Start learning programming\n/playground - Practice coding\n/ai [question] - Ask AI a question\n/help - Show this help message\n/joke - Get a random joke\n/photo - Get a random photo\n\nCode commands:\n/html [code] - Update HTML\n/css [code] - Update CSS\n/js [code] - Run JavaScript');
    } else if (data === 'get_joke') {
      await sendJoke(chatId);
    } else if (data === 'get_photo') {
      await sendPhoto(chatId);
    } else if (data === 'progress') {
      await sendProgress(chatId);
    } else if (data === 'playground') {
      await sendPlaygroundMenu(chatId);
    } else if (data.startsWith('playground_')) {
      const type = data.split('_')[1];
      await startPlayground(chatId, type);
    } else if (data.startsWith('reset_')) {
      const type = data.split('_')[1];
      const userId = chatId.toString();
      const userCodes = userCode.get(userId) || {};

      // Reset to default code
      const defaults = {
        html: '<h1>Hello World!</h1>\n<p>Welcome to the HTML playground!</p>',
        css: 'body {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n    text-align: center;\n    padding: 20px;\n}\n\nh1 {\n    color: #333;\n}',
        js: 'console.log("Hello from JavaScript!");\n\n// Try changing this code!\nalert("Welcome to JS Playground!");',
        full: {
          html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Webpage</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>This is my first webpage.</p>\n    <button onclick="changeText()">Click me!</button>\n    \n    <script>\n        function changeText() {\n            document.querySelector("h1").textContent = "You clicked the button!";\n        }\n    </script>\n</body>\n</html>',
          css: '',
          js: ''
        }
      };

      if (type === 'full') {
        userCodes.full_html = defaults.full.html;
        userCodes.full_css = defaults.full.css;
        userCodes.full_js = defaults.full.js;
      } else {
        userCodes[type] = defaults[type];
      }

      userCode.set(userId, userCodes);
      await bot.sendMessage(chatId, `🔄 Code reset to default!`);
      await startPlayground(chatId, type);
    } else if (data.startsWith('preview_')) {
      const type = data.split('_')[1];
      await generatePreview(chatId, type);
    } else if (data.startsWith('run_')) {
      const type = data.split('_')[1];
      const userId = chatId.toString();
      const userCodes = userCode.get(userId) || {};
      await executeCode(chatId, userCodes[type], type);
    } else if (data.startsWith('course_')) {
      const course = data.split('_')[1];
      await sendLesson(chatId, course, 0);
    } else if (data.startsWith('lesson_')) {
      const [, course, lessonIndex] = data.split('_');
      await sendLesson(chatId, course, parseInt(lessonIndex));
    }
  }

  console.log('Update processed successfully');
  res.status(200).send('OK');
} catch (error) {
  console.error('Error processing update:', error);
  // Ensure we always respond to prevent timeouts
  if (!res.headersSent) {
    res.status(500).send('Internal Server Error');
  }
};

// Set the webhook
const setWebhook = async () => {
  const webhookUrl = `https://www.connectonic.live/api/telegram-bot`;
  try {
    await bot.setWebhook(webhookUrl);
    console.log(`Webhook set to: ${webhookUrl}`);
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
};

// Set webhook on function initialization
setWebhook();

// For local development, you might still want polling or a local tunnel
// For Vercel, the function will be triggered by the webhook POST request.
// We don't need app.listen() for Vercel serverless functions.
// However, for local testing with a tool like ngrok, you might uncomment this:
/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setWebhook(); // Set webhook on local start if needed
});
*/

// console.log('Bot webhook handler is ready.');
};
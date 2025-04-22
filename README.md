# 🍬 Sweet Shop - Cypress Test Suite

Welcome to the Sweet Shop Testing Suite – a comprehensive end-to-end testing framework for our online candy store, built with Cypress. This project implements automated testing to ensure a seamless shopping experience across all major features of the application.

## 📊 Test Statistics
- 8 Test Scenarios (TS)
- 49 Test Cases (TC)
- All test scenarios and cases are documented in TestCases.md

## 🛠️ Technical Implementation
- Utilizes Cypress commands and custom helper functions for enhanced test efficiency
- Functional test cases are registered as Tasks in Jira (details in JiraProject/JiraSummary.md)

## 📁 Project Structure
```
📁 sweetshop/ 
├── 📁 cypress/ 
│ ├── 📁 downloads/ 
│ ├── 📁 e2e/ 
│ │ ├── 📄 about-page.cy.js   
│ │ ├── 📄 basket.cy.js  
│ │ ├── 📄 checkout.cy.js           
│ │ ├── 📄 homepage-validation.cy.js
│ │ ├── 📄 login.cy.js                                      
│ │ ├── 📄 navigationBar.cy.js                 
│ │ ├── 📄 productCatalog.cy.js 
│ │ └── 📄 sweets.cy.js                  
│ ├── 📁 fixtures/ 
│ │ └── 📄 example.json 
│ └── 📁 support/ 
│ ├── 📄 e2e.js 
│ └── 📄 commands.js  
├── 📁 node_modules/ 
├── 📄 .gitignore
├── 📄 cypress.config.js
├── 📄 jiraproject.md 
├── 📄 package-lock.json 
├── 📄 package.json 
├── 📄 README.md 
└── 📄 TestCases.md
```

## 🚀 Getting Started

Clone the repository:
```bash
git clone https://github.com/DarijusL/sweetshop.git
```

Install dependencies:
```bash
npm install
```

Run Cypress in CLI Mode:
```bash
npx cypress open
```

## 📄 License
MIT

## 🧑‍💻 Author
Darijus Lūža

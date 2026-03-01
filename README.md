# CLI_Tools_Week-2-

CLI tools with Hexagonal Architecture and presentation like an menu interface

This project is handle with only nodejs + typescript need required installing for running normally:

bash

```
npm install -D @types/node ts-node typescript tsx

**TEST**
npm install -D jest ts-jest @types/jest
```

packag.json setting: npm init -y

```
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:watch": "jest --watch"
    "dev": "tsx src/main.ts",

    "type": "module"
```

tsconfig.json setting: npx tsc --init

```
    "module": "nodenext"
    "target": "es2022"
    "types": ["node", "jest"]

    "verbatimModuleSyntax": false,
    "moduleResolution": "nodenext",
    "esModuleInterop": true
```

running project:
```
npm run dev
```

running test domain logic (service) with mock:
```
npm run test
```

# CLI_Tools_Week-2-

CLI tools with Hexagonal Architecture and presentation like an menu interface

This project is handle with only nodejs + typescript need required installing for running normally:

bash

```
npm install -D @types/node ts-node typescript
```

packag.json setting: npm init -y

```
    "dev": "node --loader ts-node/esm src/main.ts",

    "type": "module"
```

tsconfig.json setting: npx tsc --init

```
    "module": "nodenext"
    "target": "es2022"
    "types": ["node"]

    "verbatimModuleSyntax": false,
```

author: Đinh Trọng Phúc

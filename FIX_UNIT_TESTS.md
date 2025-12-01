# How to Fix Unit Tests for ES Module Compatibility

## Current Issue

The unit tests are failing because they use `jest.mock()` which internally relies on CommonJS `require()` statements. However, the project has been migrated to use ES modules (`import`/`export` syntax) as indicated by:
- `"type": "module"` in package.json files
- Use of `.js` file extensions with `import` statements
- ES module syntax throughout the codebase

## Solution Approaches

### Option 1: Convert to ES Module Mocking (Recommended)

Replace `jest.mock()` calls with ES module compatible alternatives:

**Before:**
```javascript
import { CategoryService } from '../../../src/services/category.service.js';
import { CategoryModel } from '../../../src/models/category.model.js';

// This causes issues with ES modules
jest.mock('../../../src/models/category.model.js');

describe('CategoryService', () => {
  // tests here
});
```

**After:**
```javascript
// Note: We're not importing the modules at the top level due to ES module mocking limitations
// Instead, we'll import them dynamically in the tests

let CategoryModel;
let CategoryService;

describe('CategoryService', () => {
  // Dynamically import modules before running tests
  beforeAll(async () => {
    // Manually mock the CategoryModel
    jest.mock('../../../src/models/category.model.js', () => ({
      CategoryModel: {
        findAll: jest.fn(),
        findById: jest.fn(),
        findBySlug: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      }
    }));
    
    // Now import the modules after mocking
    const categoryModelModule = await import('../../../src/models/category.model.js');
    const categoryServiceModule = await import('../../../src/services/category.service.js');
    
    CategoryModel = categoryModelModule.CategoryModel;
    CategoryService = categoryServiceModule.CategoryService;
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // tests here
});
```

### Option 2: Use Manual Mocks

Create manual mocks in a `__mocks__` directory:

1. Create `backend/__mocks__/category.model.js`:
```javascript
// Manual mock for CategoryModel to work with ES modules
export const CategoryModel = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export default CategoryModel;
```

2. Update the test file to use manual mocks:
```javascript
import { CategoryService } from '../../../src/services/category.service.js';
import { CategoryModel } from '../../../src/models/category.model.js';

// Clear any automatic mocks
jest.clearAllMocks();

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // tests here - the mocking is handled by the manual mock file
});
```

3. Update Jest configuration to recognize manual mocks:
```javascript
// In jest.config.js
export default {
  // ... other config
  moduleNameMapper: {
    '^\\.{1,2}/__mocks__/(.*)$': '<rootDir>/__mocks__/$1',
  },
};
```

### Option 3: Configure Jest for ESM (Advanced)

Update Jest configuration to properly handle ES modules:

```javascript
// In jest.config.js
export default {
  // ... existing config
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(module-that-needs-transform)/)',
  ],
};
```

And create a babel.config.js:
```javascript
export default {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-modules-commonjs', {
      allowTopLevelThis: true,
      loose: true
    }]
  ]
};
```

## Verification Commands

After implementing one of the solutions above, verify with:

```bash
# Run a single unit test to verify the fix
NODE_OPTIONS=--experimental-vm-modules npx jest backend/__tests__/unit/services/category.service.test.js --runInBand

# Run all unit tests
npm run test:unit

# Run all tests
npm test
```

## Next Steps

1. Choose one approach from above (Option 1 is recommended for simplicity)
2. Apply the fix to one test file first to verify it works
3. Gradually apply the fix to all unit test files
4. Update documentation to reflect the new testing approach
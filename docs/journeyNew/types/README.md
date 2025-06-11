# Journey New Types Directory

## Current Structure

This directory contains type definitions for the Journey New module. Instead of creating consolidated type files that would duplicate existing types, we maintain the current distributed structure.

## Type Files

- `question.ts` - Question-specific types and interfaces
- ~~`index.ts`~~ - *Removed to avoid type conflicts*
- ~~`consolidated.ts`~~ - *Not created to prevent duplication*

## Type Distribution

Types are distributed across the codebase in a logical manner:

### Core Types
- **Location**: `../types.ts`
- **Purpose**: Main journey entities (Journey, Stage, Lesson, Question, etc.)

### Context Types  
- **Location**: `../context/*.tsx`
- **Purpose**: State management interfaces

### Hook Types
- **Location**: `../hooks/*.tsx` 
- **Purpose**: Custom hook return types

### Utility Types
- **Location**: `../utils/*.ts`
- **Purpose**: Utility function interfaces

### Component Types
- **Location**: `../components/**/*.tsx`
- **Purpose**: Component props and local types

## Usage Guidelines

### Importing Types

```typescript
// ✅ Import from source location
import { JourneyNewQuestion } from '../types';
import { AnswerContextType } from '../context/AnswerContext';
import { UseQuestionReturn } from '../hooks/useQuestion';

// ❌ Avoid creating barrel exports
// import { Question, Answer } from './consolidated';
```

### Type Naming Conventions

- **Core entities**: `JourneyNew*` prefix (e.g., `JourneyNewQuestion`)
- **Context state**: `*State` suffix (e.g., `AnswerState`)
- **Context values**: `*ContextType` suffix (e.g., `QuestionContextType`)
- **Hook returns**: `Use*Return` suffix (e.g., `UseAnswerReturn`)
- **Component props**: `*Props` suffix (e.g., `QuestionRendererProps`)

## Duplication Analysis

Several types are duplicated across files:

### Answer Types
- `types/question.ts` → `Answer`
- `context/AnswerContext.tsx` → `Answer`
- `hooks/useAnswer.tsx` → `AnswerData`, `UserAnswer`
- `utils/storageUtils.ts` → `StoredAnswer`

### Progress Types
- `types.ts` → `JourneyNewProgress`
- `context/ProgressContext.tsx` → `LessonProgress`, `StageProgress`
- `utils/storageUtils.ts` → `StoredUserProgress`

## Recommendation

**Keep existing structure** rather than consolidating:

1. **No breaking changes** - Existing code continues to work
2. **Co-location** - Types near their usage
3. **Clear boundaries** - Module separation maintained
4. **Gradual improvement** - Can standardize over time

## Future Development

For new types:
- Add core entities to `../types.ts`
- Define context types in respective context files
- Define hook types in respective hook files
- Define component props alongside components

## Documentation

See `../TYPES_CONSOLIDATION.md` for detailed analysis and migration strategies. 
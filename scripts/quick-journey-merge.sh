#!/bin/bash
# Quick Journey Merge Script
# Author: ETrainer Upgrade Team
# Purpose: Merge journeyStudy (UI) + journeyNew (Logic) → app/journey

set -e  # Exit on any error

echo "🚀 Starting Journey Merge Process..."
echo "=================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "app/journeyStudy" ] || [ ! -d "app/journeyNew" ]; then
    echo -e "${RED}❌ Error: journeyStudy or journeyNew not found!${NC}"
    echo "Please run this script from the app root directory"
    exit 1
fi

# Step 1: Analysis
echo -e "${BLUE}📊 Step 1: Analyzing existing journeys...${NC}"
echo "Journey Study files:"
ls -la app/journeyStudy/ | grep -E "\.(tsx?|jsx?)$" | wc -l
echo "Journey New files:"
ls -la app/journeyNew/ | grep -E "\.(tsx?|jsx?)$" | wc -l

# Step 2: Backup
echo -e "${YELLOW}📦 Step 2: Creating backups...${NC}"
if [ -d "journeyStudy-backup" ]; then
    echo "⚠️  Backup already exists, skipping..."
else
    cp -r app/journeyStudy journeyStudy-backup/
    echo "✅ journeyStudy backed up"
fi

if [ -d "journeyNew-backup" ]; then
    echo "⚠️  Backup already exists, skipping..."
else
    cp -r app/journeyNew journeyNew-backup/
    echo "✅ journeyNew backed up"
fi

# Step 3: Create structure
echo -e "${BLUE}🏗️  Step 3: Creating merged structure...${NC}"
if [ -d "app/journey" ]; then
    echo "⚠️  app/journey already exists! Removing..."
    rm -rf app/journey
fi

mkdir -p app/journey/{screens,components,context,utils,types}
echo "✅ Merged journey structure created"

# Step 4: Copy foundation (modern architecture from journeyNew)
echo -e "${GREEN}⚡ Step 4: Copying modern foundation...${NC}"

# Copy context (state management)
if [ -d "app/journeyNew/context" ]; then
    cp -r app/journeyNew/context app/journey/
    echo "✅ Context copied"
fi

# Copy types
if [ -f "app/journeyNew/types.ts" ]; then
    cp app/journeyNew/types.ts app/journey/
    echo "✅ Types copied"
fi

# Copy modern components
if [ -d "app/journeyNew/components" ]; then
    cp -r app/journeyNew/components/* app/journey/components/
    echo "✅ Modern components copied"
fi

# Copy utils if exists
if [ -d "app/journeyNew/utils" ]; then
    cp -r app/journeyNew/utils app/journey/
    echo "✅ Utils copied"
fi

# Step 5: Prepare UI files for manual merge
echo -e "${YELLOW}🎨 Step 5: Preparing UI files for merge...${NC}"

# Copy key UI files with -OLD suffix for reference
if [ -f "app/journeyStudy/day-questions.tsx" ]; then
    cp app/journeyStudy/day-questions.tsx app/journey/screens/DayQuestions-OLD.tsx
    echo "✅ day-questions.tsx prepared for merge"
fi

if [ -f "app/journeyStudy/enhanced-day-questions.tsx" ]; then
    cp app/journeyStudy/enhanced-day-questions.tsx app/journey/screens/EnhancedDayQuestions-OLD.tsx
    echo "✅ enhanced-day-questions.tsx prepared for merge"
fi

# Copy any other UI components from journeyStudy
if [ -d "app/journeyStudy/components" ]; then
    mkdir -p app/journey/components/legacy
    cp -r app/journeyStudy/components/* app/journey/components/legacy/
    echo "✅ Legacy UI components copied"
fi

# Step 6: Create merge templates
echo -e "${BLUE}📝 Step 6: Creating merge templates...${NC}"

# Create template for DayQuestions merge
cat > app/journey/screens/DayQuestions.tsx << 'EOF'
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

// Import modern state management from journeyNew
import { AnswerContext } from '../context/AnswerContext';
import { ProgressContext } from '../context/ProgressContext';

// Import types
import { JourneyNewQuestion, UserAnswer } from '../types';

interface DayQuestionsProps {
     dayNumber: number;
     questions: JourneyNewQuestion[];
     onComplete: () => void;
}

const DayQuestions: React.FC<DayQuestionsProps> = ({
     dayNumber,
     questions,
     onComplete
}) => {
     // TODO: Merge UI from DayQuestions-OLD.tsx
     // TODO: Integrate with AnswerContext and ProgressContext
     // TODO: Add proper TypeScript types
     
     return (
          <View style={styles.container}>
               <Text style={styles.title}>Day {dayNumber} Questions</Text>
               <Text style={styles.subtitle}>
                    TODO: Merge UI components from DayQuestions-OLD.tsx
               </Text>
               
               {/* TODO: Add question rendering logic */}
               
               <TouchableOpacity onPress={onComplete} style={styles.completeButton}>
                    <Text style={styles.buttonText}>Complete Day</Text>
               </TouchableOpacity>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          padding: 16,
          backgroundColor: '#fff',
     },
     title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 8,
     },
     subtitle: {
          fontSize: 16,
          color: '#666',
          marginBottom: 16,
     },
     completeButton: {
          backgroundColor: '#007AFF',
          padding: 16,
          borderRadius: 8,
          marginTop: 16,
     },
     buttonText: {
          color: '#fff',
          textAlign: 'center',
          fontSize: 16,
          fontWeight: '600',
     },
});

export default DayQuestions;
EOF

echo "✅ DayQuestions template created"

# Create index file
cat > app/journey/index.tsx << 'EOF'
// Main Journey Screen - Entry point for merged journey
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JourneyMain: React.FC = () => {
     return (
          <View style={styles.container}>
               <Text style={styles.title}>Merged Journey</Text>
               <Text style={styles.subtitle}>
                    Combined UI from journeyStudy + Logic from journeyNew
               </Text>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
     },
     title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 8,
     },
     subtitle: {
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
     },
});

export default JourneyMain;
EOF

echo "✅ Journey index created"

# Step 7: Summary
echo -e "${GREEN}=================================="
echo "🎉 Journey Merge Foundation Complete!"
echo "==================================${NC}"

echo ""
echo -e "${BLUE}📋 What was done:${NC}"
echo "✅ Backed up existing journeys"
echo "✅ Created merged structure: app/journey/"
echo "✅ Copied modern foundation from journeyNew"
echo "✅ Prepared UI files for manual merge"
echo "✅ Created merge templates"

echo ""
echo -e "${YELLOW}📝 Next Steps (Manual):${NC}"
echo "1. Merge UI from DayQuestions-OLD.tsx → DayQuestions.tsx"
echo "2. Integrate AnswerContext and ProgressContext"
echo "3. Add proper TypeScript types"
echo "4. Update navigation routes"
echo "5. Test merged functionality"

echo ""
echo -e "${BLUE}📂 Key Files:${NC}"
echo "• app/journey/screens/DayQuestions-OLD.tsx (reference UI)"
echo "• app/journey/screens/DayQuestions.tsx (merge target)"
echo "• app/journey/context/ (modern state management)"
echo "• app/journey/types.ts (TypeScript definitions)"

echo ""
echo -e "${GREEN}🚀 Ready for manual merge process!${NC}" 
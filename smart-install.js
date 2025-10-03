#!/usr/bin/env node

/**
 * Smart Install Script
 * Vérifie si npm install est nécessaire avant de l'exécuter
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const NODE_MODULES = path.join(__dirname, 'node_modules');
const PACKAGE_JSON = path.join(__dirname, 'package.json');
const PACKAGE_LOCK = path.join(__dirname, 'package-lock.json');

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function getLastModified(filePath) {
  try {
    return fs.statSync(filePath).mtime.getTime();
  } catch {
    return 0;
  }
}

function needsInstall() {
  // node_modules n'existe pas
  if (!fileExists(NODE_MODULES)) {
    console.log('❌ node_modules n\'existe pas');
    return true;
  }

  // package.json modifié après node_modules
  const packageTime = getLastModified(PACKAGE_JSON);
  const nodeModulesTime = getLastModified(NODE_MODULES);
  
  if (packageTime > nodeModulesTime) {
    console.log('📦 package.json a été modifié');
    return true;
  }

  // package-lock.json modifié après node_modules
  if (fileExists(PACKAGE_LOCK)) {
    const lockTime = getLastModified(PACKAGE_LOCK);
    if (lockTime > nodeModulesTime) {
      console.log('🔒 package-lock.json a été modifié');
      return true;
    }
  }

  console.log('✅ Les dépendances sont déjà installées');
  return false;
}

function main() {
  console.log('\n🔍 Vérification des dépendances...\n');

  if (needsInstall()) {
    console.log('\n📦 Installation des dépendances...\n');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('\n✅ Installation terminée!\n');
    } catch (error) {
      console.error('\n❌ Erreur lors de l\'installation\n');
      process.exit(1);
    }
  } else {
    console.log('⚡ Pas d\'installation nécessaire!\n');
  }
}

main();

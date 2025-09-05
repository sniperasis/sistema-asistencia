const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Iniciando build para Vercel...');

// Compilar frontend
console.log('📦 Compilando frontend...');
execSync('cd web && npm run build', { stdio: 'inherit' });

// Verificar que se compiló correctamente
const distPath = path.join(__dirname, 'web', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Error: No se pudo compilar el frontend');
  process.exit(1);
}

console.log('✅ Frontend compilado correctamente');
console.log('🚀 Build completado para Vercel');

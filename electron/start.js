const { spawn } = require('child_process');
const { kill } = require('process');

// Inicia o servidor Vite
const viteProcess = spawn('npm.cmd', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
});

// Espera 3 segundos para o servidor iniciar
setTimeout(() => {
    // Inicia o Electron
    const electronProcess = spawn('electron.cmd', ['electron/main.js'], {
        env: { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:3000' },
        stdio: 'inherit',
        shell: true
    });

    // Quando o Electron fechar, mata o servidor Vite
    electronProcess.on('close', () => {
        
        
        if (process.platform === 'win32') {
            // Usa 'taskkill' para encerrar a árvore de processos (npm e vite)
            spawn('taskkill', ['/pid', viteProcess.pid, '/f', '/t']);
        } else {
            // No Linux/macOS, usa o sinal padrão, mas no processo detachado (se usado)
            // O sinal -SIGINT (Ctrl+C) é mais gentil, mas se o detached: true for usado,
            // precisamos do sinal negativo para matar o grupo.
            process.kill(-viteProcess.pid, 'SIGKILL'); 
        }

        process.exit();
    });

}, 3000);
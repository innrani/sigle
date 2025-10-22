// electron/main.js

const { app, BrowserWindow } = require('electron')
const path = require('path')
// Importa a função de registro dos handlers
const { setupDatabaseHandlers } = require('./databaseHandlers') 

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,    
    webPreferences: {
      // Essas configurações são necessárias para o seu setup atual de IPC
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  // Em desenvolvimento, carrega do servidor Vite
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // Em produção, carrega do arquivo dist
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// CRÍTICO: Executa quando o Electron está pronto
app.whenReady().then(() => {
  createWindow()
  // CRÍTICO: Chama a função para registrar os canais IPC
  setupDatabaseHandlers() 

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
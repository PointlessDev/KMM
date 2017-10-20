const {app, BrowserWindow} = require('electron');

let win;

function createWindow() {
  // Initialize the window to our specified dimensions
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    backgroundColor: '#303030',
    minWidth: 600,
    minHeight: 300,
    frame: false
  });

  // Specify entry point
  win.loadURL('http://localhost:4200');

  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

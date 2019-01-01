const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', ()=> {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

});

function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => addWindow = null);
};

ipcMain.on('todo_add', (event, todo) => {
  mainWindow.webContents.send('todo_add', todo);
  addWindow.close();
});

function clearTodos(){
  mainWindow.webContents.send('clear_todos')
}

const menuTemplate = [

  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click(){ createAddWindow(); }
      },
      {
        label: 'Clear Todos',
        click(){ clearTodos(); }
      },
      {
        label: 'Quit',
        // accelerator: 'Ctrl+Q',
        // accelerator: (() => {
        //   if (process.platform === "darwin"){
        //     return 'Command+Q';
        //   } else {
        //     return 'Ctrl+Q'
        //   }
        // })(), //Immediatly Invoked Function
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q', //If true return Command+Q if false return Ctrl+Q
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
};

// if (process.platform === 'linux') {
//   menuTemplate.unshift({label: 'Linux', submenu:[{label: 'It Works'}]});
// };

if (process.env.NODE_ENV  !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      { role: 'reload'}, //Pre-defined role set in electron for common functionality
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}
// 'production'
// 'development'
// 'staging'
// 'test'

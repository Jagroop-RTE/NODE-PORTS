const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { spawn } = require('child_process');
const socketIo = require("socket.io");
const http = require('http');
const multer = require('multer');
const FRONT_END_PATH = '/home/dev9/Desktop/DummyProjects/chat2action-frontend/'
const BACKEND_PATH ='/home/dev9/geeker/winkit'
const unzipper = require('unzipper');
let projectPath = ''
const app = express();
const port = 7000;
app.use(cors({
  origin: 'http://localhost:4800', // Replace with your frontend URL
  methods: ['GET', 'POST'],
  credentials: true, // You might need this if you have cookies or sessions
}));

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIo(server,{ 
  cors: {
    origin: 'http://localhost:4800'
  }
})
io.on('connection',(socket)=>{
  console.log('client connected: ',socket.id)
  
  // socket.join('clock-room')
  
  socket.on('disconnect',(reason)=>{
    console.log(reason)
  })
})
setInterval(()=>{
     io.to('clock-room').emit('time', new Date())
},1000)

app.get('/', (req, res) => {
    return res.json({ res :"Hello World............."})
});


app.get('/rundockercompose', (req, res) => {
  const command = 'docker-compose up -d';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running Docker Compose command: ${error.message}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Docker Compose started successfully.');
    res.json({ message: 'Docker Compose started successfully' });
  });
});

app.post('/execute-docker-compose-up', (req, res) => {
  const projectPath = '/home/dev9/Desktop/ProjectRun/backend/projects/winkit-docker';
  const absolutePath = path.join(projectPath, '');

  if (fs.existsSync(absolutePath)) {
    // Change the current working directory to the specified folder
    process.chdir(absolutePath);

    // Spawn a child process for 'docker-compose up -d'
    const dockerComposeProcess = spawn('docker-compose', ['up']);

    // Stream stdout and stderr
    dockerComposeProcess.stdout.on('data', (data) => {
      console.log(`docker-compose up output: ${data}`);
      // Emit data to the client using WebSocket or any other mechanism (e.g., socket.io)
      io.emit("docker-compose-up", String(data));
    });

    dockerComposeProcess.stderr.on('data', (data) => {
      console.error(`docker-compose up error: ${data}`);
      // Emit error data to the client using WebSocket or any other mechanism (e.g., socket.io)
      io.emit("docker-compose-up", String(data));
    });

    // Handle the process exit event
    dockerComposeProcess.on('exit', (code) => {
      console.log(`docker-compose up exited with code ${code}`);
      res.json({ message: 'Docker Compose started successfully' });
    });
  } else {
    res.status(404).json({ error: 'Project path not found' });
  }
});

// app.post('/execute-npm-install', (req, res) => {
//   console.log("projectPath",projectPath)
//   const absolutePath = path.join(projectPath, '');
//   if (fs.existsSync(absolutePath)) {
//     // Change the current working directory to the specified folder
//     process.chdir(absolutePath);

//     // Run npm install
//     exec('npm install', (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${error}`);
//         return res.json({res : error, status :  false})
//       } else {
//         console.log(`npm install output:\n${stdout}`);
//         return res.json({res : stdout, status :  true})
//       }
//     });
//   } else {
//     console.error(`Error: The folder '${absolutePath}' does not exist.`);
//     return res.json({res : "The folder '${absolutePath}' does not exist.", status :  false})
//   }
// })
app.post('/execute-npm-install', (req, res) => {
  console.log("projectPath", projectPath);
  const absolutePath = path.join('/home/dev9/CodeDocumentation/codeDocumentation-ai-backend/template_project/react-nodejs-example/api', '');

  if (fs.existsSync(absolutePath)) {
    // Change the current working directory to the specified folder
    process.chdir(absolutePath);

    // Spawn a child process for 'npm install'
    const npmInstallProcess = spawn('npm', ['install']);

    // Stream stdout and stderr
    npmInstallProcess.stdout.on('data', (data) => {
      console.log(`npm install output: ${data}`);
      io.emit("npm-install",String(data))
    });

    npmInstallProcess.stderr.on('data', (data) => {
      console.error(`npm install error: ${data}`);
      io.emit("npm-install",String(data))
    });
    

    

    // Handle process exit
    npmInstallProcess.on('close', (code) => {
      if (code === 0) {
        console.log('npm install completed successfully');
        return res.json({ res: 'npm install completed successfully', status: true });
      } else {
        console.error(`npm install failed with code ${code}`);
        return res.json({ res: `npm install failed with code ${code}`, status: false });
      }
    });
  } else {
    console.error(`Error: The folder '${absolutePath}' does not exist.`);
    return res.json({ res: `The folder '${absolutePath}' does not exist.`, status: false });
  }
});

app.post('/execute-npm-start', (req, res) => {
  const absolutePath = path.join('/home/dev9/CodeDocumentation/codeDocumentation-ai-backend/template_project/react-nodejs-example/api', '');

  if (fs.existsSync(absolutePath)) {
    // Change the current working directory to the specified folder
    process.chdir(absolutePath);

    // Spawn a child process for 'npm install'
    const npmInstallProcess = spawn('npm', ['start']);

    // Stream stdout and stderr
    npmInstallProcess.stdout.on('data', (data) => {
      console.log(`npm start output: ${data}`);
      io.emit("npm-install",String(data))
    });

    npmInstallProcess.stderr.on('data', (data) => {
      console.error(`npm start error: ${data}`);
      io.emit("npm-start",String(data))
    });
    

    

    // Handle process exit
    npmInstallProcess.on('close', (code) => {
      if (code === 0) {
        console.log('npm start completed successfully');
        return res.json({ res: 'npm start completed successfully', status: true });
      } else {
        console.error(`npm start failed with code ${code}`);
        return res.json({ res: `npm start failed with code ${code}`, status: false });
      }
    });
  } else {
    console.error(`Error: The folder '${absolutePath}' does not exist.`);
    return res.json({ res: `The folder '${absolutePath}' does not exist.`, status: false });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, '/home/dev9/Desktop/UnitTest/x-term-implementation/backend/projects/'); // Specify the directory where files will be stored
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname); // Use the original file name
  }
});

const upload = multer({ storage });


// Correct middleware order
app.post('/upload_files', upload.single('file'), (req, res) => {
  // req.file contains the uploaded file
  console.log(req.file);
  if(req.file && req.file.path){
    const zipFilePath = req.file.path;
    const unzipDir = req.file.destination;
    console.log("zipFilePathzipFilePath",{zipFilePath,unzipDir})
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: unzipDir }))
      .on('entry', (entry) => {
        // You can perform additional checks or processing here
        const filePath = `${unzipDir}/${entry.path}`
        projectPath = filePath

        // Replace the original zip file with the unzipped contents
        entry.pipe(fs.createWriteStream(filePath));
      })
    
    fs.unlink(zipFilePath, ()=>{
      console.log("Successfully removed !!")
    })
  }
  res.send('File uploaded successfully!');
});




app.post('/execute-npm-run-test', (req, res) => {
  const absolutePath = BACKEND_PATH;

  if (fs.existsSync(absolutePath)) {
    // Change the current working directory to the specified folder
    process.chdir(absolutePath);

    // Run npm install using spawn
    const npmProcess = spawn('npm', ['run', 'test']);

    npmProcess.stdout.on('data', (data) => {
      // res.status(200).json({ res: String(data), status: true });
    });
    
    npmProcess.stderr.on('data', (data) => {
      console.log("data-----",String(data))
      io.emit("data-from-backend",String(data))
      // return res.status(200).json({ res: String(data), status: true });
    });
    

  } else {
    console.error(`Error: The folder '${absolutePath}' does not exist.`);
    return res.json({ res: `The folder '${absolutePath}' does not exist.`, status: false });
  }
});



server.listen(port, () => console.log(`Listening on port ${port}!`));
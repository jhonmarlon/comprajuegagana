const {engines} = require('./package');
// https://github.com/parshap/check-node-version
const check = require('check-node-version');
const {execSync} = require('child_process');

check({node: engines.node}, async (error, result) => {
  if (error) {
    throw new Error(error);
  }

  // debug code: console.log(JSON.stringify(result, null, 2));

  if (result.isSatisfied) {
    console.log('Node version check satisfied, all is well.');
    return;
  }

  const currentNodeVersion = result.versions.node.version.version;
  const requiredNodeVersion = result.versions.node.wanted.range;
  const exactRequiredVersion = requiredNodeVersion.replace('<', '').replace('>', '').replace('=', '');

  const mess = `
  The current node version ${currentNodeVersion} does not satisfy the required version ${requiredNodeVersion}.
  Windows instructions to solve the issue...
  1. Install nvm: 
        Download the 'nvm-setup.zip', extract, execute 'nvm-setup.exe' and follow the instructions.
        https://github.com/coreybutler/nvm-windows/releases
  
  2. After installation, close your VS Code (or favorite editor) and re-open again to refresh the new system path.
  
  3. Check successful install of nvm:
             cmd: nvm version
          output: 1.1.7 
  4. Select or install of nvm:
               cmd: nvm use ${exactRequiredVersion}
            failed: node v${exactRequiredVersion} (64-bit) is not installed.
           success: Now using node v${exactRequiredVersion} (64-bit)
  
  5. If needed, install node v${exactRequiredVersion}
               cmd: nvm install ${exactRequiredVersion}
            output: Downloading node.js version ${exactRequiredVersion} (64-bit)... 
                    Complete
                    Creating C:\\Users\\61452\\AppData\\Roaming\\nvm\\temp
                    
                    Downloading npm version ${exactRequiredVersion}... Complete
                    Installing npm v${exactRequiredVersion}...
                    
                    Installation complete. If you want to use this version, type
                    
                    nvm use ${exactRequiredVersion}
  
  6. List all the node version
              cmd: nvm list
           output: 14.16.0
                   14.14.0
                   * ${exactRequiredVersion} (Currently using 64-bit executable)
  
  ---------------------------------------
  Mac and Linux can follow the instructions here to get nvm:
    https://github.com/nvm-sh/nvm
   `;

  execSyncCmdOrThrow('nvm version', mess);

  let nodeVersionsAvailable = execSyncCmdOrThrow('nvm list')
    .split('\n')
    .map(v => v.trim().replace('\n', ''))
    .sort()
    .reverse();

  var latestNodeVersion = nodeVersionsAvailable.find(v => v && v >= exactRequiredVersion);

  if (latestNodeVersion) {
    execSyncCmdOrThrow(`nvm use ${latestNodeVersion}`);
    // wait for the 1 second, otherwise the terminal does not fully register it is using a new node version.
    // Detail: if you remove this line, it will switch to new node version but the terminal still executes as if it in the old node version
    // ...and of course it will then fail. If you re-run npm run start, all will work.
    // This dirty little HACK got me past this hurdle.
    await sleep(1000);
    return;
  } else {
    throw new Error(mess);
  }
});

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const execSyncCmdOrThrow = (cmd, customErrMessage) => {
  try {
    console.log(`${cmd}:`);
    const result = execSync(cmd).toString();
    console.log(`${result}`);
    return result;
  } catch (err) {
    if (customErrMessage) {
      console.error(err);
      throw new Error(customErrMessage);
    } else {
      throw new Error(err);
    }
  }
};
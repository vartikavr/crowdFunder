const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
//fs => file system

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'campaign.sol');
//console.log(campaignPath)
const source = fs.readFileSync(campaignPath, 'utf8');
//console.log(source)
const output = solc.compile(source, 1).contracts;
//console.log(output)

fs.ensureDirSync(buildPath); //checks to see if a directory exists, if it doesn't then creates one

for (let contract in output) {
    let name = contract.replace(':', '');
    fs.outputJSONSync(
        path.resolve(buildPath, name + '.json'),
        output[contract]
    );
}

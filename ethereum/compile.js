const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

try{


  const buildPath = path.resolve(__dirname, "build");
  fs.removeSync(buildPath);

  const ServerContractPath = path.resolve(__dirname, "contracts", "ServerContract.sol");
  const source = fs.readFileSync(ServerContractPath, "utf8");
  const output = solc.compile(source, 1).contracts;

  fs.ensureDirSync(buildPath);

  for (let contract in output) {

    console.log(contract);

    fs.outputJsonSync(
      path.resolve(buildPath, contract.replace(":", "") + ".json"),
      output[contract]
    );
  }


}
catch(err)
{
  console.log(err.message) ;
}

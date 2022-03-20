const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({"total_accounts":1000})) ;
const mainServerContract = require('../../ethereum/build/MainServerContract.json');
const ridePlatform = require('../../ethereum/build/UserRidePlatformContract.json');

const randomstring = require("randomstring");
var fs = require('fs');

function randomNumber() { 
    return Math.floor(Math.random() * (9999999999 - 9100000000) + 9100000000);
} 

const deploy = async () => {

    try{
       
    
            const accounts = await web3.eth.getAccounts();
            for(let account of accounts)
            {
                const bal = await web3.eth.getBalance(account);
                console.log(account,bal);
            }
        
            console.log('Attempting to deploy from account', accounts[0]);
        
            const result = await new web3.eth.Contract(
            JSON.parse(mainServerContract.interface)
            ). deploy({ data: mainServerContract.bytecode })
            .send({ gas: '5000000',from: accounts[0] });
           
            console.log('contract deployed to : ',result.options.address)
             
            return result.options.address ;

        }
        catch(err)
        {
            console.log(err.message) ;
        }
  };
  

  const userRegister = async(address) =>{

    try
    {
        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
        );

        const accounts = await web3.eth.getAccounts();       
        for(let account of accounts)
        {
            const fname = randomstring.generate(2 + (randomNumber() % 10) ) ;
            const lname = randomstring.generate(2 + (randomNumber() % 10) ) ;
            const contactNo = randomNumber() ;

           

            let result = await instance.methods.userRegister(fname,lname,contactNo).send({
                gas: '5000000',from : account
            });

            // console.log(result.gasUsed);
            fs.appendFile('../analysis/userRegisterGasCost.txt',(result.gasUsed).toString() +  '\n' , function(err) {
                if (err) throw err;
            }) ;

        }
      
 
    }
    catch(err)
    {
        console.log(err.message) ;
    }
    
}


const driverRegister = async(address) =>{

    try
    {
        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
        );

        const accounts = await web3.eth.getAccounts();       
        for(let account of accounts)
        {
            const fname = randomstring.generate(2 + (randomNumber() % 10) ) ;
            const lname = randomstring.generate(2 + (randomNumber() % 10) ) ;
            const contactNo = randomNumber() ;
           
            let result = await instance.methods.driverRegister(fname,lname,contactNo).send({
                gas: '5000000',from : account
            });

            fs.appendFile('../analysis/driverRegisterGasCost.txt',(result.gasUsed).toString() +  '\n' , function(err) {
                if (err) throw err;
            }) ;

            // console.log(result.gasUsed);

        }
      
 
    }
    catch(err)
    {
        console.log(err.message) ;
    }
    
}

const rideReq = async(address) =>{

    try{
        
        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
          );

        const accounts = await web3.eth.getAccounts();

        for(let account of accounts)
        {
            const ridePA = await instance.methods.userRidePlatform(account).call() ;
            const rideP =  new web3.eth.Contract(
                JSON.parse(ridePlatform.interface),
                ridePA
              );
            
            const startLocation = randomstring.generate(2 + (randomNumber() % 10) ) ;
            const endLocation = randomstring.generate(2 + (randomNumber() % 10) ) ;

            const result = await rideP.methods.createRideReq(startLocation,endLocation)
            .send({
                gas : '5000000',
              from: account,
            });

            fs.appendFile('../analysis/rideReqGasCost.txt', (result.gasUsed).toString() + '\n' , function(err) {
                if (err) throw err;
            }) ;
        //     console.log(result.gasUsed) ;
        // 
    }
        

    }
    catch(err)
    {
        console.log(err.message) ;
    }

};

const driveReq = async(address) =>{
    try{

       
       
        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
          );

        const accounts = await web3.eth.getAccounts();

        const driverAccount = accounts[0] ;


        for(let i = 0 ; i < 25 ; i++)
        {
            
            const ridePA = await instance.methods.userRidePlatform(accounts[i]).call() ;
            const rideP = new web3.eth.Contract(
                JSON.parse(ridePlatform.interface),
                ridePA
              );

            for(let j = i ; j < 25 ; j++)
            {
                const charge = randomNumber() ;
                const result = await rideP.methods.createDriveReq(charge)
                .send({
                gas : '5000000',
                    from: accounts[j],
                });

                fs.appendFile('../analysis/driveReqGasCost.txt',(result.gasUsed).toString() + '\n' , function(err) {
                    if (err) throw err;
                }) ;

            }
              
            // console.log(result.gasUsed) ;
        }
        

    }
    catch(err)
    {
        console.log(err.message) ;
    }
}

const cancelRide = async(address) =>{

    try{
        
        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
          );

        const accounts = await web3.eth.getAccounts();

        for(let account of accounts)
        {
            const ridePA = await instance.methods.userRidePlatform(account).call() ;
            const rideP =  new web3.eth.Contract(
                JSON.parse(ridePlatform.interface),
                ridePA
              );
            
            const result = await rideP.methods.cancelRideReq().send({
                gas : 5000000,
                from : account
            }) ;

            fs.appendFile('../analysis/cancelRideGasCost.txt',(result.gasUsed).toString()+ ' ' + (result.status).toString() + '\n' , function(err) {
                if (err) throw err;
            }) ;

            // console.log(result.gasUsed) ;
        }
        

    }
    catch(err)
    {
        console.log(err.message) ;
    }

};

const transaction = async(address) =>{
    try
    {
        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
        );

        const accounts = await web3.eth.getAccounts();
        const account = accounts[0] ;       
       
            let result = await instance.methods.userRegister('amitsinh','chaudhari','9922282354').send({
                gas: '5000000',from : account
            });

            console.log(result);

        
      
 
    }
    catch(err)
    {
        console.log(err.message) ;
    }
    
};

 const mainFun = async() =>{
    const address = await deploy() ;

    // console.log('transaction ...') ;
    // await transaction(address) ; 

    console.log("users registrations ...") ;
    await userRegister(address) ;

    console.log("drivers registrations ...") ;
    await driverRegister(address) ;

    console.log('ride req ...');
    await rideReq(address) ;

    // console.log('drive req ...') ;
    // await driveReq(address) ;

    // console.log('cancel ride ...') ;
    // await cancelRide(address) ;

 }
 

mainFun() ;
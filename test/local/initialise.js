const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const provider = new HDWalletProvider(
    'jazz antenna magnet long call dose vapor reunion vessel swift van iron',
    // remember to change this to your own phrase!
    'https://rinkeby.infura.io/v3/6d0967a9ec31471483ed25f922a80dde'
    // remember to change this to your own endpoint!
  );
const web3 = new Web3(provider);

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
        let users = [
			['Nabil', 'Patrick', '5934'],
			['Usamah', 'Salgado', '3783'],
			['Moses', 'Warren', '1298'],
			['Athena', 'Rees', '2883'],
			['Rabia', 'Thompson', '5978'], 
			['Annabella', 'Fowler', '3156'],
			['Roxanne', 'Clarkson', '9918'],
			['Menachem', 'Petersen', '2144'],
			['Milla', 'Tomlinson', '8690'],
			['Tanvir', 'Combs', '9313']
			] ;

        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
        );

        const accounts = await web3.eth.getAccounts();       
        for(let i = 0 ; i < 5 ; i++)
        {
            const fname = users[i][0] ;
            const lname = users[i][1] ;
            const contactNo = randomNumber() ;

           

            let result = await instance.methods.userRegister(fname,lname,contactNo).send({
                gas: '5000000',from : accounts[i]
            });

           

            console.log(fname , lname , contactNo,result.gasUsed);

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
        let users = [
			['Nabil', 'Patrick', '5934'],
			['Usamah', 'Salgado', '3783'],
			['Moses', 'Warren', '1298'],
			['Athena', 'Rees', '2883'],
			['Rabia', 'Thompson', '5978'], 
			['Annabella', 'Fowler', '3156'],
			['Roxanne', 'Clarkson', '9918'],
			['Menachem', 'Petersen', '2144'],
			['Milla', 'Tomlinson', '8690'],
			['Tanvir', 'Combs', '9313']
			] ;

        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
        );

        const accounts = await web3.eth.getAccounts();       
        for(let i = 5 ; i < 10 ; i++)
        {
             const fname = users[i][0] ;
            const lname = users[i][1] ;
            const contactNo = randomNumber() ;
           
            let result = await instance.methods.driverRegister(fname,lname,contactNo).send({
                gas: '5000000',from : accounts[i]
            });

          

            console.log(fname , lname , contactNo,result.gasUsed);

        }
      
 
    }
    catch(err)
    {
        console.log(err.message) ;
    }
    
}

const rideReq = async(address) =>{

    try{

        let rides = [
			['Petlawad', 'Sadri'],
			['Khonsa', 'Digapahandi'],
			['Santokhgarh', 'Kanke'],
			['Kalanaur', 'Nagram'],
			['Ajaigarh', 'Daryapur'],
			['Seoni', 'Gaya'],
			['Gudibanda', 'Mulappilangad'],
			['Bagh', 'Gunupur'],
			['Digboi', 'Digapahandi'],
			['Kalanaur', 'Gaya']
			];
        
        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
          );

        const accounts = await web3.eth.getAccounts();

        for(let i = 0 ; i < 5 ; i++)
        {
            const ridePA = await instance.methods.userRidePlatform(accounts[i]).call() ;
            const rideP =  new web3.eth.Contract(
                JSON.parse(ridePlatform.interface),
                ridePA
              );
            
            const startLocation = rides[i][0] ;
            const endLocation = rides[i][1] ;

            const result = await rideP.methods.createRideReq(startLocation,endLocation)
            .send({
                gas : '5000000',
              from: accounts[i],
            });

           

            console.log(startLocation,endLocation,result.gasUsed) ;
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

      let charges = [5000,9000,10000,50000,100000,500000,1000000,5000000,70000,700]
       
        const instance = new web3.eth.Contract(
            JSON.parse(mainServerContract.interface),
            address
          );

        const accounts = await web3.eth.getAccounts();

        


        for(let i = 5 ; i < 7 ; i++)
        {
            const driverAccount = accounts[i] ;

            for(let j = 0 ; j < 5 ; j++)
            {
                const ridePA = await instance.methods.userRidePlatform(accounts[j]).call() ;
                const rideP = new web3.eth.Contract(
                    JSON.parse(ridePlatform.interface),
                    ridePA
                );
            
                const charge = charges[randomNumber() % 10] ;
                const result = await rideP.methods.createDriveReq(charge)
                .send({
                gas : '5000000',
                    from: driverAccount,
                });

          
                console.log(charge,result.gasUsed);

            }
            
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
                from : account
            }) ;

            console.log(result.gasUsed) ;
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

    try{

        // const address = '0x93d250E55560C9153f3Fe24bd5260CbF14ACf94E';
        const address = await deploy() ;

        console.log("\n\nusers registrations ...\n") ;
        await userRegister(address) ;

        console.log("\n\ndrivers registrations ...\n") ;
        await driverRegister(address) ;

        console.log('\n\nride req ...\n');
        await rideReq(address) ;

        console.log('\n\ndrive req ...\n') ;
        await driveReq(address) ;

    }
    catch(err)
    {
        console.log(err.message) ;
    }

    provider.engine.stop();
  
   

 }
 

mainFun() ;
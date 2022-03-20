pragma solidity ^0.4.17;


contract MainServerContract{

    mapping(address => address) public userProfile ;
    address[] users ;

    mapping(address => address) public driverProfile ;
    address[] drivers ; 

    mapping(address => address) public userRidePlatform ;
    address[] ridePlatformsInstances ;

    function userRegister(string fname , string lname , string mobNo) public {

        address newUserRidePlatformId = new UserRidePlatformContract(msg.sender);
        userRidePlatform[msg.sender] = newUserRidePlatformId ;
        
        address newUserProfileId = new UserProfileContract(msg.sender , newUserRidePlatformId , fname , lname , mobNo) ;
        userProfile[msg.sender] = newUserProfileId ;

        users.push(msg.sender) ;
        ridePlatformsInstances.push(newUserRidePlatformId) ;

    }

    function driverRegister(string fname , string lname , string mobNo) public {
        address newDriverProfileId = new DriverProfileContract(msg.sender , fname , lname , mobNo ) ;
        driverProfile[msg.sender] = newDriverProfileId ;

        drivers.push(msg.sender) ;
    }

    function getRidePlatformInstances() public view returns(address[]){
        return ridePlatformsInstances ;
    }

    function getUsers() public view returns(address[]){
        return users ;

    }

    function getDrivers() public view returns(address[]){
        return drivers ;

    }

}



contract UserProfileContract{    

    address public userAddressId ;
    address public rideContractInstanceAddressId ;


    string public firstName ;
    string public lastName ;
    string public contactNo ;


    function UserProfileContract(address userId , address ridePlatformId , string fname , string lname ,string mobNo) public{
        userAddressId = userId;
        rideContractInstanceAddressId = ridePlatformId ;
        firstName = fname ;
        lastName = lname ;
        contactNo = mobNo ;
    }

    function updateFirstName(string fname) public{
        require(msg.sender == userAddressId) ;
        firstName = fname ;

    }

    function updateLastName(string lname) public{
        require(msg.sender == userAddressId) ;
        lastName = lname ;

    }

    function updateContactNo(string mobNo) public{
        require(msg.sender == userAddressId) ;
        contactNo = mobNo ;

    }

    function getUserProfileSummary() public view returns(string , string , string) {
        return (
            firstName,
            lastName,
            contactNo
        );

    }




}


contract DriverProfileContract{
    address driverAddressId ;

    string public firstName ;
    string public lastName ;
    string public contactNo ;

    function DriverProfileContract(address driverId , string fname , string lname ,string mobNo) public{
        driverAddressId = driverId;
        firstName = fname ;
        lastName = lname ;
        contactNo = mobNo ;
    }

    function updateFirstName(string fname) public{
        require(msg.sender == driverAddressId) ;
        firstName = fname ;

    }

    function updateLastName(string lname) public{
        require(msg.sender == driverAddressId) ;
        lastName = lname ;

    }

    function updateContactNo(string mobNo) public{
        require(msg.sender == driverAddressId) ;
        contactNo = mobNo ;

    }

    function getDriverProfileSummary() public view returns(string , string , string){
        return (
            firstName,
            lastName,
            contactNo
        );
    }


}


contract UserRidePlatformContract{
    
    address public userAddressId ;


    enum rideStatusEnumType {idle , rideReqCreated , driveReqSelected , driverOnPath , rideOn } 
    rideStatusEnumType status ;


    struct LocationType {
        string startPoint;
        string endPoint ;
    }
    LocationType location ;
   
   
    address public driverSelected ;
    uint cashValue ;
    

    mapping(address => bool ) public isDriverAvailable;
    mapping(address => uint ) public driverCharge ;
    address[] drivers ;
    
    //user
    function UserRidePlatformContract(address userId) public{
        userAddressId = userId ;
        status = rideStatusEnumType.idle ;
        driverSelected = address(0) ;
        location = LocationType('','') ;
        cashValue = 0 ;

    }



    //user
    function createRideReq(string start , string end) public{
        require(msg.sender == userAddressId) ;
        require(status == rideStatusEnumType.idle ) ;
        
        location = LocationType(start,end) ;
        status = rideStatusEnumType.rideReqCreated ;

    }

    function updateRideReq(string start , string end) public{
        require(msg.sender == userAddressId) ;
        require(status == rideStatusEnumType.rideReqCreated);

        location = LocationType(start,end) ;
    }




    
    //user
    function chooseDriveReq(address driver) public payable{
        require(msg.sender == userAddressId) ;
        require(status == rideStatusEnumType.rideReqCreated) ;
        require(isDriverAvailable[driver]) ;
        require(msg.value >= driverCharge[driver]) ;

        driverSelected = driver ;
        status = rideStatusEnumType.driveReqSelected ;
        cashValue = msg.value ;

    }

    function reChooseDriveReq(address driver) public payable{
        require(msg.sender == userAddressId) ;
        require(status == rideStatusEnumType.driveReqSelected) ;
        require(isDriverAvailable[driver]) ;
        require(msg.value > driverCharge[driver]) ;

        userAddressId.transfer(cashValue);
        cashValue = msg.value ;
        driverSelected = driver ;

    }



    //user
    function cancelRideReq() public {
        require(msg.sender == userAddressId) ;
        require(status != rideStatusEnumType.idle && status != rideStatusEnumType.rideOn) ;

          location = LocationType('','') ;

            while(drivers.length > 0)
            {
                isDriverAvailable[drivers[drivers.length - 1]] = false ;
                driverCharge[drivers[drivers.length - 1]] = 0 ;
                delete drivers[drivers.length-1] ;
                drivers.length-- ;
            }

       
        if(status == rideStatusEnumType.driveReqSelected || status == rideStatusEnumType.driverOnPath)
        {
            driverSelected = address(0) ;
            userAddressId.transfer(cashValue) ;
            cashValue = 0 ;
        }    

        status = rideStatusEnumType.idle ;    
        

    }

    function getInCab() public {
        require(status == rideStatusEnumType.driverOnPath);        

        while(drivers.length > 0)
        {
            isDriverAvailable[drivers[drivers.length - 1]] = false ;
            driverCharge[drivers[drivers.length - 1]] = 0 ;
            delete drivers[drivers.length-1] ;
                drivers.length-- ;
        }

        status = rideStatusEnumType.rideOn ;

    }

    function makePayment() public {
        require(msg.sender == userAddressId) ;
        require(status == rideStatusEnumType.rideOn) ;
        
        location = LocationType("","") ;
        driverSelected.transfer(cashValue) ;
        cashValue = 0 ;
        status = rideStatusEnumType.idle ;

        


    }


    //Driver
    function createDriveReq (uint priceInWei ) public{
        require(status == rideStatusEnumType.rideReqCreated);
        require(!isDriverAvailable[msg.sender]) ;

        isDriverAvailable[msg.sender] = true ;
        driverCharge[msg.sender] = priceInWei ;
        drivers.push(msg.sender) ;

    }

    function updateDriveCharge(uint priceInWei) public{
        require(status == rideStatusEnumType.rideReqCreated);
        require(isDriverAvailable[msg.sender]) ;

        driverCharge[msg.sender] = priceInWei ;

    }



    //Driver
    function cancelDriveReq() public{
        require(isDriverAvailable[msg.sender]);

        if(status == rideStatusEnumType.rideReqCreated)
        {
             isDriverAvailable[msg.sender] = false ;
             driverCharge[msg.sender] = 0 ;

        }
        
        if((status == rideStatusEnumType.driveReqSelected || status == rideStatusEnumType.driverOnPath )&& driverSelected == msg.sender)
        {
            isDriverAvailable[msg.sender] = false ;
            driverCharge[msg.sender] = 0 ;
            userAddressId.transfer(cashValue) ;
        }
        

    }

    function checkIfMyDriveReqSelected() public view returns(bool){
        require(isDriverAvailable[msg.sender]);
       
        
        if(status == rideStatusEnumType.driveReqSelected && driverSelected == msg.sender)
        {
            return true ;
        }

        return false ;
        
    }



    //Driver
    function drive() public{
        require(status == rideStatusEnumType.driveReqSelected) ;
        require(driverSelected == msg.sender) ;        

        status = rideStatusEnumType.driverOnPath ;

    }    


    
    // User  &  Driver 
    function getRideStatus() public view returns(string){
        if(status == rideStatusEnumType.idle)
        {
            return 'idle';
        }

        if(status == rideStatusEnumType.rideReqCreated)
        {
            return 'rideReqCreated';
        }

        if(status == rideStatusEnumType.driveReqSelected)
        {
            return 'driveReqSelected' ;
        }

        if(status == rideStatusEnumType.driverOnPath)
        {
            return 'driverOnPath';
        }

        if(status == rideStatusEnumType.rideOn)
        {
            return 'rideOn' ;
        }


    }

    function getDrivers() public view returns(address[]){
        return drivers ;
    }

    function getLocation() public view returns(string , string){
        return (location.startPoint,location.endPoint);
    }

    

}
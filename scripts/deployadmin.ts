import { ethers } from "hardhat";
import fs from 'fs'

async function main() {
    const Contract = await ethers.getContractFactory("AdminContract");
    const contract = await Contract.deploy();
    const address = await contract.getAddress();


    const data : any = {
        ADMIN_ADDRESS: address
    }   
    const Data = JSON.stringify(data, null, 2);
    fs.writeFileSync('./frontend/admin.json', Data);
    console.log("Contract deployed to address:", address);

} 
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
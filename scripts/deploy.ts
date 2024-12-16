import { ethers } from "hardhat";
import fs from "fs"
import "dotenv/config"

/* const admin = process.env.ADMIN_ADDRESS || "";
const user = process.env.USER_ADDRESS || "";
 */
async function main() {
    const Contract = await ethers.getContractFactory("AdminContract");
    const contract = await Contract.deploy();
    const adminaddress = await contract.getAddress();

/* 
    const data : any = {
        ADMIN_ADDRESS: adminaddress
    }   
    const Data = JSON.stringify(data, null, 2);
    fs.writeFileSync('./frontend/admin.json', Data); */
    console.log("Admin Contract deployed to address:", adminaddress);


    const userContract = await ethers.getContractFactory("UserContract");
    const usercontract = await userContract.deploy();
    const useraddress = await usercontract.getAddress();

/* 
    const udata : any = {
        USER_ADDRESS: useraddress
    }
    const uData = JSON.stringify(udata, null, 2);
    fs.writeFileSync('./exfrontend/User.json', uData) */
    console.log("User Contract deployed to address:", useraddress);


    const courseContract = await ethers.getContractFactory("CourseContract");
    const coursecontract = await courseContract.deploy(adminaddress, useraddress);
    const courseaddress = await coursecontract.getAddress();


    const cdata : any = {
        COURSE_ADDRESS: courseaddress,
        USER_ADDRESS: useraddress,
        ADMIN_ADDRESS: adminaddress
    }
    const cData = JSON.stringify(cdata, null, 2);
    fs.writeFileSync('./exfrontend/course.json', cData)
    console.log("Contract deployed to address:", courseaddress);


} 
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
